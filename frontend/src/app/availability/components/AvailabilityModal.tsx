"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getRoomTypes } from "../../../services/roomTypes";

interface Props {
  hotels: any[];
  roomTypes: any[];
  onSave: (data: any, roomTypeId: number) => void;
  onClose: () => void;
}

export default function AvailabilityModal({
  hotels,
  roomTypes: initialRoomTypes,
  onSave,
  onClose,
}: Props) {
  const [hotelId, setHotelId] = useState<number>(hotels[0]?.id ?? 0);
  const [rts, setRts] = useState(initialRoomTypes);
  const [roomTypeId, setRoomTypeId] = useState<number>(
    initialRoomTypes[0]?.id ?? 0,
  );
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    totalRooms: 10,
    availableRooms: 10,
  });

  const handleHotelChange = async (id: number) => {
    setHotelId(id);
    const data = await getRoomTypes(id);
    setRts(data);
    setRoomTypeId(data[0]?.id ?? 0);
  };

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form, roomTypeId);
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
            Añadir Disponibilidad
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
              Hotel
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
              Tipo de Habitación
            </label>
            <select
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
            >
              {rts.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#64748B" }}
            >
              Fecha
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
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
                Total habitaciones
              </label>
              <input
                type="number"
                min={1}
                value={form.totalRooms}
                onChange={(e) => set("totalRooms", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Disponibles
              </label>
              <input
                type="number"
                min={0}
                max={form.totalRooms}
                value={form.availableRooms}
                onChange={(e) => set("availableRooms", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#1E293B" }}
              />
            </div>
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
