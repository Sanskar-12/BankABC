"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Loader2,
    CheckCircle,
    ArrowUpCircle,
    ArrowDownCircle,
    DollarSign,
    CreditCard,
} from "lucide-react";

// Validation schemas
const depositSchema = z.object({
    accountId: z
        .string()
        .min(1, "Account ID is required")
        .regex(/^\d+$/, "Account ID must be a number"),
    amount: z
        .string()
        .min(1, "Amount is required")
        .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount")
        .refine((val) => Number.parseFloat(val) > 0, {
            message: "Amount must be greater than 0.",
        })
        .refine((val) => Number.parseFloat(val) <= 50000, {
            message: "Maximum deposit amount is $50,000.",
        }),
    type: z.literal("DEPOSIT"), // Hardcoded type
});

const withdrawSchema = z.object({
    accountId: z
        .string()
        .min(1, "Account ID is required")
        .regex(/^\d+$/, "Account ID must be a number"),
    amount: z
        .string()
        .min(1, "Amount is required")
        .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount")
        .refine((val) => Number.parseFloat(val) > 0, {
            message: "Amount must be greater than 0.",
        })
        .refine((val) => Number.parseFloat(val) <= 10000, {
            message: "Maximum withdrawal amount is $10,000 per transaction.",
        }),
    type: z.literal("WITHDRAWAL"), // Hardcoded type
});

type DepositFormData = z.infer<typeof depositSchema>;
type WithdrawFormData = z.infer<typeof withdrawSchema>;

