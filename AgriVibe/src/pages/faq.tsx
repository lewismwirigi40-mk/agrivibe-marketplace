import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is AgriVibe Marketplace?',
      answer: 'AgriVibe Marketplace is a digital platform that connects customers with verified farmers, wholesalers, and local vendors to buy fresh agricultural products online. We provide a secure, convenient, and reliable marketplace for fresh farm produce and related products.'
    },
    {
      question: 'How do I place an order?',
      answer: 'Simply browse our marketplace, add products to your cart, proceed to checkout, provide your delivery details, select your payment method, and confirm your order. You will receive a confirmation and delivery tracking information after placing your order.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept M-Pesa, Credit/Debit Cards, and Wallet Balance. All payments are processed securely through our integrated payment systems.'
    },
    {
      question: 'How does delivery work?',
      answer: 'After you place your order, the vendor prepares your items. A driver picks up your order and delivers it to your specified address. You will receive a delivery code that you must provide to the driver upon receiving your items to confirm delivery.'
    },
    {
      question: 'How do I become a vendor?',
      answer: 'You can become a vendor by completing the vendor registration form on our website. After registration, your application will be reviewed and approved by our admin team. Once approved, you can start listing products and selling on our marketplace.'
    },
    {
      question: 'What is the delivery fee?',
      answer: 'Delivery fees vary depending on your location and order size. Orders above KES 1,000 qualify for free delivery. Standard delivery fees range from KES 50 to KES 200 depending on distance and order size.'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order within 30 minutes of placing it. After that, orders cannot be cancelled as they are being processed for delivery. Contact our support team for assistance with order cancellation.'
    },
    {
      question: 'What is the delivery code?',
      answer: 'After placing an order, you receive a 6-digit delivery code via SMS and email. This code is confidential and should only be shared with your driver upon receiving your items. It helps verify successful delivery and releases payment to the vendor.'
    },
    {
      question: 'Is my payment secure?',
      answer: 'Yes, all payments are processed through secure payment gateways. We use escrow protection to hold payments until delivery is confirmed, ensuring both buyer and seller are protected throughout the transaction process.'
    },
    {
      question: 'How do I track my order?',
      answer: 'You can track your order through your account dashboard. Once your order is assigned to a driver, you will receive real-time updates on the delivery status. You can also contact our support team for assistance with order tracking.'
    },
    {
      question: 'What if I receive damaged or incorrect items?',
      answer: 'If you receive damaged or incorrect items, please contact our customer support team immediately within 24 hours of delivery. We will work with the vendor to resolve the issue, which may include a refund, replacement, or other appropriate solutions.'
    },
    {
      question: 'What is AgriVibe\'s refund policy?',
      answer: 'We strive to ensure customer satisfaction. If you are not satisfied with your purchase, you may request a refund within 7 days of delivery. Refunds are processed based on the nature of the issue and vendor policies. Contact our support team for assistance.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="pt-24 px-4 max-w-4xl mx-auto pb-16">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">❓</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Frequently Asked Questions</h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Find answers to common questions about AgriVibe Marketplace, orders, deliveries, payments, and more.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-yellow-400/50 transition-all duration-300"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className="text-white font-semibold text-lg">{faq.question}</span>
                <span className="text-2xl text-yellow-400">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Still have questions?{' '}
            <a href="/contact" className="text-yellow-400 hover:text-yellow-300 transition">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}