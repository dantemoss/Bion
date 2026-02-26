"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Link as LinkIcon,
  BarChart3,
  Palette,
} from "lucide-react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";

/** Contenido interno: debe estar dentro de Sidebar para usar useSidebar */
function AdminSidebarContent() {
  const pathname = usePathname();
  const { open, animate } = useSidebar();

  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Links",
      href: "/admin/links",
      icon: (
        <LinkIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 opacity-50" />
      ),
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: (
        <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 opacity-50" />
      ),
    },
    {
      label: "Temas",
      href: "/admin/themes",
      icon: (
        <Palette className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 opacity-50" />
      ),
    },
    {
      label: "Configuración",
      href: "/admin/settings",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Logo: mismo padding que los links para alineación */}
      <div className="flex items-center gap-3 px-2 mb-5 flex-shrink-0 overflow-hidden">
        <img
          src="/logo-bion.svg"
          alt="Bion"
          className="h-12 w-12 object-contain flex-shrink-0 sm:h-14 sm:w-14"
        />
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="font-bold text-lg tracking-tight text-white whitespace-nowrap"
        >
          Bion
        </motion.span>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {links.map((link, idx) => (
          <SidebarLink
            key={idx}
            link={link}
            className={cn(
              "hover:bg-zinc-800/50 rounded-md px-2",
              pathname === link.href && "bg-zinc-800"
            )}
          />
        ))}
      </nav>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <Sidebar animate={true}>
      <SidebarBody className="h-full flex flex-col bg-zinc-950 border-r border-zinc-800">
        <AdminSidebarContent />
      </SidebarBody>
    </Sidebar>
  );
}
