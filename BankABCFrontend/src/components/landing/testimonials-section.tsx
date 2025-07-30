import { Star } from "lucide-react";

export function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Johnson",
            designation: "Small Business Owner",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
            quote: "BankABC has transformed how I manage my business finances. The real-time dashboard and secure transactions give me complete peace of mind.",
        },
        {
            name: "Michael Chen",
            designation: "Bank Manager",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
            quote: "As a bank manager, I appreciate the comprehensive employee management features and the intuitive interface that makes training new staff effortless.",
        },
        {
            name: "Emily Rodriguez",
            designation: "Personal Banking Customer",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
            quote: "The loan application process was incredibly smooth, and I love how I can track all my transactions in real-time. Highly recommended!",
        },
    ];

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        What Our Users Say
                    </h2>
                    <p className="text-xl text-gray-600">
                        Trusted by thousands of customers and banking
                        professionals worldwide
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-5 w-5 text-yellow-400 fill-current"
                                    />
                                ))}
                            </div>
                            <blockquote className="text-gray-700 mb-6 leading-relaxed">
                                "{testimonial.quote}"
                            </blockquote>
                            <div className="flex items-center">
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {testimonial.designation}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
