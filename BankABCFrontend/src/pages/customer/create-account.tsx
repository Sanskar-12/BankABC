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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Loader2, CheckCircle } from "lucide-react";

// Validation schema
const formSchema = z.object({
    customerId: z
        .string()
        .min(1, "Customer ID is required")
        .regex(/^\d+$/, "Customer ID must be a number"),
    branchId: z
        .string()
        .min(1, "Branch ID is required")
        .regex(/^\d+$/, "Branch ID must be a number"),
    accountName: z
        .string()
        .min(3, { message: "Account name must be at least 3 characters." }),
    accountType: z.string().min(1, "Please select an account type"),
    initialDeposit: z
        .string()
        .min(1, "Initial deposit is required")
        .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount")
        .refine((val) => Number.parseFloat(val) >= 100, {
            message: "Minimum deposit is $100.",
        }),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateAccount() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerId: "",
            branchId: "",
            accountName: "",
            accountType: "",
            initialDeposit: "",
        },
    });

    async function onSubmit(values: FormData) {
        setIsSubmitting(true);

        // Transform string values to numbers for API payload
        const payload = {
            customerId: Number.parseInt(values.customerId),
            branchId: Number.parseInt(values.branchId),
            accountName: values.accountName,
            accountType: values.accountType as "SAVINGS" | "CURRENT",
            initialDeposit: Number.parseFloat(values.initialDeposit),
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Payload:", payload);

        setIsSubmitting(false);
        setIsSubmitted(true);

        setTimeout(() => {
            setIsSubmitted(false);
            form.reset();
        }, 3000);
    }

    if (isSubmitted) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Account Created Successfully!
                    </h1>
                    <p className="text-gray-600">
                        Your new bank account has been created.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Create Account
                </h1>
                <p className="text-gray-600 mt-1">
                    Open a new bank account with BankABC.
                </p>
            </div>

            <Card className="border-blue-200 max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-gray-900">
                        Account Application
                    </CardTitle>
                    <CardDescription>
                        Fill out the form to create your new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {/* Customer ID */}
                            <FormField
                                control={form.control}
                                name="customerId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Customer ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Customer ID (e.g., 12345)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Branch ID */}
                            <FormField
                                control={form.control}
                                name="branchId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Branch ID (e.g., 001)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Account Name */}
                            <FormField
                                control={form.control}
                                name="accountName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., John Doe Savings"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Account Type */}
                            <FormField
                                control={form.control}
                                name="accountType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select account type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="SAVINGS">
                                                    Savings Account
                                                </SelectItem>
                                                <SelectItem value="CURRENT">
                                                    Current Account
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Initial Deposit */}
                            <FormField
                                control={form.control}
                                name="initialDeposit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Initial Deposit ($)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="100"
                                                placeholder="100.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
