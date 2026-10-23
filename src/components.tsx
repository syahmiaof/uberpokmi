import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  MapPin,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Tag,
  X,
  UtensilsCrossed,
} from "lucide-react";
import { locations, locationById } from "./data";
import {
  money,
  voucherCheck,
  type Payment,
  type Price,
  type Restaurant,
  type Service,
} from "./domain";
import { useDemo } from "./store";
export function Modal({
  title,
  onClose,
  children,
  wide = false,
  focusInput = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  focusInput?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    if (focusInput) dialog?.querySelector<HTMLInputElement>("input")?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={`modal ${wide ? "wide" : ""}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <header>
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </header>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
export function Confirm({
  title,
  children,
  onClose,
  onConfirm,
  label = "Confirm",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  label?: string;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="confirm-copy">{children}</div>
      <div className="button-row">
        <button className="button secondary" onClick={onClose}>
          Keep editing
        </button>
        <button className="button" onClick={onConfirm}>
          {label}
          <ArrowRight size={17} />
        </button>
      </div>
    </Modal>
  );
}
export function Empty({
  title,
  text,
  action,
  onAction,
}: {
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="empty">
      <div className="empty-mark">
        <MapPin size={26} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action && (
        <button className="button secondary" onClick={onAction}>
          {action}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
export function PageTitle({
  title,
  description,
  back,
  children,
}: {
  title: string;
  description?: string;
  back?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      {back && (
        <button className="text-button back" onClick={back}>
          <ArrowLeft size={17} /> Back
        </button>
      )}
      <div className="heading-row">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
export function LocationPicker({
  label,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { state } = useDemo();
  const found = locations.find((l) => l.id === value);
  return (
    <>
      <button
        type="button"
        className={`location-field ${compact ? "compact" : ""}`}
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
        aria-label={`${label}: ${found?.name || "Choose a location"}`}
      >
        <MapPin size={18} />
        <span>
          <small>{label}</small>
          <strong>{found?.name || "Choose a location"}</strong>
        </span>
        <ChevronDown size={15} />
      </button>
      {open && (
        <Modal title={label} onClose={() => setOpen(false)} focusInput>
          <label className="search-field">
            <Search size={19} />
            <input
              autoFocus
              aria-label="Search locations"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Kuala Lumpur"
            />
          </label>
          {!query && state.addresses.length > 0 && (
            <div className="saved-quick">
              {state.addresses.map((a) => (
                <button
                  key={a.id}
                  className="chip"
                  onClick={() => {
                    onChange(a.locationId);
                    setOpen(false);
                  }}
                >
                  {a.label} · {locationById(a.locationId).name}
                </button>
              ))}
            </div>
          )}
          <p className="micro-copy">
            {query ? "Matching locations" : "Popular in Kuala Lumpur"} · demo
            locations
          </p>
          <div className="location-list">
            {locations
              .filter((l) =>
                `${l.name} ${l.address}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    onChange(l.id);
                    setOpen(false);
                  }}
                >
                  <MapPin size={18} />
                  <span>
                    <strong>{l.name}</strong>
                    <small>{l.address}</small>
                  </span>
                  {l.id === value && <Check size={18} />}
                </button>
              ))}
          </div>
          {!locations.some((l) =>
            `${l.name} ${l.address}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          ) && (
            <Empty
              title="No locations found"
              text="Try KLCC, Bangsar, or another place in our demo area."
            />
          )}
        </Modal>
      )}
    </>
  );
}
export function PaymentPicker({
  value,
  onChange,
}: {
  value: Payment;
  onChange: (value: Payment) => void;
}) {
  return (
    <label className="field">
      Payment method
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Payment)}
      >
        {(["Card •••• 4242", "Cash", "Pokmi Wallet"] as Payment[]).map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <small>Demo methods only. No money is collected.</small>
    </label>
  );
}
export function VoucherInput({
  service,
  amount,
  code,
  onChange,
}: {
  service: Service;
  amount: number;
  code: string;
  onChange: (code: string) => void;
}) {
  const [draft, setDraft] = useState(code);
  const [feedback, setFeedback] = useState("");
  const validation = voucherCheck(code, service, amount);
  return (
    <div className="voucher-input">
      <label htmlFor={`voucher-${service}`}>
        <Tag size={15} /> Have a promo code?
      </label>
      <div className="input-action">
        <input
          id={`voucher-${service}`}
          placeholder={
            service === "ride"
              ? "Try RIDE5"
              : service === "food"
                ? "Try FIRSTBITE"
                : "Try SEND3"
          }
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value.toUpperCase());
            setFeedback("");
          }}
        />
        <button
          type="button"
          onClick={() => {
            const result = voucherCheck(draft, service, amount);
            if (!draft.trim()) {
              setFeedback("Enter a voucher code first.");
              return;
            }
            if (draft.trim() === code && !result.error) {
              setFeedback("This voucher is already applied.");
              return;
            }
            setFeedback(result.error);
            if (!result.error) onChange(draft.trim().toUpperCase());
          }}
        >
          Apply
        </button>
      </div>
      {(feedback || validation.error) && (
        <p className="field-error" role="status">
          {feedback || validation.error}
        </p>
      )}
      {code && !validation.error && (
        <div className="applied">
          <Check size={14} />
          {code} · {money(validation.discount)} saved
          <button
            type="button"
            aria-label="Remove voucher"
            onClick={() => {
              onChange("");
              setDraft("");
              setFeedback("");
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
export function PriceBreakdown({
  price,
  label = "Fare estimate",
}: {
  price: Price;
  label?: string;
}) {
  return (
    <div className="price-breakdown">
      <div>
        <span>{label}</span>
        <span>{money(price.subtotal)}</span>
      </div>
      {price.delivery > 0 && (
        <div>
          <span>Delivery fee</span>
          <span>{money(price.delivery)}</span>
        </div>
      )}
      {price.platform > 0 && (
        <div>
          <span>Platform fee</span>
          <span>{money(price.platform)}</span>
        </div>
      )}
      {price.discount > 0 && (
        <div className="discount">
          <span>{price.code}</span>
          <span>−{money(price.discount)}</span>
        </div>
      )}
      <div className="total">
        <strong>Total</strong>
        <strong>{money(price.total)}</strong>
      </div>
    </div>
  );
}
export function Quantity({
  value,
  onChange,
  label = "Quantity",
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus size={15} />
      </button>
      <span aria-label={label}>{value}</span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= 20}
        onClick={() => onChange(Math.min(20, value + 1))}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
export function FoodImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div
      className={`image-fallback ${className}`}
      role="img"
      aria-label={`${alt} — photo unavailable`}
    >
      <UtensilsCrossed size={30} />
      <span>{alt}</span>
    </div>
  ) : (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
export function RestaurantCard({
  restaurant: r,
  onClick,
}: {
  restaurant: Restaurant;
  onClick: () => void;
}) {
  return (
    <button className="restaurant-card" onClick={onClick}>
      <div className="restaurant-image">
        <FoodImage src={r.image} alt={r.menu[0].name} />
        {r.offer && <span className="food-badge">{r.offer}</span>}
        <span className="eta-badge">
          {r.eta}–{r.eta + 10} min
        </span>
      </div>
      <div className="restaurant-title">
        <h3>{r.name}</h3>
        <span>
          <Star size={13} fill="currentColor" /> {r.rating}
        </span>
      </div>
      <p>
        {r.category.slice(0, 2).join(" · ")}
        <span>Delivery {money(r.fee)}</span>
      </p>
    </button>
  );
}
export function Rating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <fieldset className="rating">
      <legend>{label}</legend>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${label}: ${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={value === n}
          onClick={() => onChange(n)}
        >
          <Star size={28} fill={value >= n ? "currentColor" : "none"} />
        </button>
      ))}
      {value > 0 && <p>Thanks! Your rating is saved on this device.</p>}
    </fieldset>
  );
}
export function DemoNote() {
  return (
    <div className="demo-note">
      <ShieldCheck size={15} />
      <span>A little simulation. A whole city of possibilities.</span>
    </div>
  );
}
