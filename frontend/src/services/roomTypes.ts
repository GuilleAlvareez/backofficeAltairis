const API = "http://localhost:8080/api";

export async function getRoomTypes(hotelId?: number) {
  const url = hotelId
    ? `${API}/room-types?hotelId=${hotelId}`
    : `${API}/room-types`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al cargar habitaciones");
  return res.json();
}

export async function createRoomType(data: any, hotelId: number) {
  const res = await fetch(`${API}/room-types?hotelId=${hotelId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear habitación");
  return res.json();
}

export async function updateRoomType(id: number, data: any) {
  const res = await fetch(`${API}/room-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar habitación");
  return res.json();
}

export async function deleteRoomType(id: number) {
  const res = await fetch(`${API}/room-types/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar habitación");
}
