import React, { useState } from 'react';
import { Plus, Trash2, Shield, Eye, Layers, Package, Sparkles } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const CategoryConfigurationSection = ({
  productType,
  configData = {},
  onChange
}) => {
  // ================= 1. EYEGLASSES CONFIGURATION =================
  if (productType === 'eyeglasses') {
    const lensTypes = configData.lensTypes || ['frame-only', 'single-vision', 'progressive'];
    const availableLenses = configData.availableLenses || [];
    const prescriptionConfig = configData.prescriptionConfig || {
      allowManual: true,
      allowUpload: true,
      requireAddForProgressive: true
    };

    const toggleLensType = (type) => {
      const next = lensTypes.includes(type)
        ? lensTypes.filter((t) => t !== type)
        : [...lensTypes, type];
      onChange({ ...configData, lensTypes: next });
    };

    const [newLensName, setNewLensName] = useState('');
    const [newLensPrice, setNewLensPrice] = useState('499');
    const [newLensIndex, setNewLensIndex] = useState('1.56');
    const [newLensCoating, setNewLensCoating] = useState('Anti-Glare & Scratch Resistant');

    const handleAddLens = () => {
      if (!newLensName.trim()) return;
      const newLens = {
        id: `lens-${Date.now().toString(36)}`,
        name: newLensName.trim(),
        price: Number(newLensPrice) || 0,
        index: newLensIndex,
        coating: newLensCoating,
        description: `${newLensIndex} Index with ${newLensCoating}`,
        applicableTypes: ['single-vision', 'progressive']
      };
      onChange({
        ...configData,
        availableLenses: [...availableLenses, newLens]
      });
      setNewLensName('');
      setNewLensPrice('499');
    };

    const handleRemoveLens = (id) => {
      onChange({
        ...configData,
        availableLenses: availableLenses.filter((l) => l.id !== id)
      });
    };

    return (
      <div className="space-y-6">
        {/* Supported Lens Types */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Available Lens Types
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'frame-only', label: 'Frame Only' },
              { id: 'single-vision', label: 'Single Vision' },
              { id: 'progressive', label: 'Progressive' }
            ].map((lt) => (
              <label
                key={lt.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  lensTypes.includes(lt.id)
                    ? 'border-[#E4232C] bg-rose-50/30 text-[#14232E]'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={lensTypes.includes(lt.id)}
                  onChange={() => toggleLensType(lt.id)}
                  className="rounded-sm accent-[#E4232C]"
                />
                <span>{lt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Optical Lens Packages Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Optical Lens Packages ({availableLenses.length})
            </h3>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Lens Name</th>
                  <th className="p-3">Index</th>
                  <th className="p-3">Coating</th>
                  <th className="p-3 text-right">Price (₹)</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {availableLenses.map((lens) => (
                  <tr key={lens.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-900">{lens.name}</td>
                    <td className="p-3 text-slate-600">{lens.index || '1.56'}</td>
                    <td className="p-3 text-slate-500">{lens.coating}</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      ₹{lens.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveLens(lens.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Add Lens Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 items-end">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                New Lens Package Name
              </label>
              <input
                type="text"
                placeholder="e.g. Crizal Sapphire HR 1.67"
                value={newLensName}
                onChange={(e) => setNewLensName(e.target.value)}
                className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                Extra Price (₹)
              </label>
              <input
                type="number"
                value={newLensPrice}
                onChange={(e) => setNewLensPrice(e.target.value)}
                className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-lg"
              />
            </div>
            <button
              type="button"
              onClick={handleAddLens}
              className="py-2 px-3 bg-[#14232E] hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Add Lens Package
            </button>
          </div>
        </div>

        {/* Prescription Options */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Prescription Support
          </h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prescriptionConfig.allowManual !== false}
                onChange={(e) => onChange({
                  ...configData,
                  prescriptionConfig: { ...prescriptionConfig, allowManual: e.target.checked }
                })}
                className="rounded-sm accent-[#E4232C]"
              />
              <span>Allow Manual Rx Entry</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prescriptionConfig.allowUpload !== false}
                onChange={(e) => onChange({
                  ...configData,
                  prescriptionConfig: { ...prescriptionConfig, allowUpload: e.target.checked }
                })}
                className="rounded-sm accent-[#E4232C]"
              />
              <span>Allow Doctor Rx File Upload</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prescriptionConfig.requireAddForProgressive !== false}
                onChange={(e) => onChange({
                  ...configData,
                  prescriptionConfig: { ...prescriptionConfig, requireAddForProgressive: e.target.checked }
                })}
                className="rounded-sm accent-[#E4232C]"
              />
              <span>Require ADD value for Progressives</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. CONTACT LENS CONFIGURATION =================
  if (productType === 'contact-lens') {
    const powerType = configData.powerType || 'spherical';
    const packSize = configData.packSize || '6 Pieces / Box';
    const piecesPerBox = configData.piecesPerBox || 6;
    const boxPricing = configData.boxPricing || [
      { boxes: 1, price: 1699, label: '1 Box' },
      { boxes: 2, price: 3299, label: '2 Boxes (Save 5%)' },
      { boxes: 4, price: 6299, label: '4 Boxes (Save 10%)' }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Power Type
            </label>
            <select
              value={powerType}
              onChange={(e) => onChange({ ...configData, powerType: e.target.value })}
              className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg"
            >
              <option value="spherical">Spherical / Regular</option>
              <option value="toric">Toric / Astigmatism (CYL + Axis)</option>
              <option value="multifocal">Multifocal (Distance + ADD)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Pack Size Label
            </label>
            <input
              type="text"
              value={packSize}
              onChange={(e) => onChange({ ...configData, packSize: e.target.value })}
              placeholder="e.g. 6 Pieces / Box or 30 Pack"
              className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Pieces Per Box
            </label>
            <input
              type="number"
              value={piecesPerBox}
              onChange={(e) => onChange({ ...configData, piecesPerBox: Number(e.target.value) || 1 })}
              className="w-full text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        {/* Volume Box Pricing Tiers */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Volume Box Pricing Tiers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {boxPricing.map((tier, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-slate-800">{tier.boxes} Box{tier.boxes > 1 ? 'es' : ''}</span>
                <input
                  type="number"
                  value={tier.price}
                  onChange={(e) => {
                    const next = [...boxPricing];
                    next[idx].price = Number(e.target.value) || 0;
                    onChange({ ...configData, boxPricing: next });
                  }}
                  className="w-full text-xs py-1.5 px-2 bg-white border border-slate-300 rounded-lg font-bold"
                />
                <span className="text-[10px] text-slate-400 block">{tier.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Optical Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Base Curve
            </label>
            <input
              type="text"
              value={configData.baseCurve || '8.6 mm'}
              onChange={(e) => onChange({ ...configData, baseCurve: e.target.value })}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Diameter
            </label>
            <input
              type="text"
              value={configData.diameter || '14.2 mm'}
              onChange={(e) => onChange({ ...configData, diameter: e.target.value })}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Water Content
            </label>
            <input
              type="text"
              value={configData.waterContent || '38%'}
              onChange={(e) => onChange({ ...configData, waterContent: e.target.value })}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Disposability
            </label>
            <input
              type="text"
              value={configData.disposability || 'Monthly'}
              onChange={(e) => onChange({ ...configData, disposability: e.target.value })}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      </div>
    );
  }

  // ================= 3. SUNGLASSES CONFIGURATION =================
  if (productType === 'sunglasses') {
    const sunglassMode = configData.sunglassMode || 'both';
    const lensTypes = configData.lensTypes || [
      { id: 'sg-only', name: 'Sunglass Only', price: 0, polarized: false },
      { id: 'sg-polarized', name: 'HD Polarized Tint', price: 999, polarized: true },
      { id: 'sg-photochromic', name: 'Photochromic Day-Night', price: 1699, polarized: false }
    ];

    return (
      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Sunglass Vision Mode Support
          </label>
          <select
            value={sunglassMode}
            onChange={(e) => onChange({ ...configData, sunglassMode: e.target.value })}
            className="w-full max-w-xs text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg"
          >
            <option value="standard">Standard Only (Non-Powered)</option>
            <option value="power">Power Only (Prescription Sunglasses)</option>
            <option value="both">Both (Buyer Chooses Standard vs Powered)</option>
          </select>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Available Sunglass Lens Packages
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {lensTypes.map((lens, idx) => (
              <div key={lens.id} className="p-3 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-800">{lens.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {lens.polarized ? 'Polarized glare reduction' : 'Standard UV400 tint'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    +₹{lens.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
      Simple accessory product. No optical prescription or lens configuration required.
    </div>
  );
};
