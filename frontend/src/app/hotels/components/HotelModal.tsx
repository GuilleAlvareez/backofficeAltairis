"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  hotel?: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function HotelModal({ hotel, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    name: hotel?.name ?? "",
    country: hotel?.country ?? "",
    city: hotel?.city ?? "",
    address: hotel?.address ?? "",
    stars: hotel?.stars ?? 5,
    category: hotel?.category ?? "",
    phone: hotel?.phone ?? "",
    email: hotel?.email ?? "",
    active: hotel?.active ?? true,
  });

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="w-full max-w-lg rounded-xl shadow-xl"
        style={{ backgroundColor: "white" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #E2E8F0" }}
        >
          <h3 className="text-base font-semibold" style={{ color: "#1E293B" }}>
            {hotel ? "Editar Hotel" : "Nuevo Hotel"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded"
            style={{ color: "#94A3B8" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Nombre *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                País *
              </label>
              <input
                required
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Ciudad *
              </label>
              <input
                required
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div className="col-span-2">
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Dirección
              </label>
              <input
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Categoría
              </label>
              <input
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Estrellas
              </label>
              <select
                value={form.stars}
                onChange={(e) => set("stars", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <option key={s} value={s}>
                    {s} estrella{s > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Teléfono
              </label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => set("active", e.target.checked)}
              />
              <label
                htmlFor="active"
                className="text-sm"
                style={{ color: "#64748B" }}
              >
                Hotel activo
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ border: "1px solid #E2E8F0", color: "#64748B" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "#2563EB" }}
            >
              {hotel ? "Guardar cambios" : "Crear hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
