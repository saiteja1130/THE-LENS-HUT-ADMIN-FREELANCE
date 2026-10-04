const initialMockCoupons = [
  {
    id: "cpn-001",
    code: "WELCOME200",
    discountType: "Fixed Amount",
    discountValue: 200,
    minOrderAmount: 999,
    startDate: "2026-01-01",
    expiryDate: "2026-12-31",
    isActive: true,
    usageCount: 142
  },
  {
    id: "cpn-002",
    code: "LENS500",
    discountType: "Fixed Amount",
    discountValue: 500,
    minOrderAmount: 2499,
    startDate: "2026-08-01",
    expiryDate: "2026-10-31",
    isActive: true,
    usageCount: 78
  },
  {
    id: "cpn-003",
    code: "FESTIVE20",
    discountType: "Percentage",
    discountValue: 20,
    minOrderAmount: 1999,
    startDate: "2026-09-01",
    expiryDate: "2026-11-15",
    isActive: true,
    usageCount: 215
  },
  {
    id: "cpn-004",
    code: "SUMMER2025",
    discountType: "Percentage",
    discountValue: 15,
    minOrderAmount: 1499,
    startDate: "2025-05-01",
    expiryDate: "2025-07-31",
    isActive: false,
    usageCount: 94
  },
  {
    id: "cpn-005",
    code: "BOGO2026",
    discountType: "Percentage",
    discountValue: 50,
    minOrderAmount: 3999,
    startDate: "2026-09-15",
    expiryDate: "2026-10-15",
    isActive: true,
    usageCount: 41
  }
];
export {
  initialMockCoupons
};