export default function Transactions() {
    const [activeTab, setActiveTab] = useState("deposit");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [transactionResult, setTransactionResult] = useState<any>(null);

    const depositForm = useForm<DepositFormData>({
        resolver: zodResolver(depositSchema),
        defaultValues: {
            accountId: "",
            amount: "",
            type: "DEPOSIT", // Default to DEPOSIT
        },
    });

    const withdrawForm = useForm<WithdrawFormData>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            accountId: "",
            amount: "",
            type: "WITHDRAWAL", // Default to WITHDRAWAL
        },
    });

    async function onDepositSubmit(values: Omit<DepositFormData, "type">) {
        setIsSubmitting(true);

        const payload = {
            accountId: Number.parseInt(values.accountId),
            amount: Number.parseFloat(values.amount),
            type: "DEPOSIT", // Hardcoded for payload
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Deposit Payload:", payload);

        setTransactionResult({
            ...payload,
            type: "DEPOSIT",
            transactionId: `DEP${Math.floor(Math.random() * 1000000)}`,
        });

        setIsSubmitting(false);
        setIsSubmitted(true);

        setTimeout(() => {
            setIsSubmitted(false);
            setTransactionResult(null);
            depositForm.reset();
        }, 4000);
    }

    async function onWithdrawSubmit(values: Omit<WithdrawFormData, "type">) {
        setIsSubmitting(true);

        const payload = {
            accountId: Number.parseInt(values.accountId),
            amount: Number.parseFloat(values.amount),
            type: "WITHDRAWAL", // Hardcoded for payload
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Withdraw Payload:", payload);

        setTransactionResult({
            ...payload,
            type: "withdraw",
            transactionId: `WTH${Math.floor(Math.random() * 1000000)}`,
        });

        setIsSubmitting(false);
        setIsSubmitted(true);

        setTimeout(() => {
            setIsSubmitted(false);
            setTransactionResult(null);
            withdrawForm.reset();
        }, 4000);
    }

    if (isSubmitted && transactionResult) {
        const isDeposit = transactionResult.type === "deposit";
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isDeposit ? "Deposit" : "Withdrawal"} Successful!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Your {isDeposit ? "deposit" : "withdrawal"} transaction
                        has been processed successfully.
                    </p>

                    <Card className="max-w-md mx-auto border-blue-200">
                        <CardHeader className="bg-blue-50">
                            <CardTitle className="text-gray-900 flex items-center gap-2">
                                {isDeposit ? (
                                    <ArrowDownCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                    <ArrowUpCircle className="h-5 w-5 text-red-600" />
                                )}
                                Transaction Receipt
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Transaction ID:
                                    </span>
                                    <span className="font-medium">
                                        {transactionResult.transactionId}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Account ID:
                                    </span>
                                    <span className="font-medium">
                                        {transactionResult.accountId}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="font-medium">
                                        {transactionResult.type}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Amount:
                                    </span>
                                    <span
                                        className={`font-bold text-lg ${isDeposit ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {isDeposit ? "+" : "-"}$
                                        {transactionResult.amount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-medium">
                                        {new Date().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Transactions
                </h1>
                <p className="text-gray-600 mt-1">
                    Deposit money to your account or make withdrawals.
                </p>
            </div>

            <Card className="border-blue-200 max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-gray-900">
                        Account Transactions
                    </CardTitle>
                    <CardDescription>
                        Choose between deposit or withdrawal operations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger
                                value="deposit"
                                className="flex items-center gap-2"
                            >
                                <ArrowDownCircle className="h-4 w-4" />
                                Deposit
                            </TabsTrigger>
                            <TabsTrigger
                                value="withdraw"
                                className="flex items-center gap-2"
                            >
                                <ArrowUpCircle className="h-4 w-4" />
                                Withdraw
                            </TabsTrigger>
                        </TabsList>

                        {/* Deposit Tab */}
                        <TabsContent value="deposit" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Deposit Info */}
                                <Card className="border-green-200 bg-green-50">
                                    <CardHeader>
                                        <CardTitle className="text-green-800 flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            Deposit Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="bg-green-100 border border-green-200 rounded p-3 text-sm text-green-800">
                                            <p className="font-medium">
                                                Daily Limit: $50,000
                                            </p>
                                            <p>No fees for deposits</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Deposit Form */}
                                <Card className="border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-gray-900">
                                            Make a Deposit
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...depositForm}>
                                            <form
                                                onSubmit={depositForm.handleSubmit(
                                                    onDepositSubmit,
                                                )}
                                                className="space-y-4"
                                            >
                                                <FormField
                                                    control={
                                                        depositForm.control
                                                    }
                                                    name="accountId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Account ID
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter Account ID (e.g., 12345)"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={
                                                        depositForm.control
                                                    }
                                                    name="amount"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Amount ($)
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.01"
                                                                    placeholder="250.75"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Maximum: $50,000
                                                                per transaction
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="submit"
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Processing
                                                            Deposit...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowDownCircle className="mr-2 h-4 w-4" />
                                                            Deposit Money
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Withdraw Tab */}
                        <TabsContent value="withdraw" className="space-y-6">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Withdraw Info */}
                                <Card className="border-red-200 bg-red-50">
                                    <CardHeader>
                                        <CardTitle className="text-red-800 flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            Withdrawal Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="bg-red-100 border border-red-200 rounded p-3 text-sm text-red-800">
                                            <p className="font-medium">
                                                Daily Limit: $10,000
                                            </p>
                                            <p>Processing fee may apply</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Withdraw Form */}
                                <Card className="border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-gray-900">
                                            Make a Withdrawal
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Form {...withdrawForm}>
                                            <form
                                                onSubmit={withdrawForm.handleSubmit(
                                                    onWithdrawSubmit,
                                                )}
                                                className="space-y-4"
                                            >
                                                <FormField
                                                    control={
                                                        withdrawForm.control
                                                    }
                                                    name="accountId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Account ID
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter Account ID (e.g., 12345)"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={
                                                        withdrawForm.control
                                                    }
                                                    name="amount"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Amount ($)
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.01"
                                                                    placeholder="150.00"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Maximum: $10,000
                                                                per transaction
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="submit"
                                                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Processing
                                                            Withdrawal...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowUpCircle className="mr-2 h-4 w-4" />
                                                            Withdraw Money
                                                        </>
                                                    )}
                                                </Button>
                                            </form>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
