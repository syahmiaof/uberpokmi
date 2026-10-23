import { describe, expect, it } from "vitest";
import {
  cartTotal,
  distance,
  isComplete,
  priceFor,
  rideFare,
  sendFare,
  validPhone,
  voucherCheck,
  type RideBooking,
} from "./domain";
import { initialState, locations } from "./data";
import { reducer } from "./store";
describe("deterministic demo prices", () => {
  it("rounds prices to sen once, including vehicle multipliers", () => {
    expect(rideFare(5, "PokmiGo")).toBe(1325);
    expect(rideFare(5, "PokmiComfort")).toBe(1921);
    expect(rideFare(5, "PokmiXL")).toBe(2385);
    expect(sendFare(5, "PokmiBike", "Small Parcel")).toBe(1100);
    expect(sendFare(5, "PokmiCar", "Medium Parcel")).toBe(2150);
  });
  it("uses strict above thresholds for ride and send", () => {
    expect(voucherCheck("RIDE5", "ride", 1500).discount).toBe(0);
    expect(voucherCheck("RIDE5", "ride", 1501).discount).toBe(500);
    expect(voucherCheck("SEND3", "delivery", 1200).discount).toBe(0);
    expect(voucherCheck("SEND3", "delivery", 1201).discount).toBe(300);
  });
  it("applies food minimum and cap to subtotal, not fees", () => {
    expect(priceFor("food", 2400, "FIRSTBITE", 250, 100).discount).toBe(0);
    expect(priceFor("food", 2500, "FIRSTBITE", 250, 100).total).toBe(2600);
    expect(priceFor("food", 10000, "FIRSTBITE", 350, 100).discount).toBe(600);
  });
  it("rejects cross-service and unknown vouchers; normalizes case", () => {
    expect(voucherCheck("RIDE5", "food", 5000).error).toContain("ride");
    expect(voucherCheck("UNKNOWN", "ride", 5000).error).toContain("not valid");
    expect(voucherCheck(" ride5 ", "ride", 5000).discount).toBe(500);
  });
  it("calculates stable symmetric route estimates", () => {
    expect(distance(locations[0], locations[8])).toBe(
      distance(locations[8], locations[0]),
    );
    expect(distance(locations[0], locations[8])).toBeGreaterThan(15);
  });
  it("sums integer unit prices and quantities", () => {
    expect(
      cartTotal([
        {
          id: "1",
          restaurantId: "r0",
          itemId: "m0",
          name: "Meal",
          image: "",
          unitPrice: 1590,
          quantity: 3,
          options: [],
          notes: "",
        },
      ]),
    ).toBe(4770);
  });
});
describe("validation and lifecycle integrity", () => {
  it.each(["0123456789", "+60123456789", "011-1234 5678", "601112345678"])(
    "accepts plausible MY mobile: %s",
    (p) => expect(validPhone(p)).toBe(true),
  );
  it.each(["123", "abc", "+44123456789", "0399999999"])(
    "rejects non MY mobile: %s",
    (p) => expect(validPhone(p)).toBe(false),
  );
  const booking = (): RideBooking => ({
    id: "PKR-test",
    service: "ride",
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    from: "klcc",
    to: "sunway",
    vehicle: "PokmiGo",
    km: 18,
    minutes: 58,
    payment: "Cash",
    price: priceFor("ride", 3600, "RIDE5"),
    step: 0,
    cancelled: false,
    ratings: [],
    notes: "",
  });
  it("stops advancing at completed, preserving original price", () => {
    const b = booking();
    let s = reducer(initialState(), { type: "book", booking: b });
    for (let i = 0; i < 10; i++) s = reducer(s, { type: "advance", id: b.id });
    expect(isComplete(s.bookings[0])).toBe(true);
    expect(s.bookings[0].price.total).toBe(3100);
    expect(s.notices.length).toBe(6);
  });
  it("does not advance cancelled or future scheduled rides", () => {
    const b = booking();
    let s = reducer(initialState(), { type: "book", booking: b });
    s = reducer(s, { type: "cancel", id: b.id });
    expect(reducer(s, { type: "advance", id: b.id })).toBe(s);
    const scheduled = {
      ...booking(),
      scheduledAt: new Date(Date.now() + 3600000).toISOString(),
      step: -1,
    };
    const s2 = reducer(initialState(), { type: "book", booking: scheduled });
    expect(reducer(s2, { type: "advance", id: scheduled.id })).toBe(s2);
  });
  it("respects notification preference and saves ratings", () => {
    const b = booking();
    let s = reducer(
      { ...initialState(), notifications: false },
      { type: "book", booking: b },
    );
    expect(s.notices.length).toBe(1);
    s = reducer(s, { type: "rating", id: b.id, index: 0, value: 5 });
    expect(s.bookings[0].ratings).toEqual([5]);
  });
});
