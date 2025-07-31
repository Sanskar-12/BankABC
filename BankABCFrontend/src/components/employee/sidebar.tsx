import {
    Building2,
    LayoutDashboard,
    FileText,
    User,
    Banknote,
    CreditCard,
    Settings,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

// Menu items based on Employee Actions APIs
const items = [
    {
        title: "Dashboard",
        url: "/employee",
        icon: LayoutDashboard,
    },
    {
        title: "Loan",
        url: "/employee/loans",
        icon: FileText,
    },
    {
        title: "View Account",
        url: "/employee/view-account",
        icon: User,
    },
    {
        title: "View Account Transactions",
        url: "/employee/view-transactions",
        icon: CreditCard,
    },
];

export default function AppSidebar() {
    const { isMobile } = useSidebar();

    return (
        <Sidebar className="border-r border-blue-200">
            <SidebarHeader className="border-b border-blue-200 bg-blue-50">
                <div className="flex items-center gap-3 px-3 py-4">
                    <div className="bg-blue-600 text-white flex size-10 items-center justify-center rounded-lg shadow-md">
                        <Building2 className="size-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            BankABC
                        </h2>
                        <p className="text-xs text-gray-600">Employee Portal</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-700 font-semibold px-3 py-2">
                        Employee Actions
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-800 data-[active=true]:font-semibold"
                                    >
                                        <a
                                            href={item.url}
                                            className="flex items-center gap-3 px-3 py-2"
                                        >
                                            <item.icon className="size-5" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-blue-200 bg-blue-50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:text-sidebar-accent-foreground"
                        >
                            <div className="px-3 py-4 flex w-full flex-row justify-between items-center">
                                <div className="flex items-center gap-3 w-full">
                                    <div className="bg-blue-600 text-white flex size-8 items-center justify-center rounded-full text-sm font-semibold">
                                        JD
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            John Doe
                                        </p>
                                        <p className="text-xs text-gray-600 truncate">
                                            Employee
                                        </p>
                                    </div>
                                </div>
                                <IconDotsVertical />
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuItem>
                            <IconLogout />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
