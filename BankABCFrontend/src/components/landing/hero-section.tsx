import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import Hero from "@/assets/hero.png";

export function HeroSection() {
    return (
        <section
            id="home"
            className="pt-16 pb-20 sm:pt-24 sm:pb-32 bg-gradient-to-br from-blue-50 to-indigo-100"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Bank Smarter with{" "}
                            <span className="text-blue-600">BankABC</span>
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                            Experience the future of banking with our
                            comprehensive management system. Secure
                            transactions, real-time analytics, and seamless
                            customer experience all in one powerful platform.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Link to="/signup">
                                <Button
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                                >
                                    Create Free Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Bank-grade security
                            </div>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                24/7 support
                            </div>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Free setup
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div className="relative z-10">
                            <img
                                src={Hero}
                                alt="BankABC Dashboard"
                                className="rounded-2xl shadow-2xl h-[500px] aspect-square"
                            />
                        </div>
                        {/* Background decoration */}
                        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
