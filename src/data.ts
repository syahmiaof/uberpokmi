import type { Location, Restaurant, DemoState } from "./domain";
export const locations: Location[] = [
  {
    id: "klcc",
    name: "KLCC",
    address: "Suria KLCC, Kuala Lumpur City Centre",
    lat: 3.1579,
    lng: 101.7123,
  },
  {
    id: "pavilion",
    name: "Pavilion Kuala Lumpur",
    address: "168, Jalan Bukit Bintang",
    lat: 3.149,
    lng: 101.7133,
  },
  {
    id: "trx",
    name: "The Exchange TRX",
    address: "Persiaran TRX, Tun Razak Exchange",
    lat: 3.1421,
    lng: 101.7188,
  },
  {
    id: "sentral",
    name: "KL Sentral",
    address: "Jalan Stesen Sentral, Brickfields",
    lat: 3.134,
    lng: 101.6864,
  },
  {
    id: "bintang",
    name: "Bukit Bintang",
    address: "Jalan Sultan Ismail, Bukit Bintang",
    lat: 3.1466,
    lng: 101.7111,
  },
  {
    id: "midvalley",
    name: "Mid Valley Megamall",
    address: "Lingkaran Syed Putra, Mid Valley City",
    lat: 3.1182,
    lng: 101.6778,
  },
  {
    id: "bangsar",
    name: "Bangsar",
    address: "Jalan Telawi, Bangsar Baru",
    lat: 3.1302,
    lng: 101.6709,
  },
  {
    id: "montkiara",
    name: "Mont Kiara",
    address: "Jalan Kiara, Mont Kiara",
    lat: 3.1656,
    lng: 101.6517,
  },
  {
    id: "sunway",
    name: "Sunway Pyramid",
    address: "3, Jalan PJS 11/15, Bandar Sunway",
    lat: 3.0733,
    lng: 101.607,
  },
];
export const locationById = (id: string) =>
  locations.find((l) => l.id === id) ?? locations[0];
