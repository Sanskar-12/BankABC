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

export default function Dashboard() {
    const navigate = useNavigate();

    // Mock account information
    const accountInfo = {
        accountName: "John Doe",
        accountNumber: "1234 5678 9012 3456",
        accountType: "Savings",
        branch: "Downtown Branch",
        balance: "$12,345.67",
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
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {accountInfo.balance}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Info Section */}
            <Card className="border-blue-200">
                <CardHeader>
                    <CardTitle className="text-gray-900">Account Info</CardTitle>
                    <CardDescription>
                        Your personal and account details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Account Holder</p>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-900">
                                    {accountInfo.accountName}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Account Number</p>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-900">
                                    {accountInfo.accountNumber}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Account Type</p>
                            <div className="flex items-center gap-2">
                                <Banknote className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-900">
                                    {accountInfo.accountType}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Branch</p>
                            <div className="flex items-center gap-2">
                                <Banknote className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-gray-900">
                                    {accountInfo.branch}
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
                    <CardDescription>Your latest account activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            {
                                description: "Salary Deposit",
                                amount: "+$3,500.00",
                                date: "Today",
                                type: "credit",
                            },
                            {
                                description: "Grocery Store",
                                amount: "-$127.45",
                                date: "Yesterday",
                                type: "debit",
                            },
                            {
                                description: "Electric Bill",
                                amount: "-$89.32",
                                date: "2 days ago",
                                type: "debit",
                            },
                            {
                                description: "ATM Withdrawal",
                                amount: "-$200.00",
                                date: "3 days ago",
                                type: "debit",
                            },
                        ].map((transaction, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {transaction.description}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {transaction.date}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`font-semibold ${
                                            transaction.type === "credit"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {transaction.amount}
                                    </p>
                                    <Badge
                                        variant={
                                            transaction.type === "credit"
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="text-xs"
                                    >
                                        {transaction.type}
                                    </Badge>
                                </div>
                            </div>
                        ))}
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
