import React, { useState } from "react";
import {
  Eye,
  CheckCircle2,
  FileText,
  Download,
  ExternalLink,
  ZoomIn,
  FileCode,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { resolveFileUrl } from "../../utils/fileUrl";
import { Modal } from "../common/Modal";

const PrescriptionDetails = ({ prescription, items = [] }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Extract prescription data: check root prescription first, then fallback to line items
  let effectivePrescription = prescription;
  let itemRxSource = null;

  if (!effectivePrescription || !effectivePrescription.hasPrescription) {
    const rxItem = (items || []).find(
      (i) =>
        i.configuration?.prescription?.hasPrescription ||
        i.configuration?.prescription?.method === "upload" ||
        i.configuration?.prescription?.fileUrl ||
        i.configuration?.prescription?.fileName ||
        i.configuration?.prescription?.rxFile ||
        i.configuration?.prescription?.od?.sph ||
        i.configuration?.contactLens?.prescriptionFile ||
        i.configuration?.contactLens?.prescriptionMethod === "upload"
    );

    if (rxItem?.configuration?.prescription) {
      itemRxSource = rxItem.configuration.prescription;
      effectivePrescription = {
        hasPrescription: true,
        method: itemRxSource.method || (itemRxSource.fileUrl ? "upload" : "manual"),
        rightEye: itemRxSource.od || itemRxSource.rightEye || {},
        leftEye: itemRxSource.os || itemRxSource.leftEye || {},
        pd: itemRxSource.pd ? `${itemRxSource.pd} mm` : "63 mm",
        lensPackage:
          rxItem.configuration?.lensSelection?.lensName ||
          itemRxSource.lensPackage ||
          "Optical Lab Custom Lens",
        fileUrl: itemRxSource.fileUrl || itemRxSource.url || itemRxSource.rxFile || "",
        fileName: itemRxSource.fileName || "",
        fileType: itemRxSource.fileType || "",
        fileSize: itemRxSource.fileSize || 0,
        notes: itemRxSource.notes || ""
      };
    } else if (rxItem?.configuration?.contactLens?.prescriptionFile) {
      const clRx = rxItem.configuration.contactLens.prescriptionFile;
      effectivePrescription = {
        hasPrescription: true,
        method: "upload",
        rightEye: { sph: "0.00", cyl: "0.00", axis: "-" },
        leftEye: { sph: "0.00", cyl: "0.00", axis: "-" },
        pd: "63 mm",
        lensPackage: "Contact Lens Prescription",
        fileUrl: clRx.fileUrl || clRx.url || "",
        fileName: clRx.fileName || "Contact_Lens_Prescription.pdf",
        fileType: clRx.fileType || "",
        fileSize: clRx.fileSize || 0,
        notes: "Uploaded for contact lens item"
      };
    }
  }

  // Also collect any uploaded files from items for display
  const uploadedFilesFromItems = (items || []).reduce((acc, item, index) => {
    const rx = item.configuration?.prescription;
    const clRx = item.configuration?.contactLens?.prescriptionFile;

    if (rx && (rx.fileUrl || rx.url || rx.rxFile || rx.fileName)) {
      const rawUrl = rx.fileUrl || rx.url || (typeof rx.rxFile === "string" ? rx.rxFile : rx.rxFile?.fileUrl) || "";
      const name = rx.fileName || (typeof rx.rxFile === "object" ? rx.rxFile?.fileName : "") || `Item_${index + 1}_Rx`;
      if (rawUrl || name) {
        acc.push({
          sourceName: item.name || `Item #${index + 1}`,
          fileUrl: resolveFileUrl(rawUrl),
          fileName: name,
          fileType: rx.fileType || "",
          fileSize: rx.fileSize || 0
        });
      }
    }

    if (clRx && (clRx.fileUrl || clRx.url || clRx.fileName)) {
      const rawUrl = clRx.fileUrl || clRx.url || "";
      acc.push({
        sourceName: item.name || `Contact Lens #${index + 1}`,
        fileUrl: resolveFileUrl(rawUrl),
        fileName: clRx.fileName || "Contact_Lens_Rx.pdf",
        fileType: clRx.fileType || "",
        fileSize: clRx.fileSize || 0
      });
    }

    return acc;
  }, []);

  const hasAnyPrescription = Boolean(effectivePrescription && effectivePrescription.hasPrescription);

  // Identify root uploaded file
  let rootUploadedFile = null;
  if (effectivePrescription) {
    const rawUrl =
      effectivePrescription.fileUrl ||
      effectivePrescription.url ||
      (typeof effectivePrescription.rxFile === "string"
        ? effectivePrescription.rxFile
        : effectivePrescription.rxFile?.fileUrl || effectivePrescription.rxFile?.url) ||
      "";

    const fileName =
      effectivePrescription.fileName ||
      (typeof effectivePrescription.rxFile === "object" ? effectivePrescription.rxFile?.fileName : "") ||
      (rawUrl ? rawUrl.split("/").pop() : "");

    if (rawUrl || fileName) {
      rootUploadedFile = {
        fileUrl: resolveFileUrl(rawUrl),
        fileName: fileName || "Doctor_Prescription.pdf",
        fileType: effectivePrescription.fileType || "",
        fileSize: effectivePrescription.fileSize || 0
      };
    }
  }

  // Deduplicate files by resolved URL or fileName
  const allUploadedFiles = [];
  const seenUrls = new Set();

  if (rootUploadedFile && (rootUploadedFile.fileUrl || rootUploadedFile.fileName)) {
    allUploadedFiles.push(rootUploadedFile);
    if (rootUploadedFile.fileUrl) seenUrls.add(rootUploadedFile.fileUrl);
  }

  uploadedFilesFromItems.forEach((f) => {
    if (f.fileUrl && !seenUrls.has(f.fileUrl)) {
      seenUrls.add(f.fileUrl);
      allUploadedFiles.push(f);
    } else if (!f.fileUrl && !allUploadedFiles.some((x) => x.fileName === f.fileName)) {
      allUploadedFiles.push(f);
    }
  });

  if (!hasAnyPrescription && allUploadedFiles.length === 0) {
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

  const { rightEye = {}, leftEye = {}, pd, lensPackage } = effectivePrescription || {};
  const hasAdd = Boolean(rightEye?.add || leftEye?.add);
  const isUploadMethod = effectivePrescription?.method === "upload" || allUploadedFiles.length > 0;
  const hasManualNumbers =
    Boolean(rightEye?.sph && rightEye.sph !== "0.00") ||
    Boolean(leftEye?.sph && leftEye.sph !== "0.00") ||
    Boolean(rightEye?.cyl && rightEye.cyl !== "0.00") ||
    Boolean(leftEye?.cyl && leftEye.cyl !== "0.00") ||
    effectivePrescription?.method === "manual";

  const isImageFile = (filename = "", filetype = "") => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return (
      ["jpg", "jpeg", "png", "webp", "avif", "gif"].includes(ext) ||
      filetype.startsWith("image/")
    );
  };

  const isPdfFile = (filename = "", filetype = "") => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext === "pdf" || filetype === "application/pdf";
  };

  const handleOpenPreview = (file) => {
    if (file.fileUrl) {
      setPreviewUrl(file.fileUrl);
      setPreviewTitle(file.fileName || "Prescription Document");
      setIsPreviewOpen(true);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <Eye className="w-4 h-4 text-[#E4232C]" />
          Optical Prescription Details
        </span>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {isUploadMethod ? "Uploaded Doctor Rx" : "Manual Prescription"}
        </span>
      </div>

      {/* 1. Uploaded Prescription Documents (Prominent Section) */}
      {allUploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Customer Uploaded Prescription ({allUploadedFiles.length})</span>
            <span className="text-emerald-700 font-semibold normal-case text-xs">
              Direct Document Access
            </span>
          </div>

          <div className="space-y-3">
            {allUploadedFiles.map((file, idx) => {
              const isImg = isImageFile(file.fileName, file.fileType);
              const isPdf = isPdfFile(file.fileName, file.fileType);

              return (
                <div
                  key={idx}
                  className="p-4 bg-emerald-50/60 border border-emerald-200/90 rounded-xl space-y-3 text-slate-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                        {isImg ? (
                          <Eye size={20} className="text-emerald-700" />
                        ) : isPdf ? (
                          <FileText size={20} className="text-emerald-700" />
                        ) : (
                          <FileCode size={20} className="text-emerald-700" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                          {file.fileName || "Prescription_Document.pdf"}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          {file.sourceName && <span>For: {file.sourceName}</span>}
                          {file.fileSize > 0 && (
                            <>
                              <span>•</span>
                              <span>{formatFileSize(file.fileSize)}</span>
                            </>
                          )}
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] uppercase">
                            {isImg ? "IMAGE" : isPdf ? "PDF" : "DOC"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {isImg && file.fileUrl && (
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(file)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <ZoomIn size={13} />
                          <span>Preview</span>
                        </button>
                      )}

                      {file.fileUrl ? (
                        <>
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                          >
                            <span>Open In New Tab</span>
                            <ExternalLink size={13} />
                          </a>
                          <a
                            href={file.fileUrl}
                            download={file.fileName || "prescription"}
                            className="p-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                            title="Download Prescription"
                          >
                            <Download size={14} />
                          </a>
                        </>
                      ) : (
                        <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                          File path unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inline Image Preview Thumbnail */}
                  {isImg && file.fileUrl && (
                    <div className="pt-2 border-t border-emerald-200/60">
                      <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                        Image Preview (Click to expand):
                      </div>
                      <div
                        onClick={() => handleOpenPreview(file)}
                        className="relative max-w-xs cursor-pointer group rounded-lg overflow-hidden border border-emerald-200/80 bg-white"
                      >
                        <img
                          src={file.fileUrl}
                          alt="Doctor Prescription"
                          className="w-full max-h-48 object-contain group-hover:opacity-90 transition-opacity"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                          <ZoomIn size={15} />
                          <span>Click to Enlarge</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Optical Power Table (Shown if manual values are present or no file was uploaded) */}
      {(hasManualNumbers || (!isUploadMethod && hasAnyPrescription)) && (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Prescription Powers & Parameters
          </div>
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
        </div>
      )}

      {/* 3. PD & Lens Package */}
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
            {lensPackage || "Optical Lab Custom Lens"}
          </span>
        </div>
      </div>

      {/* Expanded Modal for Full-Size Document/Image Inspection */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={previewTitle || "Prescription Preview"}
        description="High-resolution clinical prescription verification"
        maxWidth="4xl"
      >
        <div className="p-4 space-y-4">
          <div className="flex justify-center bg-slate-100 rounded-xl p-2 border border-slate-200 max-h-[75vh] overflow-auto">
            {isImageFile(previewTitle) ? (
              <img
                src={previewUrl}
                alt={previewTitle}
                className="max-w-full h-auto object-contain rounded-lg"
              />
            ) : isPdfFile(previewTitle) ? (
              <iframe
                src={previewUrl}
                title={previewTitle}
                className="w-full h-[65vh] rounded-lg border-0"
              />
            ) : (
              <div className="p-10 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">
                  Document cannot be previewed directly inside modal.
                </p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#14232E] text-white rounded-lg text-xs font-bold"
                >
                  <span>Open in External Viewer</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-500 truncate max-w-md">{previewUrl}</span>
            <div className="flex items-center gap-2">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>New Tab</span>
                <ExternalLink size={12} />
              </a>
              <a
                href={previewUrl}
                download
                className="px-3 py-1.5 bg-[#E4232C] hover:bg-[#C81921] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Download size={13} />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { PrescriptionDetails };
