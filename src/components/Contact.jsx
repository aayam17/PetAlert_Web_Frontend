import React from "react";
import '../css/contactus.css';  // fixed path here

const Contact = () => {
  return (
    <section className="contact-section" aria-labelledby="contact-title">
      <header className="contact-hero">
        <h2 id="contact-title" className="contact-title">Contact Us</h2>
        <p className="contact-tagline">
          If you have questions or need assistance, feel free to reach out to us!
        </p>
      </header>

      <address className="contact-info">
        <p><strong>Phone:</strong> 9849-XXXXXX</p>
        <p><strong>Email:</strong> <a href="mailto:support@petalert.com">support@petalert.com</a></p>
        <p><strong>Address:</strong> Kathmandu, Nepal</p>
      </address>

      <form className="contact-form" onSubmit={(e) => e.preventDefault()} aria-label="Contact form">
        <label htmlFor="name">Name:</label>
        <input id="name" name="name" type="text" placeholder="Your name" required />

        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" placeholder="Your email" required />

        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message" placeholder="Write your message here" rows={5} required></textarea>

        <button type="submit" aria-label="Send message">Send</button>
      </form>
    </section>
  );
};

export default Contact;
