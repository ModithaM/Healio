import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/common/authProvider";
import {ToastContainer} from "react-toastify";

export const metadata: Metadata = {
  title: "Healio | Smart Healthcare & Telemedicine Platform",
  description: "Book appointments, consult doctors online, and manage patient care seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
      <AuthProvider>{children}</AuthProvider>
      <ToastContainer />
      </body>
    </html>
  );
}
