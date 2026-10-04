import { Printer, X } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../common/Button";
import { BrandLogo } from "../common/BrandLogo";

const InvoicePreview = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Bar (hidden in print) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3 print:hidden">
          <span className="text-sm font-semibold text-slate-800">
            Invoice Preview • {order.orderNumber}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
            >
              Print Invoice
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-invoice" className="p-8 sm:p-10 bg-white text-slate-900 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-1 rounded-lg border border-slate-200 bg-white shadow-2xs">
                <BrandLogo size="md" className="h-9" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-wide text-slate-900">
                  THE LENS HUT
                </h1>
                <p className="text-xs text-slate-500">Premium Optical & Sunglass Studio</p>
                <p className="text-[11px] text-slate-400">GSTIN: 29AABCU9603R1ZM</p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-lg font-bold text-slate-900">TAX INVOICE</h2>
              <p className="text-xs text-slate-600 mt-1">Invoice #: {order.orderNumber}</p>
              <p className="text-xs text-slate-500">Date: {formatDate(order.orderDate)}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Payment: <strong className="text-slate-800">{order.paymentMethod}</strong> (
                {order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-2 gap-8 my-6 text-xs">
            <div>
              <p className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                Billed & Shipped To:
              </p>
              <p className="text-sm font-bold text-slate-900">{order.customer.name}</p>
              <p className="text-slate-600 mt-0.5">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-slate-600">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-slate-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-slate-600">Phone: {order.customer.phone}</p>
              <p className="text-slate-600">Email: {order.customer.email}</p>
            </div>

            <div className="text-right">
              <p className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                Store Dispatch Center:
              </p>
              <p className="font-semibold text-slate-800">The Lens Hut Fulfillment Hub</p>
              <p className="text-slate-600">101, Optical Tower, Indiranagar</p>
              <p className="text-slate-600">Bengaluru, Karnataka - 560038</p>
              <p className="text-slate-600">Email: billing@thelenshut.com</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left text-xs border-collapse my-6">
            <thead>
              <tr className="border-y border-slate-300 bg-slate-50 text-slate-700">
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.color ? `Color: ${item.color}` : ""}{" "}
                      {item.size ? `| Size: ${item.size}` : ""}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{item.sku}</td>
                  <td className="py-3 px-3 text-center font-medium">{item.quantity}</td>
                  <td className="py-3 px-3 text-right text-slate-600">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end my-4">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount && order.discountAmount > 0 ? (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({order.couponCode || "Promo"}):</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span>{order.shippingFee === 0 ? "FREE" : formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-300 pt-2">
                <span>Grand Total:</span>
                <span className="text-[#E4232C] font-extrabold">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Prescription Notes if applicable */}
          {order.prescription?.hasPrescription && (
            <div className="mt-6 p-3 rounded bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-800">Lens Specification: </span>
              <span className="text-slate-600">
                {order.prescription.lensPackage || "Standard Corrective Optics"} | Right: SPH{" "}
                {order.prescription.rightEye?.sph} CYL {order.prescription.rightEye?.cyl} Axis{" "}
                {order.prescription.rightEye?.axis} | Left: SPH {order.prescription.leftEye?.sph}{" "}
                CYL {order.prescription.leftEye?.cyl} Axis {order.prescription.leftEye?.axis} | PD:{" "}
                {order.prescription.pd}
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-400">
            Thank you for shopping with The Lens Hut. For returns or warranty claims, contact
            support@thelenshut.com within 14 days of delivery.
          </div>
        </div>
      </div>
    </div>
  );
};

export { InvoicePreview };
