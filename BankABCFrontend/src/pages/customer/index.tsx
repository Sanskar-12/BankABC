import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, User, CreditCard, Banknote } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
    interface Transaction {
        transId: number;
        amount: number;
        transactionType: string;
        timestamp: string;
        description: string;
    }

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [user, setUser] = useState({
        accountHolderName: "",
        accType: "",
        branchName: "",
        status: "",
        balance: 0,
        accId: 0,
    });
    const { getCookie } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataAccount = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:8080/api/user/accounts",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${getCookie("auth_token")}`,
                        },
                    },
                );

                if (!data || data.length === 0) {
                    navigate("/customer/create-account");
                    return;
                }

                setUser(data[0]);
            } catch (error) {
                navigate("/customer/create-account");
            }
        };

        fetchDataAccount();
    }, []);

    useEffect(() => {
        if (user.accId === 0) return;

        const fetchTransactions = async () => {
            const { data } = await axios.get(
                `http://localhost:8080/api/user/accounts/${user.accId}/transactions`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getCookie("auth_token")}`,
                    },
                },
            );

            // Assuming data is an array of transactions sorted by timestamp descending
            const recentTransactions = data.slice(0, 4);
            setTransactions(recentTransactions);
        };

        fetchTransactions();
    }, [user.accId]);

    // Mock account information
    const accountInfo = {
        accountHolderName: user.accountHolderName,
        status: user.status,
        accType: user.accType,
        branchName: user.branchName,
        balance: user.balance,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Welcome back! Here's your account overview.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2">
                <Card className="border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Total Balance
                        </CardTitle>
                        {/* <DollarSign className="h-4 w-4 text-blue-600" /> */}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            ₹{accountInfo.balance}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Info Section */}
            <Card className="border-blue-200">
                <CardHeader>
                    <CardTitle className="text-gray-900">
                        Account Info
                    </CardTitle>
                    <CardDescription>
                        Your personal and account details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                                Account Holder
                            </p>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-900">
                                    {accountInfo.accountHolderName}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                                Account Type
                            </p>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-900">
                                    {accountInfo.accType}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Branch Name</p>
                            <div className="flex items-center gap-2">
                                <Banknote className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-900">
                                    {accountInfo.branchName}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                                Account Status
                            </p>
                            <div className="flex items-center gap-2">
                                <Banknote className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-900">
                                    {accountInfo.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-blue-200">
                <CardHeader>
                    <CardTitle className="text-gray-900">
                        Recent Transactions
                    </CardTitle>
                    <CardDescription>
                        Your latest account activity
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.map((transaction, index) => {
                            const type =
                                transaction.transactionType === "DEPOSIT"
                                    ? "credit"
                                    : "debit";

                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {transaction.description}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {transaction.transactionType}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-semibold ${
                                                type === "credit"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            ₹{transaction.amount}
                                        </p>
                                        <Badge
                                            variant={
                                                type === "credit"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className="text-xs"
                                        >
                                            {type}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4">
                        <Button
                            variant="outline"
                            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                        >
                            View All Transactions
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
function getCookie(arg0: string) {
    throw new Error("Function not implemented.");
}
