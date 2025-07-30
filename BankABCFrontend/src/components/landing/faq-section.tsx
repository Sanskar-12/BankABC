import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
    const faqs = [
        {
            question: "How secure is BankABC?",
            answer: "BankABC employs bank-grade security measures including 256-bit SSL encryption, multi-factor authentication, and regular security audits. All data is stored in secure, compliant data centers with 24/7 monitoring.",
        },
        {
            question: "Can I use it as a customer and admin?",
            answer: "Yes! BankABC supports multiple user roles including customers, employees, and administrators. Each role has specific permissions and access levels, allowing you to manage different aspects of the banking system based on your role.",
        },
        {
            question: "Do I need to install any software?",
            answer: "No installation required! BankABC is a web-based platform that works directly in your browser. Simply access it through any modern web browser on desktop, tablet, or mobile devices.",
        },
        {
            question: "Is there any cost involved?",
            answer: "We offer flexible pricing plans including a free tier for small operations. Our paid plans start at competitive rates with no hidden fees. Contact our sales team for custom enterprise pricing.",
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-600">
                        Get answers to common questions about BankABC
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="bg-white rounded-lg border border-gray-200 px-6"
                            >
                                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
