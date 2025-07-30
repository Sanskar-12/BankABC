import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer id="contact" className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    SB
                                </span>
                            </div>
                            <span className="text-xl font-bold">BankABC</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            The future of banking technology. Secure, reliable,
                            and user-friendly banking management system for
                            modern financial institutions.
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                to="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link
                                to="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link
                                to="#"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#home"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#features"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Services
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#testimonials"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Testimonials
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold mb-4">Contact Info</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-blue-400" />
                                <span className="text-gray-400">
                                    support@BankABC.com
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-blue-400" />
                                <span className="text-gray-400">
                                    +91 799 779 7999
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2025 BankABC. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link
                            to="#"
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            Terms & Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
