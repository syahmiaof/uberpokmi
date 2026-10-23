import { useState } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  Bike,
  CarFront,
  Check,
  Clock3,
  FileText,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";
import { locationById } from "./data";
import {
  dateTime,
  distance,
  money,
  priceFor,
  rideFare,
  sendFare,
  uid,
  validPhone,
  type Booking,
  type Payment,
} from "./domain";
import {
  Confirm,
  DemoNote,
  LocationPicker,
  PageTitle,
  PaymentPicker,
  PriceBreakdown,
  VoucherInput,
} from "./components";
import { MapExperience } from "./MapExperience";
import { useDemo } from "./store";
export interface RideDraft {
  from: string;
  to: string;
  vehicle: string;
  code: string;
  scheduled: boolean;
  date: string;
}
export function Ride({
  draft,
  setDraft,
  onBooked,
  onBack,
}: {
  draft: RideDraft;
  setDraft: (draft: RideDraft) => void;
  onBooked: (booking: Booking) => void;
  onBack: () => void;
}) {
  const { state } = useDemo();
  const [payment, setPayment] = useState<Payment>(state.payment);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const update = (value: Partial<RideDraft>) => {
    setDraft({ ...draft, ...value });
    setError("");
  };
  const valid = !!draft.from && !!draft.to && draft.from !== draft.to;
  const km = valid
    ? distance(locationById(draft.from), locationById(draft.to))
    : 0;
  const minutes = Math.ceil(km * 3 + 4);
  const price = priceFor("ride", rideFare(km, draft.vehicle), draft.code);
  const validate = () => {
    if (!draft.from || !draft.to) return "Choose your pickup and destination.";
    if (!valid) return "Pickup and destination must be different.";
    if (
      draft.scheduled &&
      (!draft.date || new Date(draft.date).getTime() <= Date.now())
    )
      return "Choose a future date and time for your ride.";
    return "";
  };
  const book = () => {
    const issue = validate();
    if (issue) {
      setError(issue);
      setConfirm(false);
      return;
    }
    const now = new Date().toISOString();
    onBooked({
      id: `PKR-${uid().slice(0, 8).toUpperCase()}`,
      created: now,
      updated: now,
      service: "ride",
      from: draft.from,
      to: draft.to,
      vehicle: draft.vehicle,
      price,
      km,
      minutes,
      payment,
      scheduledAt: draft.scheduled
        ? new Date(draft.date).toISOString()
        : undefined,
      step: draft.scheduled ? -1 : 0,
      cancelled: false,
      ratings: [],
      notes: "",
    });
    setConfirm(false);
  };
  return (
    <>
      <PageTitle
        title="Where to?"
        description="A better way to get where you’re going."
        back={onBack}
      >
        <span className="service-label">
          <CarFront size={17} /> PokmiRide
        </span>
      </PageTitle>
      <div className={`booking-layout ${expanded ? "" : "sheet-collapsed"}`}>
        <section className="booking-panel">
          <button
            className="sheet-toggle"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide booking panel" : "Choose your ride"}
            <ChevronHandle />
          </button>
          <div className="sheet-content">
            <div className="route-fields">
              <LocationPicker
                label="Pickup"
                value={draft.from}
                onChange={(from) => update({ from })}
              />
              <button
                className="swap-button"
                aria-label="Swap pickup and destination"
                disabled={!draft.from || !draft.to}
                onClick={() => update({ from: draft.to, to: draft.from })}
              >
                <ArrowDownUp size={16} />
              </button>
              <LocationPicker
                label="Destination"
                value={draft.to}
                onChange={(to) => update({ to })}
              />
            </div>
            {draft.from === draft.to && draft.to && (
              <p className="field-error">
                Pickup and destination must be different.
              </p>
            )}
            <div className="segmented">
              <button
                className={!draft.scheduled ? "selected" : ""}
                onClick={() => update({ scheduled: false })}
              >
                Ride now
              </button>
              <button
                className={draft.scheduled ? "selected" : ""}
                onClick={() => update({ scheduled: true })}
              >
                <Clock3 size={15} /> Schedule
              </button>
            </div>
            {draft.scheduled && (
              <label className="field">
                Pickup date and time
                <input
                  type="datetime-local"
                  value={draft.date}
                  onChange={(e) => update({ date: e.target.value })}
                />
                <small>
                  Enter your device’s local time. Confirmation displays Kuala
                  Lumpur time (UTC+8).
                </small>
              </label>
            )}
            <div className="section-heading compact-heading">
              <h2>Choose your ride</h2>
              {valid && (
                <span>
                  {km.toFixed(1)} km · {minutes} min
                </span>
              )}
            </div>
            <div className="vehicle-list">
              {[
                {
                  name: "PokmiGo",
                  detail: "Everyday, made effortless",
                  seats: 4,
                  eta: 3,
                },
                {
                  name: "PokmiComfort",
                  detail: "A little extra breathing room",
                  seats: 4,
                  eta: 5,
                },
                {
                  name: "PokmiXL",
                  detail: "More room for your people",
                  seats: 6,
                  eta: 7,
                },
              ].map((v, i) => (
                <button
                  key={v.name}
                  className={`vehicle-card ${draft.vehicle === v.name ? "selected" : ""}`}
                  onClick={() => update({ vehicle: v.name })}
                  aria-pressed={draft.vehicle === v.name}
                >
                  <img
                    src={
                      i === 0
                        ? "/images/pokmi-car.png"
                        : i === 1
                          ? "/images/pokmi-comfort.png"
                          : "/images/pokmi-xl.png"
                    }
                    alt={`${v.name} vehicle illustration`}
                    className={`vehicle-art variant-${i}`}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="vehicle-info">
                    <strong>{v.name}</strong>
                    <small>
                      <Users size={12} /> {v.seats} · {v.eta} min away
                    </small>
                    <span>{v.detail}</span>
                  </span>
                  <span className="vehicle-price">
                    {valid ? money(rideFare(km, v.name)) : "—"}
                    {draft.vehicle === v.name && <Check size={15} />}
                  </span>
                </button>
              ))}
            </div>
            <details className="pricing-explainer">
              <summary>How demo fares work</summary>
              <p>
                PokmiGo: RM4.50 + RM1.75/km. Comfort: 1.45×. XL: 1.80×. Distance
                uses approximate coordinates with a 1.35 road multiplier.
              </p>
            </details>
            <PaymentPicker value={payment} onChange={setPayment} />
            <VoucherInput
              service="ride"
              amount={price.subtotal}
              code={draft.code}
              onChange={(code) => update({ code })}
            />
            {valid && <PriceBreakdown price={price} />}
            <div role="alert">
              {error && <p className="field-error">{error}</p>}
            </div>
            <button
              className="button full"
              onClick={() => {
                const issue = validate();
                setError(issue);
                if (!issue) setConfirm(true);
              }}
            >
              {draft.scheduled ? "Schedule" : "Confirm"} {draft.vehicle}
              <ArrowRight size={18} />
            </button>
            <DemoNote />
          </div>
        </section>
        <div className="booking-map">
          <MapExperience
            from={draft.from}
            to={draft.to}
            status={
              valid
                ? `${minutes} min to your destination`
                : "Choose your next destination"
            }
          />
          <div className="map-caption">
            <ShieldCheck size={18} />
            <div>
              <strong>A smooth ride, from the start.</strong>
              <span>Fictional drivers. Real attention to the details.</span>
            </div>
          </div>
        </div>
      </div>
      {confirm && (
        <Confirm
          title={draft.scheduled ? "Schedule your ride" : "Ready when you are"}
          onClose={() => setConfirm(false)}
          onConfirm={book}
          label={draft.scheduled ? "Schedule demo ride" : "Book demo ride"}
        >
          <p>
            <strong>{locationById(draft.from).name}</strong> to{" "}
            <strong>{locationById(draft.to).name}</strong>
          </p>
          <p>
            {draft.vehicle} · {minutes} min · {payment}
          </p>
          {draft.scheduled && (
            <p>{dateTime(new Date(draft.date).toISOString())} · Kuala Lumpur</p>
          )}
          <PriceBreakdown price={price} />
          <p className="muted">
            This creates a simulated booking. No real driver or payment.
          </p>
        </Confirm>
      )}
    </>
  );
}
function ChevronHandle() {
  return <span className="sheet-handle" />;
}
export interface DeliveryDraft {
  from: string;
  to: string;
  sender: string;
  senderPhone: string;
  recipient: string;
  recipientPhone: string;
  description: string;
  parcel: string;
  vehicle: string;
  notes: string;
  code: string;
}
export const newDeliveryDraft = (): DeliveryDraft => ({
  from: "bintang",
  to: "",
  sender: "",
  senderPhone: "",
  recipient: "",
  recipientPhone: "",
  description: "",
  parcel: "Small Parcel",
  vehicle: "PokmiBike",
  notes: "",
  code: "",
});
export function Delivery({
  draft,
  setDraft,
  onBooked,
  onBack,
}: {
  draft: DeliveryDraft;
  setDraft: (draft: DeliveryDraft) => void;
  onBooked: (booking: Booking) => void;
  onBack: () => void;
}) {
  const { state } = useDemo();
  const [payment, setPayment] = useState<Payment>(state.payment);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const update = (v: Partial<DeliveryDraft>) => {
    setDraft({ ...draft, ...v });
    setError("");
  };
  const valid = draft.from && draft.to && draft.from !== draft.to;
  const km = valid
    ? distance(locationById(draft.from), locationById(draft.to))
    : 0;
  const minutes = Math.ceil(15 + km * 3);
  const price = priceFor(
    "delivery",
    sendFare(km, draft.vehicle, draft.parcel),
    draft.code,
  );
  const validate = () => {
    if (!draft.sender.trim() || !draft.recipient.trim())
      return "Enter both sender and receiver names.";
    if (!validPhone(draft.senderPhone) || !validPhone(draft.recipientPhone))
      return "Enter valid Malaysian mobile numbers, for example 0123456789 or +60123456789.";
    if (!draft.from || !draft.to)
      return "Choose both pickup and drop-off locations.";
    if (!valid) return "Pickup and drop-off must be different.";
    if (!draft.description.trim())
      return "Describe the contents of your parcel.";
    if (draft.parcel === "Medium Parcel" && draft.vehicle === "PokmiBike")
      return "Medium parcels need PokmiCar. Choose a car to continue.";
    return "";
  };
  const textField = (
    key:
      "sender" | "senderPhone" | "recipient" | "recipientPhone" | "description",
    label: string,
    placeholder: string,
  ) => (
    <label className="field">
      {label}
      <input
        value={draft[key]}
        onChange={(e) => update({ [key]: e.target.value })}
        placeholder={placeholder}
        maxLength={key === "description" ? 180 : 60}
        type={key.includes("Phone") ? "tel" : "text"}
      />
    </label>
  );
  const book = () => {
    const issue = validate();
    if (issue) {
      setError(issue);
      setConfirm(false);
      return;
    }
    const now = new Date().toISOString();
    onBooked({
      id: `PKS-${uid().slice(0, 8).toUpperCase()}`,
      created: now,
      updated: now,
      service: "delivery",
      ...draft,
      price,
      km,
      minutes,
      payment,
      step: 0,
      cancelled: false,
      ratings: [],
    });
    setConfirm(false);
  };
  return (
    <>
      <PageTitle
        title="Small parcel. Big possibilities."
        description="Across town, and off your to-do list."
        back={onBack}
      >
        <span className="service-label">
          <Package size={17} /> PokmiSend
        </span>
      </PageTitle>
      <div className="delivery-layout">
        <section className="panel delivery-form">
          <div className="section-heading compact-heading">
            <h2>From you, to them.</h2>
            <span className="subtle-badge">Same-city demo</span>
          </div>
          <div className="form-columns">
            <fieldset>
              <legend>Sender details</legend>
              {textField("sender", "Sender name", "Full name")}
              {textField("senderPhone", "Sender phone", "012 345 6789")}
              <LocationPicker
                label="Parcel pickup"
                value={draft.from}
                onChange={(from) => update({ from })}
              />
            </fieldset>
            <fieldset>
              <legend>Receiver details</legend>
              {textField("recipient", "Receiver name", "Full name")}
              {textField("recipientPhone", "Receiver phone", "012 345 6789")}
              <LocationPicker
                label="Parcel drop-off"
                value={draft.to}
                onChange={(to) => update({ to })}
              />
            </fieldset>
          </div>
          <h2 className="subheading">What are we sending?</h2>
          {textField(
            "description",
            "Parcel contents",
            "e.g. A birthday gift, safely wrapped",
          )}
          <div className="parcel-options">
            {[
              {
                name: "Documents",
                size: "Up to 1 kg · A4 envelope",
                Icon: FileText,
              },
              {
                name: "Small Parcel",
                size: "Up to 5 kg · 30 × 30 cm",
                Icon: Package,
              },
              {
                name: "Medium Parcel",
                size: "Up to 15 kg · 50 × 50 cm",
                Icon: Package,
              },
            ].map((p) => (
              <button
                key={p.name}
                className={`parcel-option ${draft.parcel === p.name ? "selected" : ""}`}
                onClick={() =>
                  update({
                    parcel: p.name,
                    vehicle:
                      p.name === "Medium Parcel" ? "PokmiCar" : draft.vehicle,
                  })
                }
                aria-pressed={draft.parcel === p.name}
              >
                <p.Icon size={25} />
                <strong>{p.name}</strong>
                <small>{p.size}</small>
              </button>
            ))}
          </div>
          <h2 className="subheading">Choose your wheels</h2>
          <div className="send-vehicles">
            {[
              {
                name: "PokmiBike",
                Icon: Bike,
                text: "Quick trips, lighter parcels",
              },
              {
                name: "PokmiCar",
                Icon: CarFront,
                text: "More space, safely enclosed",
              },
            ].map((v) => (
              <button
                key={v.name}
                disabled={
                  draft.parcel === "Medium Parcel" && v.name === "PokmiBike"
                }
                className={`send-vehicle ${draft.vehicle === v.name ? "selected" : ""}`}
                onClick={() => update({ vehicle: v.name })}
              >
                <v.Icon size={28} />
                <span>
                  <strong>{v.name}</strong>
                  <small>
                    {draft.parcel === "Medium Parcel" && v.name === "PokmiBike"
                      ? "Unavailable for medium parcels"
                      : v.text}
                  </small>
                </span>
                {draft.vehicle === v.name && <Check size={17} />}
              </button>
            ))}
          </div>
          <label className="field">
            Delivery notes <span className="muted">(optional)</span>
            <textarea
              value={draft.notes}
              onChange={(e) => update({ notes: e.target.value })}
              placeholder="Anything your demo courier should know?"
              maxLength={300}
            />
          </label>
        </section>
        <aside className="delivery-summary">
          <MapExperience
            from={draft.from}
            to={draft.to}
            status={
              valid
                ? `${km.toFixed(1)} km · approximately ${minutes} min`
                : "Your parcel’s journey"
            }
          />
          <div className="panel">
            <h2>Delivery estimate</h2>
            <p className="muted">
              {draft.vehicle} · {draft.parcel}
            </p>
            <PaymentPicker value={payment} onChange={setPayment} />
            <VoucherInput
              service="delivery"
              amount={price.subtotal}
              code={draft.code}
              onChange={(code) => update({ code })}
            />
            {valid && (
              <PriceBreakdown price={price} label="Delivery estimate" />
            )}
            <details className="pricing-explainer">
              <summary>Demo pricing & parcel limits</summary>
              <p>
                Bike: RM5 + RM1.20/km. Car: RM10 + RM1.70/km. Medium parcel:
                +RM3. Size and weight limits are fictional. Do not enter real
                private contact details.
              </p>
            </details>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="button full"
              onClick={() => {
                const issue = validate();
                setError(issue);
                if (!issue) setConfirm(true);
              }}
            >
              Review delivery
              <ArrowRight size={17} />
            </button>
            <DemoNote />
          </div>
        </aside>
      </div>
      {confirm && (
        <Confirm
          title="Check your delivery"
          label="Confirm demo delivery"
          onClose={() => setConfirm(false)}
          onConfirm={book}
        >
          <p>
            <strong>{draft.sender}</strong> → <strong>{draft.recipient}</strong>
          </p>
          <p>
            {locationById(draft.from).name} → {locationById(draft.to).name}
          </p>
          <p>
            {draft.parcel} · {draft.description} · {draft.vehicle}
          </p>
          <PriceBreakdown price={price} label="Delivery estimate" />
          <p className="muted">
            Simulated delivery. No real courier is booked.
          </p>
        </Confirm>
      )}
    </>
  );
}
