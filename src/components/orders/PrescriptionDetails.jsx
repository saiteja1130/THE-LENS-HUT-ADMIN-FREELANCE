import React, { useState } from "react";
import {
  Eye,
  CheckCircle2,
  FileText,
  Download,
  ExternalLink,
  ZoomIn,
  FileCode,
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
        method:
          itemRxSource.method || (itemRxSource.fileUrl ? "upload" : "manual"),
        rightEye: itemRxSource.od || itemRxSource.rightEye || {},
        leftEye: itemRxSource.os || itemRxSource.leftEye || {},
        pd: itemRxSource.pd ? `${itemRxSource.pd} mm` : "63 mm",
        lensPackage:
          rxItem.configuration?.lensSelection?.lensName ||
          itemRxSource.lensPackage ||
          "Optical Lab Custom Lens",
        fileUrl:
          itemRxSource.fileUrl ||
          itemRxSource.url ||
          itemRxSource.rxFile ||
          "",
        fileName: itemRxSource.fileName || "",
        fileType: itemRxSource.fileType || "",
        fileSize: itemRxSource.fileSize || 0,
        notes: itemRxSource.notes || "",
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
        notes: "Uploaded for contact lens item",
      };
    }
  }

  // Also collect any uploaded files from items for display
  const uploadedFilesFromItems = (items || []).reduce((acc, item, index) => {
    const rx = item.configuration?.prescription;
    const clRx = item.configuration?.contactLens?.prescriptionFile;

    if (rx && (rx.fileUrl || rx.url || rx.rxFile || rx.fileName)) {
      const rawUrl =
        rx.fileUrl ||
        rx.url ||
        (typeof rx.rxFile === "string" ? rx.rxFile : rx.rxFile?.fileUrl) ||
        "";
      const name =
        rx.fileName ||
        (typeof rx.rxFile === "object" ? rx.rxFile?.fileName : "") ||
        `Item_${index + 1}_Rx`;
      if (rawUrl || name) {
        acc.push({
          sourceName: item.name || `Item #${index + 1}`,
          fileUrl: resolveFileUrl(rawUrl),
          fileName: name,
          fileType: rx.fileType || "",
          fileSize: rx.fileSize || 0,
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
        fileSize: clRx.fileSize || 0,
      });
    }

    return acc;
  }, []);

  const hasAnyPrescription = Boolean(
    effectivePrescription && effectivePrescription.hasPrescription
  );

  // Identify root uploaded file
  let rootUploadedFile = null;
  if (effectivePrescription) {
    const rawUrl =
      effectivePrescription.fileUrl ||
      effectivePrescription.url ||
      (typeof effectivePrescription.rxFile === "string"
        ? effectivePrescription.rxFile
        : effectivePrescription.rxFile?.fileUrl ||
          effectivePrescription.rxFile?.url) ||
      "";

    const fileName =
      effectivePrescription.fileName ||
      (typeof effectivePrescription.rxFile === "object"
        ? effectivePrescription.rxFile?.fileName
        : "") ||
      (rawUrl ? rawUrl.split("/").pop() : "");

    if (rawUrl || fileName) {
      rootUploadedFile = {
        fileUrl: resolveFileUrl(rawUrl),
        fileName: fileName || "Doctor_Prescription.pdf",
        fileType: effectivePrescription.fileType || "",
        fileSize: effectivePrescription.fileSize || 0,
      };
    }
  }

  // Deduplicate files by resolved URL or fileName
  const allUploadedFiles = [];
  const seenUrls = new Set();

  if (
    rootUploadedFile &&
    (rootUploadedFile.fileUrl || rootUploadedFile.fileName)
  ) {
    allUploadedFiles.push(rootUploadedFile);
    if (rootUploadedFile.fileUrl) seenUrls.add(rootUploadedFile.fileUrl);
  }

  uploadedFilesFromItems.forEach((f) => {
    if (f.fileUrl && !seenUrls.has(f.fileUrl)) {
      seenUrls.add(f.fileUrl);
      allUploadedFiles.push(f);
    } else if (
      !f.fileUrl &&
      !allUploadedFiles.some((x) => x.fileName === f.fileName)
    ) {
      allUploadedFiles.push(f);
    }
  });

  if (!hasAnyPrescription && allUploadedFiles.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all sm:p-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900">
          <Eye className="h-4 w-4 text-slate-500" />
          Lens & Prescription Details
        </h2>
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 text-center">
          <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
          <p className="text-sm font-semibold text-slate-800">
            No Prescription Required (Plano / Demo / Standard Sunglasses)
          </p>
          <p className="mt-1 text-xs text-slate-500">
            This order contains non-corrective lenses or standard accessory items.
          </p>
        </div>
      </div>
    );
  }

  const { rightEye = {}, leftEye = {}, pd, lensPackage } =
    effectivePrescription || {};
  const hasAdd = Boolean(rightEye?.add || leftEye?.add);
  const isUploadMethod =
    effectivePrescription?.method === "upload" || allUploadedFiles.length > 0;
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
    <div className="space-y-5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all sm:p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Eye className="h-4 w-4 text-[#E4232C]" />
          Optical Prescription Details
        </span>
        <span className="inline-flex items-center rounded-full border border-emerald-200/70 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 shadow-2xs">
          {isUploadMethod ? "Uploaded Doctor Rx" : "Manual Prescription"}
        </span>
      </div>

      {/* 1. Uploaded Prescription Documents */}
      {allUploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Customer Uploaded Prescription ({allUploadedFiles.length})</span>
            <span className="text-xs font-semibold normal-case text-emerald-700">
              Direct Clinical Access
            </span>
          </div>

          <div className="space-y-3">
            {allUploadedFiles.map((file, idx) => {
              const isImg = isImageFile(file.fileName, file.fileType);
              const isPdf = isPdfFile(file.fileName, file.fileType);

              return (
                <div
                  key={idx}
                  className="space-y-3 rounded-xl border border-emerald-200/90 bg-emerald-50/60 p-4 text-slate-800 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200/70 bg-emerald-100/90 text-emerald-800 shadow-2xs">
                        {isImg ? (
                          <Eye size={20} className="text-emerald-700" />
                        ) : isPdf ? (
                          <FileText size={20} className="text-emerald-700" />
                        ) : (
                          <FileCode size={20} className="text-emerald-700" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="max-w-xs truncate text-sm font-bold text-slate-900 sm:max-w-md">
                          {file.fileName || "Prescription_Document.pdf"}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                          {file.sourceName && (
                            <span>For: {file.sourceName}</span>
                          )}
                          {file.fileSize > 0 && (
                            <>
                              <span>•</span>
                              <span>{formatFileSize(file.fileSize)}</span>
                            </>
                          )}
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
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
                          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-emerald-700"
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
                            className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-2xs transition-colors hover:bg-emerald-50 cursor-pointer"
                          >
                            <span>Open In New Tab</span>
                            <ExternalLink size={13} />
                          </a>
                          <a
                            href={file.fileUrl}
                            download={file.fileName || "prescription"}
                            className="rounded-lg border border-emerald-300 bg-white p-1.5 text-xs font-semibold text-emerald-900 shadow-2xs transition-colors hover:bg-emerald-50 cursor-pointer"
                            title="Download Prescription"
                          >
                            <Download size={14} />
                          </a>
                        </>
                      ) : (
                        <span className="rounded border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          File path unavailable
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inline Image Preview Thumbnail */}
                  {isImg && file.fileUrl && (
                    <div className="border-t border-emerald-200/60 pt-2.5">
                      <div className="mb-1.5 text-[11px] font-semibold text-slate-500">
                        Image Preview (Click to expand):
                      </div>
                      <div
                        onClick={() => handleOpenPreview(file)}
                        className="group relative max-w-xs cursor-pointer overflow-hidden rounded-lg border border-emerald-200/80 bg-white shadow-2xs"
                      >
                        <img
                          src={file.fileUrl}
                          alt="Doctor Prescription"
                          className="max-h-48 w-full object-contain transition-opacity group-hover:opacity-90"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-1 bg-slate-900/20 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
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

      {/* 2. Optical Power Table (Shown if manual values exist or no file was uploaded) */}
      {(hasManualNumbers || (!isUploadMethod && hasAnyPrescription)) && (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Prescription Powers & Parameters
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200/80">
            <table className="w-full min-w-[500px] border-collapse text-center text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase text-slate-600">
                  <th className="py-2.5 px-4 text-left">Eye</th>
                  <th className="py-2.5 px-4">SPH (Sphere)</th>
                  <th className="py-2.5 px-4">CYL (Cylinder)</th>
                  <th className="py-2.5 px-4">Axis</th>
                  {hasAdd && (
                    <th className="py-2.5 px-4 text-[#E4232C]">
                      ADD (Near Reading)
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="bg-slate-50/50 py-3 px-4 text-left font-semibold text-slate-900">
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
                  <td className="bg-slate-50/50 py-3 px-4 text-left font-semibold text-slate-900">
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
      <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pupillary Distance (PD)
          </span>
          <span className="mt-1 block text-sm font-bold text-slate-900">
            {pd || "63 mm (Standard)"}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Selected Lens Package
          </span>
          <span className="mt-1 block text-sm font-bold text-slate-900">
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
        <div className="space-y-4 p-4">
          <div className="flex max-h-[75vh] justify-center overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-2">
            {isImageFile(previewTitle) ? (
              <img
                src={previewUrl}
                alt={previewTitle}
                className="h-auto max-w-full rounded-lg object-contain"
              />
            ) : isPdfFile(previewTitle) ? (
              <iframe
                src={previewUrl}
                title={previewTitle}
                className="h-[65vh] w-full rounded-lg border-0"
              />
            ) : (
              <div className="space-y-3 p-10 text-center">
                <FileText className="mx-auto h-12 w-12 text-slate-400" />
                <p className="text-sm font-semibold text-slate-700">
                  Document cannot be previewed directly inside modal.
                </p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#14232E] px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  <span>Open in External Viewer</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="max-w-md truncate text-xs text-slate-500">
              {previewUrl}
            </span>
            <div className="flex items-center gap-2">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200 cursor-pointer"
              >
                <span>New Tab</span>
                <ExternalLink size={12} />
              </a>
              <a
                href={previewUrl}
                download
                className="flex items-center gap-1 rounded-lg bg-[#E4232C] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#C81921] cursor-pointer"
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
