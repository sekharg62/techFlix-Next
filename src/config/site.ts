import { siteConfig as contact } from "@/constants/siteConfig";

export const siteConfig = {
  name: "TECH FLIX",
  description: "The Future of Entertainment is Here.",
  faqs: [
    {
      question: "What is TECH FLIX?",
      answer: "TECH FLIX is a premium streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices."
    },
    {
      question: "How fast will I get my subscription?",
      answer: "Most orders arrive within 5 to 10 minutes. Your login or code is sent on WhatsApp."
    },
    {
      question: "How can I pay?",
      answer: "You can pay with bKash, Nagad or Rocket using Send Money."
    },
    {
      question: "What if my account or code stops working?",
      answer: "Message us on WhatsApp. If it stops working during your plan, we replace it or refund you."
    },
    {
      question: "How do I contact support?",
      answer: `Chat with us on WhatsApp at ${contact.phone}, from 9 AM to midnight.`
    }
  ]
};
