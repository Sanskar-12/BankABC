"use client";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types based on the Java backend DTOs
interface EmployeeDto {
    empId: number;
    empName: string;
    email: string;
    dob: string; // ISO date string
    phone: string;
    branchId: number;
}

interface BranchDto {
    branchId: number;
    branchName: string;
    branchAddr: string;
}

// Zod schemas matching the backend validation
const createEmployeeSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    employeeName: z.string().min(1, "Employee name is required"),
    dateOfBirth: z.date({ error: "Date of birth is required" }),
    phone: z.string().min(1, "Phone number is required"),
    branchId: z.string().min(1, "Branch is required"),
});

const updateEmployeeSchema = z.object({
    empName: z.string().min(1, "Employee name is required"),
    phone: z.string().min(1, "Phone number is required"),
    branchId: z.string().min(1, "Branch is required"),
});

type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;
type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;

// Mock data for development - replace with actual API calls
const mockEmployees: EmployeeDto[] = [
    {
        empId: 1,
        empName: "Jane Smith",
        email: "jane.smith@bankabc.com",
        dob: "1985-03-15",
        phone: "+1 (555) 111-2222",
        branchId: 101,
    },
    {
        empId: 2,
        empName: "Robert Johnson",
        email: "robert.j@bankabc.com",
        dob: "1990-07-22",
        phone: "+1 (555) 333-4444",
        branchId: 102,
    },
    {
        empId: 3,
        empName: "Emily Davis",
        email: "emily.d@bankabc.com",
        dob: "1988-11-01",
        phone: "+1 (555) 555-6666",
        branchId: 101,
    },
];

