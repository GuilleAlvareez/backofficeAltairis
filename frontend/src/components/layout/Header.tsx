"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/hotels": "Hoteles",
  "/room-types": "Habitaciones",
  "/availability": "Disponibilidad",
  "/reservations": "Reservas",
};

export default function Header() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Altairis";
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header
      className="h-16 flex items-center justify-between px-6"
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <div>
        <h2 className="text-lg font-semibold" style={{ color: "#1E293B" }}>
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm capitalize" style={{ color: "#64748B" }}>
          {today}
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: "#2563EB" }}
        >
          VA
        </div>
      </div>
    </header>
  );
}
