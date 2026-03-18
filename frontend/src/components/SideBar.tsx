"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Hotel,
  BedDouble,
  CalendarDays,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hotels", label: "Hoteles", icon: Hotel },
  { href: "/room-types", label: "Habitaciones", icon: BedDouble },
  { href: "/availability", label: "Disponibilidad", icon: CalendarDays },
  { href: "/reservations", label: "Reservas", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{ backgroundColor: "#0F172A" }}
      className="w-64 min-h-screen flex flex-col"
    >
      {/* Logo */}
      <div className="p-6" style={{ borderBottom: "1px solid #1E293B" }}>
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: "#2563EB" }}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
          >
            <Hotel size={16} color="white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Viajes Altairis</h1>
            <p className="text-xs" style={{ color: "#64748B" }}>
              Backoffice Operativo
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150"
              style={{
                backgroundColor: isActive ? "#2563EB" : "transparent",
                color: isActive ? "white" : "#94A3B8",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "#1E293B";
                  (e.currentTarget as HTMLElement).style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                }
              }}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: "1px solid #1E293B" }}>
        <p className="text-xs text-center" style={{ color: "#475569" }}>
          v1.0.0 · 2026
        </p>
      </div>
    </aside>
  );
}