const mockBranches: BranchDto[] = [
    {
        branchId: 101,
        branchName: "Main Branch",
        branchAddr: "123 Main St, Downtown",
    },
    {
        branchId: 102,
        branchName: "Northside Branch",
        branchAddr: "456 North Ave, Northside",
    },
    {
        branchId: 103,
        branchName: "West End Branch",
        branchAddr: "789 West Blvd, West End",
    },
];

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState<EmployeeDto[]>([]);
    const [branches, setBranches] = useState<BranchDto[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<EmployeeDto[]>(
        [],
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogType, setDialogType] = useState<
        "create" | "edit" | "delete" | null
    >(null);
    const [currentEmployee, setCurrentEmployee] = useState<EmployeeDto | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);

    const createForm = useForm<CreateEmployeeFormData>({
        resolver: zodResolver(createEmployeeSchema),
        defaultValues: {
            email: "",
            password: "",
            employeeName: "",
            dateOfBirth: undefined,
            phone: "",
            branchId: "",
        },
    });

    const updateForm = useForm<UpdateEmployeeFormData>({
        resolver: zodResolver(updateEmployeeSchema),
        defaultValues: {
            empName: "",
            phone: "",
            branchId: "",
        },
    });

    // API Functions - Replace these with actual API calls
    const fetchEmployees = async (): Promise<EmployeeDto[]> => {
        // Simulate API call to GET /api/admin/employees
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return mockEmployees;
    };

    const fetchBranches = async (): Promise<BranchDto[]> => {
        // Simulate API call to GET /api/admin/branches (if available)
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockBranches;
    };

    const createEmployee = async (
        data: CreateEmployeeFormData,
    ): Promise<void> => {
        // Simulate API call to POST /api/admin/employees
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newEmployee: EmployeeDto = {
            empId: Math.max(...employees.map((e) => e.empId)) + 1,
            empName: data.employeeName,
            email: data.email,
            dob: format(data.dateOfBirth, "yyyy-MM-dd"),
            phone: data.phone,
            branchId: Number.parseInt(data.branchId),
        };

        setEmployees((prev) => [...prev, newEmployee]);
        console.log("Created employee:", newEmployee);
    };

    const updateEmployee = async (
        id: number,
        data: UpdateEmployeeFormData,
    ): Promise<void> => {
        // Simulate API call to PUT /api/admin/employees/{id}
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setEmployees((prev) =>
            prev.map((emp) =>
                emp.empId === id
                    ? {
                          ...emp,
                          empName: data.empName,
                          phone: data.phone,
                          branchId: Number.parseInt(data.branchId),
                      }
                    : emp,
            ),
        );
        console.log("Updated employee:", id, data);
    };

    const deleteEmployee = async (id: number): Promise<void> => {
        // Simulate API call to DELETE /api/admin/employees/{id}
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setEmployees((prev) => prev.filter((emp) => emp.empId !== id));
        console.log("Deleted employee:", id);
    };

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [employeesData, branchesData] = await Promise.all([
                    fetchEmployees(),
                    fetchBranches(),
                ]);
                setEmployees(employeesData);
                setBranches(branchesData);
            } catch (err) {
                setError("Failed to load data. Please try again.");
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter employees based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredEmployees(employees);
        } else {
            const filtered = employees.filter(
                (emp) =>
                    emp.empName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    emp.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    emp.phone.includes(searchTerm),
            );
            setFilteredEmployees(filtered);
        }
    }, [employees, searchTerm]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            const employeesData = await fetchEmployees();
            setEmployees(employeesData);
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

    const handleEditClick = (employee: EmployeeDto) => {
        setCurrentEmployee(employee);
        updateForm.reset({
            empName: employee.empName,
            phone: employee.phone,
            branchId: String(employee.branchId),
        });
        setDialogType("edit");
    };

    const handleDeleteClick = (employee: EmployeeDto) => {
        setCurrentEmployee(employee);
        setDialogType("delete");
    };

    const onCreateSubmit = async (values: CreateEmployeeFormData) => {
        try {
            setIsSubmitting(true);
            setError(null);
            await createEmployee(values);
            setDialogType(null);
            createForm.reset();
        } catch (err) {
            setError("Failed to create employee. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onUpdateSubmit = async (values: UpdateEmployeeFormData) => {
        if (!currentEmployee) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await updateEmployee(currentEmployee.empId, values);
            setDialogType(null);
            setCurrentEmployee(null);
        } catch (err) {
            setError("Failed to update employee. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (!currentEmployee) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await deleteEmployee(currentEmployee.empId);
            setDialogType(null);
            setCurrentEmployee(null);
        } catch (err) {
            setError("Failed to delete employee. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getBranchName = (branchId: number) => {
        const branch = branches.find((b) => b.branchId === branchId);
        return branch ? branch.branchName : `Branch ${branchId}`;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Manage Employees
                </h1>
                <p className="text-gray-600 mt-1">
                    View, create, update, and delete employee records.
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
                            All Employees
                        </CardTitle>
                        <CardDescription>
                            Overview of all bank employees and their details.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            <RefreshCw
                                className={cn(
                                    "h-4 w-4 mr-2",
                                    loading && "animate-spin",
                                )}
                            />
                            Refresh
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleCreateClick}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Employee
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Search Bar */}
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search employees by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    {/* Employee Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-3 text-gray-600">
                                Loading employees...
                            </span>
                        </div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                            {searchTerm
                                ? "No employees found matching your search."
                                : "No employee records found."}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Date of Birth</TableHead>
                                        <TableHead className="text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEmployees.map((employee) => (
                                        <TableRow key={employee.empId}>
                                            <TableCell className="font-medium">
                                                {employee.empId}
                                            </TableCell>
                                            <TableCell>
                                                {employee.empName}
                                            </TableCell>
                                            <TableCell>
                                                {employee.email}
                                            </TableCell>
                                            <TableCell>
                                                {employee.phone}
                                            </TableCell>
                                            <TableCell>
                                                {getBranchName(
                                                    employee.branchId,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    new Date(employee.dob),
                                                    "MMM dd, yyyy",
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 bg-transparent"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                employee,
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
                                                                employee,
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

            {/* Create Employee Dialog */}
            <Dialog
                open={dialogType === "create"}
                onOpenChange={() => setDialogType(null)}
            >
                <DialogContent className="sm:max-w-[500px] border-blue-200 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">
                            Create New Employee
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the details to add a new employee to the
                            system.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...createForm}>
                        <form
                            onSubmit={createForm.handleSubmit(onCreateSubmit)}
                            className="space-y-4 py-4"
                        >
                            <FormField
                                control={createForm.control}
                                name="employeeName"
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
                                control={createForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="john.doe@bankabc.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Minimum 8 characters required.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
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
                                control={createForm.control}
                                name="dateOfBirth"
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
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
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
                                            Employee's date of birth.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createForm.control}
                                name="branchId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a branch" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {branches.map((branch) => (
                                                    <SelectItem
                                                        key={branch.branchId}
                                                        value={String(
                                                            branch.branchId,
                                                        )}
                                                    >
                                                        {branch.branchName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                        "Create Employee"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit Employee Dialog */}
            {currentEmployee && (
                <Dialog
                    open={dialogType === "edit"}
                    onOpenChange={() => setDialogType(null)}
                >
                    <DialogContent className="sm:max-w-[425px] border-blue-200">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900">
                                Edit Employee
                            </DialogTitle>
                            <DialogDescription>
                                Update details for employee:{" "}
                                <span className="font-medium">
                                    {currentEmployee.empName}
                                </span>{" "}
                                (ID: {currentEmployee.empId})
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
                                    name="empName"
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
                                    name="branchId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Branch</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a branch" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {branches.map((branch) => (
                                                        <SelectItem
                                                            key={
                                                                branch.branchId
                                                            }
                                                            value={String(
                                                                branch.branchId,
                                                            )}
                                                        >
                                                            {branch.branchName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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

            {/* Delete Employee Confirmation Dialog */}
            {currentEmployee && (
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
                                Are you sure you want to delete employee:{" "}
                                <span className="font-medium">
                                    {currentEmployee.empName}
                                </span>{" "}
                                (ID: {currentEmployee.empId})?
                                <br />
                                <span className="text-red-600 font-medium">
                                    This action cannot be undone.
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
                                    "Delete Employee"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
