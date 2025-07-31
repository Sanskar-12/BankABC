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
    Edit,
    Trash2,
    PlusCircle,
    RefreshCw,
    Search,
    AlertCircle,
    MapPin,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Types based on the Java backend DTOs
interface BranchDto {
    branchId: number;
    branchName: string;
    branchAddr: string;
}

// Zod schemas for form validation
const branchSchema = z.object({
    branchName: z
        .string()
        .min(1, "Branch name is required")
        .max(100, "Branch name too long"),
    branchAddr: z
        .string()
        .min(1, "Branch address is required")
        .max(200, "Address too long"),
});

type BranchFormData = z.infer<typeof branchSchema>;

// Mock data for development - replace with actual API calls
const mockBranches: BranchDto[] = [
    {
        branchId: 101,
        branchName: "Main Branch",
        branchAddr: "123 Main Street, Downtown, City 12345",
    },
    {
        branchId: 102,
        branchName: "Northside Branch",
        branchAddr: "456 North Avenue, Northside, City 12346",
    },
    {
        branchId: 103,
        branchName: "West End Branch",
        branchAddr: "789 West Boulevard, West End, City 12347",
    },
    {
        branchId: 104,
        branchName: "East Side Branch",
        branchAddr: "321 East Street, East Side, City 12348",
    },
    {
        branchId: 105,
        branchName: "South Plaza Branch",
        branchAddr: "654 South Plaza, South District, City 12349",
    },
];

