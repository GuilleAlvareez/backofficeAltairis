"use client";

import { useEffect, useState } from "react";
import {
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "@/services/roomTypes";
import { getAllHotels } from "@/services/hotels";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import RoomTypeModal from "./components/RoomTypeModal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

const ITEMS_PER_PAGE = 10;

export default function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterHotel, setFilterHotel] = useState("");
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast, showToast, hideToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [rt, h] = await Promise.all([
        getRoomTypes(filterHotel ? Number(filterHotel) : undefined),
        getAllHotels(),
      ]);
      setRoomTypes(rt);
      setHotels(h);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterHotel]);
  useEffect(() => {
    setPage(0);
  }, [search, filterHotel]);

  const filtered = roomTypes.filter(
    (rt) =>
      rt.name.toLowerCase().includes(search.toLowerCase()) ||
      rt.hotel?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  const handleSave = async (data: any, hotelId: number) => {
    try {
      if (editing) {
        await updateRoomType(editing.id, data);
      } else {
        await createRoomType(data, hotelId);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch {
      showToast("Error al guardar la habitación", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este tipo de habitación?"))
      return;
    try {
      await deleteRoomType(id);
      showToast("Habitación eliminada correctamente", "success");
      load();
    } catch {
      showToast("Error al eliminar la habitación", "error");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              width: "280px",
            }}
          >
            <Search size={16} style={{ color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Buscar habitación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: "#1E293B" }}
            />
          </div>
          <select
            value={filterHotel}
            onChange={(e) => setFilterHotel(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              color: "#1E293B",
            }}
          >
            <option value="">Todos los hoteles</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
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
          Nueva Habitación
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
                "Habitación",
                "Hotel",
                "Capacidad",
                "Precio/noche",
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
                  colSpan={6}
                  className="text-center py-12 text-sm"
                  style={{ color: "#94A3B8" }}
                >
                  Cargando habitaciones...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-sm"
                  style={{ color: "#94A3B8" }}
                >
                  No se encontraron habitaciones
                </td>
              </tr>
            ) : (
              paginated.map((rt) => (
                <tr
                  key={rt.id}
                  style={{ borderBottom: "1px solid #F1F5F9" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#F8FAFC")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td className="px-4 py-3">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#1E293B" }}
                    >
                      {rt.name}
                    </p>
                    {rt.description && (
                      <p
                        className="text-xs mt-0.5 truncate max-w-xs"
                        style={{ color: "#94A3B8" }}
                      >
                        {rt.description}
                      </p>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "#64748B" }}
                  >
                    {rt.hotel?.name ?? "—"}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "#64748B" }}
                  >
                    {rt.capacity ? `${rt.capacity} personas` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#1E293B" }}
                    >
                      {rt.pricePerNight
                        ? `${Number(rt.pricePerNight).toLocaleString("es-ES")} €`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: rt.active ? "#ECFDF5" : "#FEF2F2",
                        color: rt.active ? "#10B981" : "#EF4444",
                      }}
                    >
                      {rt.active ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditing(rt);
                          setModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg"
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
                        onClick={() => handleDelete(rt.id)}
                        className="p-1.5 rounded-lg"
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
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: "1px solid #E2E8F0" }}
        >
          <span className="text-xs" style={{ color: "#64748B" }}>
            {filtered.length} habitaciones en total
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg"
              style={{
                color: page === 0 ? "#CBD5E1" : "#64748B",
                border: "1px solid #E2E8F0",
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs" style={{ color: "#64748B" }}>
              {page + 1} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg"
              style={{
                color: page >= totalPages - 1 ? "#CBD5E1" : "#64748B",
                border: "1px solid #E2E8F0",
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <RoomTypeModal
          roomType={editing}
          hotels={hotels}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
