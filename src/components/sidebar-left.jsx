import * as React from "react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SearchIcon, HomeIcon, InboxIcon, CalendarIcon, Settings2Icon, MessageCircleQuestionIcon, WrenchIcon } from "lucide-react"

const data = {
  teams: [
    {
      name: "Loyola Motors",
      logo: (
        <WrenchIcon />
      ),
      plan: "Panel Admin",
    },
  ],
  navMain: [
    {
      title: "Buscar",
      url: "#",
      icon: (
        <SearchIcon />
      ),
    },
    {
      title: "Panel",
      url: "/panel",
      icon: (
        <HomeIcon />
      ),
      isActive: true,
    },
    {
      title: "Notificaciones",
      url: "#",
      icon: (
        <InboxIcon />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Calendario",
      url: "/panel/citas",
      icon: (
        <CalendarIcon />
      ),
    },
    {
      title: "Configuracion",
      url: "/panel/admin/configuracion",
      icon: (
        <Settings2Icon />
      ),
    },
    {
      title: "Ayuda",
      url: "#",
      icon: (
        <MessageCircleQuestionIcon />
      ),
    },
  ],
  favorites: [
    { name: "Clientes", url: "/panel/clientes", emoji: "👥" },
    { name: "Vehiculos", url: "/panel/vehiculos", emoji: "🚗" },
    { name: "Servicios", url: "/panel/servicios", emoji: "🔧" },
    { name: "Facturas", url: "/panel/facturas", emoji: "🧾" },
    { name: "Repuestos", url: "/panel/repuestos", emoji: "📦" },
    { name: "Citas", url: "/panel/citas", emoji: "📅" },
    { name: "Reportes", url: "/panel/reportes", emoji: "📊" },
    { name: "Usuarios", url: "/panel/usuarios", emoji: "👤" },
  ],
  workspaces: [
    {
      name: "Taller",
      emoji: "🔧",
      pages: [
        { name: "Clientes", url: "/panel/clientes", emoji: "👥" },
        { name: "Vehiculos", url: "/panel/vehiculos", emoji: "🚗" },
        { name: "Servicios", url: "/panel/servicios", emoji: "🔧" },
      ],
    },
    {
      name: "Facturacion",
      emoji: "🧾",
      pages: [
        { name: "Facturas", url: "/panel/facturas", emoji: "🧾" },
        { name: "Repuestos", url: "/panel/repuestos", emoji: "📦" },
        { name: "Reportes", url: "/panel/reportes", emoji: "📊" },
      ],
    },
    {
      name: "Contenido Web",
      emoji: "🌐",
      pages: [
        { name: "Diapositivas", url: "/panel/admin/diapositivas", emoji: "🖼️" },
        { name: "Precios", url: "/panel/admin/precios", emoji: "🏷️" },
        { name: "Servicios Web", url: "/panel/admin/servicios", emoji: "⚙️" },
        { name: "Blog", url: "/panel/admin/blog", emoji: "📝" },
        { name: "Equipo", url: "/panel/admin/equipo", emoji: "👷" },
        { name: "Galeria", url: "/panel/admin/galeria", emoji: "📸" },
        { name: "Testimonios", url: "/panel/admin/testimonios", emoji: "⭐" },
        { name: "Preguntas", url: "/panel/admin/preguntas", emoji: "❓" },
      ],
    },
    {
      name: "Sistema",
      emoji: "⚙️",
      pages: [
        { name: "Usuarios", url: "/panel/usuarios", emoji: "👤" },
        { name: "Configuracion", url: "/panel/admin/configuracion", emoji: "🔧" },
      ],
    },
  ],
}

export function SidebarLeft({
  ...props
}) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
