import { useState } from "react";
import {
  Bell,
  Check,
  CreditCard,
  Globe2,
  MapPin,
  Moon,
  Pencil,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sun,
  Trash2,
} from "lucide-react";
import { locationById } from "./data";
import { uid, type SavedAddress } from "./domain";
import {
  Confirm,
  Empty,
  LocationPicker,
  Modal,
  PageTitle,
  PaymentPicker,
} from "./components";
import { useDemo } from "./store";
export function Account({ onReset }: { onReset: () => void }) {
  const { state, dispatch, toast } = useDemo();
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [label, setLabel] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [remove, setRemove] = useState<SavedAddress | null>(null);
  const [reset, setReset] = useState(false);
  const [help, setHelp] = useState(false);
  const open = (address?: SavedAddress) => {
    setEditing(address || { id: uid(), label: "", locationId: "" });
    setLabel(address?.label || "");
    setLocation(address?.locationId || "");
    setError("");
  };
  return (
    <>
      <PageTitle
        title="Your little corner of the city."
        description="The details that make every day a little easier."
      />
      <div className="account-grid">
        <section className="panel profile-panel">
          <div className="profile-avatar">AT</div>
          <h2>Alex Tan</h2>
          <p>Demo Member</p>
          <span className="subtle-badge">
            <ShieldCheck size={14} /> Interactive demo profile
          </span>
          <p className="micro-copy">
            A fictional account, ready to explore.
            <br />
            Your preferences are saved on this browser.
          </p>
        </section>
        <div className="account-main">
          <section className="panel">
            <div className="section-heading compact-heading">
              <h2>
                <MapPin size={19} /> Saved places
              </h2>
              <button className="text-button" onClick={() => open()}>
                <Plus size={17} /> Add place
              </button>
            </div>
            {state.addresses.map((a) => (
              <div key={a.id} className="saved-address">
                <div>
                  <strong>{a.label}</strong>
                  <span>{locationById(a.locationId).name}</span>
                  <small>{locationById(a.locationId).address}</small>
                </div>
                <button
                  className="icon-button"
                  aria-label={`Edit ${a.label}`}
                  onClick={() => open(a)}
                >
                  <Pencil size={17} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Delete ${a.label}`}
                  onClick={() => setRemove(a)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
            {!state.addresses.length && (
              <Empty
                title="Your favourite places belong here."
                text="Save an address to select it quickly when booking."
              />
            )}
          </section>
          <section className="panel">
            <h2>Make yourself at home.</h2>
            <div className="setting">
              <CreditCard size={20} />
              <div>
                <PaymentPicker
                  value={state.payment}
                  onChange={(payment) => {
                    dispatch({ type: "preferences", value: { payment } });
                    toast("Payment preference saved.");
                  }}
                />
              </div>
            </div>
            <div className="setting">
              <Bell size={20} />
              <div>
                <strong>Order updates</strong>
                <small>Simulated notifications inside the app</small>
              </div>
              <button
                role="switch"
                aria-checked={state.notifications}
                aria-label="Order update notifications"
                className={`switch ${state.notifications ? "on" : ""}`}
                onClick={() =>
                  dispatch({
                    type: "preferences",
                    value: { notifications: !state.notifications },
                  })
                }
              >
                <span />
              </button>
            </div>
            <div className="setting">
              <Moon size={20} />
              <div>
                <strong>Appearance</strong>
                <small>
                  {state.theme === "dark" ? "Urban Velocity Dark" : "Daylight"}
                </small>
              </div>
              <div className="theme-switch">
                <button
                  aria-label="Dark theme"
                  aria-pressed={state.theme === "dark"}
                  className={state.theme === "dark" ? "active" : ""}
                  onClick={() =>
                    dispatch({ type: "preferences", value: { theme: "dark" } })
                  }
                >
                  <Moon size={17} />
                </button>
                <button
                  aria-label="Light theme"
                  aria-pressed={state.theme === "light"}
                  className={state.theme === "light" ? "active" : ""}
                  onClick={() =>
                    dispatch({ type: "preferences", value: { theme: "light" } })
                  }
                >
                  <Sun size={17} />
                </button>
              </div>
            </div>
            <div className="setting">
              <Globe2 size={20} />
              <div>
                <strong>Language</strong>
                <small>English · Malaysian locations and MYR</small>
              </div>
              <span className="subtle-badge">EN</span>
            </div>
          </section>
          <section className="panel">
            <h2>Help & demo settings</h2>
            <button
              className="setting setting-button"
              onClick={() => setHelp(true)}
            >
              <ShieldCheck size={20} />
              <span>Help and safety</span>
              <Plus size={17} />
            </button>
            <button
              className="setting setting-button"
              onClick={() => setReset(true)}
            >
              <RotateCcw size={20} />
              <span>Reset demo data</span>
              <small>Start fresh</small>
            </button>
            <a
              className="credits-link"
              href="/images/credits.html"
              target="_blank"
              rel="noreferrer"
            >
              Photography credits & asset sources ↗
            </a>
          </section>
        </div>
      </div>
      {editing && (
        <Modal
          title={
            state.addresses.some((a) => a.id === editing.id)
              ? "Edit saved place"
              : "Save a place"
          }
          onClose={() => setEditing(null)}
        >
          <label className="field">
            Place label
            <input
              placeholder="e.g. Home, Work, Gym"
              value={label}
              maxLength={30}
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
          <LocationPicker
            label="Saved address"
            value={location}
            onChange={setLocation}
          />
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button full"
            onClick={() => {
              if (!label.trim() || !location) {
                setError("Add a label and choose a location.");
                return;
              }
              const address = {
                ...editing,
                label: label.trim(),
                locationId: location,
              };
              dispatch({
                type: "addresses",
                addresses: state.addresses.some((a) => a.id === editing.id)
                  ? state.addresses.map((a) =>
                      a.id === editing.id ? address : a,
                    )
                  : [...state.addresses, address],
              });
              setEditing(null);
              toast("Your place is saved.");
            }}
          >
            <Check size={17} /> Save place
          </button>
        </Modal>
      )}
      {remove && (
        <Confirm
          title={`Delete ${remove.label}?`}
          onClose={() => setRemove(null)}
          onConfirm={() => {
            dispatch({
              type: "addresses",
              addresses: state.addresses.filter((a) => a.id !== remove.id),
            });
            setRemove(null);
          }}
          label="Delete place"
        >
          <p>
            Existing bookings are kept. You can save this place again any time.
          </p>
        </Confirm>
      )}
      {reset && (
        <Confirm
          title="A fresh start?"
          onClose={() => setReset(false)}
          onConfirm={() => {
            dispatch({ type: "reset" });
            setReset(false);
            onReset();
            toast("Demo data reset. Your city is ready.");
          }}
          label="Reset demo data"
        >
          <p>
            This clears bookings, cart, messages and saved preferences on this
            browser, then restores the demo defaults.
          </p>
        </Confirm>
      )}
      {help && <Help onClose={() => setHelp(false)} />}
    </>
  );
}
export function Help({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="A little help, whenever you need it." onClose={onClose}>
      <div className="help-content">
        <ShieldCheck size={32} />
        <h3>Explore with peace of mind.</h3>
        <p>
          UberPokmi is a fictional frontend demonstration. Drivers, restaurants,
          prices, payments and delivery updates are simulated.
        </p>
        <h3>How do I complete a journey?</h3>
        <p>
          Book a service, then use <strong>Advance demo</strong> on the tracking
          screen. Your completed booking and receipt appear in Activity.
        </p>
        <h3>Where is my data?</h3>
        <p>
          Bookings and preferences are saved in this browser’s local storage. No
          authentication, real dispatch, payment processing or live GPS is
          connected. Avoid entering private contact details.
        </p>
        <h3>Can I cancel or start over?</h3>
        <p>
          Cancel an active booking from its tracking screen. Account → Reset
          demo data clears the demo after confirmation.
        </p>
        <h3>Maps & imagery</h3>
        <p>
          The schematic map works offline. Optional OpenStreetMap tiles need
          internet. Route lines are simulated; food photos represent dishes, not
          actual merchants.
        </p>
      </div>
    </Modal>
  );
}
