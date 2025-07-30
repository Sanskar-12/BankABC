import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Define the possible user roles
type UserRole = "Customer" | "Employee" | "Admin";

export default function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [role, setRole] = useState<UserRole>("Customer");

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const {login}=useAuth()
    const [isLogin, setIsLogin] = useState(false);

    const { user } = useAuth();
    console.log(user)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    // A single submission handler
    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would now make an API call with the role and credentials
        console.log({
            role,
            email: credentials.email,
            password: credentials.password,
        });

        const loginData={
            username: credentials.email,
            password: credentials.password,
        }
        const result = await login(loginData);
        if (result.success) {
          toast.success(`Signed In successfully!`);
          setIsLogin(true);
        } else {
          toast.error(result.error || 'Signin failed. Please try again.');
        }
    };

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-lg flex-col gap-6">
                {/* Increased max width here */}
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
                    className={cn(
                        "flex flex-col justify-center gap-6 w-full",
                        className,
                    )}
                    {...props}
                >
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">
                                Welcome to BankABC
                            </CardTitle>
                            <CardDescription>
                                Select your role, then enter your email and
                                password to log in.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Tabs are now used only to select the role */}
                            <Tabs
                                value={role}
                                onValueChange={(value) =>
                                    setRole(value as UserRole)
                                }
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="Customer">
                                        Customer
                                    </TabsTrigger>
                                    <TabsTrigger value="Employee">
                                        Employee
                                    </TabsTrigger>
                                    <TabsTrigger value="Admin">
                                        Admin
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {/* The form is now outside the TabsContent, as it's the same for all roles */}
                            <form
                                className="space-y-4 mt-6"
                                onSubmit={handleSubmit}
                            >
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Username</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        required
                                        value={credentials.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={credentials.password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="self-center">
                            <Link to="/signup">
                                <div className="text-muted-foreground text-center text-xs text-balance">
                                    Don't have an account? <strong>Sign up</strong>
                                </div>
                            </Link>
                        </CardFooter>
                    </Card>
                    <div className="text-muted-foreground text-center text-xs text-balance">
                        By logging in, you agree to BankABC's{" "}
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
}
