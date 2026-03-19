const API = "http://localhost:8080/api";

export async function getAvailabilityByHotel(
  hotelId: number,
  from: string,
  to: string,
) {
  const res = await fetch(
    `${API}/availability/hotel/${hotelId}?from=${from}&to=${to}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Error al cargar disponibilidad");
  return res.json();
}

export async function saveAvailability(data: any, roomTypeId: number) {
  const res = await fetch(`${API}/availability?roomTypeId=${roomTypeId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al guardar disponibilidad");
  return res.json();
}

export async function deleteAvailability(id: number) {
  const res = await fetch(`${API}/availability/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar disponibilidad");
}
