import { UserPlus, Send, FileCheck, MapPin } from "lucide-react";

export function ServicesSection() {
    const services = [
        {
            icon: UserPlus,
            title: "Customer Account Opening",
            description:
                "Streamlined digital account opening process with instant verification and approval.",
        },
        {
            icon: Send,
            title: "Funds Transfer",
            description:
                "Secure and instant money transfers between accounts with real-time notifications.",
        },
        {
            icon: FileCheck,
            title: "Loan Applications",
            description:
                "Digital loan application process with automated credit scoring and quick approvals.",
        },
        {
            icon: MapPin,
            title: "Branch Locator",
            description:
                "Find nearby branches and ATMs with interactive maps and real-time availability.",
        },
    ];

    return (
        <section id="services" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Our Banking Services
                    </h2>
                    <p className="text-xl text-gray-600">
                        Comprehensive banking solutions designed to meet all
                        your financial needs
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                <service.icon className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
