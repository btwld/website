import type { Metadata } from "next";
import { ContactPage } from "../../../components/contact/ContactPage";

const description =
  "Get in touch with Concepta. Send us a message, call +1 (407) 720-4711, or visit us at 111 N Orange Ave, Suite 800, Orlando, FL.";

export const metadata: Metadata = {
  title: "Contact | Concepta",
  description,
  applicationName: "Concepta",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Concepta",
    description,
    images: ["/og_concepta.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Concepta",
    description,
    images: ["/og_concepta.png"],
  },
};

export default function Contact() {
  return <ContactPage />;
}
