"use client"

import * as React from "react"

import { Calendars } from "@/components/calendars"
import { DatePicker } from "@/components/date-picker"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react"

// This is sample data.
const data = {
  calendars: [
    {
      name: "Mis Calendarios",
      items: ["Personal", "Trabajo", "Familia"],
    },
    {
      name: "Favoritos",
      items: ["Feriados", "Cumpleanos"],
    },
    {
      name: "Otros",
      items: ["Viajes", "Recordatorios", "Vencimientos"],
    },
  ],
}

export function SidebarRight({
  ...props
}) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <PlusIcon />
              <span>Nuevo Calendario</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
