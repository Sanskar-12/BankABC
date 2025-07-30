import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "@/components/customer/sidebar";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout() {
    const location = useLocation();
    let segments = location.pathname
        .split("/")
        .filter((segment) => segment !== "");

    if (segments.length > 0) {
        segments = segments.slice(1);
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-blue-200 bg-white px-4">
                    <SidebarTrigger className="text-blue-700 hover:bg-blue-50" />
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>BankABC</span>
                        {/* <span>/</span> */}
                        {/* it should change according to the router / dashboard/create-account etc */}
                        {segments.map((segment, index) => (
                            <span
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <span>/</span>
                                <span
                                    className={
                                        index === segments.length - 1
                                            ? "font-medium text-gray-900"
                                            : ""
                                    }
                                >
                                    {segment
                                        .replace(/-/g, " ") // Replace dashes with spaces
                                        .replace(/\b\w/g, (c) =>
                                            c.toUpperCase(),
                                        )}
                                </span>
                            </span>
                        ))}
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />{" "}
                        {/* This is where nested pages will render */}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
