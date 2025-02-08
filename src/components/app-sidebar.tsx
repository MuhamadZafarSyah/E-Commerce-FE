import { Home, Package2, User, Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Zafar",
      logo: User,
      plan: "Admin",
    },
  ],
  navMain: [
    {
      title: "Products",
      url: "#",
      icon: Package2,
      isActive: true,
      items: [
        {
          title: "List Products",
          url: "/dashboard/product",
        },
        {
          title: "Edit Product",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Users,
      items: [
        {
          title: "List Users",
          url: "/dashboard/users",
        },

      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
