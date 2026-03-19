const API = "http://localhost:8080/api";

export async function getHotels(page = 0, size = 20, search = "") {
  const res = await fetch(
    `${API}/hotels?page=${page}&size=${size}&search=${search}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Error al cargar hoteles");
  return res.json();
}

export async function getAllHotels() {
  const res = await fetch(`${API}/hotels/all`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al cargar hoteles");
  return res.json();
}

export async function createHotel(data: any) {
  const res = await fetch(`${API}/hotels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear hotel");
  return res.json();
}

export async function updateHotel(id: number, data: any) {
  const res = await fetch(`${API}/hotels/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar hotel");
  return res.json();
}

export async function deleteHotel(id: number) {
  const res = await fetch(`${API}/hotels/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar hotel");
}
