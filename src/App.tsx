import { useEffect, useState } from "react";
import {
  Activity as ActivityIcon,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CarFront,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  Home,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Ticket,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import { Account, Help } from "./Account";
import {
  Delivery,
  Ride,
  newDeliveryDraft,
  type RideDraft,
} from "./BookingForms";
import {
  Empty,
  FoodImage,
  LocationPicker,
  Modal,
  PageTitle,
  RestaurantCard,
  Confirm,
} from "./components";
import { Food, Cart } from "./Food";
import { Tracking } from "./Tracking";
import { locationById, restaurants } from "./data";
import {
  dateTime,
  isComplete,
  isScheduled,
  money,
  statusLabel,
  uid,
  vouchers,
  type Booking,
  type Page,
  type Service,
} from "./domain";
import { useDemo } from "./store";
const nav = [
  { page: "home", label: "Home", Icon: Home },
  { page: "ride", label: "Ride", Icon: CarFront },
  { page: "food", label: "Food", Icon: UtensilsCrossed },
  { page: "delivery", label: "Delivery", Icon: Package },
  { page: "activity", label: "Activity", Icon: ActivityIcon },
  { page: "offers", label: "Offers", Icon: Ticket },
  { page: "account", label: "Account", Icon: UserRound },
] as const;
const defaultRide = (): RideDraft => ({
  from: "bintang",
  to: "",
  vehicle: "PokmiGo",
  code: "",
  scheduled: false,
  date: "",
});
function pageFromHash(): Page {
  const hash = window.location.hash.slice(1).split("/")[0];
  return nav.some((n) => n.page === hash) ? (hash as Page) : "home";
}
export default function App() {
  const { state, dispatch, toast } = useDemo();
  const [page, setPage] = useState<Page>(pageFromHash);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [ride, setRide] = useState(defaultRide);
  const [delivery, setDelivery] = useState(newDeliveryDraft);
  const [cart, setCart] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [help, setHelp] = useState(false);
  const [reorder, setReorder] = useState<Booking | null>(null);
  const [search, setSearch] = useState(false);
  const go = (next: Page) => {
    setPage(next);
    setSelectedId(null);
    window.location.hash = next;
    window.scrollTo({ top: 0 });
  };
  useEffect(() => {
    const listener = () => {
      setPage(pageFromHash());
      setSelectedId(null);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);
  const openBooking = (b: Booking) => {
    setSelectedId(b.id);
    window.scrollTo({ top: 0 });
  };
  const book = (b: Booking) => {
    dispatch({ type: "book", booking: b });
    openBooking(b);
  };
  const again = (b: Booking) => {
    if (b.service === "ride") {
      setRide({
        from: b.from,
        to: b.to,
        vehicle: b.vehicle,
        code: "",
        scheduled: false,
        date: "",
      });
      go("ride");
    }
    if (b.service === "delivery") {
      setDelivery({
        from: b.from,
        to: b.to,
        sender: b.sender,
        senderPhone: b.senderPhone,
        recipient: b.recipient,
        recipientPhone: b.recipientPhone,
        description: b.description,
        parcel: b.parcel,
        vehicle: b.vehicle,
        notes: b.notes,
        code: "",
      });
      go("delivery");
    }
    if (b.service === "food") {
      if (state.cart.length && !reorder) {
        setReorder(b);
        return;
      }
      dispatch({
        type: "cart",
        cart: b.items.map((i) => ({ ...i, id: uid() })),
      });
      setReorder(null);
      setRestaurantId(b.restaurantId);
      go("food");
      setCart(true);
    }
  };
  const selected = state.bookings.find((b) => b.id === selectedId);
  const unread = state.notices.filter((n) => !n.read).length;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <button
          className="wordmark"
          onClick={() => go("home")}
          aria-label="UberPokmi home"
        >
          uberpokmi<span>.</span>
        </button>
        <div className="sidebar-caption">YOUR EVERYDAY, UPGRADED</div>
        <nav aria-label="Main navigation">
          {nav.map(({ page: n, label, Icon }, i) => (
            <button
              key={n}
              className={`${page === n ? "active" : ""} ${i === 4 ? "nav-separated" : ""}`}
              onClick={() => go(n)}
              aria-current={page === n ? "page" : undefined}
            >
              <Icon size={20} />
              <span>{label}</span>
              {n === "offers" && <span className="nav-count">3</span>}
              {page === n && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="city-stamp">
            <NavigationArt />
            <strong>
              Made for your
              <br />
              kind of city.
            </strong>
            <span>KUALA LUMPUR, MY</span>
          </div>
          <button className="help-button" onClick={() => setHelp(true)}>
            <CircleHelp size={18} /> Need a hand?
            <ArrowUpRight size={15} />
          </button>
          <button className="sidebar-profile" onClick={() => go("account")}>
            <span className="avatar">AT</span>
            <span>
              <strong>Alex Tan</strong>
              <small>Demo Member</small>
            </span>
            <ChevronRight size={17} />
          </button>
        </div>
      </aside>
      <div className="app-content">
        <header className="topbar">
          <div className="mobile-logo">
            uberpokmi<span>.</span>
          </div>
          <LocationPicker
            label="Your location"
            value={state.locationId}
            onChange={(locationId) =>
              dispatch({ type: "preferences", value: { locationId } })
            }
            compact
          />
          <div className="top-actions">
            <span className="demo-badge">
              <span /> Interactive Demo
            </span>
            <button
              className="icon-button top-search"
              aria-label="Search the city"
              onClick={() => setSearch(true)}
            >
              <Search size={19} />
            </button>
            <button
              className="icon-button notification-button"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              onClick={() => setNotifications(true)}
            >
              <Bell size={20} />
              {unread > 0 && <span />}
            </button>
            <button
              className="avatar"
              aria-label="Open demo account"
              onClick={() => go("account")}
            >
              AT
            </button>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="main-content">
          {selected ? (
            <Tracking
              booking={selected}
              onBack={() => setSelectedId(null)}
              onAgain={again}
            />
          ) : page === "home" ? (
            <HomePage
              go={go}
              onDestination={(to) => {
                setRide({
                  ...ride,
                  from: state.locationId === to ? "bintang" : state.locationId,
                  to,
                });
                go("ride");
              }}
              onRestaurant={(id) => {
                setRestaurantId(id);
                go("food");
              }}
              onBooking={openBooking}
            />
          ) : page === "ride" ? (
            <Ride
              draft={ride}
              setDraft={setRide}
              onBooked={book}
              onBack={() => go("home")}
            />
          ) : page === "food" ? (
            <Food
              restaurantId={restaurantId}
              setRestaurantId={setRestaurantId}
              onBack={() => go("home")}
              onCart={() => setCart(true)}
            />
          ) : page === "delivery" ? (
            <Delivery
              draft={delivery}
              setDraft={setDelivery}
              onBooked={book}
              onBack={() => go("home")}
            />
          ) : page === "activity" ? (
            <ActivityPage onBooking={openBooking} go={go} />
          ) : page === "offers" ? (
            <Offers
              onUse={(service) => {
                if (service === "ride") setRide({ ...ride, code: "RIDE5" });
                if (service === "delivery")
                  setDelivery({ ...delivery, code: "SEND3" });
                go(service);
                if (service === "food")
                  toast(
                    "Enter FIRSTBITE at checkout for 10% off eligible food.",
                  );
              }}
            />
          ) : (
            <Account
              onReset={() => {
                setRide(defaultRide());
                setDelivery(newDeliveryDraft());
                setRestaurantId(null);
                setSelectedId(null);
                go("home");
              }}
            />
          )}
          <footer className="app-footer">
            <span>YOUR CITY. YOUR WAY.</span>
            <span>
              Built for the everyday. <span className="footer-dot" /> Kuala
              Lumpur
            </span>
            <a href="/images/credits.html" target="_blank" rel="noreferrer">
              Image credits
            </a>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {nav
          .filter((n) =>
            ["home", "activity", "offers", "account"].includes(n.page),
          )
          .map(({ page: p, label, Icon }) => (
            <button
              key={p}
              className={page === p ? "active" : ""}
              onClick={() => go(p)}
              aria-current={page === p ? "page" : undefined}
            >
              <Icon size={21} />
              <span>{label}</span>
            </button>
          ))}
      </nav>
      {state.cart.length > 0 && page !== "food" && (
        <button
          className="global-cart"
          aria-label="Open food bag"
          onClick={() => setCart(true)}
        >
          <ShoppingBag size={20} />
          <span>{state.cart.reduce((n, i) => n + i.quantity, 0)}</span>
        </button>
      )}
      {cart && <Cart onClose={() => setCart(false)} onBooked={book} />}{" "}
      {help && <Help onClose={() => setHelp(false)} />}{" "}
      {notifications && (
        <Modal
          title="A little heads-up."
          onClose={() => setNotifications(false)}
        >
          <div className="section-heading compact-heading">
            <span>{unread} unread updates</span>
            <button
              className="text-button"
              onClick={() => dispatch({ type: "read" })}
            >
              <Check size={15} /> Mark all read
            </button>
          </div>
          <div className="notifications">
            {state.notices.map((n) => (
              <div key={n.id} className={n.read ? "read" : "unread"}>
                <span className="notice-dot" />
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.body}</p>
                  <small>{dateTime(n.created)}</small>
                  {n.bookingId && (
                    <button
                      className="text-button"
                      onClick={() => {
                        const b = state.bookings.find(
                          (b) => b.id === n.bookingId,
                        );
                        if (b) openBooking(b);
                        setNotifications(false);
                      }}
                    >
                      View booking
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {reorder && (
        <Confirm
          title="Replace your current bag?"
          label="Reorder and replace"
          onClose={() => setReorder(null)}
          onConfirm={() => again(reorder)}
        >
          <p>
            This reorder will replace the items currently in your bag. Your past
            orders stay in Activity.
          </p>
        </Confirm>
      )}
      {search && (
        <Modal
          title="Where would you like to go?"
          onClose={() => setSearch(false)}
        >
          <p className="muted">Pick a place for your next ride.</p>
          <LocationPicker
            label="Search destination"
            value={ride.to}
            onChange={(to) => {
              setRide({ ...ride, to });
              setSearch(false);
              go("ride");
            }}
          />
          <div className="search-services">
            {nav
              .filter((n) => ["food", "delivery"].includes(n.page))
              .map((n) => (
                <button
                  className="button secondary"
                  key={n.page}
                  onClick={() => {
                    setSearch(false);
                    go(n.page);
                  }}
                >
                  <n.Icon size={18} /> Explore {n.label}
                </button>
              ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
function NavigationArt() {
  return (
    <svg viewBox="0 0 160 70" aria-hidden="true">
      <path
        d="M0 55H36V27H80V45H120V8H160"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      <circle cx="36" cy="55" r="5" fill="currentColor" />
      <path d="M120 5l-7 13h14z" fill="currentColor" />
    </svg>
  );
}
function HomePage({
  go,
  onDestination,
  onRestaurant,
  onBooking,
}: {
  go: (p: Page) => void;
  onDestination: (id: string) => void;
  onRestaurant: (id: string) => void;
  onBooking: (b: Booking) => void;
}) {
  const { state } = useDemo();
  const active = state.bookings.find((b) => !isComplete(b) && !b.cancelled);
  return (
    <>
      <div className="home-greeting">
        <span>
          Good to see you, Alex <span className="greeting-line" />
        </span>
        <span className="city-time">
          <MapPin size={14} /> KUALA LUMPUR
        </span>
      </div>
      <div className="home-title">
        <h1>
          Your city.
          <br />
          <span>Your way.</span>
        </h1>
        <div>
          <p>
            Every journey, craving and delivery.
            <br />
            One less thing to think about.
          </p>
          <span className="home-trust">
            <ShieldCheck size={15} /> Made for your everyday
          </span>
        </div>
      </div>
      <section className="service-grid" aria-label="Choose your service">
        <button
          className="service-card ride-service"
          onClick={() => go("ride")}
        >
          <div className="service-card-top">
            <span>
              <CarFront size={19} /> POKMIRIDE
            </span>
            <span className="service-arrow">
              <ArrowUpRight size={21} />
            </span>
          </div>
          <h2>
            Let’s get
            <br />
            you there.
          </h2>
          <img
            src="/images/pokmi-car.png"
            alt="Original graphite PokmiGo vehicle render"
          />
          <p>
            Go anywhere, effortlessly.
            <ArrowRight size={17} />
          </p>
        </button>
        <button
          className="service-card food-service"
          onClick={() => go("food")}
        >
          <div className="service-card-top">
            <span>
              <UtensilsCrossed size={18} /> POKMIFOOD
            </span>
            <span className="service-arrow">
              <ArrowUpRight size={21} />
            </span>
          </div>
          <h2>
            Follow your
            <br />
            cravings.
          </h2>
          <div className="service-food-image">
            <FoodImage src="/images/food-1-0.jpg" alt="Nasi lemak ayam" />
          </div>
          <p>
            Good food. Right to you.
            <ArrowRight size={17} />
          </p>
        </button>
        <button
          className="service-card send-service"
          onClick={() => go("delivery")}
        >
          <div className="service-card-top">
            <span>
              <Package size={18} /> POKMISEND
            </span>
            <span className="service-arrow">
              <ArrowUpRight size={21} />
            </span>
          </div>
          <h2>
            From here.
            <br />
            With care.
          </h2>
          <div className="parcel-art">
            <div className="parcel-sticker">
              pokmi<span>.</span>
              <ArrowUpRight size={22} />
            </div>
            <div className="parcel-tape" />
            <Package size={90} strokeWidth={0.8} />
          </div>
          <p>
            Send it across town.
            <ArrowRight size={17} />
          </p>
        </button>
      </section>
      <section className="promo-strip">
        <div className="promo-ticket">
          <Ticket size={27} />
        </div>
        <div>
          <h3>Your next move, on us.</h3>
          <p>
            A little welcome treat. Save RM5 on eligible rides with{" "}
            <strong>RIDE5</strong>.
          </p>
        </div>
        <button className="text-button" onClick={() => go("offers")}>
          Explore offers
          <ArrowRight size={17} />
        </button>
      </section>
      <section className="recent-places">
        <div className="section-heading">
          <h2>Back to your usual?</h2>
          <span>A few places you might love</span>
        </div>
        <div className="destination-grid">
          {["klcc", "pavilion", "sentral"].map((id, i) => (
            <button
              key={id}
              className="destination-card"
              onClick={() => onDestination(id)}
            >
              <span className="destination-icon">
                {i === 2 ? <Clock3 size={21} /> : <MapPin size={21} />}
              </span>
              <span>
                <strong>{locationById(id).name}</strong>
                <small>
                  {i === 0
                    ? "Kuala Lumpur City Centre"
                    : i === 1
                      ? "Bukit Bintang"
                      : "Brickfields, Kuala Lumpur"}
                </small>
              </span>
              <ArrowUpRight size={18} />
            </button>
          ))}
        </div>
      </section>
      <section>
        <div className="section-heading">
          <div>
            <h2>Something delicious nearby.</h2>
            <p>Local favourites. Big flavour.</p>
          </div>
          <button className="text-button" onClick={() => go("food")}>
            Explore food
            <ArrowRight size={17} />
          </button>
        </div>
        <div className="home-restaurants">
          {restaurants.slice(0, 3).map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onClick={() => onRestaurant(r.id)}
            />
          ))}
        </div>
      </section>
      <section className="home-activity">
        <div>
          <h2>
            {active
              ? "Your day is in motion."
              : "A fresh page. A city of possibilities."}
          </h2>
          <p>
            {active
              ? `${statusLabel(active)} · ${active.id}`
              : "Your journeys and orders will find a home right here."}
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() => (active ? onBooking(active) : go("activity"))}
        >
          {active ? "Continue tracking" : "View activity"}
          <ArrowRight size={17} />
        </button>
      </section>
    </>
  );
}
function ActivityPage({
  onBooking,
  go,
}: {
  onBooking: (b: Booking) => void;
  go: (p: Page) => void;
}) {
  const { state } = useDemo();
  const [filter, setFilter] = useState("All");
  const filtered = state.bookings.filter(
    (b) => filter === "All" || b.service === filter.toLowerCase(),
  );
  return (
    <>
      <PageTitle
        title="Your day, in motion."
        description="Every trip, every bite, every little delivery. All in one place."
      />
      <div className="category-tabs">
        {["All", "Ride", "Food", "Delivery"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="activity-list">
          {filtered.map((b) => {
            const Icon =
              b.service === "ride"
                ? CarFront
                : b.service === "food"
                  ? UtensilsCrossed
                  : Package;
            return (
              <button
                className="activity-row"
                key={b.id}
                onClick={() => onBooking(b)}
              >
                <span className={`activity-icon ${b.service}`}>
                  <Icon size={23} />
                </span>
                <div className="activity-info">
                  <span className="activity-id">
                    {b.id} · {dateTime(b.created)}
                  </span>
                  <h3>
                    {b.service === "food"
                      ? restaurants.find((r) => r.id === b.restaurantId)?.name
                      : `${locationById(b.from).name} → ${locationById(b.to).name}`}
                  </h3>
                  <span
                    className={`status-chip ${isComplete(b) ? "complete" : ""} ${b.cancelled ? "cancelled" : ""}`}
                  >
                    {b.cancelled
                      ? "Cancelled"
                      : isComplete(b)
                        ? "Completed"
                        : isScheduled(b)
                          ? "Scheduled"
                          : statusLabel(b)}
                  </span>
                </div>
                <div className="activity-amount">
                  <strong>{money(b.price.total)}</strong>
                  <small>
                    {isComplete(b) ? "View receipt" : "View details"}
                    <ArrowRight size={14} />
                  </small>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <Empty
          title="No recent activity. Yet."
          text="Your next ride, meal or delivery is the start of a good story."
          action="Explore your city"
          onAction={() => go("home")}
        />
      )}
    </>
  );
}
function Offers({ onUse }: { onUse: (service: Service) => void }) {
  const { toast } = useDemo();
  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast(`${code} copied. Good things are on the way.`);
    } catch {
      toast(`Your code is ${code}. Select the code to copy manually.`);
    }
  };
  return (
    <>
      <PageTitle
        title="A little extra, just for you."
        description="Good days come with a few good deals."
      />
      <div className="offers-grid">
        {vouchers.map((v) => (
          <article key={v.code} className={`offer-card ${v.accent}`}>
            <div className="offer-top">
              <span>
                {v.service === "ride"
                  ? "PokmiRide"
                  : v.service === "food"
                    ? "PokmiFood"
                    : "PokmiSend"}
              </span>
              <Ticket size={30} />
            </div>
            <h2>{v.benefit}</h2>
            <p>{v.title}</p>
            <div className="offer-code">
              <code>{v.code}</code>
              <button
                aria-label={`Copy ${v.code}`}
                onClick={() => copy(v.code)}
              >
                <Copy size={18} />
              </button>
            </div>
            <div className="offer-terms">
              <strong>{v.rule}</strong>
              <small>
                Demo offer · no expiry in this simulation.
                <br />
                Reusable for demo bookings.
              </small>
            </div>
            <button
              className="button secondary full"
              onClick={() => onUse(v.service)}
            >
              Use this offer
              <ArrowRight size={16} />
            </button>
          </article>
        ))}
      </div>
      <div className="offers-note">
        <Sparkles size={21} />
        <p>
          Little perks for your everyday. These are fictional vouchers, ready to
          try in the demo.
        </p>
      </div>
    </>
  );
}
