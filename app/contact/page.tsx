'use client';

import React, { useState } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { styles } from "@/utils/styles";
import { Input, Textarea } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Mail, MessageCircle, Globe } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending message
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header activeItem={4} user={null} isSellerExist={false} />
      
      <div className="w-full pt-24 pb-16">
        <div className="w-[90%] md:w-[80%] xl:w-[60%] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`${styles.heading} mb-4`}>
              Get in <span className="text-[#64ff4c]">Touch</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Have questions? We&apos;d love to hear from you. Send us a message!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[#16c252]/10">
                    <Mail className="w-5 h-5 text-[#16c252]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-400">support@promptplace.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Live Chat</h3>
                    <p className="text-gray-400">Available 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <Globe className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Community</h3>
                    <p className="text-gray-400">Join our Discord server</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
                <h3 className="font-semibold mb-2 text-[#16c252]">Quick Response</h3>
                <p className="text-gray-400 text-sm">
                  We typically respond within 24 hours. For urgent matters,
                  please use our live chat feature.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Your Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "border-gray-700 bg-gray-900/50",
                  }}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "border-gray-700 bg-gray-900/50",
                  }}
                />

                <Input
                  label="Subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "border-gray-700 bg-gray-900/50",
                  }}
                />

                <Textarea
                  label="Message"
                  placeholder="Tell us more..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  variant="bordered"
                  minRows={5}
                  classNames={{
                    input: "text-white",
                    inputWrapper: "border-gray-700 bg-gray-900/50",
                  }}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#64ff4c] text-black font-semibold hover:bg-[#52cc3d] transition-colors h-12"
                  isLoading={loading}
                  size="lg"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
