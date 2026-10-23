import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { initialState } from "./data";
import {
  isComplete,
  isScheduled,
  stages,
  statusLabel,
  uid,
  type Booking,
  type CartItem,
  type DemoState,
  type SavedAddress,
} from "./domain";
export type Action =
  | { type: "book"; booking: Booking }
  | { type: "advance"; id: string }
  | { type: "cancel"; id: string }
  | { type: "rating"; id: string; index: number; value: number }
  | { type: "cart"; cart: CartItem[] }
  | { type: "addresses"; addresses: SavedAddress[] }
  | {
      type: "preferences";
      value: Partial<
        Pick<DemoState, "theme" | "payment" | "notifications" | "locationId">
      >;
    }
  | { type: "read" }
  | { type: "reset" };
export function reducer(state: DemoState, action: Action): DemoState {
  if (action.type === "reset") return initialState();
  if (action.type === "cart") return { ...state, cart: action.cart };
  if (action.type === "addresses")
    return { ...state, addresses: action.addresses };
  if (action.type === "preferences") return { ...state, ...action.value };
  if (action.type === "read")
    return {
      ...state,
      notices: state.notices.map((n) => ({ ...n, read: true })),
    };
  if (action.type === "book")
    return {
      ...state,
      bookings: [action.booking, ...state.bookings],
      cart: action.booking.service === "food" ? [] : state.cart,
      notices: state.notifications
        ? [
            {
              id: uid(),
              title: isScheduled(action.booking)
                ? "Your ride is scheduled"
                : "You’re all set",
              body: `Your ${action.booking.service} demo booking is confirmed.`,
              bookingId: action.booking.id,
              read: false,
              created: action.booking.created,
            },
            ...state.notices,
          ].slice(0, 60)
        : state.notices,
    };
  const booking = state.bookings.find((b) => b.id === action.id);
  if (!booking) return state;
  if (action.type === "rating")
    return {
      ...state,
      bookings: state.bookings.map((b) =>
        b.id === action.id
          ? {
              ...b,
              ratings: Object.assign([...b.ratings], {
                [action.index]: action.value,
              }),
            }
          : b,
      ),
    };
  if (booking.cancelled || isComplete(booking)) return state;
  if (
    action.type === "advance" &&
    booking.service === "ride" &&
    isScheduled(booking) &&
    Date.parse(booking.scheduledAt!) > Date.now()
  )
    return state;
  const updated: Booking =
    action.type === "cancel"
      ? { ...booking, cancelled: true, updated: new Date().toISOString() }
      : {
          ...booking,
          step: Math.min(booking.step + 1, stages[booking.service].length - 1),
          updated: new Date().toISOString(),
        };
  return {
    ...state,
    bookings: state.bookings.map((b) => (b.id === booking.id ? updated : b)),
    notices: state.notifications
      ? [
          {
            id: uid(),
            title: statusLabel(updated),
            body: `${updated.id} · ${updated.service} update`,
            read: false,
            bookingId: updated.id,
            created: updated.updated,
          },
          ...state.notices,
        ].slice(0, 60)
      : state.notices,
  };
}
const STORAGE_KEY = "uberpokmi-demo-v1";
function readState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const data = JSON.parse(raw) as DemoState;
    if (
      data.version !== 1 ||
      !Array.isArray(data.bookings) ||
      !Array.isArray(data.cart) ||
      !Array.isArray(data.addresses) ||
      !Array.isArray(data.notices)
    )
      return initialState();
    if (
      data.bookings.some(
        (b) =>
          !stages[b.service] ||
          !b.price ||
          !Number.isFinite(b.price.total) ||
          !Number.isInteger(b.step),
      ) ||
      data.cart.some(
        (c) =>
          !Number.isFinite(c.unitPrice) ||
          !Number.isInteger(c.quantity) ||
          c.quantity < 1,
      )
    )
      return initialState();
    return { ...initialState(), ...data };
  } catch {
    return initialState();
  }
}
const Context = createContext<{
  state: DemoState;
  dispatch: React.Dispatch<Action>;
  toast: (message: string) => void;
} | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, readState);
  const [message, setMessage] = useState("");
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
    document.documentElement.dataset.theme = state.theme;
  }, [state]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);
  const searching = state.bookings
    .filter((b) => b.service === "ride" && b.step === 0 && !b.cancelled)
    .map((b) => b.id)
    .join("|");
  useEffect(() => {
    if (!searching) return;
    const timer = setTimeout(
      () =>
        searching.split("|").forEach((id) => dispatch({ type: "advance", id })),
      2500,
    );
    return () => clearTimeout(timer);
  }, [searching]);
  return (
    <Context.Provider value={{ state, dispatch, toast: setMessage }}>
      {children}
      {storageError && (
        <div className="storage-warning" role="alert">
          Browser storage is unavailable. Changes will last for this session
          only.
        </div>
      )}
      {message && (
        <div className="toast" role="status">
          {message}
        </div>
      )}
    </Context.Provider>
  );
}
export function useDemo() {
  const context = useContext(Context);
  if (!context) throw new Error("DemoProvider is required");
  return context;
}
