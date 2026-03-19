"use client";

import { X } from "lucide-react";
import { useHotelForm } from "@/hooks/useHotelForm";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

interface Props {
  hotel?: any;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function HotelModal({ hotel, onSave, onClose }: Props) {
  const { form, errors, setField, validate } = useHotelForm(hotel);
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await onSave(form);
      showToast(
        hotel
          ? "Hotel actualizado correctamente"
          : "Hotel creado correctamente",
        "success",
      );
    } catch {
      showToast("Error al guardar el hotel. Inténtalo de nuevo.", "error");
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
            {hotel ? "Editar Hotel" : "Nuevo Hotel"}
          </h3>
          <button onClick={onClose} style={{ color: "#94A3B8" }}>
            <X size={18} />
          </button>
        </div>

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
                País *
              </label>
              <input
                value={form.country}
                onChange={(e) => setField("country", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  border: `1px solid ${errors.country ? "#EF4444" : "#E2E8F0"}`,
                  color: "#1E293B",
                }}
              />
              {errors.country && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {errors.country}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#64748B" }}
              >
                Ciudad *
              </label>
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  border: `1px solid ${errors.city ? "#EF4444" : "#E2E8F0"}`,
                  color: "#1E293B",
                }}
              />
              {errors.city && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {errors.city}
                </p>
              )}
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
                onChange={(e) => setField("address", e.target.value)}
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
                onChange={(e) => setField("category", e.target.value)}
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
                onChange={(e) => setField("stars", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  border: `1px solid ${errors.stars ? "#EF4444" : "#E2E8F0"}`,
                  color: "#1E293B",
                }}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <option key={s} value={s}>
                    {s} estrella{s > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              {errors.stars && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {errors.stars}
                </p>
              )}
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
                onChange={(e) => setField("phone", e.target.value)}
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
                onChange={(e) => setField("email", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  border: `1px solid ${errors.email ? "#EF4444" : "#E2E8F0"}`,
                  color: "#1E293B",
                }}
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="col-span-2 flex items-center gap-2">
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
                Hotel activo
              </label>
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
              {hotel ? "Guardar cambios" : "Crear hotel"}
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
