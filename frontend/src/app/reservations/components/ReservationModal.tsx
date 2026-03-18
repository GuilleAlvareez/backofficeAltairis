"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getRoomTypes } from "../../services/roomTypes";
import { createReservation } from "../../services/reservations";

interface Props {
  hotels: any[];
  onSave: () => void;
  onClose: () => void;
}

export default function ReservationModal({ hotels, onSave, onClose }: Props) {
  const [hotelId, setHotelId] = useState<number>(hotels[0]?.id ?? 0);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [roomTypeId, setRoomTypeId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    checkIn: "",
    checkOut: "",
    numberOfRooms: 1,
    notes: "",
    status: "CONFIRMED",
  });

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleHotelChange = async (id: number) => {
    setHotelId(id);
    const rts = await getRoomTypes(id);
    setRoomTypes(rts);
    setRoomTypeId(rts[0]?.id ?? 0);
  };

  useState(() => {
    if (hotels[0]) handleHotelChange(hotels[0].id);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReservation(form, roomTypeId);
      onSave();
    } finally {
      setLoading(false);
    }
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
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #E2E8F0" }}
        >
          <h3 className="text-base font-semibold" style={{ color: "#1E293B" }}>
            Nueva Reserva
          </h3>
          <button onClick={onClose} style={{ color: "#94A3B8" }}>
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Hotel y habitación */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Hotel *
              </label>
              <select
                value={hotelId}
                onChange={(e) => handleHotelChange(Number(e.target.value))}
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
                Habitación *
              </label>
              <select
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              >
                {roomTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Huésped */}
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#64748B" }}
            >
              Nombre huésped *
            </label>
            <input
              required
              value={form.guestName}
              onChange={(e) => set("guestName", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Email *
              </label>
              <input
                required
                type="email"
                value={form.guestEmail}
                onChange={(e) => set("guestEmail", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Teléfono
              </label>
              <input
                value={form.guestPhone}
                onChange={(e) => set("guestPhone", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Check-in *
              </label>
              <input
                required
                type="date"
                value={form.checkIn}
                onChange={(e) => set("checkIn", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Check-out *
              </label>
              <input
                required
                type="date"
                value={form.checkOut}
                onChange={(e) => set("checkOut", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
          </div>

          {/* Nº habitaciones y estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Nº habitaciones
              </label>
              <input
                type="number"
                min={1}
                value={form.numberOfRooms}
                onChange={(e) => set("numberOfRooms", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Estado
              </label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              >
                <option value="CONFIRMED">Confirmada</option>
                <option value="PENDING">Pendiente</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#64748B" }}
            >
              Notas
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
            />
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
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: loading ? "#93C5FD" : "#2563EB" }}
            >
              {loading ? "Guardando..." : "Crear reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
