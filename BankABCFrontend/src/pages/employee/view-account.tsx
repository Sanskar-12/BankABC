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
    Search,
    User,
    DollarSign,
    CreditCard,
    RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"; // Import Label

// Zod schema for account ID input
const accountIdSchema = z.object({
    accountId: z
        .string()
        .min(1, "Account ID is required")
        .regex(/^\d+$/, "Account ID must be a number"),
});

type AccountIdFormData = z.infer<typeof accountIdSchema>;

// Zod schema for updating account status
const updateAccountStatusSchema = z.object({
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "CLOSED"]),
});

type UpdateAccountStatusFormData = z.infer<typeof updateAccountStatusSchema>;

// Mock Account Data (simulating GET /api/employee/accounts/{id})
const mockAccounts = {
    "1001": {
        accId: 1001,
        accName: "John Doe Savings",
        accType: "SAVINGS",
        balance: 12345.67,
        status: "ACTIVE",
        customerId: "CUST001",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
    },
    "1002": {
        accId: 1002,
        accName: "Jane Smith Current",
        accType: "CURRENT",
        balance: 5432.1,
        status: "INACTIVE",
        customerId: "CUST002",
        email: "jane.smith@example.com",
        phone: "+1 (555) 987-6543",
    },
    "1003": {
        accId: 1003,
        accName: "Bob Johnson Business",
        accType: "BUSINESS",
        balance: 78901.23,
        status: "SUSPENDED",
        customerId: "CUST003",
        email: "bob.johnson@example.com",
        phone: "+1 (555) 555-1212",
    },
};

export default function ManageAccountContent() {
    const [account, setAccount] = useState<any | null>(null);
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchedAccountId, setSearchedAccountId] = useState<string | null>(
        null,
    );

    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const searchForm = useForm<AccountIdFormData>({
        resolver: zodResolver(accountIdSchema),
        defaultValues: {
            accountId: "",
        },
    });

    const updateStatusForm = useForm<UpdateAccountStatusFormData>({
        resolver: zodResolver(updateAccountStatusSchema),
        defaultValues: {
            status: "ACTIVE",
        },
    });

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "default";
            case "INACTIVE":
                return "secondary";
            case "SUSPENDED":
                return "destructive";
            case "CLOSED":
                return "destructive";
            default:
                return "outline";
        }
    };

    async function onSearchSubmit(values: AccountIdFormData) {
        setLoadingAccount(true);
        setSearchError(null);
        setAccount(null);
        setSearchedAccountId(values.accountId);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

            const fetchedAccount = (mockAccounts as any)[values.accountId];
            if (fetchedAccount) {
                setAccount(fetchedAccount);
            } else {
                setSearchError(`No account found for ID: ${values.accountId}`);
            }
        } catch (err) {
            setSearchError(
                "Failed to fetch account details. Please try again.",
            );
            console.error(err);
        } finally {
            setLoadingAccount(false);
        }
    }

    const handleUpdateStatusClick = () => {
        if (account) {
            updateStatusForm.reset({
                status: account.status as UpdateAccountStatusFormData["status"],
            });
            setDialogOpen(true);
        }
    };

    async function onUpdateStatusSubmit(values: UpdateAccountStatusFormData) {
        if (!account) return;

        setUpdatingStatus(true);
        // Simulate PUT /api/employee/accounts/{id}/status/{status}
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setAccount((prevAccount: any) => ({
            ...prevAccount,
            status: values.status,
        }));
        console.log(
            `Updated Account ${account.accId} status to:`,
            values.status,
        );

        setUpdatingStatus(false);
        setDialogOpen(false);
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Manage Customer Accounts
                </h1>
                <p className="text-gray-600 mt-1">
                    View customer account details and update their status.
                </p>
            </div>

            <Card className="border-blue-200 max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-gray-900">
                        Search Account
                    </CardTitle>
                    <CardDescription>
                        Enter the customer's account ID to view and manage their
                        account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...searchForm}>
                        <form
                            onSubmit={searchForm.handleSubmit(onSearchSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={searchForm.control}
                                name="accountId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., 1001"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The unique identifier for the
                                            customer's bank account.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={loadingAccount}
                            >
                                {loadingAccount ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
                                        Search Account
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Search Results / Account Details */}
            {searchError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
                    <p className="font-medium">{searchError}</p>
                </div>
            )}

            {loadingAccount && (
                <div className="flex items-center justify-center py-12 max-w-2xl mx-auto">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600">
                        Loading account details...
                    </span>
                </div>
            )}

            {account && !loadingAccount && !searchError && (
                <Card className="border-blue-200 max-w-4xl mx-auto">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-gray-900">
                                Account Details for ID: {account.accId}
                            </CardTitle>
                            <CardDescription>
                                Overview of the customer's account information.
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setAccount(null);
                                setSearchedAccountId(null);
                                searchForm.reset();
                            }}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" /> New Search
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />{" "}
                                Customer Information
                            </h3>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">
                                    Customer ID:
                                </span>{" "}
                                {account.customerId}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">
                                    Account Name:
                                </span>{" "}
                                {account.accName}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span>{" "}
                                {account.email}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Phone:</span>{" "}
                                {account.phone}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-blue-600" />{" "}
                                Account Information
                            </h3>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">
                                    Account Type:
                                </span>{" "}
                                {account.accType}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">
                                    Current Balance:
                                </span>{" "}
                                <span className="font-bold text-lg text-green-600">
                                    $
                                    {account.balance.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="font-medium">
                                    Account Status:
                                </span>{" "}
                                <Badge
                                    variant={getStatusBadgeVariant(
                                        account.status,
                                    )}
                                >
                                    {account.status}
                                </Badge>
                            </p>
                            <Button
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleUpdateStatusClick}
                                disabled={updatingStatus}
                            >
                                {updatingStatus ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Update Account Status
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Update Account Status Dialog */}
            {account && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-[425px] border-blue-200">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900">
                                Update Account Status
                            </DialogTitle>
                            <DialogDescription>
                                Change the status for Account ID:{" "}
                                <span className="font-medium">
                                    {account.accId}
                                </span>{" "}
                                ({account.accName})
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...updateStatusForm}>
                            <form
                                onSubmit={updateStatusForm.handleSubmit(
                                    onUpdateStatusSubmit,
                                )}
                                className="space-y-4 py-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="current-status">
                                        Current Status
                                    </Label>{" "}
                                    {/* Changed from FormLabel to Label */}
                                    <Input
                                        id="current-status"
                                        value={account.status}
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </div>
                                <FormField
                                    control={updateStatusForm.control}
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
                                                    <SelectItem value="ACTIVE">
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem value="INACTIVE">
                                                        Inactive
                                                    </SelectItem>
                                                    <SelectItem value="SUSPENDED">
                                                        Suspended
                                                    </SelectItem>
                                                    <SelectItem value="CLOSED">
                                                        Closed
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
                                        disabled={updatingStatus}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={updatingStatus}
                                    >
                                        {updatingStatus ? (
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
