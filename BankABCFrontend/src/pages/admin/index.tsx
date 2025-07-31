import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeCustomers: 0,
        totalBranches: 0,
        totalEmployees: 0,
    });

    const { getCookie } = useAuth();

   useEffect(() => {
    axios
        .get("http://localhost:8080/api/admin/stats", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("auth_token")}`,
            },
        })
        .then((response) => {
            console.log("Dashboard Stats Response:", response.data); // 👈 LOG HERE
            setStats(response.data);
        })
       .catch((error) => {
    console.error("Failed to fetch dashboard stats", error);
    if (error.response) {
        console.error("Response:", error.response.data);
    } else if (error.request) {
        console.error("Request was made but no response received", error.request);
    } else {
        console.error("Error setting up request", error.message);
    }
});

}, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Admin.</p>
            </div>

            <div className="grid gap-4 grid-cols-2">
                <Card className="border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Total Customers
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.totalCustomers}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Active Customers
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.activeCustomers}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Total Branches
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.totalBranches}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Total Employees
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.totalEmployees}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}




















