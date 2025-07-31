import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const SignUp = ({ className, ...props }: React.ComponentProps<"div">) => {
    // State for the Customer sign-up form
    const [customerData, setCustomerData] = useState({
        customerName: "",
        email: "",
        password: "",
        dateOfBirth: "",
        phone: "",
    });
    const navigate = useNavigate();
    // const [isSignUp, setIsSignUp] = useState(false);
    const { register } = useAuth();

    // Handle input changes
    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleCustomerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const signupData = {
            customerName: customerData.customerName,
            email: customerData.email,
            password: customerData.password,
            phone: customerData.phone,
            dateOfBirth: new Date(customerData.dateOfBirth)
                .toISOString()
                .split("T")[0],
        };

        console.log("Customer SignUp Data:", {
            ...customerData,
            dateOfBirth: new Date(customerData.dateOfBirth)
                .toISOString()
                .split("T")[0],
        });
        const result = await register(signupData);
        if (result.success) {
            toast.success(`account created successfully! Please sign in.`);
            navigate("/login");
            // setIsSignUp(true);
        } else {
            toast.error(
                result.error || "Registration failed. Please try again.",
            );
        }
        // TODO: Add API call for customer sign-up
    };

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-lg flex-col gap-6">
                <a
                    href="#"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="bg-blue-600 text-white flex size-6 items-center justify-center rounded-md">
                        <Building2 className="size-4" />
                    </div>
                    BankABC
                </a>
                <div
                    className={cn("flex flex-col gap-6", className)}
                    {...props}
                >
                    <Card className="w-full">
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">
                                Create Your BankABC Account
                            </CardTitle>
                            <CardDescription>
                                Fill out the form below to sign up
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="space-y-4"
                                onSubmit={handleCustomerSubmit}
                            >
                                <div className="grid gap-3">
                                    <Label htmlFor="customer-name">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="customer-name"
                                        name="customerName"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        value={customerData.customerName}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="customer-email">
                                        Email
                                    </Label>
                                    <Input
                                        id="customer-email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        value={customerData.email}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="customer-password">
                                        Password
                                    </Label>
                                    <Input
                                        id="customer-password"
                                        name="password"
                                        type="password"
                                        required
                                        value={customerData.password}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="customer-phone">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="customer-phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        required
                                        value={customerData.phone}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="customer-dob">
                                        Date of Birth
                                    </Label>
                                    <Input
                                        id="customer-dob"
                                        name="dateOfBirth"
                                        type="date"
                                        required
                                        value={customerData.dateOfBirth}
                                        onChange={handleCustomerChange}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Sign Up
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="self-center">
                            <Link to="/login">
                                <div className="text-muted-foreground text-center text-xs text-balance">
                                    Already have an account?{" "}
                                    <strong>Log In</strong>
                                </div>
                            </Link>
                        </CardFooter>
                    </Card>
                    <div className="text-muted-foreground text-center text-xs text-balance">
                        By signing up, you agree to BankABC's{" "}
                        <a
                            href="#"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                            href="#"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Privacy Policy
                        </a>
                        .
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
