"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as z from "zod";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import { Loader2, Search } from "lucide-react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const accountIdSchema = z.object({
    accountId: z
        .string()
        .min(1, "Account ID is required")
        .regex(/^\d+$/, "Account ID must be a number"),
});

type AccountIdFormData = z.infer<typeof accountIdSchema>;

export default function ViewAccountTransactionsContent() {
    const [transactions, setTransactions] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchedAccountId, setSearchedAccountId] = useState<string | null>(null);

    const { getCookie } = useAuth();

    const form = useForm<AccountIdFormData>({
        resolver: zodResolver(accountIdSchema),
        defaultValues: { accountId: "" },
    });

    const getTransactionBadgeVariant = (type: string) => {
        if (type === "DEPOSIT") return "default";
        if (
            type === "WITHDRAWAL" ||
            type === "LOAN_REPAYMENT" ||
            type === "BILL_PAYMENT" ||
            type === "TRANSFER"
        )
            return "destructive";
        return "secondary";
    };

    async function onSubmit(values: AccountIdFormData) {
        setLoading(true);
        setError(null);
        setTransactions(null);
        setSearchedAccountId(values.accountId);

        try {
            const token = getCookie("auth_token");
            if (!token) {
                setError("Authentication token not found.");
                setLoading(false);
                return;
            }

            const res = await axios.get(
                `http://localhost:8080/api/employee/accounts/${values.accountId}/transactions`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data && res.data.length > 0) {
                setTransactions(res.data);
            } else {
                setTransactions([]);
                setError(`No transactions found for Account ID: ${values.accountId}`);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    View Account Transactions
                </h1>
                <p className="text-gray-600 mt-1">
                    Search for customer transactions by their account ID.
                </p>
            </div>

            <Card className="border-blue-200 max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-gray-900">
                        Search Transactions
                    </CardTitle>
                    <CardDescription>
                        Enter the customer's account ID to view their transaction history.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="accountId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 12345" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the customer's unique account identifier.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
                                        Search Transactions
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {transactions && transactions.length > 0 && (
                <Card className="border-blue-200 max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Transactions for Account ID: {searchedAccountId}
                        </CardTitle>
                        <CardDescription>
                            Detailed history of all transactions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Transaction ID</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction: any) => (
                                        <TableRow key={transaction.transId}>
                                            <TableCell className="font-medium">
                                                {transaction.transId}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getTransactionBadgeVariant(
                                                        transaction.transactionType
                                                    )}
                                                >
                                                    {transaction.transactionType.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{transaction.description}</TableCell>
                                            <TableCell
                                                className={`text-right font-semibold ${
                                                    transaction.transactionType === "DEPOSIT"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {transaction.transactionType === "DEPOSIT"
                                                    ? "+"
                                                    : ""}
                                                $
                                                {transaction.amount.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(transaction.timestamp).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
