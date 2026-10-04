const initialMockOrders = [
  {
    id: "ord-101",
    orderNumber: "LH-2026-8941",
    orderDate: "2026-09-26T14:32:00Z",
    customer: {
      id: "cust-001",
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98765 12345"
    },
    items: [
      {
        id: "item-1",
        productId: "prod-001",
        name: "Vincent Chase Retro Classic",
        sku: "VC-E1140-BLK",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
        color: "Jet Black",
        size: "Medium",
        quantity: 1,
        price: 1999,
        total: 1999
      }
    ],
    subtotal: 1999,
    shippingFee: 0,
    discountAmount: 200,
    couponCode: "WELCOME200",
    totalAmount: 1799,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    shippingAddress: {
      fullName: "Aarav Sharma",
      phone: "+91 98765 12345",
      email: "aarav.sharma@example.com",
      addressLine1: "Flat 402, Lotus Heights, Baner Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411045",
      country: "India"
    },
    prescription: {
      hasPrescription: true,
      rightEye: {
        sph: "-1.75",
        cyl: "-0.50",
        axis: "90"
      },
      leftEye: {
        sph: "-2.00",
        cyl: "-0.25",
        axis: "85"
      },
      pd: "63 mm",
      lensPackage: "Anti-Glare + Blue Cut 1.60 High Index (Thin)"
    },
    tracking: {
      courierName: "Delhivery",
      trackingId: "DLHV-994820148",
      updatedAt: "2026-09-26T16:00:00Z"
    }
  },
  {
    id: "ord-102",
    orderNumber: "LH-2026-8942",
    orderDate: "2026-09-26T11:15:00Z",
    customer: {
      id: "cust-002",
      name: "Priya Iyer",
      email: "priya.iyer@example.com",
      phone: "+91 98220 54321"
    },
    items: [
      {
        id: "item-2",
        productId: "prod-003",
        name: "Ray-Ban Aviator Polarized Gold",
        sku: "RB-3025-GLD",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
        color: "Gold & Green",
        size: "Large",
        quantity: 1,
        price: 7990,
        total: 7990
      }
    ],
    subtotal: 7990,
    shippingFee: 0,
    totalAmount: 7990,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    shippingAddress: {
      fullName: "Priya Iyer",
      phone: "+91 98220 54321",
      email: "priya.iyer@example.com",
      addressLine1: "B-12, Green Glen Layout, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560103",
      country: "India"
    },
    prescription: {
      hasPrescription: false
      // Non-prescription sunglasses
    },
    tracking: {
      courierName: "BlueDart Express",
      trackingId: "BD-7739012384",
      updatedAt: "2026-09-26T18:00:00Z"
    }
  },
  {
    id: "ord-103",
    orderNumber: "LH-2026-8943",
    orderDate: "2026-09-25T16:45:00Z",
    customer: {
      id: "cust-003",
      name: "Rohan Mehta",
      email: "rohan.mehta@example.com",
      phone: "+91 97110 99887"
    },
    items: [
      {
        id: "item-3",
        productId: "prod-002",
        name: "John Jacobs Titanium Executive",
        sku: "JJ-E1092-GUN",
        image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80",
        color: "Gunmetal Gray",
        size: "Large",
        quantity: 1,
        price: 4299,
        total: 4299
      },
      {
        id: "item-4",
        productId: "prod-007",
        name: "Lens Hut Deluxe Ultrasonic Cleaning Kit",
        sku: "ACC-CLN-KIT01",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
        color: "Midnight Matte",
        quantity: 1,
        price: 599,
        total: 599
      }
    ],
    subtotal: 4898,
    shippingFee: 0,
    totalAmount: 4898,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    shippingAddress: {
      fullName: "Rohan Mehta",
      phone: "+91 97110 99887",
      email: "rohan.mehta@example.com",
      addressLine1: "Villa 14, Palm Meadows, Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560066",
      country: "India"
    },
    prescription: {
      hasPrescription: true,
      rightEye: {
        sph: "-3.25",
        cyl: "-1.00",
        axis: "180"
      },
      leftEye: {
        sph: "-3.50",
        cyl: "-0.75",
        axis: "175"
      },
      pd: "64 mm",
      lensPackage: "Kodak UV420 Premium Anti-Fatigue 1.67 Index"
    }
  },
  {
    id: "ord-104",
    orderNumber: "LH-2026-8944",
    orderDate: "2026-09-24T09:10:00Z",
    customer: {
      id: "cust-004",
      name: "Ananya Verma",
      email: "ananya.v@example.com",
      phone: "+91 99887 76655"
    },
    items: [
      {
        id: "item-5",
        productId: "prod-004",
        name: "Vogue Parisienne Cat-Eye",
        sku: "VG-C2045-BRN",
        image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80",
        color: "Amber Havana",
        size: "Medium",
        quantity: 1,
        price: 3299,
        total: 3299
      }
    ],
    subtotal: 3299,
    shippingFee: 0,
    totalAmount: 3299,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    shippingAddress: {
      fullName: "Ananya Verma",
      phone: "+91 99887 76655",
      email: "ananya.v@example.com",
      addressLine1: "304, Silver Arch Apartments, Malabar Hill",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400006",
      country: "India"
    },
    prescription: {
      hasPrescription: true,
      rightEye: {
        sph: "+1.25",
        cyl: "0.00",
        axis: "0"
      },
      leftEye: {
        sph: "+1.50",
        cyl: "0.00",
        axis: "0"
      },
      pd: "61 mm",
      lensPackage: "Single Vision Reading Clarity 1.56"
    },
    tracking: {
      courierName: "Delhivery",
      trackingId: "DLHV-883491029",
      updatedAt: "2026-09-25T15:30:00Z"
    }
  },
  {
    id: "ord-105",
    orderNumber: "LH-2026-8945",
    orderDate: "2026-09-23T19:20:00Z",
    customer: {
      id: "cust-005",
      name: "Vikram Sengupta",
      email: "vikram.sen@example.com",
      phone: "+91 94331 11223"
    },
    items: [
      {
        id: "item-6",
        productId: "prod-008",
        name: "Oakley Holbrook Polarized Matte Prizm",
        sku: "OK-OO9102-MBK",
        image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80",
        color: "Matte Black",
        size: "Large",
        quantity: 1,
        price: 8790,
        total: 8790
      }
    ],
    subtotal: 8790,
    shippingFee: 0,
    totalAmount: 8790,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    orderStatus: "Cancelled",
    shippingAddress: {
      fullName: "Vikram Sengupta",
      phone: "+91 94331 11223",
      email: "vikram.sen@example.com",
      addressLine1: "Plot 77, Salt Lake Sector V",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700091",
      country: "India"
    },
    prescription: {
      hasPrescription: false
    }
  },
  {
    id: "ord-106",
    orderNumber: "LH-2026-8946",
    orderDate: "2026-09-22T13:00:00Z",
    customer: {
      id: "cust-001",
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98765 12345"
    },
    items: [
      {
        id: "item-7",
        productId: "prod-005",
        name: "Bausch & Lomb Ultra Monthly (Pack of 6)",
        sku: "BL-ULT-M6",
        image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
        color: "Clear Aqua",
        quantity: 2,
        price: 1650,
        total: 3300
      }
    ],
    subtotal: 3300,
    shippingFee: 0,
    totalAmount: 3300,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    shippingAddress: {
      fullName: "Aarav Sharma",
      phone: "+91 98765 12345",
      email: "aarav.sharma@example.com",
      addressLine1: "Flat 402, Lotus Heights, Baner Road",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411045",
      country: "India"
    },
    prescription: {
      hasPrescription: true,
      rightEye: {
        sph: "-2.00",
        cyl: "0.00",
        axis: "0"
      },
      leftEye: {
        sph: "-2.00",
        cyl: "0.00",
        axis: "0"
      },
      lensPackage: "Monthly Disposable MoistureSeal Contact Lenses"
    },
    tracking: {
      courierName: "DTDC Courier",
      trackingId: "DTDC-440192837",
      updatedAt: "2026-09-23T11:00:00Z"
    }
  }
];
export {
  initialMockOrders
};
