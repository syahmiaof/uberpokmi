export type Service = "ride" | "food" | "delivery";
export type Page = "home" | Service | "activity" | "offers" | "account";
export type Payment = "Cash" | "Card •••• 4242" | "Pokmi Wallet";
export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}
export interface SavedAddress {
  id: string;
  label: string;
  locationId: string;
}
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spicy?: boolean;
}
export interface Restaurant {
  id: string;
  name: string;
  category: string[];
  description: string;
  rating: string;
  eta: number;
  fee: number;
  image: string;
  offer?: string;
  menu: MenuItem[];
}
export interface CartItem {
  id: string;
  restaurantId: string;
  itemId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  options: string[];
  notes: string;
}
export interface Price {
  subtotal: number;
  delivery: number;
  platform: number;
  discount: number;
  total: number;
  code: string;
}
interface BookingBase {
  id: string;
  created: string;
  updated: string;
  from: string;
  to: string;
  payment: Payment;
  price: Price;
  step: number;
  cancelled: boolean;
  ratings: number[];
  notes: string;
}
export interface RideBooking extends BookingBase {
  service: "ride";
  vehicle: string;
  km: number;
  minutes: number;
  scheduledAt?: string;
}
export interface FoodOrder extends BookingBase {
  service: "food";
  restaurantId: string;
  items: CartItem[];
  minutes: number;
}
export interface DeliveryOrder extends BookingBase {
  service: "delivery";
  vehicle: string;
  parcel: string;
  description: string;
  sender: string;
  senderPhone: string;
  recipient: string;
  recipientPhone: string;
  km: number;
  minutes: number;
}
export type Booking = RideBooking | FoodOrder | DeliveryOrder;
export interface Notice {
  id: string;
  title: string;
  body: string;
  bookingId?: string;
  read: boolean;
  created: string;
}
export interface DemoState {
  version: 1;
  bookings: Booking[];
  cart: CartItem[];
  addresses: SavedAddress[];
  notices: Notice[];
  theme: "dark" | "light";
  payment: Payment;
  notifications: boolean;
  locationId: string;
}
export const stages: Record<Service, string[]> = {
  ride: [
    "Searching for your driver",
    "Your driver is assigned",
    "Your driver is arriving",
    "Enjoy the journey",
    "You’ve arrived",
  ],
  food: [
    "Order placed",
    "Order accepted",
    "Freshly prepared for you",
    "Your rider is assigned",
    "Order picked up",
    "Good food, on its way",
    "Enjoy every bite",
  ],
  delivery: [
    "Delivery placed",
    "Your courier is assigned",
    "Parcel picked up",
    "Your parcel is on its way",
    "Delivered with care",
  ],
};
export const money = (sen: number) => `RM ${(sen / 100).toFixed(2)}`;
export const dateTime = (value: string) =>
  new Date(value).toLocaleString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
export const isComplete = (b: Booking) =>
  b.step === stages[b.service].length - 1;
export const isScheduled = (b: Booking) =>
  b.service === "ride" && !!b.scheduledAt && b.step === -1;
export const statusLabel = (b: Booking) =>
  b.cancelled
    ? "Cancelled"
    : isScheduled(b)
      ? "Scheduled"
      : stages[b.service][b.step];
export function distance(a: Location, b: Location) {
  const rad = Math.PI / 180;
  const h =
    Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 +
    Math.cos(a.lat * rad) *
      Math.cos(b.lat * rad) *
      Math.sin(((b.lng - a.lng) * rad) / 2) ** 2;
  return Math.max(
    0.5,
    Math.round(
      6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 1.35 * 10,
    ) / 10,
  );
}
export const rideFare = (km: number, vehicle: string) =>
  Math.round(
    (450 + km * 175) *
      (vehicle === "PokmiComfort" ? 1.45 : vehicle === "PokmiXL" ? 1.8 : 1),
  );
export const sendFare = (km: number, vehicle: string, parcel: string) =>
  Math.round(
    (vehicle === "PokmiBike" ? 500 + km * 120 : 1000 + km * 170) +
      (parcel === "Medium Parcel" ? 300 : 0),
  );
export const vouchers = [
  {
    code: "RIDE5",
    service: "ride" as Service,
    title: "A little less fare. A lot more city.",
    benefit: "RM5 off your next ride",
    rule: "Ride fare above RM15.",
    accent: "lime",
  },
  {
    code: "FIRSTBITE",
    service: "food" as Service,
    title: "Your first bite is on the house. Almost.",
    benefit: "10% off your food",
    rule: "Food subtotal RM25 or more. Up to RM6 off.",
    accent: "orange",
  },
  {
    code: "SEND3",
    service: "delivery" as Service,
    title: "Send a little something, for less.",
    benefit: "RM3 off your delivery",
    rule: "Delivery fee above RM12.",
    accent: "mint",
  },
];
export function voucherCheck(
  code: string,
  service: Service,
  amount: number,
): { discount: number; error: string } {
  if (!code.trim()) return { discount: 0, error: "" };
  const v = vouchers.find((v) => v.code === code.trim().toUpperCase());
  if (!v)
    return {
      discount: 0,
      error: "That code is not valid. Try a voucher from Offers.",
    };
  if (v.service !== service)
    return {
      discount: 0,
      error: `This voucher is for ${v.service} bookings only.`,
    };
  if (
    (service === "ride" && amount <= 1500) ||
    (service === "food" && amount < 2500) ||
    (service === "delivery" && amount <= 1200)
  )
    return { discount: 0, error: `Minimum spend not met. ${v.rule}` };
  return {
    discount:
      service === "ride"
        ? 500
        : service === "delivery"
          ? 300
          : Math.min(600, Math.round(amount * 0.1)),
    error: "",
  };
}
export function priceFor(
  service: Service,
  subtotal: number,
  code = "",
  delivery = 0,
  platform = 0,
): Price {
  const { discount, error } = voucherCheck(code, service, subtotal);
  return {
    subtotal,
    delivery,
    platform,
    discount,
    total: Math.max(0, subtotal + delivery + platform - discount),
    code: error ? "" : code.trim().toUpperCase(),
  };
}
export const validPhone = (phone: string) =>
  /^(?:\+?60|0)1[0-9]{8,9}$/.test(phone.replace(/[\s-]/g, ""));
export const cartTotal = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
export const uid = () => crypto.randomUUID();
