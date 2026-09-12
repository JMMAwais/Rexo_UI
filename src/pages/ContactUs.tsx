import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, Headphones } from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    content: "support@markethub.pk",
    description: "We reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    content: "+92 300 1234567",
    description: "Mon - Sat, 9 AM - 6 PM",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    content: "MarketHub HQ, Lahore",
    description: "Pakistan",
  },
  {
    icon: Clock,
    title: "Working Hours",
    content: "Mon - Sat: 9 AM - 6 PM",
    description: "Sunday: Closed",
  },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <Headphones className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">Contact Us</h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Have a question, concern, or feedback? We're here to help. Reach out to our support team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-lg shadow-card p-6">
            <h2 className="font-semibold text-foreground mb-5 flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" /> Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                  <Input
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-secondary border-0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-secondary border-0"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                <Input
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="bg-secondary border-0"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                <Textarea
                  placeholder="Tell us more about your issue..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-secondary border-0 resize-none"
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" /> Send Message
              </Button>
              {submitted && (
                <p className="text-sm text-center text-green-600">Thank you! Your message has been sent.</p>
              )}
            </form>
          </div>

          <div className="space-y-4">
            {contactInfo.map(({ icon: Icon, title, content, description }) => (
              <div key={title} className="bg-card rounded-lg shadow-card p-5 flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                  <p className="text-sm text-foreground mt-0.5">{content}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-secondary rounded-lg text-center">
          <p className="text-xs text-muted-foreground">
            For seller-specific questions, please contact the seller directly through the order details page or visit the{" "}
            <a href="/help" className="text-primary hover:underline">Help Center</a>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