export default function ManageBranchesContent() {
    const [branches, setBranches] = useState<BranchDto[]>([]);
    const [filteredBranches, setFilteredBranches] = useState<BranchDto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogType, setDialogType] = useState<
        "create" | "edit" | "delete" | null
    >(null);
    const [currentBranch, setCurrentBranch] = useState<BranchDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    const createForm = useForm<BranchFormData>({
        resolver: zodResolver(branchSchema),
        defaultValues: {
            branchName: "",
            branchAddr: "",
        },
    });

    const updateForm = useForm<BranchFormData>({
        resolver: zodResolver(branchSchema),
        defaultValues: {
            branchName: "",
            branchAddr: "",
        },
    });

    // API Functions - Replace these with actual API calls
    const fetchBranches = async (): Promise<BranchDto[]> => {
        // Simulate API call to GET /api/admin/branches
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return mockBranches;
    };

    const createBranch = async (data: BranchFormData): Promise<BranchDto> => {
        // Simulate API call to POST /api/admin/branches
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newBranch: BranchDto = {
            branchId: Math.max(...branches.map((b) => b.branchId)) + 1,
            branchName: data.branchName,
            branchAddr: data.branchAddr,
        };

        setBranches((prev) => [...prev, newBranch]);
        console.log("Created branch:", newBranch);
        return newBranch;
    };

    const updateBranch = async (
        id: number,
        data: BranchFormData,
    ): Promise<BranchDto> => {
        // Simulate API call to PUT /api/admin/branches (assuming this endpoint exists)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const updatedBranch = { branchId: id, ...data };
        setBranches((prev) =>
            prev.map((branch) =>
                branch.branchId === id ? updatedBranch : branch,
            ),
        );
        console.log("Updated branch:", updatedBranch);
        return updatedBranch;
    };

    const deleteBranch = async (id: number): Promise<void> => {
        // Simulate API call to DELETE /api/admin/branches/{id}
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setBranches((prev) => prev.filter((branch) => branch.branchId !== id));
        console.log("Deleted branch:", id);
    };

    // Load initial data
    useEffect(() => {
        const loadBranches = async () => {
            try {
                setLoading(true);
                setError(null);
                const branchesData = await fetchBranches();
                setBranches(branchesData);
            } catch (err) {
                setError("Failed to load branches. Please try again.");
                console.error("Error loading branches:", err);
            } finally {
                setLoading(false);
            }
        };
        loadBranches();
    }, []);

    // Filter branches based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredBranches(branches);
        } else {
            const filtered = branches.filter(
                (branch) =>
                    branch.branchName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    branch.branchAddr
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    branch.branchId.toString().includes(searchTerm),
            );
            setFilteredBranches(filtered);
        }
    }, [branches, searchTerm]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            const branchesData = await fetchBranches();
            setBranches(branchesData);
        } catch (err) {
            setError("Failed to refresh data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        createForm.reset();
        setDialogType("create");
    };

    const handleEditClick = (branch: BranchDto) => {
        setCurrentBranch(branch);
        updateForm.reset({
            branchName: branch.branchName,
            branchAddr: branch.branchAddr,
        });
        setDialogType("edit");
    };

    const handleDeleteClick = (branch: BranchDto) => {
        setCurrentBranch(branch);
        setDialogType("delete");
    };

    const onCreateSubmit = async (values: BranchFormData) => {
        try {
            setIsSubmitting(true);
            setError(null);
            await createBranch(values);
            setDialogType(null);
            createForm.reset();
        } catch (err) {
            setError("Failed to create branch. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onUpdateSubmit = async (values: BranchFormData) => {
        if (!currentBranch) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await updateBranch(currentBranch.branchId, values);
            setDialogType(null);
            setCurrentBranch(null);
        } catch (err) {
            setError("Failed to update branch. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (!currentBranch) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await deleteBranch(currentBranch.branchId);
            setDialogType(null);
            setCurrentBranch(null);
        } catch (err) {
            setError(
                "Failed to delete branch. This branch may have associated employees or accounts.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Manage Branches
                </h1>
                <p className="text-gray-600 mt-1">
                    View, create, update, and delete bank branch locations.
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Main Content Card */}
            <Card className="border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900">
                            All Branches
                        </CardTitle>
                        <CardDescription>
                            Overview of all bank branch locations and their
                            details.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            <RefreshCw
                                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                            />
                            Refresh
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleCreateClick}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Branch
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search Bar */}
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search branches by name, address, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        {searchTerm && (
                            <Badge variant="secondary" className="ml-2">
                                {filteredBranches.length} results
                            </Badge>
                        )}
                    </div>

                    {/* Branch Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-3 text-gray-600">
                                Loading branches...
                            </span>
                        </div>
                    ) : filteredBranches.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                            {searchTerm
                                ? "No branches found matching your search."
                                : "No branch records found."}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Branch ID</TableHead>
                                        <TableHead>Branch Name</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead className="text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBranches.map((branch) => (
                                        <TableRow key={branch.branchId}>
                                            <TableCell className="font-medium">
                                                <Badge variant="outline">
                                                    {branch.branchId}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {branch.branchName}
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-gray-600">
                                                        {branch.branchAddr}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 bg-transparent"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                branch,
                                                            )
                                                        }
                                                        disabled={isSubmitting}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Edit
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:bg-red-50 bg-transparent"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                branch,
                                                            )
                                                        }
                                                        disabled={isSubmitting}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Delete
                                                        </span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Branch Dialog */}
            <Dialog
                open={dialogType === "create"}
                onOpenChange={() => setDialogType(null)}
            >
                <DialogContent className="sm:max-w-[500px] border-blue-200">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">
                            Create New Branch
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the details to add a new branch location to
                            the system.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...createForm}>
                        <form
                            onSubmit={createForm.handleSubmit(onCreateSubmit)}
                            className="space-y-4 py-4"
                        >
                            <FormField
                                control={createForm.control}
                                name="branchName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Downtown Branch"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A unique name to identify this
                                            branch location.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="branchAddr"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., 123 Main Street, Downtown, City 12345"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Complete address including street,
                                            city, and postal code.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogType(null)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Branch"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit Branch Dialog */}
            {currentBranch && (
                <Dialog
                    open={dialogType === "edit"}
                    onOpenChange={() => setDialogType(null)}
                >
                    <DialogContent className="sm:max-w-[500px] border-blue-200">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900">
                                Edit Branch
                            </DialogTitle>
                            <DialogDescription>
                                Update details for branch:{" "}
                                <span className="font-medium">
                                    {currentBranch.branchName}
                                </span>{" "}
                                (ID: {currentBranch.branchId})
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...updateForm}>
                            <form
                                onSubmit={updateForm.handleSubmit(
                                    onUpdateSubmit,
                                )}
                                className="space-y-4 py-4"
                            >
                                <FormField
                                    control={updateForm.control}
                                    name="branchName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Branch Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Downtown Branch"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateForm.control}
                                    name="branchAddr"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Branch Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., 123 Main Street, Downtown, City 12345"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setDialogType(null)}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
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

            {/* Delete Branch Confirmation Dialog */}
            {currentBranch && (
                <Dialog
                    open={dialogType === "delete"}
                    onOpenChange={() => setDialogType(null)}
                >
                    <DialogContent className="sm:max-w-[425px] border-blue-200">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900">
                                Confirm Deletion
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete branch:{" "}
                                <span className="font-medium">
                                    {currentBranch.branchName}
                                </span>{" "}
                                (ID: {currentBranch.branchId})?
                                <br />
                                <br />
                                <span className="text-red-600 font-medium">
                                    Warning: This action cannot be undone. Make
                                    sure there are no employees or accounts
                                    associated with this branch.
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDialogType(null)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={onDeleteConfirm}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Branch"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
