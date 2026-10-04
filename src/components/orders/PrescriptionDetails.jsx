import React from "react";
import { Eye, CheckCircle2, FileText, Download, ExternalLink } from "lucide-react";

const PrescriptionDetails = ({ prescription }) => {
  if (!prescription || !prescription.hasPrescription) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-slate-500" />
          Lens & Prescription Details
        </h2>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
          <p className="text-sm font-semibold text-slate-800">
            No Prescription Required (Plano / Demo / Standard Sunglasses)
          </p>
          <p className="text-xs text-slate-500 mt-1">
            This order contains non-corrective lenses or standard accessory items.
          </p>
        </div>
      </div>
    );
  }

  const { rightEye, leftEye, pd, lensPackage, rxFile } = prescription;
  const hasAdd = Boolean(rightEye?.add || leftEye?.add);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <Eye className="w-4 h-4 text-[#E4232C]" />
          Optical Prescription Parameters
        </span>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Verified Optical Rx
        </span>
      </div>

      {/* Optical Power Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border border-slate-200">
              <th className="py-2.5 px-4 text-left">Eye</th>
              <th className="py-2.5 px-4">SPH (Sphere)</th>
              <th className="py-2.5 px-4">CYL (Cylinder)</th>
              <th className="py-2.5 px-4">Axis</th>
              {hasAdd && <th className="py-2.5 px-4 text-[#E4232C]">ADD (Near Reading)</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 border border-slate-200">
            <tr>
              <td className="py-3 px-4 text-left font-semibold text-slate-900 bg-slate-50/50">
                Right Eye (OD)
              </td>
              <td className="py-3 px-4 font-mono font-medium text-slate-800">
                {rightEye?.sph || "0.00"}
              </td>
              <td className="py-3 px-4 font-mono font-medium text-slate-800">
                {rightEye?.cyl || "0.00"}
              </td>
              <td className="py-3 px-4 font-mono font-medium text-slate-800">
                {rightEye?.axis ? `${rightEye.axis}°` : "-"}
              </td>
              {hasAdd && (
                <td className="py-3 px-4 font-mono font-bold text-[#E4232C]">
                  {rightEye?.add || "-"}
                </td>
              )}
            </tr>
            <tr>
              <td className="py-3 px-4 text-left font-semibold text-slate-900 bg-slate-50/50">
                Left Eye (OS)
              </td>
              <td className="py-3 px-4 font-mono font-medium text-slate-800">
                {leftEye?.sph || "0.00"}
              </td>
              <td className="py-3 px-4 font-mono font-medium text-slate-800">
                {leftEye?.cyl || "0.00"}
              </td>
              <td className="py-3 px-4 font-mono font-medium text-slate-800">
                {leftEye?.axis ? `${leftEye.axis}°` : "-"}
              </td>
              {hasAdd && (
                <td className="py-3 px-4 font-mono font-bold text-[#E4232C]">
                  {leftEye?.add || "-"}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* PD & Lens Package */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Pupillary Distance (PD)
          </span>
          <span className="text-sm font-bold text-slate-900 mt-1 block">
            {pd || "63 mm (Standard)"}
          </span>
        </div>

        <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Selected Lens Package
          </span>
          <span className="text-sm font-bold text-slate-900 mt-1 block">
            {lensPackage || "Anti-Glare + Blue Cut 1.60 Index"}
          </span>
        </div>
      </div>

      {/* Attached Rx Document Link if uploaded */}
      {rxFile && (
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-emerald-700" />
            <span>Prescription File: <strong>{rxFile.fileName || "Doctor_Prescription.pdf"}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => alert(`Accessing authenticated prescription file: ${rxFile.fileName || 'Prescription.pdf'}`)}
            className="font-bold underline text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <span>View Document</span>
            <ExternalLink size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export { PrescriptionDetails };
