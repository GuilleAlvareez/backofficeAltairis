"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "./services/reservations";
import {
  Hotel,
  BookOpen,
  LogIn,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#2563EB", "#F59E0B", "#10B981", "#EF4444"];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm" style={{ color: "#64748B" }}>
          Cargando dashboard...
        </div>
      </div>
    );

  const pieData = [
    { name: "Confirmadas", value: stats.confirmed },
    { name: "Pendientes", value: stats.pending },
    { name: "Completadas", value: stats.completed },
    { name: "Canceladas", value: stats.cancelled },
  ];

  const barData = [
    { name: "Confirmadas", value: stats.confirmed, fill: "#2563EB" },
    { name: "Pendientes", value: stats.pending, fill: "#F59E0B" },
    { name: "Completadas", value: stats.completed, fill: "#10B981" },
    { name: "Canceladas", value: stats.cancelled, fill: "#EF4444" },
  ];

  const metricCards = [
    {
      label: "Total Reservas",
      value: stats.totalReservations,
      icon: BookOpen,
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      label: "Confirmadas",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "#10B981",
      bg: "#ECFDF5",
    },
    {
      label: "Check-ins Hoy",
      value: stats.checkInsToday,
      icon: LogIn,
      color: "#F59E0B",
      bg: "#FFFBEB",
    },
    {
      label: "Check-outs Hoy",
      value: stats.checkOutsToday,
      icon: LogOut,
      color: "#8B5CF6",
      bg: "#F5F3FF",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tarjetas métricas */}
      <div className="grid grid-cols-4 gap-4">
        {metricCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl p-5"
            style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-sm font-medium"
                style={{ color: "#64748B" }}
              >
                {label}
              </span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: bg }}
              >
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: "#1E293B" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-4">
        {/* Pie chart */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "#1E293B" }}
          >
            Reservas por Estado
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {/* Leyenda */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                />
                <span className="text-xs" style={{ color: "#64748B" }}>
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "#1E293B" }}
          >
            Distribución de Reservas
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Info operativa */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "#1E293B" }}>
          Resumen Operativo
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div
            className="text-center p-4 rounded-lg"
            style={{ backgroundColor: "#F8FAFC" }}
          >
            <TrendingUp
              size={24}
              style={{ color: "#2563EB", margin: "0 auto 8px" }}
            />
            <p className="text-2xl font-bold" style={{ color: "#1E293B" }}>
              {stats.totalReservations}
            </p>
            <p className="text-xs mt-1" style={{ color: "#64748B" }}>
              Total reservas históricas
            </p>
          </div>
          <div
            className="text-center p-4 rounded-lg"
            style={{ backgroundColor: "#F8FAFC" }}
          >
            <Clock
              size={24}
              style={{ color: "#F59E0B", margin: "0 auto 8px" }}
            />
            <p className="text-2xl font-bold" style={{ color: "#1E293B" }}>
              {stats.pending}
            </p>
            <p className="text-xs mt-1" style={{ color: "#64748B" }}>
              Pendientes de confirmar
            </p>
          </div>
          <div
            className="text-center p-4 rounded-lg"
            style={{ backgroundColor: "#F8FAFC" }}
          >
            <XCircle
              size={24}
              style={{ color: "#EF4444", margin: "0 auto 8px" }}
            />
            <p className="text-2xl font-bold" style={{ color: "#1E293B" }}>
              {stats.cancelled}
            </p>
            <p className="text-xs mt-1" style={{ color: "#64748B" }}>
              Canceladas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
