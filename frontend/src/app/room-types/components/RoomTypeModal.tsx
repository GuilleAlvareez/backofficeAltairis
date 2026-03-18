"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  roomType?: any;
  hotels: any[];
  onSave: (data: any, hotelId: number) => void;
  onClose: () => void;
}

export default function RoomTypeModal({
  roomType,
  hotels,
  onSave,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    name: roomType?.name ?? "",
    description: roomType?.description ?? "",
    capacity: roomType?.capacity ?? 2,
    pricePerNight: roomType?.pricePerNight ?? "",
    active: roomType?.active ?? true,
  });
  const [hotelId, setHotelId] = useState<number>(
    roomType?.hotel?.id ?? hotels[0]?.id ?? 0,
  );

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form, hotelId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-xl"
        style={{ backgroundColor: "white" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #E2E8F0" }}
        >
          <h3 className="text-base font-semibold" style={{ color: "#1E293B" }}>
            {roomType ? "Editar Habitación" : "Nueva Habitación"}
          </h3>
          <button onClick={onClose} style={{ color: "#94A3B8" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#64748B" }}
            >
              Hotel *
            </label>
            <select
              value={hotelId}
              onChange={(e) => setHotelId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              disabled={!!roomType}
            >
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
          <div>
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
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Capacidad
              </label>
              <input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => set("capacity", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Precio/noche (€)
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.pricePerNight}
                onChange={(e) => set("pricePerNight", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
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
              Habitación activa
            </label>
          </div>

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
              {roomType ? "Guardar cambios" : "Crear habitación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
