import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

import Login from "@/pages/login";
import SignUp from "@/pages/signup";
import Landing from "@/pages/landing";

import CustomerDashboard from "@/pages/customer";
import CreateAccount from "@/pages/customer/create-account";
import ApplyForLoan from "@/pages/customer/apply-for-loan";
import Transactions from "@/pages/customer/transactions";

import EmployeeDashboard from "@/pages/employee";
import Loans from "@/pages/employee/loans";
import ViewTransactions from "@/pages/employee/view-transactions";
import ViewAccount from "@/pages/employee/view-account";

import AdminDashboard from "@/pages/admin";
import EmployeeManagement from "@/pages/admin/manage-employees";
import BranchManagement from "@/pages/admin/manage-branches";

import CustomerLayout from "@/layouts/customer";
import EmployeeLayout from "@/layouts/employee";
import AdminLayout from "@/layouts/admin";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ManageCustomers from "./pages/admin/manage-customer";

// ✅ Protected Route (for authenticated pages)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { getCookie, loading } = useAuth();

    const token = getCookie("auth_token");
    const rawUser = getCookie("user_data");

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (token && rawUser) {
        try {
            const user = JSON.parse(rawUser);
            const role = user?.roles?.[0];

            if (role === "ROLE_ADMIN") {
                return <Navigate to="/admin" replace />;
            } else if (role === "ROLE_EMPLOYEE") {
                return <Navigate to="/employee" replace />;
            } else if (role === "ROLE_USER") {
                return <Navigate to="/customer" replace />;
            } else {
                // Unknown role fallback
                return <Navigate to="/" replace />;
            }
        } catch (error) {
            console.error("Failed to parse user_data cookie:", error);
            return <Navigate to="/login" replace />;
        }
    }

    return children;
};

const AppRoutes = () => {
    const { getCookie } = useAuth();
    const rawUser = getCookie("user_data");

    let user = null;
    try {
        user = JSON.parse(rawUser);
    } catch (error) {
        console.error("Invalid user_data in cookie", error);
    }


    const role = user?.roles?.[0];

    return (
        <Routes>
            <Route index element={<Landing />} />

            {/* Public Routes */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <PublicRoute>
                        <SignUp />
                    </PublicRoute>
                }
            />

            {/* Customer Routes */}
            {role === "ROLE_USER" && (
                <Route
                    path="/customer"
                    element={
                        <ProtectedRoute>
                            <CustomerLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<CustomerDashboard />} />
                    <Route path="create-account" element={<CreateAccount />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="loan" element={<ApplyForLoan />} />
                </Route>
            )}

            {/* Employee Routes */}
            <Route
                path="/employee"
                element={
                    <ProtectedRoute>
                        <EmployeeLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<EmployeeDashboard />} />
                <Route path="loans" element={<Loans />} />
                <Route
                    path="view-transactions"
                    element={<ViewTransactions />}
                />
                <Route path="view-account" element={<ViewAccount />} />
            </Route>

            {/* Admin Routes */}
            {role === "ROLE_ADMIN" && (
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route
                        path="manage-employees"
                        element={<EmployeeManagement />}
                    />
                    <Route
                        path="manage-branches"
                        element={<BranchManagement />}
                    />
                    <Route
                        path="manage-customers"
                        element={<ManageCustomers />}
                    />
                </Route>
            )}
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen">
                    <AppRoutes />
                    <Toaster position="top-right" />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
