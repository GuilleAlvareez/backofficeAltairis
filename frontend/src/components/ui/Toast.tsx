"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
      style={{
        backgroundColor: type === "success" ? "#ECFDF5" : "#FEF2F2",
        border: `1px solid ${type === "success" ? "#10B981" : "#EF4444"}`,
        minWidth: "300px",
        maxWidth: "400px",
      }}
    >
      {type === "success" ? (
        <CheckCircle size={18} style={{ color: "#10B981", flexShrink: 0 }} />
      ) : (
        <XCircle size={18} style={{ color: "#EF4444", flexShrink: 0 }} />
      )}
      <span
        className="text-sm flex-1"
        style={{ color: type === "success" ? "#065F46" : "#991B1B" }}
      >
        {message}
      </span>
      <button onClick={onClose} style={{ color: "#94A3B8", flexShrink: 0 }}>
        <X size={14} />
      </button>
    </div>
  );
}
