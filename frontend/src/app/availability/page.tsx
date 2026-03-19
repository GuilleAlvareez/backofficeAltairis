"use client";

import { useEffect, useState } from "react";
import {
  getAvailabilityByHotel,
  saveAvailability,
} from "../../services/availability";
import { getAllHotels } from "../../services/hotels";
import { getRoomTypes } from "../../services/roomTypes";
import { Plus, Calendar } from "lucide-react";
import AvailabilityModal from "./components/AvailabilityModal";

export default function AvailabilityPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const in30 = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(in30);

  useEffect(() => {
    getAllHotels().then((h) => {
      setHotels(h);
      if (h.length > 0) setSelectedHotel(h[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedHotel) return;
    getRoomTypes(selectedHotel).then(setRoomTypes);
    load();
  }, [selectedHotel, from, to]);

  const load = async () => {
    if (!selectedHotel) return;
    setLoading(true);
    try {
      const data = await getAvailabilityByHotel(selectedHotel, from, to);
      setAvailabilities(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any, roomTypeId: number) => {
    await saveAvailability(data, roomTypeId);
    setModalOpen(false);
    load();
  };

  // Agrupar por tipo de habitación
  const grouped = roomTypes.map((rt) => ({
    roomType: rt,
    availabilities: availabilities
      .filter((a) => a.roomType?.id === rt.id)
      .sort((a, b) => a.date.localeCompare(b.date)),
  }));

  const getOccupancyColor = (available: number, total: number) => {
    const pct = available / total;
    if (pct === 0) return { bg: "#FEF2F2", color: "#EF4444" };
    if (pct < 0.3) return { bg: "#FFF7ED", color: "#F97316" };
    if (pct < 0.7) return { bg: "#FFFBEB", color: "#F59E0B" };
    return { bg: "#ECFDF5", color: "#10B981" };
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(Number(e.target.value))}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              color: "#1E293B",
            }}
          >
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Calendar size={16} style={{ color: "#94A3B8" }} />
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                color: "#1E293B",
              }}
            />
            <span className="text-sm" style={{ color: "#94A3B8" }}>
              →
            </span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "white",
                border: "1px solid #E2E8F0",
                color: "#1E293B",
              }}
            />
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#2563EB" }}
        >
          <Plus size={16} />
          Añadir Disponibilidad
        </button>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-4">
        {[
          { label: "Completo", bg: "#FEF2F2", color: "#EF4444" },
          { label: "Bajo", bg: "#FFF7ED", color: "#F97316" },
          { label: "Medio", bg: "#FFFBEB", color: "#F59E0B" },
          { label: "Disponible", bg: "#ECFDF5", color: "#10B981" },
        ].map(({ label, bg, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: bg, border: `1px solid ${color}` }}
            />
            <span className="text-xs" style={{ color: "#64748B" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Tabla por tipo de habitación */}
      {loading ? (
        <div className="text-center py-12 text-sm" style={{ color: "#94A3B8" }}>
          Cargando disponibilidad...
        </div>
      ) : (
        grouped.map(({ roomType, availabilities: avs }) => (
          <div
            key={roomType.id}
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
          >
            {/* Header tipo habitación */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{
                backgroundColor: "#F8FAFC",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#1E293B" }}
                >
                  {roomType.name}
                </span>
                {roomType.pricePerNight && (
                  <span className="ml-2 text-xs" style={{ color: "#64748B" }}>
                    {Number(roomType.pricePerNight).toLocaleString("es-ES")}{" "}
                    €/noche
                  </span>
                )}
              </div>
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                {avs.length} registros
              </span>
            </div>

            {avs.length === 0 ? (
              <div
                className="px-4 py-6 text-center text-sm"
                style={{ color: "#94A3B8" }}
              >
                Sin disponibilidad registrada en este período
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      {[
                        "Fecha",
                        "Total",
                        "Disponibles",
                        "Ocupadas",
                        "Ocupación",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2 text-xs font-medium"
                          style={{ color: "#94A3B8" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {avs.map((av) => {
                      const booked = av.totalRooms - av.availableRooms;
                      const pct = Math.round((booked / av.totalRooms) * 100);
                      const { bg, color } = getOccupancyColor(
                        av.availableRooms,
                        av.totalRooms,
                      );
                      return (
                        <tr
                          key={av.id}
                          style={{ borderBottom: "1px solid #F8FAFC" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#F8FAFC")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <td
                            className="px-4 py-2 text-sm"
                            style={{ color: "#1E293B" }}
                          >
                            {new Date(av.date).toLocaleDateString("es-ES", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </td>
                          <td
                            className="px-4 py-2 text-sm"
                            style={{ color: "#64748B" }}
                          >
                            {av.totalRooms}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className="text-sm font-medium"
                              style={{ color }}
                            >
                              {av.availableRooms}
                            </span>
                          </td>
                          <td
                            className="px-4 py-2 text-sm"
                            style={{ color: "#64748B" }}
                          >
                            {booked}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-24 h-2 rounded-full"
                                style={{ backgroundColor: "#F1F5F9" }}
                              >
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: color,
                                  }}
                                />
                              </div>
                              <span
                                className="text-xs font-medium px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: bg, color }}
                              >
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}

      {modalOpen && (
        <AvailabilityModal
          hotels={hotels}
          roomTypes={roomTypes}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
