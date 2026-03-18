"use client";

import { useEffect, useState } from "react";
import {
  createHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
} from "../services/hotels";
import { Plus, Search, Pencil, Trash2, Star } from "lucide-react";
import HotelModal from "./components/HotelModal";

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllHotels();
      setHotels(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()) ||
      h.country.toLowerCase().includes(search.toLowerCase()) ||
      h.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async (data: any) => {
    if (editing) {
      await updateHotel(editing.id, data);
    } else {
      await createHotel(data);
    }
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este hotel?")) return;
    await deleteHotel(id);
    load();
  };

  const handleEdit = (hotel: any) => {
    setEditing(hotel);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{
            backgroundColor: "white",
            border: "1px solid #E2E8F0",
            width: "320px",
          }}
        >
          <Search size={16} style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Buscar por nombre, ciudad o país..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "#1E293B" }}
          />
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#2563EB" }}
        >
          <Plus size={16} />
          Nuevo Hotel
        </button>
      </div>

      {/* Tabla */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
      >
        <table className="w-full">
          <thead>
            <tr
              style={{
                backgroundColor: "#F8FAFC",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              {[
                "Hotel",
                "Ciudad",
                "País",
                "Categoría",
                "Estrellas",
                "Estado",
                "Acciones",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "#64748B" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-sm"
                  style={{ color: "#94A3B8" }}
                >
                  Cargando hoteles...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-sm"
                  style={{ color: "#94A3B8" }}
                >
                  No se encontraron hoteles
                </td>
              </tr>
            ) : (
              filtered.map((hotel) => (
                <tr
                  key={hotel.id}
                  style={{ borderBottom: "1px solid #F1F5F9" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#F8FAFC")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#1E293B" }}
                    >
                      {hotel.name}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "#64748B" }}
                  >
                    {hotel.city}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "#64748B" }}
                  >
                    {hotel.country}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "#64748B" }}
                  >
                    {hotel.category ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: hotel.stars ?? 0 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill="#F59E0B"
                          style={{ color: "#F59E0B" }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: hotel.active ? "#ECFDF5" : "#FEF2F2",
                        color: hotel.active ? "#10B981" : "#EF4444",
                      }}
                    >
                      {hotel.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(hotel)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#64748B" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#F1F5F9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#EF4444" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#FEF2F2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid #E2E8F0" }}
          >
            <span className="text-xs" style={{ color: "#64748B" }}>
              Página {page + 1} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: page === 0 ? "#F1F5F9" : "white",
                  border: "1px solid #E2E8F0",
                  color: page === 0 ? "#94A3B8" : "#1E293B",
                }}
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-3 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor:
                    page === totalPages - 1 ? "#F1F5F9" : "white",
                  border: "1px solid #E2E8F0",
                  color: page === totalPages - 1 ? "#94A3B8" : "#1E293B",
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <HotelModal
          hotel={editing}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
