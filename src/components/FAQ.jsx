import React, { useState } from "react";
import '../css/faq.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Can I track my pet's vaccination records?",
      answer:
        "Yes! You can add, edit, and view vaccination records under each pet's records to stay up-to-date.",
    },
    {
      question: "How do I book a vet appointment?",
      answer:
        "Visit the 'Vet Appointments' page, select your prefered location and time slot, and confirm your booking.",
    },
    {
      question: "What if I lose my pet?",
      answer:
        "Use the 'Lost & Found Board' to report lost pets or check if someone has found a pet matching your description.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <header className="faq-header">
        <h2 id="faq-title" className="faq-title">Frequently Asked Questions</h2>
        <p className="faq-subtitle">
          Find answers to common questions about PetAlert.
        </p>
      </header>

      <dl className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <dt>
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                {faq.question}
                <span className="arrow">{activeIndex === index ? "▲" : "▼"}</span>
              </button>
            </dt>
            <dd
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              className="faq-answer"
            >
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default FAQ;
