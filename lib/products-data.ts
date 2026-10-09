export interface ProductSeed {
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  features: string;
  images: string[];
  colors: string[] | null;
}

export const CATEGORIES = [
  "কিচেন গ্যাজেট",
  "বেবি কেয়ার",
  "বিউটি কেয়ার",
  "ইলেকট্রনিক্স",
  "ফিটনেস",
] as const;

export const PRODUCTS: ProductSeed[] = [
  {
    slug: "mini-grinder",
    name: "Silver Crest OR-2026 Electric Grinder",
    price: 1050,
    category: "কিচেন গ্যাজেট",
    description:
      "Silver Crest OR-2026 Electric Grinder রান্নাঘরের দৈনন্দিন grinding-এর কাজকে আরও সহজ ও দ্রুত করার জন্য তৈরি। এর Stainless Steel Cup Body, Transparent Lid এবং সুবিধাজনক Long Portable Handle ব্যবহারে আরাম ও স্থায়িত্ব দেয়।\n\nবিভিন্ন ধরনের শুকনো উপকরণ যেমন Coffee Beans, Spices, Green Beans, Red Beans, Millet এবং অন্যান্য শস্য/মসলা grinding-এর কাজে ব্যবহার করা যায়।",
    features:
      "Brand: Silver Crest | Model: OR-2026\nStainless Steel Cup Body ও Grinding Bowl\nশক্তিশালী Multi-Blade Grinding System\nTransparent Lid\nLong & Portable Handle\nOne-Click Operation\nMultifunctional Grinding\nPower Supply: 220–240V, 50/60Hz",
    images: [
      "/products/mini-grinder/1.webp",
      "/products/mini-grinder/2.webp",
      "/products/mini-grinder/3.webp",
      "/products/mini-grinder/4.webp",
    ],
    colors: null,
  },
  {
    slug: "prestige-grinder",
    name: "Prestige Food Grinder N-S-2026",
    price: 950,
    category: "কিচেন গ্যাজেট",
    description:
      "রান্নার মসলা থেকে কফি ও বাদাম — দৈনন্দিন Grinding-এর কাজ করুন আরও সহজে!\n\nPrestige Food Multi Function Grinder হলো ঘরোয়া রান্নাঘরের জন্য একটি কমপ্যাক্ট Electric Grinder। মসলা, বিভিন্ন শুকনা শস্য, কফি বিন, বাদামসহ বিভিন্ন শুকনো উপকরণ Grind করার কাজে এটি ব্যবহার করা যায়। Stainless Steel Grinding Jar এবং সহজ Hand-Grip Design দৈনন্দিন ব্যবহারে বাড়তি সুবিধা দেয়।",
    features:
      "Brand: Prestige | Model: N-S-2026\nElectric Grinding System — দ্রুত Grinding\nStainless Steel Blade ও Jar\nMultipurpose Grinding — মসলা, শস্য, কফি, বাদাম\nComfortable Handle\nTransparent Safety Lid\nEasy to Maintain\nCompact Design\n\nযা যা Grind করা যাবে: শুকনা মসলা, মরিচ, গোলমরিচ, জিরা, ধনে, বিভিন্ন শস্য, Coffee Beans, Nuts",
    images: [
      "/products/prestige-grinder/1.webp",
      "/products/prestige-grinder/2.webp",
    ],
    colors: null,
  },
  {
    slug: "veggie-chopper",
    name: "16 Pcs Vegetable Chopper & Slicer",
    price: 990,
    category: "কিচেন গ্যাজেট",
    description:
      "একটি Kitchen Tool-এই কাটুন, স্লাইস করুন, কিউব করুন ও গ্রেট করুন — রান্নার প্রস্তুতি হোক আরও দ্রুত ও সহজ!\n\nপ্রতিদিন পেঁয়াজ, আলু, শসা, গাজরসহ বিভিন্ন সবজি হাতে কাটতে অনেক সময় ও পরিশ্রম লাগে। 16 Pcs Multifunctional Vegetable Chopper & Slicer বিভিন্ন ধরনের Cutting Attachment-এর সাহায্যে একই সেটে সবজি Chop, Slice, Dice, Julienne ও Grate করার সুবিধা দেয়।\n\nLarge Size Container-এর কারণে কাটা সবজি সরাসরি নিচের Container-এ জমা হয়।",
    features:
      "16 Pcs Complete Kitchen Set\nFast Vegetable Chopping\nPerfect Slicing | Julienne Cutting\nDicing / Cube Cutting | Grating Function\nLarge Collection Container\nPress-Down Chopper Design\nMultiple Interchangeable Blades\nEasy to Clean & Store\n\nব্যবহার: পেঁয়াজ, আলু, গাজর, শসা, টমেটো, বাঁধাকপি, বিভিন্ন ফল ও সবজি\nCutting Styles: Chopping, Slicing, Dicing, Julienne, Grating, Shredding",
    images: [
      "/products/veggie-chopper/1.webp",
      "/products/veggie-chopper/2.webp",
      "/products/veggie-chopper/3.webp",
    ],
    colors: null,
  },
  {
    slug: "multi-cooker",
    name: "Prestige Plus 2.2L Multi Cooker 1000W",
    price: 1050,
    category: "কিচেন গ্যাজেট",
    description:
      "রান্না হোক আরও দ্রুত, সহজ ও ঝামেলামুক্ত!\n\nPrestige Plus 2.2 Litre Electric Multi Cooker হলো দৈনন্দিন রান্নার জন্য একটি কমপ্যাক্ট ও মাল্টি-ফাংশনাল কুকার। শক্তিশালী 1000 Watt Power-এর সাহায্যে ভাত, নুডলস, স্যুপ, ডিমসহ বিভিন্ন খাবার সহজেই তৈরি করা যায়।\n\nসঙ্গে থাকা Steamer & Egg Attachment ব্যবহার করে স্টিম করা খাবার ও ডিমও সহজে প্রস্তুত করতে পারবেন। বাসা, অফিস, হোস্টেল কিংবা ছোট পরিবারের দৈনন্দিন ব্যবহারের জন্য এটি হতে পারে দারুণ একটি কিচেন সলিউশন।",
    features:
      "1000 Watt High Power\n2.2 Litre Capacity\nMulti-Function Cooking — Cook, Boil & Steam\nSteamer & Egg Attachment\nOne-Touch Operation\nWarmer Function\nGlass Lid\nCompact & Portable Design\nVoltage: 220–240V | 50/60Hz\n\nরান্না করা যাবে: ভাত, নুডলস, স্যুপ, ডিম, স্টিমড ফুড\nপ্যাকেজে আছে: Multi Cooker, Steamer Tray, Measuring Cup, Rice Spoon, Power Cord",
    images: [
      "/products/multi-cooker/1.webp",
      "/products/multi-cooker/2.webp",
      "/products/multi-cooker/3.webp",
      "/products/multi-cooker/4.webp",
    ],
    colors: ["Green & Yellow", "Cream & Brown"],
  },
  {
    slug: "nasal-aspirator",
    name: "Kids Electric Nasal Aspirator",
    price: 850,
    category: "বেবি কেয়ার",
    description:
      "শিশুর নাকের ময়লা ও জমে থাকা সর্দি পরিষ্কার করার জন্য ব্যবহারযোগ্য Kids Electric Nasal Aspirator। এর curved ergonomic design সহজে হাতে ধরে ব্যবহার করা যায় এবং soft nasal tip শিশুর নাক পরিষ্কারের সময় আরামদায়ক ব্যবহারে সহায়তা করে।\n\nনাকের ময়লা পরিষ্কার, শ্বাস-প্রশ্বাস স্বাভাবিক।",
    features:
      "শিশুদের নাক পরিষ্কারের জন্য তৈরি\nElectric suction system — শক্তিশালী সাকশন\nSoft nasal tip — নরম সিলিকন টিপ, ১০০% নিরাপদ\nOne-Button Operation\nকম শব্দে ব্যবহার উপযোগী — শিশু ঘুমালেও ব্যবহার করা যায়\nUSB Rechargeable — সহজ ও সুবিধাজনক চার্জিং\nStylish & ergonomic curved design\nCompact size — বাসা বা ভ্রমণে বহন সুবিধাজনক\n\nসাথে থাকছে: চার্জিং কেবল ও অতিরিক্ত টিপ",
    images: [
      "/products/nasal-aspirator/1.webp",
      "/products/nasal-aspirator/2.webp",
      "/products/nasal-aspirator/3.webp",
    ],
    colors: null,
  },
  {
    slug: "yogurt-maker",
    name: "Samurai SYM001 Yogurt Maker 1L",
    price: 720,
    category: "কিচেন গ্যাজেট",
    description:
      "এবার ঘরেই সহজে তৈরি করুন টাটকা ও সুস্বাদু দই!\n\nসামুরাই SYM001 সম্পূর্ণ স্বয়ংক্রিয় দই তৈরির মেশিন ব্যবহার করে ঘরেই সহজে তৈরি করতে পারবেন পছন্দের দই। এর ১ লিটার ধারণক্ষমতা, স্টেইনলেস স্টিলের ভেতরের পাত্র এবং মাত্র ১৫ ওয়াট বিদ্যুৎ ব্যবহার এটিকে দৈনন্দিন ব্যবহারের জন্য বেশ সুবিধাজনক করে তুলেছে।\n\nদইয়ের সঙ্গে পছন্দের ফল, বাদাম, গ্র্যানোলা বা অন্যান্য উপকরণ যোগ করে সকালের নাশতা কিংবা বিকেলের খাবারের জন্য তৈরি করতে পারবেন মজাদার দইয়ের বাটি।",
    features:
      "সম্পূর্ণ স্বয়ংক্রিয়\n১ লিটার ধারণক্ষমতা\nস্টেইনলেস স্টিলের ভেতরের পাত্র\nস্বচ্ছ ঢাকনা\nমাত্র ১৫ ওয়াট বিদ্যুৎ ব্যবহার\nকমপ্যাক্ট আকার\n\nBrand: সামুরাই (Samurai Technology Ltd.) | Model: SYM001\nRated Voltage: 220V, 50Hz | Rated Power: 15W",
    images: [
      "/products/yogurt-maker/1.webp",
      "/products/yogurt-maker/2.webp",
      "/products/yogurt-maker/3.webp",
      "/products/yogurt-maker/4.webp",
    ],
    colors: null,
  },
  {
    slug: "baby-care-kit",
    name: "Baby Care Kit 10 Pcs",
    price: 600,
    category: "বেবি কেয়ার",
    description:
      "আপনার ছোট্ট সোনামণির প্রতিদিনের যত্নকে আরও সহজ ও গোছানো করতে 10 Pcs Baby Care Kit হতে পারে দারুণ একটি পছন্দ। শিশুর দৈনন্দিন Grooming & Care-এর প্রয়োজনীয় সামগ্রীগুলো একটি সেটেই সুন্দরভাবে সাজানো রয়েছে।",
    features:
      "সেটে যা যা রয়েছে:\nSoft Hair Brush — কোমল চুল আঁচড়ানোর জন্য\nBaby Comb — চুল পরিপাটি রাখতে\nDigital Thermometer — তাপমাত্রা মাপার জন্য\nNasal Aspirator — নাক পরিষ্কারের জন্য\nNail Clipper — নখ কাটার জন্য\nSafety Scissor — নিরাপদে নখ কাটার জন্য\nTweezers, Nail File ও আরও প্রয়োজনীয় Accessories\n\nBPA Free ও 100% Safe\n0+ Months — নবজাতকের জন্য\nসুন্দর গিফট বক্স প্যাকেজিং\nNewborn Gift / Baby Shower Gift হিসেবে পারফেক্ট",
    images: [
      "/products/baby-care-kit/1.webp",
      "/products/baby-care-kit/2.webp",
      "/products/baby-care-kit/3.webp",
    ],
    colors: ["Pink", "Baby Blue"],
  },
  {
    slug: "nail-trimmer",
    name: "Electric Baby Nail Trimmer Set",
    price: 700,
    category: "বেবি কেয়ার",
    description:
      "আপনার ছোট্ট সোনামণির নখ কাটার সময় আরও সহজ, আরামদায়ক ও ঝামেলামুক্ত করতে ব্যবহার করতে পারেন এই Electric Baby Nail Trimmer Set। বিভিন্ন বয়সের জন্য আলাদা Grinding Head থাকায় শিশুর বয়স অনুযায়ী উপযুক্ত Nail Pad নির্বাচন করা যায়।\n\nসেটটিতে রয়েছে 6টি Interchangeable Grinding & Polishing Head।",
    features:
      "Baby, Kids ও Adults-এর জন্য ব্যবহারযোগ্য\nবয়স অনুযায়ী আলাদা Grinding Head\nনখ Trim, Smooth ও Polish করতে সহায়ক\nসহজে Grinding Head পরিবর্তন করা যায়\n2টি AA Battery দিয়ে পরিচালিত\nসুন্দর ও Compact Storage Case\nআকর্ষণীয় Pink & White Design\nNewborn Baby Gift বা Baby Shower Gift হিসেবেও দারুণ\nLow-Noise Operation — শিশু ঘুমালেও সমস্যা নেই\n\nPackage Includes: Electric Nail Trimmer Machine, 6টি Grinding/Polishing Head, Storage Case",
    images: [
      "/products/nail-trimmer/1.webp",
      "/products/nail-trimmer/2.webp",
      "/products/nail-trimmer/3.webp",
    ],
    colors: null,
  },
  {
    slug: "hand-mixer",
    name: "Scarlett 7-Speed Hand Mixer",
    price: 850,
    category: "কিচেন গ্যাজেট",
    description:
      "বেকিং ও মিক্সিংয়ের কাজ এখন আরও সহজ, দ্রুত ও ঝামেলামুক্ত!\n\nঘরে কেক তৈরি, ডিম বিট করা, ক্রিম Whip করা কিংবা Dough Mix করার জন্য Scarlett 7-Speed Electric Hand Mixer হতে পারে আপনার Kitchen-এর একটি প্রয়োজনীয় সহকারী। এর 7-Speed Control System প্রয়োজন অনুযায়ী মিক্সিং স্পিড নির্বাচন করার সুবিধা দেয়।\n\nসাথে থাকা Stainless Steel Beater ও Dough Hook ব্যবহার করে বিভিন্ন ধরনের Baking ও Mixing-এর কাজ সহজেই করা যায়।",
    features:
      "7-Speed Control\nEfficient Mixing Performance\nEgg Beating | Cake Batter Mixing | Cream Whipping | Dough Mixing\nMultiple Attachments (Beater & Dough Hook)\nStainless Steel Attachments\nComfortable Hand Grip\nCompact Design\n\nBrand: Scarlett | Type: Electric Hand Mixer\nPackage: 2× Stainless Steel Beater, 2× Dough Hook, 1× Hand Mixer",
    images: [
      "/products/hand-mixer/1.webp",
      "/products/hand-mixer/2.webp",
      "/products/hand-mixer/3.webp",
    ],
    colors: null,
  },
  {
    slug: "blackhead-remover",
    name: "6-in-1 Electric Blackhead Remover",
    price: 700,
    category: "বিউটি কেয়ার",
    description:
      "ঘরে বসেই সহজে স্কিন কেয়ারের জন্য Electric Blackhead Remover & Pore Vacuum Cleaner। ভ্যাকুয়াম সাকশন প্রযুক্তির মাধ্যমে ত্বকের পোরস থেকে ব্ল্যাকহেড, অতিরিক্ত তেল ও জমে থাকা ময়লা পরিষ্কার করতে সহায়তা করে। বিভিন্ন ধরনের ত্বক ও মুখের বিভিন্ন অংশে ব্যবহারের জন্য এতে রয়েছে ৬টি পরিবর্তনযোগ্য Suction Head এবং Adjustable Suction Mode।",
    features:
      "6 Interchangeable Suction Heads — প্রয়োজন অনুযায়ী আলাদা হেড\nAdjustable Suction Level — Oily, Normal ও Dry Skin অনুযায়ী মোড\nDeep Pore Cleaning — ব্ল্যাকহেড ও পোরসের ময়লা পরিষ্কারে সহায়ক\nLED Display Screen\nUSB Rechargeable — USB Charging Cable সহ\nPortable & Lightweight\nEasy One-Button Control\n\nPackage: 1× Device + 6× Suction Heads + 1× USB Cable + User Manual\nব্যবহার: Nose, chin ও facial pore cleaning",
    images: [
      "/products/blackhead-remover/1.webp",
      "/products/blackhead-remover/2.webp",
      "/products/blackhead-remover/3.webp",
    ],
    colors: null,
  },
];
