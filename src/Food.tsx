import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Trash2,
  Truck,
} from "lucide-react";
import { restaurants } from "./data";
import {
  cartTotal,
  money,
  priceFor,
  uid,
  type Booking,
  type CartItem,
  type MenuItem,
  type Payment,
  type Restaurant,
} from "./domain";
import {
  Confirm,
  Empty,
  FoodImage,
  LocationPicker,
  Modal,
  PageTitle,
  PaymentPicker,
  PriceBreakdown,
  Quantity,
  RestaurantCard,
  VoucherInput,
} from "./components";
import { useDemo } from "./store";
export function Food({
  restaurantId,
  setRestaurantId,
  onBack,
  onCart,
}: {
  restaurantId: string | null;
  setRestaurantId: (id: string | null) => void;
  onBack: () => void;
  onCart: () => void;
}) {
  const { state, dispatch, toast } = useDemo();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("recommended");
  const [menuCategory, setMenuCategory] = useState("All");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const list = restaurants
    .filter(
      (r) =>
        (category === "All" || r.category.includes(category)) &&
        `${r.name} ${r.category.join(" ")} ${r.menu.map((m) => m.name).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "fastest"
        ? a.eta - b.eta
        : sort === "fee"
          ? a.fee - b.fee
          : +b.rating - +a.rating,
    );
  const openRestaurant = (id: string) => {
    setRestaurantId(id);
    setMenuCategory("All");
  };
  return (
    <>
      <PageTitle
        title={restaurant ? restaurant.name : "Good food. Good mood."}
        description={
          restaurant
            ? restaurant.description
            : "From your neighbourhood favourites to your next obsession."
        }
        back={restaurant ? () => setRestaurantId(null) : onBack}
      >
        <LocationPicker
          label="Deliver to"
          value={state.locationId}
          onChange={(locationId) =>
            dispatch({ type: "preferences", value: { locationId } })
          }
          compact
        />
      </PageTitle>
      {restaurant ? (
        <>
          <div className="restaurant-hero">
            <FoodImage src={restaurant.image} alt={restaurant.menu[0].name} />
            <div className="restaurant-hero-info">
              <span>
                <Star size={16} fill="currentColor" /> {restaurant.rating} demo
                rating
              </span>
              <span>
                <Clock3 size={16} /> {restaurant.eta}–{restaurant.eta + 10} min
              </span>
              <span>
                <Truck size={17} /> {money(restaurant.fee)} delivery
              </span>
            </div>
          </div>
          <div className="section-heading">
            <h2>Made fresh. Made for you.</h2>
            <span>Fictional restaurant · demo menu</span>
          </div>
          <div className="category-tabs">
            {["All", ...new Set(restaurant.menu.map((m) => m.category))].map(
              (c) => (
                <button
                  key={c}
                  className={menuCategory === c ? "active" : ""}
                  onClick={() => setMenuCategory(c)}
                >
                  {c}
                </button>
              ),
            )}
          </div>
          <div className="menu-grid">
            {restaurant.menu
              .filter(
                (m) => menuCategory === "All" || m.category === menuCategory,
              )
              .map((item) => (
                <button
                  key={item.id}
                  className="menu-item"
                  onClick={() => setSelected(item)}
                >
                  <div>
                    <small>{item.category}</small>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <strong>{money(item.price)}</strong>
                  </div>
                  <div className="menu-image">
                    <FoodImage src={item.image} alt={item.name} />
                    <span className="add-circle">
                      <Plus size={20} />
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </>
      ) : (
        <>
          <div className="food-discovery-top">
            <div className="food-search">
              <label className="search-field">
                <Search size={19} />
                <input
                  aria-label="Search food or restaurants"
                  placeholder="A dish, a craving, a favourite spot…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <label className="sort-control">
                <SlidersHorizontal size={17} />
                <select
                  aria-label="Sort restaurants"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="recommended">Top rated</option>
                  <option value="fastest">Fastest delivery</option>
                  <option value="fee">Lowest delivery fee</option>
                </select>
              </label>
            </div>
            <div className="category-tabs">
              {[
                "All",
                "Malaysian",
                "Chicken",
                "Rice",
                "Noodles",
                "Burgers",
                "Coffee",
                "Desserts",
              ].map((c) => (
                <button
                  key={c}
                  className={category === c ? "active" : ""}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {!query && category === "All" && (
            <div className="food-feature">
              <div>
                <span className="feature-offer">A good reason to stay in</span>
                <h2>
                  Big cravings.
                  <br />
                  Little delivery fee.
                </h2>
                <p>Your favourite local flavours, brought closer.</p>
                <button
                  className="button"
                  onClick={() => {
                    openRestaurant("r1");
                    toast(
                      "Use FIRSTBITE at checkout: 10% off, minimum RM25, up to RM6.",
                    );
                  }}
                >
                  Find your first bite
                  <ArrowRight size={17} />
                </button>
              </div>
              <FoodImage
                src="/images/food-1-0.jpg"
                alt="Malaysian nasi lemak with chicken"
              />
            </div>
          )}
          <div className="section-heading">
            <h2>
              {query
                ? `Results for “${query}”`
                : category === "All"
                  ? "Local favourites, for a reason."
                  : `${category}, coming right up.`}
            </h2>
            <span>{list.length} restaurants</span>
          </div>
          <div className="restaurant-grid">
            {list.map((r) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                onClick={() => openRestaurant(r.id)}
              />
            ))}
          </div>
          {!list.length && (
            <Empty
              title="No bites found"
              text="Try another dish or clear your filters."
              action="Clear filters"
              onAction={() => {
                setQuery("");
                setCategory("All");
              }}
            />
          )}
        </>
      )}
      {state.cart.length > 0 && (
        <button className="floating-cart" onClick={onCart}>
          <ShoppingBag size={20} />
          <span>
            {state.cart.reduce((s, i) => s + i.quantity, 0)} items · View your
            bag
          </span>
          <strong>{money(cartTotal(state.cart))}</strong>
          <ArrowRight size={18} />
        </button>
      )}
      {selected && restaurant && (
        <Customization
          item={selected}
          restaurant={restaurant}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
function Customization({
  item,
  restaurant,
  onClose,
}: {
  item: MenuItem;
  restaurant: Restaurant;
  onClose: () => void;
}) {
  const { state, dispatch, toast } = useDemo();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [spice, setSpice] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [replace, setReplace] = useState(false);
  const options =
    restaurant.id === "r4"
      ? [
          { name: "Extra kaya", price: 150 },
          { name: "Butter", price: 100 },
        ]
      : [
          { name: "Extra rice", price: 200 },
          { name: "Fried egg", price: 150 },
          { name: "Extra sambal", price: 100 },
        ];
  const unitPrice =
    item.price +
    (size === "Large" ? 400 : 0) +
    options
      .filter((o) => addons.includes(o.name))
      .reduce((s, o) => s + o.price, 0);
  const cartItem: CartItem = {
    id: uid(),
    restaurantId: restaurant.id,
    itemId: item.id,
    name: item.name,
    image: item.image,
    unitPrice,
    quantity,
    options: [size, ...(item.spicy ? [spice] : []), ...addons],
    notes: notes.trim(),
  };
  const add = (replaceCart: boolean) => {
    dispatch({
      type: "cart",
      cart: replaceCart ? [cartItem] : [...state.cart, cartItem],
    });
    toast(`${item.name} added to your bag.`);
    onClose();
  };
  if (replace)
    return (
      <Confirm
        title="Start a new bag?"
        label="Replace bag"
        onClose={() => setReplace(false)}
        onConfirm={() => add(true)}
      >
        <p>
          Your bag contains food from{" "}
          <strong>
            {
              restaurants.find((r) => r.id === state.cart[0]?.restaurantId)
                ?.name
            }
          </strong>
          .
        </p>
        <p>
          Orders can contain one restaurant. Replace those items with your
          selection from {restaurant.name}?
        </p>
      </Confirm>
    );
  return (
    <Modal title={item.name} onClose={onClose}>
      <FoodImage
        className="customization-image"
        src={item.image}
        alt={item.name}
      />
      <p className="muted">{item.description}</p>
      <fieldset className="option-field">
        <legend>
          Choose a size <span>Required</span>
        </legend>
        {["Regular", "Large"].map((s) => (
          <label key={s}>
            <input
              type="radio"
              name="size"
              value={s}
              checked={size === s}
              onChange={() => setSize(s)}
            />
            <span>{s}</span>
            <strong>{s === "Large" ? "+RM 4.00" : "Included"}</strong>
          </label>
        ))}
      </fieldset>
      {item.spicy && (
        <fieldset className="option-field">
          <legend>
            Sambal level <span>Required</span>
          </legend>
          {["Mild", "Medium", "Extra spicy"].map((s) => (
            <label key={s}>
              <input
                type="radio"
                name="spice"
                value={s}
                checked={spice === s}
                onChange={() => setSpice(s)}
              />
              <span>{s}</span>
            </label>
          ))}
        </fieldset>
      )}
      <fieldset className="option-field">
        <legend>
          Make it yours <span>Optional</span>
        </legend>
        {options.map((o) => (
          <label key={o.name}>
            <input
              type="checkbox"
              checked={addons.includes(o.name)}
              onChange={() =>
                setAddons(
                  addons.includes(o.name)
                    ? addons.filter((a) => a !== o.name)
                    : [...addons, o.name],
                )
              }
            />
            <span>{o.name}</span>
            <strong>+{money(o.price)}</strong>
          </label>
        ))}
      </fieldset>
      <label className="field">
        Special instructions
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={200}
          placeholder="e.g. Pack sambal separately"
        />
      </label>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      <div className="customize-footer">
        <Quantity value={quantity} onChange={setQuantity} />
        <button
          className="button"
          onClick={() => {
            if (!size || (item.spicy && !spice)) {
              setError("Choose a size and all required options before adding.");
              return;
            }
            if (
              state.cart.length &&
              state.cart[0].restaurantId !== restaurant.id
            )
              setReplace(true);
            else add(false);
          }}
        >
          Add to bag · {money(unitPrice * quantity)}
          <Plus size={17} />
        </button>
      </div>
    </Modal>
  );
}
export function Cart({
  onClose,
  onBooked,
}: {
  onClose: () => void;
  onBooked: (booking: Booking) => void;
}) {
  const { state, dispatch } = useDemo();
  const [checkout, setCheckout] = useState(false);
  const [address, setAddress] = useState(state.locationId);
  const [instructions, setInstructions] = useState("");
  const [payment, setPayment] = useState<Payment>(state.payment);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const restaurant = restaurants.find(
    (r) => r.id === state.cart[0]?.restaurantId,
  );
  const subtotal = cartTotal(state.cart);
  const price = priceFor("food", subtotal, code, restaurant?.fee || 0, 100);
  const updateQuantity = (id: string, quantity: number) =>
    dispatch({
      type: "cart",
      cart: state.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
    });
  const place = () => {
    if (!address) {
      setError("Choose a delivery location.");
      return;
    }
    if (!restaurant || !state.cart.length) return;
    const now = new Date().toISOString();
    onBooked({
      id: `PKF-${uid().slice(0, 8).toUpperCase()}`,
      created: now,
      updated: now,
      from: "bintang",
      to: address,
      service: "food",
      restaurantId: restaurant.id,
      items: state.cart,
      notes: instructions,
      payment,
      price,
      minutes: restaurant.eta,
      step: 0,
      cancelled: false,
      ratings: [],
    });
    onClose();
  };
  return (
    <Modal
      title={checkout ? "The last little step." : "Your bag"}
      onClose={onClose}
    >
      {!state.cart.length ? (
        <Empty
          title="A craving goes here."
          text="Find something delicious and add it to your bag."
          action="Explore the menu"
          onAction={onClose}
        />
      ) : (
        <>
          {checkout && (
            <button className="text-button" onClick={() => setCheckout(false)}>
              <ArrowLeft size={16} /> Back to bag
            </button>
          )}
          <h3 className="cart-restaurant">{restaurant?.name}</h3>
          <p className="muted">
            <Clock3 size={14} /> {restaurant?.eta}–{(restaurant?.eta || 0) + 10}{" "}
            min · demo delivery
          </p>
          <div className="cart-items">
            {state.cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <FoodImage src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.options.join(" · ")}</small>
                  {item.notes && <small>“{item.notes}”</small>}
                  <div className="cart-item-controls">
                    <Quantity
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.id, q)}
                      label={item.name}
                    />
                    <button
                      className="icon-button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() =>
                        dispatch({
                          type: "cart",
                          cart: state.cart.filter((i) => i.id !== item.id),
                        })
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <strong>{money(item.unitPrice * item.quantity)}</strong>
              </div>
            ))}
          </div>
          {checkout && (
            <>
              <LocationPicker
                label="Delivery address"
                value={address}
                onChange={setAddress}
              />
              <label className="field">
                Delivery instructions
                <textarea
                  placeholder="e.g. Leave at the lobby reception"
                  value={instructions}
                  maxLength={300}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </label>
              <PaymentPicker value={payment} onChange={setPayment} />
            </>
          )}
          <VoucherInput
            service="food"
            amount={subtotal}
            code={code}
            onChange={setCode}
          />
          <PriceBreakdown price={price} label="Food subtotal" />
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          <button
            className="button full"
            onClick={checkout ? place : () => setCheckout(true)}
          >
            {checkout ? "Place demo order" : "Continue to checkout"} ·{" "}
            {money(price.total)}
            {checkout ? <Check size={18} /> : <ArrowRight size={18} />}
          </button>
          <p className="micro-copy centered">
            Fictional restaurant. No real order or payment.
          </p>
        </>
      )}
    </Modal>
  );
}