const restaurantInfo = [
  [
    "Ayam Gepuk Pokmi",
    "Chicken,Malaysian,Rice",
    "Crispy chicken. Sambal with a kick.",
    "4.9",
    25,
    250,
    "Crowd favourite",
  ],
  [
    "Nasi Lemak Bonda",
    "Malaysian,Rice",
    "A little taste of home, every time.",
    "4.8",
    20,
    200,
    "10% off with FIRSTBITE",
  ],
  [
    "Mamak Station 24",
    "Malaysian",
    "Your neighbourhood mamak, delivered.",
    "4.7",
    25,
    250,
    "",
  ],
  [
    "Wok Street",
    "Noodles,Malaysian",
    "Big wok energy. Proper wok hei.",
    "4.8",
    30,
    300,
    "",
  ],
  [
    "Kopi & Toast",
    "Coffee,Desserts",
    "Slow mornings, good coffee.",
    "4.9",
    20,
    200,
    "",
  ],
  [
    "Sambal Studio",
    "Chicken,Rice,Burgers",
    "A love letter to sambal.",
    "4.6",
    30,
    300,
    "",
  ],
  [
    "Satay Lane",
    "Malaysian,Chicken",
    "Charcoal grilled, made to share.",
    "4.8",
    35,
    350,
    "",
  ],
  [
    "Bowl & Broth",
    "Noodles",
    "A warm bowl for your kind of day.",
    "4.7",
    25,
    250,
    "",
  ],
] as const;
const menus: [string, number, string, boolean?][][] = [
  [
    [
      "Ayam Gepuk Original",
      1590,
      "Golden fried chicken, steamed rice, tempeh and signature sambal.",
      true,
    ],
    [
      "Ayam Gepuk Berempah",
      1790,
      "Aromatic spiced chicken with rice and cucumber.",
      true,
    ],
    [
      "Ayam Gepuk Sambal Merah",
      2290,
      "Fried chicken with fragrant rice and red chilli sambal.",
      true,
    ],
    [
      "Ayam Penyet",
      1690,
      "Smashed fried chicken, vegetables and a fragrant sambal.",
      true,
    ],
  ],
  [
    [
      "Nasi Lemak Ayam",
      1490,
      "Coconut rice, crispy chicken, anchovies, peanuts and sambal.",
      true,
    ],
    [
      "Nasi Lemak Rendang",
      1890,
      "Slow cooked beef rendang over fragrant coconut rice.",
      true,
    ],
    [
      "Nasi Lemak Ayam Berempah",
      890,
      "Spiced chicken with coconut rice, peanuts and sambal.",
      true,
    ],
    [
      "Nasi Lemak Sambal Sotong",
      1990,
      "Tender squid in sweet spicy sambal with coconut rice.",
      true,
    ],
  ],
  [
    ["Roti Canai", 350, "Flaky flatbread served with dhal and curry."],
    ["Roti Telur", 550, "Fresh griddled roti filled with egg."],
    [
      "Murtabak Ayam",
      1090,
      "Spiced chicken and egg folded into crisp flatbread.",
    ],
    ["Thosai", 490, "A crisp fermented rice crepe with chutney and dhal."],
  ],
  [
    [
      "Char Kway Teow",
      1390,
      "Wok fired flat noodles with prawns and bean sprouts.",
      true,
    ],
    [
      "Mee Goreng Mamak",
      1190,
      "Yellow noodles, tofu and vegetables in a spicy sauce.",
      true,
    ],
    [
      "Nasi Goreng Kampung",
      1290,
      "Village style fried rice with anchovies and vegetables.",
      true,
    ],
    ["Hokkien Mee", 1490, "Thick noodles in rich dark soy sauce."],
  ],
  [
    [
      "Kaya Butter Toast",
      690,
      "Crisp toast with coconut kaya and a cold slab of butter.",
    ],
    ["Kopi Ais", 590, "Traditional roasted coffee over ice."],
    ["French Toast", 990, "Golden egg toast with a little sweetness."],
    ["Pandan Cake", 790, "Light pandan chiffon, fragrant and freshly sliced."],
  ],
  [
    [
      "Ayam Sambal",
      1690,
      "Chicken simmered in our signature red sambal.",
      true,
    ],
    [
      "Sambal Prawn Rice",
      1990,
      "Prawns in a rich sambal with steamed rice.",
      true,
    ],
    ["Ikan Bakar", 2290, "Grilled fish with a tangy sambal dip.", true],
    [
      "Chicken Burger",
      1590,
      "Chargrilled chicken, lettuce and house sambal in a soft bun.",
      true,
    ],
  ],
  [
    [
      "Chicken Satay · 10 sticks",
      1890,
      "Charcoal chicken skewers with peanut sauce and cucumber.",
    ],
    [
      "Beef Satay · 10 sticks",
      2290,
      "Grilled marinated beef with our peanut dip.",
    ],
    [
      "Mixed Satay · 12 sticks",
      2590,
      "Chicken and beef skewers, ideal for sharing.",
    ],
    [
      "Grilled Chicken",
      1690,
      "Juicy marinated chicken, gently charred over coals.",
    ],
  ],
  [
    [
      "Curry Laksa",
      1490,
      "Coconut curry broth, noodles, tofu puffs and herbs.",
      true,
    ],
    [
      "Chicken Noodle Soup",
      1290,
      "Clear chicken broth, soft noodles and greens.",
    ],
    [
      "Asam Laksa",
      1590,
      "Tangy tamarind fish broth with thick rice noodles.",
      true,
    ],
    ["Wantan Mee", 1390, "Springy noodles with dumplings and leafy greens."],
  ],
];
export const restaurants: Restaurant[] = restaurantInfo.map((r, i) => ({
  id: `r${i}`,
  name: r[0],
  category: r[1].split(","),
  description: r[2],
  rating: r[3],
  eta: r[4],
  fee: r[5],
  offer: r[6],
  image: `/images/food-${i}-0.jpg`,
  menu: menus[i].map((m, j) => ({
    id: `m${i}-${j}`,
    name: m[0],
    price: m[1],
    description: m[2],
    spicy: m[3],
    image: `/images/food-${i}-${j}.jpg`,
    category:
      i === 4
        ? j === 1
          ? "Drinks"
          : "Bakery"
        : j < 2
          ? "Signature dishes"
          : "More favourites",
  })),
}));
export const initialState = (): DemoState => ({
  version: 1,
  bookings: [],
  cart: [],
  addresses: [
    { id: "home", label: "Home", locationId: "bangsar" },
    { id: "work", label: "Work", locationId: "klcc" },
  ],
  notices: [
    {
      id: "welcome",
      title: "Welcome to your city",
      body: "Try a ride, find your next favourite meal, or send a parcel. It’s all an interactive demo.",
      read: false,
      created: new Date().toISOString(),
    },
  ],
  theme: "dark",
  payment: "Card •••• 4242",
  notifications: true,
  locationId: "bintang",
});
