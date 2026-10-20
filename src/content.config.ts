// ============================================================
//  JALITENG — Content Config
//  Ubah harga, jam, link, dan data bisnis DI SINI SAJA.
//  Jangan ubah file komponen untuk update konten.
// ============================================================

// ── Flags ───────────────────────────────────────────────────
/** true jika mascot sudah ada di dalam video hero (jangan render layer mascot terpisah di hero) */
export const HERO_HAS_BAKED_MASCOT = true;

/** true jika nomor WhatsApp sudah dikonfirmasi aktif */
export const whatsappVerified = false;

/** true jika punya layanan antar sendiri (selain GoFood) */
export const ownDelivery = false;

// ── Business Info ────────────────────────────────────────────
export const business = {
  name: "Jaliteng",
  tagline: "Wedangan dan kuliner malam, hangat dari Semarang.",
  positioning:
    "Tempat kuliner malam dan wedangan khas Jawa Tengah yang bermula dari Kota Semarang, terkenal dengan Tahu Petis Semarang dan Wedang Ronde yang autentik.",
  heroHeadline: "Tahu Petis & Wedang Ronde khas Semarang.",
  heroSubline: "Wedangan dan kuliner malam, hangat dari Semarang.",
  address:
    "Jl. Ki Mangunsarkoro No.86F, Brumbungan, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah 50241",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Jl.+Ki+Mangunsarkoro+No.86F+Semarang+Tengah+Semarang",
  phone: "0819-1555-9953",
  whatsappUrl: "https://wa.me/6281915559953",
  instagramUrl: "https://share.google/miSZNX5at25yAhZsF",
  goFoodUrl: "https://share.google/PcC8xVcyiJDVdZXwn",
  hours: {
    open: 9,
    close: 22,
    timezone: "Asia/Jakarta",
    label: "Setiap hari, 09.00 – 22.00 WIB",
    days: ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"],
  },
  serveCuisine: "Javanese",
  city: "Semarang",
} as const;

// ── Story ─────────────────────────────────────────────────────
export const story = {
  headline: "Cerita di Balik Jaliteng",
  body: "Jaliteng lahir dari cinta pada wedangan malam khas Semarang—minuman hangat, camilan kenyal, dan suasana yang bikin betah duduk lama. Nama Jaliteng sendiri punya makna yang erat dengan identitas kuliner Jawa Tengah.",
  points: [
    {
      icon: "steam",
      title: "Wedang Ronde yang Autentik",
      desc: "Ronde kenyal berisi kacang, kuah jahe atau santan yang menghangatkan—resep yang dijaga sejak awal berdiri.",
    },
    {
      icon: "tofu",
      title: "Tahu Petis Semarang Asli",
      desc: "Tahu goreng crispy dicocol petis hitam khas Semarang. Satu gigitan, langsung kerasa kota lama.",
    },
    {
      icon: "moon",
      title: "Kuliner Malam yang Bisa Diandalkan",
      desc: "Buka setiap hari sampai jam 22.00. Pas buat nongkrong malam, ngobrol santai, atau sekadar menghangatkan diri.",
    },
  ],
};

// ── Mascot Config ─────────────────────────────────────────────
export const mascot = {
  footAnchorY: 88,
  footAnchorX: 22,
  bubbles: [
    "Monggo, dipilih dulu...",
    "Wedang Rondenya, Mas/Mbak? Panas-panas enak!",
    "Tahu Petis-e mantap, dijamin nagih!",
    "Pesannya lewat WhatsApp ya, gampang kok!",
    "Kulo nuwun, selamat datang di Jaliteng!",
    "Mau yang hangat apa yang seger nih?",
  ],
};

// ── Menu Types ────────────────────────────────────────────────
export type OptionChoice = { label: string; priceAdd?: number };
export type MenuOption = {
  id: string;
  label: string;
  required: boolean;
  choices: OptionChoice[];
};
export type AddOn = { label: string; priceAdd: number };
export type MenuItem = {
  id: string;
  name: string;
  price: number | null;
  description?: string;
  variants?: { label: string; price: number }[];
  options?: MenuOption[];
  addOns?: AddOn[];
  printedNotes?: string[];
  featured?: boolean;
  noteEnabled?: boolean;
  availableDays?: ("Senin"|"Selasa"|"Rabu"|"Kamis"|"Jumat"|"Sabtu"|"Minggu")[];
};
export type MenuCategory = {
  id: string;
  label: string;
  items: MenuItem[];
};

const wedangAddOns: AddOn[] = [
  { label: "Ronde", priceAdd: 2000 },
  { label: "Wijen Hitam", priceAdd: 3000 },
  { label: "Kacang Merah", priceAdd: 3000 },
];

