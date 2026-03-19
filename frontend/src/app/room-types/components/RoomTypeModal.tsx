"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRoomTypeForm } from "@/hooks/useRoomTypeForm";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

interface Props {
  roomType?: any;
  hotels: any[];
  onSave: (data: any, hotelId: number) => Promise<void>;
  onClose: () => void;
}

export default function RoomTypeModal({
  roomType,
  hotels,
  onSave,
  onClose,
}: Props) {
  const { form, errors, setField, validate } = useRoomTypeForm(roomType);
  const { toast, showToast, hideToast } = useToast();
  const [hotelId, setHotelId] = useState<number>(
    roomType?.hotel?.id ?? hotels[0]?.id ?? 0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await onSave(form, hotelId);
      showToast(
        roomType
          ? "Habitación actualizada correctamente"
          : "Habitación creada correctamente",
        "success",
      );
    } catch {
      showToast("Error al guardar la habitación. Inténtalo de nuevo.", "error");
    }
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
              disabled={!!roomType}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
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
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: `1px solid ${errors.name ? "#EF4444" : "#E2E8F0"}`,
                color: "#1E293B",
              }}
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                {errors.name}
              </p>
            )}
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
              onChange={(e) => setField("description", e.target.value)}
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
                onChange={(e) => setField("capacity", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  border: `1px solid ${errors.capacity ? "#EF4444" : "#E2E8F0"}`,
                  color: "#1E293B",
                }}
              />
              {errors.capacity && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {errors.capacity}
                </p>
              )}
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
                onChange={(e) => setField("pricePerNight", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  border: `1px solid ${errors.pricePerNight ? "#EF4444" : "#E2E8F0"}`,
                  color: "#1E293B",
                }}
              />
              {errors.pricePerNight && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {errors.pricePerNight}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => setField("active", e.target.checked)}
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

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
