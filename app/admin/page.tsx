import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Admin",
  description: "Control panel — theme, content and leads.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
