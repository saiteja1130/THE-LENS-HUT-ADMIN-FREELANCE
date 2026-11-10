import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { Glasses, Package, Sun, FileText, ExternalLink } from "lucide-react";
import { resolveFileUrl } from "../../utils/fileUrl";

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
        <div className="mt-2 space-y-1.5 rounded-lg border border-slate-200/70 bg-slate-50/80 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#14232E]">
            <Glasses size={14} className="text-[#E4232C] shrink-0" />
            <span className="capitalize">
              Spectacles · {lt.replace("-", " ")}
            </span>
          </div>
          {lensName && lt !== "frame-only" && (
            <div className="text-slate-600">
              Lens Package: <strong className="text-slate-900">{lensName}</strong>
            </div>
          )}
          {rx &&
            (rx.method === "upload" ||
              rx.fileUrl ||
              rx.fileName ||
              rx.rxFile) &&
            (() => {
              const rxUrl = resolveFileUrl(
                rx.fileUrl ||
                  rx.url ||
                  (typeof rx.rxFile === "string"
                    ? rx.rxFile
                    : rx.rxFile?.fileUrl)
              );
              const rxName =
                rx.fileName ||
                (typeof rx.rxFile === "object" ? rx.rxFile?.fileName : "") ||
                "Doctor_Prescription.pdf";
              return (
                <div className="flex items-center justify-between rounded-lg border border-emerald-200/80 bg-emerald-50/90 p-2 text-xs text-emerald-950 shadow-2xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText size={13} className="text-emerald-700 shrink-0" />
                    <span className="font-semibold truncate max-w-[180px] sm:max-w-xs">
                      Rx: {rxName}
                    </span>
                  </div>
                  {rxUrl ? (
                    <a
                      href={rxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-2xs transition-colors hover:bg-emerald-100 shrink-0 ml-2 cursor-pointer"
                    >
                      <span>View Rx</span>
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="text-[10px] font-medium text-amber-700">
                      Uploaded
                    </span>
                  )}
                </div>
              );
            })()}
          {rx && rx.method === "manual" && (
            <div className="font-mono text-[11px] text-slate-600">
              OD: {rx.od?.sph || "0.00"}{" "}
              {rx.od?.cyl && `CYL ${rx.od.cyl} ${rx.od.axis}`}
              {" · "}
              OS: {rx.os?.sph || "0.00"}{" "}
              {rx.os?.cyl && `CYL ${rx.os.cyl} ${rx.os.axis}`}
              {rx.pd && ` · PD: ${rx.pd}mm`}
            </div>
          )}
        </div>
      );
    }

    if (pType === "contact-lens" || config.contactLens) {
      const cl = config.contactLens || {};
      const clFile = cl.prescriptionFile || {};
      const clUrl = resolveFileUrl(clFile.fileUrl || clFile.url || cl.fileUrl);
      const clName = clFile.fileName || cl.fileName || "Contact_Lens_Rx.pdf";

      return (
        <div className="mt-2 space-y-1.5 rounded-lg border border-slate-200/70 bg-slate-50/80 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#14232E]">
            <Package size={14} className="text-[#E4232C] shrink-0" />
            <span>
              Contact Lenses · {cl.boxes || 1} Box
              {(cl.boxes || 1) > 1 ? "es" : ""} ({cl.piecesPerBox || 6}{" "}
              Pcs/Box)
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-600">
            {cl.prescriptionMethod === "post-checkout" ? (
              <span className="font-semibold text-amber-700">
                Powers to be taken post-checkout
              </span>
            ) : cl.prescriptionMethod === "upload" || cl.prescriptionFile ? (
              <div className="mt-1 flex items-center justify-between rounded-lg border border-emerald-200/80 bg-emerald-50/90 p-2 font-sans text-emerald-950 shadow-2xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <FileText size={13} className="text-emerald-700 shrink-0" />
                  <span className="font-semibold text-xs truncate max-w-[180px]">
                    Rx: {clName}
                  </span>
                </div>
                {clUrl && (
                  <a
                    href={clUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-white px-2 py-0.5 text-[10px] font-bold text-emerald-800 shadow-2xs transition-colors hover:bg-emerald-100 shrink-0 ml-2 cursor-pointer"
                  >
                    <span>View Rx</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            ) : (
              <span>
                OD: {cl.od?.sph || "Plano"}{" "}
                {cl.od?.cyl && `CYL ${cl.od.cyl} ${cl.od.axis}`}
                {" · "}
                OS: {cl.os?.sph || "Plano"}{" "}
                {cl.os?.cyl && `CYL ${cl.os.cyl} ${cl.os.axis}`}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (pType === "sunglasses" || config.sunglass) {
      const sg = config.sunglass || {};
      return (
        <div className="mt-2 space-y-1.5 rounded-lg border border-slate-200/70 bg-slate-50/80 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#14232E]">
            <Sun size={14} className="text-[#E4232C] shrink-0" />
            <span>Sunglasses · {sg.lensName || "Standard Tint"}</span>
          </div>
          {sg.mode === "power" && (
            <div className="font-semibold text-[11px] text-[#E4232C]">
              Corrective Prescription Sunglass
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all sm:p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">Ordered Items</h2>
          <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item, idx) => (
          <div
            key={item.id || item.productId || idx}
            className="flex flex-col gap-4 py-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 p-1 shadow-2xs">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                  {item.name}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                  SKU: {item.sku || "LH-OPTICAL"}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  {(item.color || item.selectedColor) && (
                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">
                      Color:{" "}
                      <strong className="text-slate-800">
                        {item.color || item.selectedColor}
                      </strong>
                    </span>
                  )}
                  {(item.size || item.selectedSize) && (
                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">
                      Size:{" "}
                      <strong className="text-slate-800">
                        {item.size || item.selectedSize}
                      </strong>
                    </span>
                  )}
                </div>

                {/* Category Configuration Breakdown */}
                {renderItemConfiguration(item)}
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between sm:flex-col sm:items-end sm:justify-center">
              <div className="text-xs text-slate-500 tabular-nums">
                {formatCurrency(item.unitPrice || item.price)} × {item.quantity}
              </div>
              <div className="text-base font-bold text-slate-900 tabular-nums sm:mt-1">
                {formatCurrency(
                  item.totalPrice ||
                    item.total ||
                    (item.unitPrice || item.price) * item.quantity
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Summary */}
      <div className="ml-auto mt-6 max-w-xs space-y-2 border-t border-slate-200/80 pt-4">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800 tabular-nums">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-xs text-emerald-600">
            <span>Discount {couponCode ? `(${couponCode})` : ""}</span>
            <span className="font-semibold tabular-nums">
              -{formatCurrency(discountAmount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-xs text-slate-600">
          <span>Shipping Fee</span>
          <span className="font-semibold text-slate-800 tabular-nums">
            {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
          </span>
        </div>

        <div className="flex justify-between border-t border-slate-200/80 pt-2.5 text-base font-bold text-slate-900">
          <span>Grand Total</span>
          <span className="font-extrabold text-[#E4232C] tabular-nums">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export { OrderItems };
