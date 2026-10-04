import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
const ProductColorVariant = ({
  colors,
  onChange
}) => {
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#1e293b");
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const newColor = {
      id: `c-${Date.now().toString(36)}`,
      name: newColorName.trim(),
      hex: newColorHex
    };
    onChange([...colors, newColor]);
    setNewColorName("");
    setNewColorHex("#1e293b");
  };
  const handleRemoveColor = (id) => {
    onChange(colors.filter((c) => c.id !== id));
  };
  return <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        {colors.length === 0 ? <p className="text-xs text-slate-400 italic">No color variants added yet.</p> : colors.map((color) => <div
    key={color.id}
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs shadow-2xs"
  >
              <span
    className="w-4 h-4 rounded-full border border-slate-300 shadow-inner shrink-0"
    style={{ backgroundColor: color.hex }}
  />
              <span className="font-semibold text-slate-800">{color.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">{color.hex}</span>
              <button
    type="button"
    onClick={() => handleRemoveColor(color.id)}
    className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
    aria-label={`Remove ${color.name}`}
  >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>)}
      </div>

      {
    /* Add Color inputs */
  }
      <div className="flex flex-col sm:flex-row items-end gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex-1 w-full">
          <Input
    label="Color Name"
    placeholder="e.g. Matte Tortoiseshell, Gold"
    value={newColorName}
    onChange={(e) => setNewColorName(e.target.value)}
  />
        </div>

        <div className="w-full sm:w-28">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Color Hex
          </label>
          <div className="flex items-center gap-2 h-9 px-2 bg-white rounded-lg border border-slate-300">
            <input
    type="color"
    value={newColorHex}
    onChange={(e) => setNewColorHex(e.target.value)}
    className="w-6 h-6 rounded border-0 p-0 cursor-pointer bg-transparent"
  />
            <span className="text-xs font-mono text-slate-600">{newColorHex}</span>
          </div>
        </div>

        <Button
    type="button"
    variant="outline"
    size="md"
    onClick={handleAddColor}
    disabled={!newColorName.trim()}
    icon={<Plus className="w-4 h-4" />}
    className="w-full sm:w-auto shrink-0"
  >
          Add Color
        </Button>
      </div>
    </div>;
};
export {
  ProductColorVariant
};
