import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { Glasses, Package, Sun, FileText } from "lucide-react";

const OrderItems = ({
  items = [],
  subtotal,
  discountAmount = 0,
  couponCode,
  shippingFee,
  totalAmount,
}) => {
  const renderItemConfiguration = (item) => {
    const config = item.configuration || {};
    const pType = item.productType || config.productType;

    if (pType === "eyeglasses" || config.lensSelection) {
      const lt = config.lensSelection?.lensType || "single-vision";
      const lensName = config.lensSelection?.lensName;
      const rx = config.prescription;

      return (
        <div className="mt-1.5 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#14232E]">
            <Glasses size={13} className="text-[#E4232C]" />
            <span className="capitalize">Spectacles · {lt.replace("-", " ")}</span>
          </div>
          {lensName && lt !== "frame-only" && (
            <div className="text-slate-600">
              Lens: <strong>{lensName}</strong>
            </div>
          )}
          {rx && rx.method === "upload" && (
            <div className="text-emerald-700 font-semibold flex items-center gap-1">
              <FileText size={11} />
              <span>Doctor Prescription Uploaded</span>
            </div>
          )}
          {rx && rx.method === "manual" && (
            <div className="text-slate-600 font-mono text-[11px]">
              OD: {rx.od?.sph || "0.00"} {rx.od?.cyl && `CYL ${rx.od.cyl} ${rx.od.axis}`}
              {" · "}
              OS: {rx.os?.sph || "0.00"} {rx.os?.cyl && `CYL ${rx.os.cyl} ${rx.os.axis}`}
              {rx.pd && ` · PD: ${rx.pd}mm`}
            </div>
          )}
        </div>
      );
    }

    if (pType === "contact-lens" || config.contactLens) {
      const cl = config.contactLens || {};
      return (
        <div className="mt-1.5 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#14232E]">
            <Package size={13} className="text-[#E4232C]" />
            <span>
              Contact Lenses · {cl.boxes || 1} Box{(cl.boxes || 1) > 1 ? "es" : ""} ({cl.piecesPerBox || 6} Pcs/Box)
            </span>
          </div>
          <div className="text-slate-600 font-mono text-[11px]">
            {cl.prescriptionMethod === "post-checkout" ? (
              <span className="text-amber-700 font-semibold">Powers to be taken post-checkout</span>
            ) : cl.prescriptionMethod === "upload" ? (
              <span className="text-emerald-700 font-semibold">Rx File Attached</span>
            ) : (
              <span>
                OD: {cl.od?.sph || "Plano"} {cl.od?.cyl && `CYL ${cl.od.cyl} ${cl.od.axis}`}
                {" · "}
                OS: {cl.os?.sph || "Plano"} {cl.os?.cyl && `CYL ${cl.os.cyl} ${cl.os.axis}`}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (pType === "sunglasses" || config.sunglass) {
      const sg = config.sunglass || {};
      return (
        <div className="mt-1.5 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#14232E]">
            <Sun size={13} className="text-[#E4232C]" />
            <span>Sunglasses · {sg.lensName || "Standard Tint"}</span>
          </div>
          {sg.mode === "power" && (
            <div className="text-[#E4232C] font-semibold text-[11px]">
              Corrective Prescription Sunglass
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
        Ordered Items ({items.length})
      </h2>

      <div className="divide-y divide-slate-100">
        {items.map((item, idx) => (
          <div
            key={item.id || item.productId || idx}
            className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-lg object-contain border border-slate-200 bg-slate-50 shrink-0 p-1"
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 text-sm">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">SKU: {item.sku || "LH-OPTICAL"}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                  {(item.color || item.selectedColor) && (
                    <span className="inline-flex items-center gap-1">
                      Color: <strong className="text-slate-800">{item.color || item.selectedColor}</strong>
                    </span>
                  )}
                  {(item.size || item.selectedSize) && (
                    <span className="inline-flex items-center gap-1">
                      • Size: <strong className="text-slate-800">{item.size || item.selectedSize}</strong>
                    </span>
                  )}
                </div>

                {/* Category Configuration Breakdown */}
                {renderItemConfiguration(item)}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-sm shrink-0">
              <div className="text-slate-500 text-xs">
                {formatCurrency(item.unitPrice || item.price)} × {item.quantity}
              </div>
              <div className="font-bold text-slate-900 text-base sm:mt-1">
                {formatCurrency(item.totalPrice || item.total || (item.unitPrice || item.price) * item.quantity)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Summary */}
      <div className="mt-6 border-t border-slate-200 pt-4 space-y-2 max-w-xs ml-auto">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Subtotal</span>
          <span className="font-medium text-slate-800">{formatCurrency(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-xs text-emerald-600">
            <span>Discount {couponCode ? `(${couponCode})` : ""}</span>
            <span className="font-medium">-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-slate-600">
          <span>Shipping Fee</span>
          <span className="font-medium text-slate-800">
            {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
          </span>
        </div>

        <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
          <span>Total</span>
          <span className="text-[#E4232C] font-extrabold">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export { OrderItems };
