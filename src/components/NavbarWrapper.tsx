"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname === "/signup"; // adjust as needed

  return !hideNavbar ? <Navbar /> : null;
}
