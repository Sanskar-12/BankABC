"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import { Loader2, Search, RefreshCw, User, DollarSign, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

const accountIdSchema = z.object({
    accountId: z
        .string()
        .min(1, "Account ID is required")
        .regex(/^\d+$/, "Account ID must be a number"),
});

type AccountIdFormData = z.infer<typeof accountIdSchema>;

export default function ManageAccountContent() {
    const [account, setAccount] = useState<any | null>(null);
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchedAccountId, setSearchedAccountId] = useState<string | null>(null);

    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("ACTIVE");

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    const { getCookie } = useAuth();

    const searchForm = useForm<AccountIdFormData>({
        resolver: zodResolver(accountIdSchema),
        defaultValues: { accountId: "" },
    });

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "default";
            case "INACTIVE":
                return "secondary";
            case "SUSPENDED":
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
            const token = getCookie("auth_token");
            if (!token) {
                setSearchError("Authentication token not found.");
                setLoadingAccount(false);
                return;
            }

            const res = await axios.get(
                `http://localhost:8080/api/employee/accounts/${values.accountId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Account data:", res.data);

            setAccount(res.data);
            setEditData(res.data);
            setSelectedStatus(res.data.status);
        } catch (err) {
            setSearchError(`No account found for ID: ${values.accountId}`);
            console.error(err);
        } finally {
            setLoadingAccount(false);
        }
    }

    async function updateAccountStatus(status: string) {
        if (!searchedAccountId) return;
        setUpdatingStatus(true);

        try {
            const token = getCookie("auth_token");
            if (!token) {
                setSearchError("Authentication token not found.");
                setUpdatingStatus(false);
                return;
            }

            const res = await axios.put(
               `http://localhost:8080/api/employee/accounts/${searchedAccountId}/status/${status}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAccount(res.data);
        } catch (err) {
            console.error(err);
            setSearchError("Failed to update account status.");
        } finally {
            setUpdatingStatus(false);
        }
    }

    function handleEditClick() {
        setEditData({ ...account });
        setIsEditing(true);
    }

    function handleChange(field: string, value: any) {
        setEditData((prev: any) => ({ ...prev, [field]: value }));
    }

    async function saveAccountChanges() {
        setSaving(true);
        try {
            const token = getCookie("auth_token");
            await axios.put(
                `http://localhost:8080/api/employee/accounts/${account.accId}`,
                editData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAccount(editData);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update account", err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Manage Customer Accounts
                </h1>
                <p className="text-gray-600 mt-1">
                    View customer account details and update their status.
                </p>
            </div>

            {/* Search Card */}
            <Card className="border-blue-200 max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-gray-900">Search Account</CardTitle>
                    <CardDescription>
                        Enter the customer's account ID to view and manage their account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...searchForm}>
                        <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} className="space-y-4">
                            <FormField
                                control={searchForm.control}
                                name="accountId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 1001" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The unique identifier for the customer's bank account.
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

            {searchError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
                    <p className="font-medium">{searchError}</p>
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
                        {!isEditing ? (
                            <Button variant="outline" onClick={handleEditClick}>
                                Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    className="bg-blue-600 text-white"
                                    onClick={saveAccountChanges}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        "Save"
                                    )}
                                </Button>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" /> Customer Information
                            </h3>

                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Account Name:</span>{" "}
                                {isEditing ? (
                                    <Input value={editData.accName} onChange={(e) => handleChange("accName", e.target.value)} />
                                ) : (
                                    account.accName
                                )}
                            </p>

                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span>{" "}
                                {isEditing ? (
                                    <Input value={editData.email} onChange={(e) => handleChange("email", e.target.value)} />
                                ) : (
                                    account.email
                                )}
                            </p>

                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Phone:</span>{" "}
                                {isEditing ? (
                                    <Input value={editData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                                ) : (
                                    account.phone
                                )}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-blue-600" /> Account Information
                            </h3>

                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Account Type:</span>{" "}
                                {isEditing ? (
                                    <Input value={editData.accType} onChange={(e) => handleChange("accType", e.target.value)} />
                                ) : (
                                    account.accType
                                )}
                            </p>

                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Current Balance:</span>{" "}
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={editData.balance}
                                        onChange={(e) => handleChange("balance", e.target.value)}
                                    />
                                ) : (
                                   `$${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                                )}
                            </p>

                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="font-medium">Account Status:</span>{" "}
                                <Badge variant={getStatusBadgeVariant(account.status)}>
                                    {account.status}
                                </Badge>
                            </p>

                            {!isEditing && (
                                <div className="flex items-center gap-3 mt-4">
                                    <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                            <SelectItem value="CLOSED">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        onClick={() => updateAccountStatus(selectedStatus)}
                                        disabled={updatingStatus}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {updatingStatus ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                Update Status
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}