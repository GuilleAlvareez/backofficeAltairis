"use client";

import { useEffect, useState } from "react";
import {
  getReservations,
  updateReservationStatus,
  deleteReservation,
} from "../../services/reservations";
import { getAllHotels } from "../../services/hotels";
import { Plus, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import ReservationModal from "./components/ReservationModal";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmada",
  PENDING: "Pendiente",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  CONFIRMED: { bg: "#EFF6FF", color: "#2563EB" },
  PENDING: { bg: "#FFFBEB", color: "#F59E0B" },
  COMPLETED: { bg: "#ECFDF5", color: "#10B981" },
  CANCELLED: { bg: "#FEF2F2", color: "#EF4444" },
};

const ITEMS_PER_PAGE = 10;

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getReservations(0, 100);
      setReservations(data.content);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    getAllHotels().then(setHotels);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [search, filterStatus]);

  const filtered = reservations.filter((r) => {
    const matchSearch =
      search === "" ||
      r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.guestEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.reservationCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  const handleStatusChange = async (id: number, status: string) => {
    await updateReservationStatus(id, status);
    // Actualiza solo esa reserva en el estado local, sin recargar
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta reserva?")) return;
    try {
      await deleteReservation(id);
      showToast("Reserva eliminada correctamente", "success");
      load();
    } catch {
      showToast("Error al eliminar la reserva", "error");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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
              placeholder="Buscar por huésped, email o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: "#1E293B" }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              color: "#1E293B",
            }}
          >
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#2563EB" }}
        >
          <Plus size={16} />
          Nueva Reserva
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
                "Código",
                "Huésped",
                "Hotel / Habitación",
                "Check-in",
                "Check-out",
                "Total",
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
                  colSpan={8}
                  className="text-center py-12 text-sm"
                  style={{ color: "#94A3B8" }}
                >
                  Cargando reservas...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-12 text-sm"
                  style={{ color: "#94A3B8" }}
                >
                  No se encontraron reservas
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr
                  key={r.id}
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
                      className="text-xs font-mono font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: "#F1F5F9", color: "#475569" }}
                    >
                      {r.reservationCode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#1E293B" }}
                    >
                      {r.guestName}
                    </p>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>
                      {r.guestEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm" style={{ color: "#1E293B" }}>
                      {r.roomType?.hotel?.name ?? "—"}
                    </p>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>
                      {r.roomType?.name ?? "—"}
                    </p>
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "#64748B" }}
                  >
                    {new Date(r.checkIn).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "#64748B" }}
                  >
                    {new Date(r.checkOut).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#1E293B" }}
                    >
                      {r.totalPrice
                        ? `${Number(r.totalPrice).toLocaleString("es-ES")} €`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                      className="px-2 py-1 rounded-full text-xs font-medium outline-none cursor-pointer"
                      style={{
                        backgroundColor: STATUS_STYLES[r.status]?.bg,
                        color: STATUS_STYLES[r.status]?.color,
                        border: "none",
                      }}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg"
                      style={{ color: "#EF4444" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FEF2F2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <Trash2 size={14} />
                    </button>
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
            {filtered.length} reservas en total
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
        <ReservationModal
          hotels={hotels}
          onSave={() => {
            setModalOpen(false);
            load();
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
