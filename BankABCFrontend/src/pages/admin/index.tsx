import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, User, CreditCard, Banknote } from "lucide-react";

export default function Dashboard() {
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
                <p className="text-gray-600 mt-1">Welcome back! Admin.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2">
                <Card className="border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Total Users
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {accountInfo.balance}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Total Active Users
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {accountInfo.balance}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Total Customers
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {accountInfo.balance}
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
                            {accountInfo.balance}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            {/* <Card className="border-blue-200">
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
            </Card> */}
        </div>
    );
}