export const menu: MenuCategory[] = [
  {
    id: "wedang",
    label: "Wedang & Es",
    items: [
      {
        id: "ronde",
        name: "Ronde",
        price: 12000,
        description: "Ronde isi, kolang kaling, agar-agar, ronde kecil, kacang sangrai",
        featured: true,
        noteEnabled: true,
        options: [{ id: "kuah-ronde", label: "Kuah", required: true, choices: [{ label: "Jahe" }, { label: "Santan" }] }],
        addOns: wedangAddOns,
      },
      {
        id: "sekoteng",
        name: "Sekoteng",
        price: 12000,
        description: "Kolang kaling, agar-agar, manisan kering, ronde kecil, kacang sangrai",
        noteEnabled: true,
        printedNotes: ["Kuah: jahe + jeruk nipis (pisah)"],
        addOns: wedangAddOns,
      },
      {
        id: "ronde-sekoteng",
        name: "Ronde Sekoteng",
        price: 14000,
        description: "Ronde kacang, ronde kecil, agar-agar, kolang kaling, manisan kering, kacang sangrai",
        noteEnabled: true,
        printedNotes: ["Kuah: Jahe", "Pilihan ronde: Kacang 2 / Wijen Hitam 1"],
        addOns: wedangAddOns,
      },
      {
        id: "ronde-wijen",
        name: "Ronde Wijen Hitam",
        price: 14000,
        description: "Ronde wijen hitam, ronde kecil, agar-agar, kacang sangrai",
        noteEnabled: true,
        options: [{ id: "kuah-ronde-wijen", label: "Kuah", required: true, choices: [{ label: "Jahe" }, { label: "Santan" }] }],
        addOns: wedangAddOns,
      },
      {
        id: "gendhong",
        name: "Gendhong",
        price: 14000,
        description: "Ronde kecil, agar-agar, kolang kaling, kacang tanah, kacang hijau, roti",
        noteEnabled: true,
        printedNotes: ["Kuah: Jahe & Santan"],
        addOns: wedangAddOns,
      },
      { id: "kacang-tanah", name: "Kacang Tanah", price: 12000, noteEnabled: true, addOns: wedangAddOns },
      { id: "kacang-hijau", name: "Kacang Hijau", price: 12000, noteEnabled: true, addOns: wedangAddOns },
      { id: "kacang-campur", name: "Kacang Campur", price: 12000, noteEnabled: true, addOns: wedangAddOns },
      { id: "wedang-roti", name: "Wedang / Es Roti", price: 12000, noteEnabled: true, addOns: wedangAddOns },
      { id: "es-campur", name: "Es Campur", price: 12000, noteEnabled: true, addOns: wedangAddOns },
    ],
  },
  {
    id: "minuman",
    label: "Aneka Minuman",
    items: [
      {
        id: "jahe",
        name: "Jahe",
        price: 7000,
        noteEnabled: true,
        options: [{ id: "sajian-jahe", label: "Sajian", required: true, choices: [{ label: "Es" }, { label: "Hangat" }] }],
      },
      { id: "lemon-tea", name: "Lemon Tea", price: 7000, noteEnabled: true },
      { id: "teh-manis", name: "Teh Manis", price: null, noteEnabled: true, variants: [{ label: "Es", price: 5000 }, { label: "Hangat", price: 4000 }] },
      { id: "teh-tawar", name: "Teh Tawar", price: null, noteEnabled: true, variants: [{ label: "Es", price: 4000 }, { label: "Hangat", price: 2000 }] },
    ],
  },
  {
    id: "tahu-petis",
    label: "Spesial Tahu Petis",
    items: [
      { id: "tahu-petis-5", name: "Tahu Petis (isi 5)", price: 25000, featured: true, noteEnabled: true },
      { id: "tahu-petis-10", name: "Tahu Petis (isi 10)", price: 48000, featured: true, noteEnabled: true },
      { id: "petis-cup", name: "Petis 1 Cup", price: 30000, noteEnabled: true },
    ],
  },
  {
    id: "makanan-ringan",
    label: "Makanan Ringan",
    items: [
      { id: "lumpia-goreng", name: "Lumpia Goreng", price: 12500, noteEnabled: true },
      { id: "tahu-bakso", name: "Tahu Bakso", price: 6000, noteEnabled: true },
      { id: "tahu-crispy", name: "Tahu Crispy Ayam", price: 5000, noteEnabled: true },
      { id: "risol-mayo", name: "Risol Mayo", price: 5000, noteEnabled: true },
      { id: "sosis-solo", name: "Sosis Solo", price: 7000, noteEnabled: true },
      { id: "siomay-ayam", name: "Siomay Ayam", price: 7500, noteEnabled: true },
      { id: "siomay-goreng", name: "Siomay Goreng", price: 8500, noteEnabled: true },
      { id: "siomay-mini", name: "Siomay Mini (isi 3)", price: 10000, noteEnabled: true },
      { id: "otak-otak-tahu", name: "Otak Otak Tahu", price: 10000, noteEnabled: true },
      { id: "pastel-tutup", name: "Pastel Tutup", price: 12000, noteEnabled: true },
      { id: "sate-pisang", name: "Sate Pisang", price: 5000, noteEnabled: true, availableDays: ["Sabtu", "Minggu"] },
    ],
  },
];

export const featuredIds = ["tahu-petis-5", "tahu-petis-10", "ronde"];

export const analytics = {
  plausibleDomain: (import.meta.env.VITE_PLAUSIBLE_DOMAIN as string) || "",
  ga4Id: (import.meta.env.VITE_GA4_ID as string) || "",
};

export const seo = {
  title: "Jaliteng — Tahu Petis & Wedang Ronde Khas Semarang",
  description:
    "Jaliteng: wedangan dan kuliner malam di Semarang. Tahu Petis Semarang, Wedang Ronde autentik, buka setiap hari 09.00-22.00.",
  ogImage: "./assets/hero-poster.jpg",
  siteUrl: (import.meta.env.VITE_SITE_URL as string) || "https://jaliteng.vercel.app",
  locale: "id_ID",
};
