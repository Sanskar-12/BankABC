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
    FormDescription,
} from "@/components/ui/form";
import {
    Loader2,
    CheckCircle,
    DollarSign,
    FileText,
    Home,
    Car,
    GraduationCap,
    Building,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// Validation schema
const formSchema = z.object({
    accountId: z
        .string()
        .min(1, "Account ID is required")
        .regex(/^\d+$/, "Account ID must be a number"),
    loanType: z.string().min(1, "Please select a loan type"),
    loanAmount: z
        .string()
        .min(1, "Loan amount is required")
        .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount")
        .refine((val) => Number.parseFloat(val) >= 1000, {
            message: "Minimum loan amount is $1,000.",
        })
        .refine((val) => Number.parseFloat(val) <= 500000, {
            message: "Maximum loan amount is $500,000.",
        }),
});

type FormData = z.infer<typeof formSchema>;

export default function ApplyForLoan() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedLoanType, setSelectedLoanType] = useState<string>("");
    const { getCookie } = useAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountId: "",
            loanType: "",
            loanAmount: "",
        },
    });

    const loanTypes = [
        {
            id: "PERSONAL",
            title: "Personal Loan",
            description:
                "For personal expenses, debt consolidation, or emergencies",
            icon: DollarSign,
            interestRate: "8.5% - 15.9%",
            maxAmount: "$50,000",
        },
        {
            id: "HOME",
            title: "Home Loan",
            description: "For purchasing or refinancing your home",
            icon: Home,
            interestRate: "3.2% - 7.8%",
            maxAmount: "$500,000",
        },
        {
            id: "AUTO",
            title: "Auto Loan",
            description: "For purchasing new or used vehicles",
            icon: Car,
            interestRate: "4.1% - 9.5%",
            maxAmount: "$75,000",
        },
        {
            id: "BUSINESS",
            title: "Business Loan",
            description: "For business expansion and working capital",
            icon: Building,
            interestRate: "6.5% - 18.0%",
            maxAmount: "$250,000",
        },
        {
            id: "EDUCATION",
            title: "Education Loan",
            description: "For higher education and skill development",
            icon: GraduationCap,
            interestRate: "5.5% - 12.0%",
            maxAmount: "$100,000",
        },
    ];

    const handleLoanTypeSelect = (loanType: string) => {
        setSelectedLoanType(loanType);
        form.setValue("loanType", loanType);
    };

    async function onSubmit(values: FormData) {
        setIsSubmitting(true);

        // Transform string values to proper types for API payload
        const payload = {
            accountId: Number.parseInt(values.accountId),
            loanType: values.loanType,
            loanAmount: Number.parseFloat(values.loanAmount),
        };

        await axios.post(
            "http://localhost:8080/api/user/loans/apply",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getCookie("auth_token")}`,
                },
            },
        );

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Loan Application Payload:", payload);

        setIsSubmitting(false);
        setIsSubmitted(true);

        setTimeout(() => {
            setIsSubmitted(false);
            setSelectedLoanType("");
            form.reset();
        }, 4000);
    }

    if (isSubmitted) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Loan Application Submitted!
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Your loan application has been submitted successfully.
                        We will review your application and get back to you
                        within 2-3 business days.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                        <p className="text-sm text-blue-800">
                            <strong>Application ID:</strong> LA
                            {Math.floor(Math.random() * 100000)}
                        </p>
                        <p className="text-sm text-blue-800 mt-1">
                            Please save this ID for future reference.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Apply for Loan
                </h1>
                <p className="text-gray-600 mt-1">
                    Choose your loan type and submit your application with
                    BankABC.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Loan Types Selection */}
                <Card className="border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Available Loan Types
                        </CardTitle>
                        <CardDescription>
                            Select the type of loan that best fits your needs
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3">
                            {loanTypes.map((loan) => {
                                const Icon = loan.icon;
                                const isSelected = selectedLoanType === loan.id;
                                return (
                                    <div
                                        key={loan.id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                            isSelected
                                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                                : "border-blue-200 hover:bg-blue-50"
                                        }`}
                                        onClick={() =>
                                            handleLoanTypeSelect(loan.id)
                                        }
                                    >
                                        <div className="flex items-start gap-3">
                                            <Icon
                                                className={`h-6 w-6 mt-1 ${isSelected ? "text-blue-600" : "text-gray-600"}`}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {loan.title}
                                                    </h3>
                                                    {isSelected && (
                                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {loan.description}
                                                </p>
                                                <div className="flex justify-between mt-2 text-xs">
                                                    <span className="text-blue-600 font-medium">
                                                        Rate:{" "}
                                                        {loan.interestRate}
                                                    </span>
                                                    <span className="text-gray-500">
                                                        Max: {loan.maxAmount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {selectedLoanType && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Selected:</strong>{" "}
                                    {
                                        loanTypes.find(
                                            (l) => l.id === selectedLoanType,
                                        )?.title
                                    }
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Loan Application Form */}
                <Card className="border-blue-200 h-min">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Loan Application Form
                        </CardTitle>
                        <CardDescription>
                            Fill out the details for your loan application
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                {/* Account ID */}
                                <FormField
                                    control={form.control}
                                    name="accountId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your Account ID (e.g., 101)"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Your existing bank account ID
                                                with BankABC
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Loan Type */}
                                <FormField
                                    control={form.control}
                                    name="loanType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loan Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select loan type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PERSONAL">
                                                        Personal Loan
                                                    </SelectItem>
                                                    <SelectItem value="HOME">
                                                        Home Loan
                                                    </SelectItem>
                                                    <SelectItem value="AUTO">
                                                        Auto Loan
                                                    </SelectItem>
                                                    <SelectItem value="BUSINESS">
                                                        Business Loan
                                                    </SelectItem>
                                                    <SelectItem value="EDUCATION">
                                                        Education Loan
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Loan Amount */}
                                <FormField
                                    control={form.control}
                                    name="loanAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Loan Amount ($)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="1000"
                                                    max="500000"
                                                    placeholder="5000.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Amount between $1,000 and
                                                $500,000
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Loan Summary */}
                                {form.watch("loanAmount") &&
                                    form.watch("loanType") && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">
                                                Loan Summary
                                            </h4>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Loan Type:
                                                    </span>
                                                    <span className="font-medium">
                                                        {loanTypes.find(
                                                            (l) =>
                                                                l.id ===
                                                                form.watch(
                                                                    "loanType",
                                                                ),
                                                        )?.title ||
                                                            "Not selected"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Requested Amount:
                                                    </span>
                                                    <span className="font-medium">
                                                        $
                                                        {Number.parseFloat(
                                                            form.watch(
                                                                "loanAmount",
                                                            ) || "0",
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Interest Rate:
                                                    </span>
                                                    <span className="font-medium text-blue-600">
                                                        {loanTypes.find(
                                                            (l) =>
                                                                l.id ===
                                                                form.watch(
                                                                    "loanType",
                                                                ),
                                                        )?.interestRate ||
                                                            "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting Application...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Submit Loan Application
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
