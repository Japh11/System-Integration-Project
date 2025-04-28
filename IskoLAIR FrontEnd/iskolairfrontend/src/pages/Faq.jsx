// src/FAQ.jsx
import React, { useState } from "react";
import "./css/Faq.css"; // adjust path as needed

const faqData = [
  {
    question: "What is this website about?",
    answer: "This website provides detailed information and useful tools for your productivity and organization.",
  },
  {
    question: "How do I create an account?",
    answer: "Click the “Sign Up” button at the top right and fill in your details to get started!",
  },
  {
    question: "Can I use this service for free?",
    answer: "Yes! We offer a free tier with all the basic features. Premium options are also available.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <div className="faq">
        {faqData.map((item, index) => (
          <div className="faq-item" key={index}>
            <button
              className={`faq-question ${openIndex === index ? "open" : ""}`}
              onClick={() => toggle(index)}
            >
              {item.question}
            </button>
            <div className={`faq-answer ${openIndex === index ? "active" : ""}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
