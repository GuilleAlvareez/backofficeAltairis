import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/SideBar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Altairis Backoffice",
  description: "Backoffice operativo de Viajes Altairis",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Header />
            <main
              style={{ flex: 1, padding: "24px", backgroundColor: "#F8F9FC" }}
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
