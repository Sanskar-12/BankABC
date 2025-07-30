import {
    Shield,
    Building2,
    DollarSign,
    BarChart3,
    FileText,
} from "lucide-react";

export function FeaturesSection() {
    const features = [
        {
            icon: Shield,
            title: "Secure Login and Role-Based Access",
            description:
                "Advanced authentication with multi-level access control for customers, employees, and administrators.",
        },
        {
            icon: Building2,
            title: "Manage Customer & Employee Data",
            description:
                "Comprehensive data management system with secure storage and easy access to all user information.",
        },
        {
            icon: DollarSign,
            title: "Track Transactions and Balances",
            description:
                "Real-time transaction monitoring with detailed balance tracking and transaction history.",
        },
        {
            icon: BarChart3,
            title: "Dashboard with Real-Time Stats",
            description:
                "Interactive dashboards with live analytics, performance metrics, and business intelligence.",
        },
        {
            icon: FileText,
            title: "View Loan Applications and Approvals",
            description:
                "Streamlined loan processing with application tracking and automated approval workflows.",
        },
    ];

    return (
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Powerful Features for Modern Banking
                    </h2>
                    <p className="text-xl text-gray-600">
                        Everything you need to manage your banking operations
                        efficiently and securely
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                <feature.icon className="h-6 w-6 text-blue-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
