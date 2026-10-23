import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCheck,
  Clock3,
  Copy,
  FileText,
  MessageCircle,
  Navigation,
  Play,
  Send,
  Share2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { locationById, restaurants } from "./data";
import {
  dateTime,
  isComplete,
  isScheduled,
  money,
  stages,
  statusLabel,
  type Booking,
} from "./domain";
import {
  Confirm,
  Modal,
  PageTitle,
  PriceBreakdown,
  Rating,
} from "./components";
import { MapExperience } from "./MapExperience";
import { useDemo } from "./store";
export function Tracking({
  booking: b,
  onBack,
  onAgain,
}: {
  booking: Booking;
  onBack: () => void;
  onAgain: (booking: Booking) => void;
}) {
  const { dispatch, toast } = useDemo();
  const [chat, setChat] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [share, setShare] = useState(false);
  const done = isComplete(b);
  const scheduled = isScheduled(b);
  const restaurant =
    b.service === "food"
      ? restaurants.find((r) => r.id === b.restaurantId)
      : null;
  const assigned = b.service === "food" ? b.step >= 3 : b.step >= 1;
  const progress =
    b.service === "ride"
      ? b.step >= 3
        ? 0.72
        : b.step === 2
          ? 0.25
          : 0.05
      : b.step / (stages[b.service].length - 1);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `UberPokmi demo ${b.id}: ${statusLabel(b)}. ${locationById(b.from).name} → ${locationById(b.to).name}. This is a simulation, not a live tracking link.`,
      );
      toast("Demo trip summary copied.");
    } catch {
      toast(
        "Clipboard unavailable. You can select and copy the summary below.",
      );
    }
  };
  return (
    <>
      <PageTitle
        title={
          b.cancelled
            ? "Plans change. That’s okay."
            : scheduled
              ? "One less thing to think about."
              : statusLabel(b)
        }
        description={`${b.id} · ${dateTime(b.created)} · Interactive demo`}
        back={onBack}
      />
      <div className="tracking-layout">
        <section className="panel tracking-panel">
          {(done || b.cancelled || scheduled) && (
            <div
              className={`completion-mark ${b.cancelled ? "cancelled" : ""}`}
            >
              {scheduled ? (
                <Clock3 size={32} />
              ) : b.cancelled ? (
                <Navigation size={30} />
              ) : (
                <CheckCheck size={32} />
              )}
            </div>
          )}
          {scheduled ? (
            <div className="scheduled-info">
              <h2>Your ride is scheduled.</h2>
              <p>{b.service === "ride" && dateTime(b.scheduledAt!)}</p>
              <p className="muted">
                No driver matching starts before your scheduled time. Your
                booking stays in Activity.
              </p>
            </div>
          ) : (
            !b.cancelled && (
              <ol className="timeline">
                {stages[b.service].map((stage, i) => (
                  <li
                    key={stage}
                    className={
                      i < b.step ? "passed" : i === b.step ? "current" : ""
                    }
                  >
                    <span>
                      {i < b.step || done ? <Check size={13} /> : i + 1}
                    </span>
                    <div>
                      <strong>{stage}</strong>
                      {i === b.step && !done && (
                        <small>
                          {b.service === "ride" && b.step === 0
                            ? "Finding your Pokmi driver… usually 2–3 seconds"
                            : "Simulated update · use Advance demo to continue"}
                        </small>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )
          )}
          {assigned && !b.cancelled && !scheduled && (
            <div className="driver-card">
              <img
                src="/images/demo-driver.png"
                alt="AI-generated portrait of fictional demo driver Amir Hakim"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div>
                <strong>Amir Hakim</strong>
                <span>
                  <Star size={12} fill="currentColor" /> 4.9 · Fictional{" "}
                  {b.service === "ride" ? "driver" : "courier"}
                </span>
                <small>
                  {b.service === "ride"
                    ? `${b.vehicle} · Graphite sedan`
                    : b.service === "delivery"
                      ? b.vehicle
                      : "PokmiBike"}{" "}
                  · DEMO 4242
                </small>
                {!done && (
                  <small>
                    Demo arrival: {b.service === "ride" ? "3 min" : "5–10 min"}
                  </small>
                )}
              </div>
              <ShieldCheck size={19} />
            </div>
          )}
          <div className="route-summary">
            <span className="route-dot" />
            <div>
              <small>
                {b.service === "food" ? "From the kitchen" : "Pickup"}
              </small>
              <strong>{restaurant?.name || locationById(b.from).name}</strong>
            </div>
            <span className="route-dot destination" />
            <div>
              <small>
                {b.service === "delivery"
                  ? `Deliver to ${b.recipient}`
                  : "Destination"}
              </small>
              <strong>{locationById(b.to).name}</strong>
            </div>
          </div>
          {b.service === "delivery" && (
            <div className="parcel-detail">
              <strong>{b.parcel}</strong>
              <p>{b.description}</p>
              <small>
                Sender: {b.sender} · {b.senderPhone}
                <br />
                Receiver: {b.recipient} · {b.recipientPhone}
              </small>
            </div>
          )}
          {b.notes && <p className="muted">Notes: {b.notes}</p>}
          <div className="booking-total">
            <span>
              {b.payment}
              <small>Demo total</small>
            </span>
            <strong>{money(b.price.total)}</strong>
          </div>
          <div className="contact-actions">
            {assigned && !done && !b.cancelled && (
              <button
                className="button secondary"
                onClick={() => setChat(true)}
              >
                <MessageCircle size={17} /> Chat demo
              </button>
            )}
            <button
              className="button secondary"
              onClick={() => setReceipt(true)}
            >
              <FileText size={17} />
              {done ? "View receipt" : "View details"}
            </button>
            {b.service === "ride" && (
              <button
                className="icon-button outlined"
                aria-label="Share trip demo"
                onClick={() => setShare(true)}
              >
                <Share2 size={17} />
              </button>
            )}
          </div>
          {!done && !b.cancelled && !scheduled && (
            <button
              className="advance-button"
              onClick={() => dispatch({ type: "advance", id: b.id })}
            >
              <Play size={14} /> Advance demo
              <ArrowRight size={15} />
            </button>
          )}
          {scheduled &&
            b.service === "ride" &&
            Date.parse(b.scheduledAt!) <= Date.now() && (
              <button
                className="button full"
                onClick={() => dispatch({ type: "advance", id: b.id })}
              >
                Start scheduled demo
              </button>
            )}
          {!done && !b.cancelled && (
            <button
              className="text-button cancel-link"
              onClick={() => setCancel(true)}
            >
              Cancel {b.service === "food" ? "order" : "booking"}
            </button>
          )}
          {(done || b.cancelled) && (
            <button className="button full" onClick={() => onAgain(b)}>
              {b.service === "food"
                ? "Reorder your favourites"
                : b.service === "ride"
                  ? "Book again"
                  : "Send another parcel"}
              <ArrowRight size={17} />
            </button>
          )}
          {done && (
            <>
              <Rating
                label={
                  b.service === "food"
                    ? "Rate your meal"
                    : b.service === "ride"
                      ? "How was your ride?"
                      : "How was your delivery?"
                }
                value={b.ratings[0] || 0}
                onChange={(value) =>
                  dispatch({ type: "rating", id: b.id, index: 0, value })
                }
              />
              {b.service === "food" && (
                <Rating
                  label="Rate your delivery"
                  value={b.ratings[1] || 0}
                  onChange={(value) =>
                    dispatch({ type: "rating", id: b.id, index: 1, value })
                  }
                />
              )}
            </>
          )}
        </section>
        <div className="tracking-visual">
          {b.service === "food" && b.step < 4 && !done && !b.cancelled ? (
            <div className="kitchen-state">
              <img src={restaurant?.image} alt={restaurant?.menu[0].name} />
              <div>
                <span className="subtle-badge">
                  {b.minutes}–{b.minutes + 10} min estimate
                </span>
                <h2>
                  {b.step < 2
                    ? "Something good is on the menu."
                    : "A little sizzle. A lot of flavour."}
                </h2>
                <p>
                  Your demo order is with {restaurant?.name}.<br />
                  We’ll show the route when your rider picks it up.
                </p>
              </div>
            </div>
          ) : (
            <MapExperience
              from={b.from}
              to={b.to}
              progress={done ? 1 : progress}
              searching={b.service === "ride" && b.step === 0}
              status={statusLabel(b)}
            />
          )}
          <div className="tracking-bottom">
            {done && b.service === "delivery" ? (
              <div className="delivery-proof">
                <ShieldCheck size={32} />
                <div>
                  <h3>Parcel received. Smile delivered.</h3>
                  <p>
                    Demo confirmation by {b.recipient} · {dateTime(b.updated)}
                  </p>
                  <small>
                    Simulated proof of delivery. No real parcel or delivery
                    photograph.
                  </small>
                </div>
              </div>
            ) : (
              <>
                <ShieldCheck size={22} />
                <div>
                  <h3>
                    {done
                      ? "Thanks for taking us along."
                      : "A little peace of mind."}
                  </h3>
                  <p>
                    {done
                      ? "Your receipt and booking are saved in Activity."
                      : "This is a local simulation. Your contacts and payments stay fictional."}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {receipt && (
        <Modal
          title={done ? "Your digital receipt" : "Booking details"}
          onClose={() => setReceipt(false)}
        >
          <div className="receipt-brand">
            uberpokmi<span>.</span>
          </div>
          <p className="muted">
            {b.id}
            <br />
            {dateTime(b.created)}
            <br />
            {statusLabel(b)}
          </p>
          <p>
            <strong>{restaurant?.name || locationById(b.from).name}</strong> →{" "}
            {locationById(b.to).name}
          </p>
          {b.service === "food" &&
            b.items.map((i) => (
              <div className="receipt-item" key={i.id}>
                <span>
                  {i.quantity} × {i.name}
                  <small>
                    {i.options.join(" · ")}
                    {i.notes && ` · ${i.notes}`}
                  </small>
                </span>
                <strong>{money(i.quantity * i.unitPrice)}</strong>
              </div>
            ))}
          {b.service !== "food" && (
            <p>
              {b.vehicle} · {b.km.toFixed(1)} km · {b.minutes} min estimate
            </p>
          )}
          <PriceBreakdown
            price={b.price}
            label={b.service === "food" ? "Food subtotal" : "Base estimate"}
          />
          <p>{b.payment}</p>
          <p className="receipt-note">
            DEMO RECEIPT · No payment collected
            <br />
            Fictional prices and services. Not a tax invoice.
          </p>
        </Modal>
      )}
      {chat && <Chat onClose={() => setChat(false)} />}{" "}
      {cancel && (
        <Confirm
          title="Cancel this demo booking?"
          onClose={() => setCancel(false)}
          onConfirm={() => {
            dispatch({ type: "cancel", id: b.id });
            setCancel(false);
          }}
          label="Cancel booking"
        >
          <p>
            The booking will stay in Activity as cancelled. No cancellation fee
            applies in this demo.
          </p>
        </Confirm>
      )}
      {share && (
        <Modal title="Share trip demo" onClose={() => setShare(false)}>
          <p>
            {b.id} · {statusLabel(b)}
          </p>
          <p>
            {locationById(b.from).name} → {locationById(b.to).name}
          </p>
          <p className="muted">
            This copies a demo summary. It does not create a live tracking link
            or send anything to another person.
          </p>
          <button className="button full" onClick={copy}>
            <Copy size={17} /> Copy summary
          </button>
        </Modal>
      )}
    </>
  );
}
function Chat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ text: string; me: boolean }[]>([
    {
      text: "Hi! I’m your demo driver. I’ll meet you at the pickup point.",
      me: false,
    },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const send = (value: string) => {
    if (!value.trim() || typing) return;
    setMessages((m) => [...m, { text: value.trim(), me: true }]);
    setText("");
    setTyping(true);
    timer.current = setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          text: "Got it, thanks! I’ll follow your instructions. This is an automated demo reply.",
          me: false,
        },
      ]);
      setTyping(false);
    }, 900);
  };
  return (
    <Modal title="Chat with Amir · demo" onClose={onClose}>
      <p className="micro-copy">
        Messages stay here. No real person receives them.
      </p>
      <div className="chat-messages" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={m.me ? "me" : "them"}>
            {m.text}
          </div>
        ))}
        {typing && <small>Demo driver is typing…</small>}
      </div>
      <div className="quick-replies">
        {["I’m at the entrance", "Please wait a moment"].map((v) => (
          <button
            className="chip"
            key={v}
            disabled={typing}
            onClick={() => send(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <form
        className="input-action"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <input
          aria-label="Message to demo driver"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={300}
          placeholder="Write a message…"
        />
        <button
          aria-label="Send demo message"
          disabled={typing || !text.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </Modal>
  );
}
