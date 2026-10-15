import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";

// Placeholder copy: replace with your real policies before launch.
const PAGES = {
  shipping: {
    title: "Shipping & Delivery",
    sections: [
      {
        heading: "Delivery times",
        body: "Orders are processed within 1-2 business days. Standard delivery takes 3-7 business days depending on your location.",
      },
      {
        heading: "Tracking your order",
        body: "Once your order is placed you can follow its status any time from the Orders section of your account.",
      },
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    sections: [
      {
        heading: "7-day returns",
        body: "Not happy with something? Return unused items in their original packaging within 7 days of delivery.",
      },
      {
        heading: "Refunds",
        body: "Refunds are issued to your original payment method once we have received and inspected the returned item.",
      },
    ],
  },
  faq: {
    title: "FAQs",
    sections: [
      {
        heading: "How do I place an order?",
        body: "Add items to your bag, head to checkout, enter your delivery address and complete the payment.",
      },
      {
        heading: "Can I change or cancel my order?",
        body: "Get in touch as soon as possible after ordering and we will do our best to help before it ships.",
      },
    ],
  },
  contact: {
    title: "Contact Us",
    sections: [
      {
        heading: "We're here to help",
        body: "Email support@shopkart.example and our team will get back to you within one business day.",
      },
    ],
  },
  about: {
    title: "About Us",
    sections: [
      {
        heading: "Our story",
        body: "SHOPKART brings together fashion, technology and home essentials in one place, with a focus on quality, fair prices and a smooth shopping experience.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "Your data",
        body: "We only collect the information needed to process your orders and improve your experience, and we never sell it to third parties.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    sections: [
      {
        heading: "Using SHOPKART",
        body: "By placing an order you agree to provide accurate information and to pay for the items you purchase.",
      },
    ],
  },
};

const InfoPage = () => {
  const { slug } = useParams();
  const page = PAGES[slug];

  if (!page) return <Navigate to="/" replace />;

  return (
    <article className="info-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{page.title}</span>
      </nav>
      <h1>{page.title}</h1>
      {page.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </article>
  );
};

export default InfoPage;
