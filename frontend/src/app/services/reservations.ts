const API = "http://localhost:8080/api";

export async function getDashboardStats() {
  const res = await fetch(`${API}/reservations/dashboard`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error al cargar stats");
  return res.json();
}

export async function getReservations(page = 0, size = 20, search = "") {
  const res = await fetch(
    `${API}/reservations?page=${page}&size=${size}&search=${search}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Error al cargar reservas");
  return res.json();
}

export async function createReservation(data: any, roomTypeId: number) {
  const res = await fetch(`${API}/reservations?roomTypeId=${roomTypeId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear reserva");
  return res.json();
}

export async function updateReservationStatus(id: number, status: string) {
  const res = await fetch(`${API}/reservations/${id}/status?status=${status}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Error al actualizar estado");
  return res.json();
}

export async function deleteReservation(id: number) {
  const res = await fetch(`${API}/reservations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar reserva");
}
