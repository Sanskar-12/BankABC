"use client";

import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";
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
import { Loader2, Edit, RefreshCw } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

// Mock Loan Data (simulating GET /api/employee/loans)
const mockLoans = [
    {
        loanId: "L001",
        loanType: "PERSONAL",
        loanAmount: 15000.0,
        loanStatus: "PENDING",
        accountId: 1001,
    },
    {
        loanId: "L002",
        loanType: "HOME",
        loanAmount: 250000.0,
        loanStatus: "APPROVED",
        accountId: 1002,
    },
    {
        loanId: "L003",
        loanType: "AUTO",
        loanAmount: 30000.0,
        loanStatus: "REJECTED",
        accountId: 1003,
    },
    {
        loanId: "L004",
        loanType: "EDUCATION",
        loanAmount: 50000.0,
        loanStatus: "PENDING",
        accountId: 1004,
    },
    {
        loanId: "L005",
        loanType: "BUSINESS",
        loanAmount: 100000.0,
        loanStatus: "APPROVED",
        accountId: 1005,
    },
];

// Zod schema for updating loan status
const updateLoanStatusSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

type UpdateLoanStatusFormData = z.infer<typeof updateLoanStatusSchema>;

export default function ViewLoansContent() {
    const [loans, setLoans] = useState<typeof mockLoans>([]);
    const [loadingLoans, setLoadingLoans] = useState(true);
    const [updatingLoanId, setUpdatingLoanId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentLoanToEdit, setCurrentLoanToEdit] = useState<
        (typeof mockLoans)[0] | null
    >(null);

    const form = useForm<UpdateLoanStatusFormData>({
        resolver: zodResolver(updateLoanStatusSchema),
        defaultValues: {
            status: "PENDING",
        },
    });

    // Simulate fetching loans
    useEffect(() => {
        const fetchLoans = async () => {
            setLoadingLoans(true);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
            setLoans(mockLoans);
            setLoadingLoans(false);
        };
        fetchLoans();
    }, []);

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "default"; // shadcn default is blue-ish
            case "PENDING":
                return "secondary"; // shadcn secondary is gray-ish
            case "REJECTED":
                return "destructive"; // shadcn destructive is red-ish
            default:
                return "outline";
        }
    };

    const handleEditStatusClick = (loan: (typeof mockLoans)[0]) => {
        setCurrentLoanToEdit(loan);
        form.reset({
            status: loan.loanStatus as UpdateLoanStatusFormData["status"],
        });
        setDialogOpen(true);
    };

    // Simulate updating loan status (PUT /api/employee/loans/{id}/status)
    async function onUpdateStatusSubmit(values: UpdateLoanStatusFormData) {
        if (!currentLoanToEdit) return;

        setUpdatingLoanId(currentLoanToEdit.loanId);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

        setLoans((prevLoans) =>
            prevLoans.map((loan) =>
                loan.loanId === currentLoanToEdit.loanId
                    ? { ...loan, loanStatus: values.status }
                    : loan,
            ),
        );

        console.log(
            `Updated Loan ${currentLoanToEdit.loanId} status to:`,
            values.status,
        );

        setUpdatingLoanId(null);
        setDialogOpen(false);
        setCurrentLoanToEdit(null);
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Manage Loans
                </h1>
                <p className="text-gray-600 mt-1">
                    View all customer loan applications and update their
                    statuses.
                </p>
            </div>

            <Card className="border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900">
                            All Customer Loans
                        </CardTitle>
                        <CardDescription>
                            Overview of all loan applications.
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setLoadingLoans(true);
                            setTimeout(() => {
                                setLoans(mockLoans); // Re-fetch mock data
                                setLoadingLoans(false);
                            }, 1000);
                        }}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                </CardHeader>
                <CardContent>
                    {loadingLoans ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-3 text-gray-600">
                                Loading loans...
                            </span>
                        </div>
                    ) : loans.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                            No loan applications found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Loan ID</TableHead>
                                        <TableHead>Account ID</TableHead>
                                        <TableHead>Loan Type</TableHead>
                                        <TableHead className="text-right">
                                            Amount
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loans.map((loan) => (
                                        <TableRow key={loan.loanId}>
                                            <TableCell className="font-medium">
                                                {loan.loanId}
                                            </TableCell>
                                            <TableCell>
                                                {loan.accountId}
                                            </TableCell>
                                            <TableCell>
                                                {loan.loanType}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                $
                                                {loan.loanAmount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={getStatusBadgeVariant(
                                                        loan.loanStatus,
                                                    )}
                                                >
                                                    {loan.loanStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50 bg-transparent"
                                                    onClick={() =>
                                                        handleEditStatusClick(
                                                            loan,
                                                        )
                                                    }
                                                    disabled={
                                                        updatingLoanId ===
                                                        loan.loanId
                                                    }
                                                >
                                                    {updatingLoanId ===
                                                    loan.loanId ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Edit className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">
                                                        Edit Status
                                                    </span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Loan Status Dialog */}
            {currentLoanToEdit && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-[425px] border-blue-200">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900">
                                Update Loan Status
                            </DialogTitle>
                            <DialogDescription>
                                Change the status for Loan ID:{" "}
                                <span className="font-medium">
                                    {currentLoanToEdit.loanId}
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(
                                    onUpdateStatusSubmit,
                                )}
                                className="space-y-4 py-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="current-status">
                                        Current Status
                                    </Label>
                                    <Input
                                        id="current-status"
                                        value={currentLoanToEdit.loanStatus}
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select new status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PENDING">
                                                        Pending
                                                    </SelectItem>
                                                    <SelectItem value="APPROVED">
                                                        Approved
                                                    </SelectItem>
                                                    <SelectItem value="REJECTED">
                                                        Rejected
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setDialogOpen(false)}
                                        disabled={updatingLoanId !== null}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={updatingLoanId !== null}
                                    >
                                        {updatingLoanId ===
                                        currentLoanToEdit.loanId ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
