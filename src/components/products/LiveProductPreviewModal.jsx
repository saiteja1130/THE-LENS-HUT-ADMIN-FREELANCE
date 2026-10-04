import React, { useState } from 'react';
import { X, Eye, Glasses, Package, Sun, CheckCircle2 } from 'lucide-react';
import { calculateItemPrice } from '../../services/opticalEngine/pricing';

export const LiveProductPreviewModal = ({
  isOpen,
  onClose,
  productData = {}
}) => {
  if (!isOpen) return null;

  const pType = productData.productType || 'eyeglasses';
  const variants = productData.colors || [
    { id: 'c1', name: 'Midnight Black', hex: '#0f172a' }
  ];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedLensType, setSelectedLensType] = useState('single-vision');
  const [boxes, setBoxes] = useState(1);
  const [sunglassMode, setSunglassMode] = useState('standard');

  const previewConfig = {
    productId: productData.id || 'preview',
    productType: pType,
    variantId: selectedVariant?.id,
    lensSelection: {
      lensType: selectedLensType,
      lensId: productData.eyeglassesConfig?.availableLenses?.[0]?.id,
      lensPrice: productData.eyeglassesConfig?.availableLenses?.[0]?.price || 0
    },
    contactLens: {
      boxes,
      powerType: productData.contactLensConfig?.powerType || 'spherical'
    },
    sunglass: {
      mode: sunglassMode,
      lensType: 'sg-only',
      lensPrice: 0
    }
  };

  const pricing = calculateItemPrice(
    {
      price: productData.price || 1999,
      basePrice: productData.price || 1999,
      productType: pType,
      eyeglassesConfig: productData.eyeglassesConfig,
      contactLensConfig: productData.contactLensConfig,
      sunglassesConfig: productData.sunglassesConfig
    },
    previewConfig,
    1
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-[#E4232C]" />
            <h3 className="text-base font-extrabold text-[#14232E]">
              Buyer Configuration Preview
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product Basic Summary */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-14 h-14 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1 shrink-0">
            {productData.images?.front ? (
              <img
                src={productData.images.front}
                alt={productData.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Glasses size={24} className="text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {productData.brand || 'The Lens Hut'} · {pType.toUpperCase()}
            </span>
            <h4 className="text-xs font-bold text-[#14232E] truncate">
              {productData.name || 'Untitled Product'}
            </h4>
            <div className="text-xs font-black text-[#E4232C] mt-0.5">
              Base Price: ₹{(productData.price || 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Interactive Configuration Sandbox */}
        <div className="space-y-4 text-xs">
          {/* Variants */}
          {variants.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700">1. Color Variant:</span>
              <div className="flex gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id || v.name}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                      selectedVariant?.name === v.name
                        ? 'border-[#14232E] bg-slate-100'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300"
                      style={{ backgroundColor: v.hex || '#14232E' }}
                    />
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Eyeglasses Sandbox */}
          {pType === 'eyeglasses' && (
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700">2. Lens Type Selection:</span>
              <div className="grid grid-cols-3 gap-2">
                {['frame-only', 'single-vision', 'progressive'].map((lt) => (
                  <button
                    key={lt}
                    type="button"
                    onClick={() => setSelectedLensType(lt)}
                    className={`py-2 px-2 text-[11px] font-bold rounded-lg border capitalize ${
                      selectedLensType === lt
                        ? 'border-[#E4232C] bg-rose-50 text-[#E4232C]'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {lt.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact Lens Sandbox */}
          {pType === 'contact-lens' && (
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700">2. Box Quantity Selection:</span>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 4].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBoxes(b)}
                    className={`py-2 px-2 text-[11px] font-bold rounded-lg border ${
                      boxes === b
                        ? 'border-[#E4232C] bg-rose-50 text-[#E4232C]'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {b} Box{b > 1 ? 'es' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sunglasses Sandbox */}
          {pType === 'sunglasses' && (
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700">2. Sunglass Mode:</span>
              <div className="grid grid-cols-2 gap-2">
                {['standard', 'power'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSunglassMode(m)}
                    className={`py-2 px-2 text-[11px] font-bold rounded-lg border capitalize ${
                      sunglassMode === m
                        ? 'border-[#E4232C] bg-rose-50 text-[#E4232C]'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {m === 'standard' ? 'Standard Tint' : 'Prescription Sunglass'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Real-time Calculation Result */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Calculated Unit Price:</span>
              <span className="font-bold text-slate-800">₹{pricing.unitPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-extrabold text-[#14232E] pt-1 border-t border-slate-200">
              <span>Customer Total Amount:</span>
              <span className="text-[#E4232C] font-black text-sm">₹{pricing.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-[#14232E] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
