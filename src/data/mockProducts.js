const initialMockProducts = [
  {
    id: "prod-001",
    name: "Vincent Chase Retro Classic",
    sku: "VC-E1140-BLK",
    brand: "Vincent Chase",
    category: "Eyeglasses",
    gender: "Unisex",
    description: "Timeless round acetate frame with sturdy flex hinges. Crafted for everyday durability and sleek minimalist aesthetics.",
    price: 2499,
    offerPrice: 1999,
    stock: 14,
    status: "active",
    images: {
      front: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    colors: [
      { id: "c1", name: "Jet Black", hex: "#111827" },
      { id: "c2", name: "Tortoiseshell", hex: "#78350f" },
      { id: "c3", name: "Crystal Clear", hex: "#e2e8f0" }
    ],
    lensCompatibility: {
      zeroPower: true,
      singleVision: true,
      progressive: true,
      blueLightBlock: true,
      sunTint: true
    },
    frameSpecifications: {
      shape: "Round",
      frameType: "Full Rim",
      material: "Acetate",
      size: "Medium"
    },
    createdAt: "2026-08-10T10:00:00Z",
    updatedAt: "2026-09-15T12:30:00Z"
  },
  {
    id: "prod-002",
    name: "John Jacobs Titanium Executive",
    sku: "JJ-E1092-GUN",
    brand: "John Jacobs",
    category: "Eyeglasses",
    gender: "Men",
    description: "Ultra-lightweight Japanese Titanium frame engineered for zero pressure on the nose bridge. Ideal for long boardroom meetings.",
    price: 4999,
    offerPrice: 4299,
    stock: 4,
    // Low stock <= 5
    status: "active",
    images: {
      front: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80"
    },
    colors: [
      { id: "c1", name: "Gunmetal Gray", hex: "#475569" },
      { id: "c2", name: "Matte Silver", hex: "#94a3b8" }
    ],
    lensCompatibility: {
      zeroPower: true,
      singleVision: true,
      progressive: true,
      blueLightBlock: true,
      sunTint: false
    },
    frameSpecifications: {
      shape: "Rectangle",
      frameType: "Rimless",
      material: "Titanium",
      size: "Large"
    },
    createdAt: "2026-08-12T14:20:00Z",
    updatedAt: "2026-09-20T08:15:00Z"
  },
  {
    id: "prod-003",
    name: "Ray-Ban Aviator Polarized Gold",
    sku: "RB-3025-GLD",
    brand: "Ray-Ban",
    category: "Sunglasses",
    gender: "Unisex",
    description: "Iconic teardrop metal frame featuring G-15 polarized green lenses for peak UV400 clarity and authentic heritage appeal.",
    price: 8590,
    offerPrice: 7990,
    stock: 12,
    status: "active",
    images: {
      front: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    colors: [
      { id: "c1", name: "Gold & Green", hex: "#d4af37" },
      { id: "c2", name: "Silver & Mirror Blue", hex: "#38bdf8" }
    ],
    lensCompatibility: {
      zeroPower: true,
      singleVision: true,
      progressive: false,
      blueLightBlock: false,
      sunTint: true
    },
    frameSpecifications: {
      shape: "Aviator",
      frameType: "Full Rim",
      material: "Metal",
      size: "Large"
    },
    createdAt: "2026-07-28T09:00:00Z",
    updatedAt: "2026-09-18T16:00:00Z"
  },
  {
    id: "prod-004",
    name: "Vogue Parisienne Cat-Eye",
    sku: "VG-C2045-BRN",
    brand: "Vogue Eyewear",
    category: "Eyeglasses",
    gender: "Women",
    description: "Chic feminine cat-eye silhouette designed with beveled temples and rich havana amber hues.",
    price: 3899,
    offerPrice: 3299,
    stock: 8,
    status: "active",
    images: {
      front: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80"
    },
    colors: [
      { id: "c1", name: "Amber Havana", hex: "#b45309" },
      { id: "c2", name: "Onyx Rose Gold", hex: "#be185d" }
    ],
    lensCompatibility: {
      zeroPower: true,
      singleVision: true,
      progressive: true,
      blueLightBlock: true,
      sunTint: true
    },
    frameSpecifications: {
      shape: "Cat-Eye",
      frameType: "Full Rim",
      material: "Acetate",
      size: "Medium"
    },
    createdAt: "2026-08-01T11:45:00Z",
    updatedAt: "2026-09-21T14:10:00Z"
  },
  {
    id: "prod-005",
    name: "Bausch & Lomb Ultra Monthly (Pack of 6)",
    sku: "BL-ULT-M6",
    brand: "Bausch & Lomb",
    category: "Contact Lenses",
    gender: "Unisex",
    description: "MoistureSeal technology maintains 95% of lens moisture for a full 16 hours of ultra-comfortable vision without dry eye fatigue.",
    price: 1899,
    offerPrice: 1650,
    stock: 25,
    status: "active",
    images: {
      front: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
    },
    colors: [
      { id: "c1", name: "Clear Aqua", hex: "#0284c7" }
    ],
    lensCompatibility: {
      zeroPower: false,
      singleVision: true,
      progressive: false,
      blueLightBlock: false,
      sunTint: false
    },
    createdAt: "2026-08-05T08:30:00Z",
    updatedAt: "2026-09-22T09:20:00Z"
  },
  {
    id: "prod-006",
    name: "Hooper Flexi-Kid TR90 Frame",
    sku: "HP-K3010-BLU",
    brand: "Hooper",
    category: "Eyeglasses",
    gender: "Kids",
    description: "Unbreakable bendable Swiss TR90 material designed for active kids. Safe rubber nose pads with matching ear grips.",
    price: 1599,
    offerPrice: 1299,
    stock: 2,
    // Low stock <= 5
    status: "active",
    images: {
      front: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80"
    },
    colors: [
      { id: "c1", name: "Cobalt Blue", hex: "#1d4ed8" },
      { id: "c2", name: "Candy Pink", hex: "#ec4899" }
    ],
    lensCompatibility: {
      zeroPower: true,
      singleVision: true,
      progressive: false,
      blueLightBlock: true,
      sunTint: false
    },
    frameSpecifications: {
      shape: "Square",
      frameType: "Full Rim",
      material: "TR90",
      size: "Small"
    },
    createdAt: "2026-08-14T10:15:00Z",
    updatedAt: "2026-09-24T11:00:00Z"
  },
  {
    id: "prod-007",
    name: "Lens Hut Deluxe Ultrasonic Cleaning Kit",
    sku: "ACC-CLN-KIT01",
    brand: "The Lens Hut",
    category: "Accessories",
    gender: "Unisex",
    description: "Microfiber cleaning cloths, natural anti-fog spray, and mini precision optical screwdriver in a magnetic vegan leather travel pouch.",
    price: 799,
    offerPrice: 599,
    stock: 0,
    // Out of Stock
    status: "active",
    images: {
      front: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
    },
    colors: [
      { id: "c1", name: "Midnight Matte", hex: "#0f172a" }
    ],
    lensCompatibility: {
      zeroPower: false,
      singleVision: false,
      progressive: false,
      blueLightBlock: false,
      sunTint: false
    },
    createdAt: "2026-07-20T12:00:00Z",
    updatedAt: "2026-09-23T15:40:00Z"
  },
  {
    id: "prod-008",
    name: "Oakley Holbrook Polarized Matte Prizm",
    sku: "OK-OO9102-MBK",
    brand: "Oakley",
    category: "Sunglasses",
    gender: "Men",
    description: "O-Matter stress-resistant frame material with Plutonite lenses and Oakley Prizm color enhancement optics.",
    price: 9290,
    offerPrice: 8790,
    stock: 18,
    status: "active",
    images: {
      front: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80"
    },
    colors: [
      { id: "c1", name: "Matte Black", hex: "#0a0a0a" },
      { id: "c2", name: "Prizm Sapphire", hex: "#2563eb" }
    ],
    lensCompatibility: {
      zeroPower: true,
      singleVision: true,
      progressive: false,
      blueLightBlock: false,
      sunTint: true
    },
    frameSpecifications: {
      shape: "Square",
      frameType: "Full Rim",
      material: "Other",
      size: "Large"
    },
    createdAt: "2026-08-18T16:30:00Z",
    updatedAt: "2026-09-25T17:10:00Z"
  },
  {
    id: "prod-009",
    name: "Vincent Chase Half-Rim Clubmaster",
    sku: "VC-E1210-BRZ",
    brand: "Vincent Chase",
    category: "Eyeglasses",
    gender: "Men",
    description: "Browline semi-rimless metal frame with tortoiseshell top crest. Elegant vintage silhouette for modern intellectuals.",
    price: 2999,
    offerPrice: 2299,
    stock: 3,
    // Low stock <= 5
    status: "inactive",
    images: {
      front: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
      side: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
      angle: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"
    },
    colors: [
      { id: "c1", name: "Bronze & Havana", hex: "#78350f" },
      { id: "c2", name: "Gold & Black", hex: "#d4af37" }
    ],
    lensCompatibility: {
      zeroPower: true,
      singleVision: true,
      progressive: true,
      blueLightBlock: true,
      sunTint: true
    },
    frameSpecifications: {
      shape: "Rectangle",
      frameType: "Half Rim",
      material: "Metal",
      size: "Medium"
    },
    createdAt: "2026-07-15T09:00:00Z",
    updatedAt: "2026-08-30T10:15:00Z"
  }
];
export {
  initialMockProducts
};
