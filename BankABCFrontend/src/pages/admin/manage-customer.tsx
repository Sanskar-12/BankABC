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
    RefreshCw,
    Search,
    AlertCircle,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Types based on the Java backend DTOs
interface CustomerDto {
    custId: number;
    custName: string;
    email: string;
    phone: string;
    address: string;
    dob: string; // ISO date string
    createdAt?: string;
    accountCount?: number;
}

// Zod schemas for form validation
const updateCustomerSchema = z.object({
    custName: z
        .string()
        .min(1, "Customer name is required")
        .max(100, "Name too long"),
    email: z.string().email("Invalid email address"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .max(20, "Phone number too long"),
    address: z
        .string()
        .min(1, "Address is required")
        .max(200, "Address too long"),
    dob: z.date({ error: "Date of birth is required" }),
});

type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;

// Mock data for development - replace with actual API calls
const mockCustomers: CustomerDto[] = [
    {
        custId: 1001,
        custName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, Downtown, City 12345",
        dob: "1985-03-15",
        createdAt: "2023-01-15T10:30:00Z",
        accountCount: 2,
    },
    {
        custId: 1002,
        custName: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 987-6543",
        address: "456 Oak Avenue, Northside, City 12346",
        dob: "1990-07-22",
        createdAt: "2023-02-20T14:15:00Z",
        accountCount: 1,
    },
    {
        custId: 1003,
        custName: "Robert Johnson",
        email: "robert.j@example.com",
        phone: "+1 (555) 555-1212",
        address: "789 Pine Street, West End, City 12347",
        dob: "1988-11-01",
        createdAt: "2023-03-10T09:45:00Z",
        accountCount: 3,
    },
    {
        custId: 1004,
        custName: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "+1 (555) 444-3333",
        address: "321 Elm Drive, East Side, City 12348",
        dob: "1992-05-18",
        createdAt: "2023-04-05T16:20:00Z",
        accountCount: 1,
    },
    {
        custId: 1005,
        custName: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "+1 (555) 777-8888",
        address: "654 Maple Lane, South District, City 12349",
        dob: "1987-09-30",
        createdAt: "2023-05-12T11:10:00Z",
        accountCount: 2,
    },
];

export default function ManageCustomers() {
    const [customers, setCustomers] = useState<CustomerDto[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<CustomerDto[]>(
        [],
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogType, setDialogType] = useState<
        "edit" | "delete" | "view" | null
    >(null);
    const [currentCustomer, setCurrentCustomer] = useState<CustomerDto | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);

    const updateForm = useForm<UpdateCustomerFormData>({
        resolver: zodResolver(updateCustomerSchema),
        defaultValues: {
            custName: "",
            email: "",
            phone: "",
            address: "",
            dob: undefined,
        },
    });

    // API Functions - Replace these with actual API calls
    const fetchCustomers = async (): Promise<CustomerDto[]> => {
        // Simulate API call to GET /api/admin/customers
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return mockCustomers;
    };

    const updateCustomer = async (
        id: number,
        data: UpdateCustomerFormData,
    ): Promise<CustomerDto> => {
        // Simulate API call to PUT /api/admin/customers/{id}
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const updatedCustomer: CustomerDto = {
            custId: id,
            custName: data.custName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            dob: format(data.dob, "yyyy-MM-dd"),
            accountCount:
                customers.find((c) => c.custId === id)?.accountCount || 0,
        };

        setCustomers((prev) =>
            prev.map((customer) =>
                customer.custId === id ? updatedCustomer : customer,
            ),
        );
        console.log("Updated customer:", updatedCustomer);
        return updatedCustomer;
    };

    const deleteCustomer = async (id: number): Promise<void> => {
        // Simulate API call to DELETE /api/admin/customers/{id}
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setCustomers((prev) =>
            prev.filter((customer) => customer.custId !== id),
        );
        console.log("Deleted customer:", id);
    };

    // Load initial data
    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setLoading(true);
                setError(null);
                const customersData = await fetchCustomers();
                setCustomers(customersData);
            } catch (err) {
                setError("Failed to load customers. Please try again.");
                console.error("Error loading customers:", err);
            } finally {
                setLoading(false);
            }
        };
        loadCustomers();
    }, []);

    // Filter customers based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredCustomers(customers);
        } else {
            const filtered = customers.filter(
                (customer) =>
                    customer.custName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    customer.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    customer.phone.includes(searchTerm) ||
                    customer.address
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    customer.custId.toString().includes(searchTerm),
            );
            setFilteredCustomers(filtered);
        }
    }, [customers, searchTerm]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            const customersData = await fetchCustomers();
            setCustomers(customersData);
        } catch (err) {
            setError("Failed to refresh data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewClick = (customer: CustomerDto) => {
        setCurrentCustomer(customer);
        setDialogType("view");
    };

    const handleEditClick = (customer: CustomerDto) => {
        setCurrentCustomer(customer);
        updateForm.reset({
            custName: customer.custName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            dob: new Date(customer.dob),
        });
        setDialogType("edit");
    };

    const handleDeleteClick = (customer: CustomerDto) => {
        setCurrentCustomer(customer);
        setDialogType("delete");
    };

    const onUpdateSubmit = async (values: UpdateCustomerFormData) => {
        if (!currentCustomer) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await updateCustomer(currentCustomer.custId, values);
            setDialogType(null);
            setCurrentCustomer(null);
        } catch (err) {
            setError("Failed to update customer. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (!currentCustomer) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await deleteCustomer(currentCustomer.custId);
            setDialogType(null);
            setCurrentCustomer(null);
        } catch (err) {
            setError(
                "Failed to delete customer. This customer may have active accounts or transactions.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Manage Customers
                </h1>
                <p className="text-gray-600 mt-1">
                    View, update, and delete customer records and information.
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
                            All Customers
                        </CardTitle>
                        <CardDescription>
                            Overview of all registered customers and their
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
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search Bar */}
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search customers by name, email, phone, address, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-md"
                        />
                        {searchTerm && (
                            <Badge variant="secondary" className="ml-2">
                                {filteredCustomers.length} results
                            </Badge>
                        )}
                    </div>

                    {/* Customer Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-3 text-gray-600">
                                Loading customers...
                            </span>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                            {searchTerm
                                ? "No customers found matching your search."
                                : "No customer records found."}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Accounts</TableHead>
                                        <TableHead className="text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer) => (
                                        <TableRow key={customer.custId}>
                                            <TableCell className="font-medium">
                                                <Badge variant="outline">
                                                    {customer.custId}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {customer.custName}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">
                                                        {customer.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">
                                                        {customer.phone}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {calculateAge(customer.dob)}{" "}
                                                    years
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="default">
                                                    {customer.accountCount || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-blue-600 hover:bg-blue-50 bg-transparent"
                                                        onClick={() =>
                                                            handleViewClick(
                                                                customer,
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 bg-transparent"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                customer,
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
                                                                customer,
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

            {/* View Customer Details Dialog */}
            {currentCustomer && (
                <Dialog
                    open={dialogType === "view"}
                    onOpenChange={() => setDialogType(null)}
                >
                    <DialogContent className="sm:max-w-[600px] border-blue-200">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900">
                                Customer Details
                            </DialogTitle>
                            <DialogDescription>
                                Complete information for customer:{" "}
                                <span className="font-medium">
                                    {currentCustomer.custName}
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Customer ID
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {currentCustomer.custId}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span>{currentCustomer.custName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span>{currentCustomer.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span>{currentCustomer.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <span>{currentCustomer.address}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Date of Birth
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>
                                            {format(
                                                new Date(currentCustomer.dob),
                                                "MMMM dd, yyyy",
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Age
                                    </label>
                                    <Badge variant="secondary">
                                        {calculateAge(currentCustomer.dob)}{" "}
                                        years old
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Active Accounts
                                    </label>
                                    <Badge variant="default">
                                        {currentCustomer.accountCount || 0}{" "}
                                        accounts
                                    </Badge>
                                </div>
                                {currentCustomer.createdAt && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Customer Since
                                        </label>
                                        <span className="text-sm text-gray-600">
                                            {format(
                                                new Date(
                                                    currentCustomer.createdAt,
                                                ),
                                                "MMMM yyyy",
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDialogType(null)}
                            >
                                Close
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    setDialogType(null);
                                    handleEditClick(currentCustomer);
                                }}
                            >
                                Edit Customer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Edit Customer Dialog */}
            {currentCustomer && (
                <Dialog
                    open={dialogType === "edit"}
                    onOpenChange={() => setDialogType(null)}
                >
                    <DialogContent className="sm:max-w-[500px] border-blue-200 max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900">
                                Edit Customer
                            </DialogTitle>
                            <DialogDescription>
                                Update details for customer:{" "}
                                <span className="font-medium">
                                    {currentCustomer.custName}
                                </span>{" "}
                                (ID: {currentCustomer.custId})
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
                                    name="custName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Doe"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="+1 (555) 123-4567"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateForm.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="123 Main Street, City, State 12345"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateForm.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date of Birth</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value &&
                                                                    "text-muted-foreground",
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    "PPP",
                                                                )
                                                            ) : (
                                                                <span>
                                                                    Pick a date
                                                                </span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={
                                                            field.onChange
                                                        }
                                                        disabled={(date) =>
                                                            date > new Date() ||
                                                            date <
                                                                new Date(
                                                                    "1900-01-01",
                                                                )
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Customer's date of birth.
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

            {/* Delete Customer Confirmation Dialog */}
            {currentCustomer && (
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
                                Are you sure you want to delete customer:{" "}
                                <span className="font-medium">
                                    {currentCustomer.custName}
                                </span>{" "}
                                (ID: {currentCustomer.custId})?
                                <br />
                                <br />
                                <span className="text-red-600 font-medium">
                                    Warning: This action cannot be undone. Make
                                    sure the customer has no active accounts or
                                    pending transactions.
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
                                    "Delete Customer"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
