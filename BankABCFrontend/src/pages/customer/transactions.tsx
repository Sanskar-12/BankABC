"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Loader2, CheckCircle, ArrowUpCircle, ArrowDownCircle, DollarSign, CreditCard,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// SCHEMAS
const depositSchema = z.object({
  accountId: z.string().min(1, "Account ID is required").regex(/^\d+$/, "Account ID must be a number"),
  amount: z.string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter valid amount")
    .refine((val) => Number.parseFloat(val) > 0, { message: "Amount must be greater than 0" })
    .refine((val) => Number.parseFloat(val) <= 50000, { message: "Max is $50,000" }),
  type: z.enum(["DEPOSIT", "LOAN_REPAYMENT"]),
});

const withdrawSchema = z.object({
  accountId: z.string().min(1, "Account ID is required").regex(/^\d+$/, "Account ID must be a number"),
  amount: z.string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter valid amount")
    .refine((val) => Number.parseFloat(val) > 0, { message: "Amount must be greater than 0" })
    .refine((val) => Number.parseFloat(val) <= 10000, { message: "Max is $10,000" }),
  type: z.literal("WITHDRAWAL"),
});

type DepositFormData = z.infer<typeof depositSchema>;
type WithdrawFormData = z.infer<typeof withdrawSchema>;

export default function Transactions() {
  const [activeTab, setActiveTab] = useState("deposit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const { getCookie } = useAuth();

  const depositForm = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: { accountId: "", amount: "", type: "DEPOSIT" },
  });

  const withdrawForm = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: { accountId: "", amount: "", type: "WITHDRAWAL" },
  });

  const handleTransactionResult = (payload: any, transId: number) => {
    setTransactionResult({ ...payload, transactionId: transId });
    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setTransactionResult(null);
      depositForm.reset();
      withdrawForm.reset();
    }, 4000);
  };

  const onDepositSubmit = async (values: Omit<DepositFormData, "type">) => {
    setIsSubmitting(true);
    const payload = {
      accountId: Number(values.accountId),
      amount: Number(values.amount),
      type: "DEPOSIT",
    };

    const { data } = await axios.post("http://localhost:8080/api/user/accounts/deposit", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("auth_token")}`,
      },
    });

    handleTransactionResult(payload, data.transId);
  };

  const onWithdrawSubmit = async (values: Omit<WithdrawFormData, "type">) => {
    setIsSubmitting(true);
    const payload = {
      accountId: Number(values.accountId),
      amount: Number(values.amount),
      type: "WITHDRAWAL",
    };

    const { data } = await axios.post("http://localhost:8080/api/user/accounts/withdraw", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("auth_token")}`,
      },
    });

    handleTransactionResult(payload, data.transId);
  };

  if (isSubmitted && transactionResult) {
    const isCredit = transactionResult.type === "DEPOSIT";
    const sign = isCredit ? "+" : "-";
    const amountColor = isCredit ? "text-green-600" : "text-red-600";

    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isCredit ? "Deposit" : "Withdrawal"} Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your {isCredit ? "deposit" : "withdrawal"} has been processed.
          </p>

          <Card className="max-w-md mx-auto border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                {isCredit ? (
                  <ArrowDownCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowUpCircle className="h-5 w-5 text-red-600" />
                )}
                Transaction Receipt
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">{transactionResult.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account ID:</span>
                <span className="font-medium">{transactionResult.accountId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{transactionResult.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className={`font-bold text-lg ${amountColor}`}>
                  {sign}${transactionResult.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">Deposit or withdraw money.</p>
      </div>

      <Card className="border-blue-200 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Account Transactions</CardTitle>
          <CardDescription>Choose between deposit or withdrawal</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="deposit" className="flex items-center gap-2">
                <ArrowDownCircle className="h-4 w-4" />
                Deposit
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="flex items-center gap-2">
                <ArrowUpCircle className="h-4 w-4" />
                Withdraw
              </TabsTrigger>
            </TabsList>

            {/* Deposit Tab */}
            <TabsContent value="deposit">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Info */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" /> Deposit Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-100 p-3 rounded text-green-800 text-sm border border-green-200">
                      <p className="font-medium">Daily Limit: $50,000</p>
                      <p>No fees for deposits</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Make a Deposit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...depositForm}>
                      <form onSubmit={depositForm.handleSubmit(onDepositSubmit)} className="space-y-4">
                        <FormField
                          control={depositForm.control}
                          name="accountId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account ID</FormLabel>
                              <FormControl><Input placeholder="12345" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={depositForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount ($)</FormLabel>
                              <FormControl><Input type="number" {...field} /></FormControl>
                              <FormDescription>Max: $50,000</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={depositForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Deposit Type</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="DEPOSIT">Deposit</SelectItem>
                                    <SelectItem value="LOAN_REPAYMENT">Loan Repayment</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full bg-green-600 text-white" disabled={isSubmitting}>
                          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Processing...</> : "Deposit"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Withdraw Tab */}
            <TabsContent value="withdraw">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" /> Withdrawal Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-red-100 p-3 rounded text-red-800 text-sm border border-red-200">
                      <p className="font-medium">Daily Limit: $10,000</p>
                      <p>Fees may apply</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Make a Withdrawal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...withdrawForm}>
                      <form onSubmit={withdrawForm.handleSubmit(onWithdrawSubmit)} className="space-y-4">
                        <FormField
                          control={withdrawForm.control}
                          name="accountId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account ID</FormLabel>
                              <FormControl><Input placeholder="12345" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={withdrawForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount ($)</FormLabel>
                              <FormControl><Input type="number" {...field} /></FormControl>
                              <FormDescription>Max: $10,000</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full bg-red-600 text-white" disabled={isSubmitting}>
                          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Processing...</> : "Withdraw"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
