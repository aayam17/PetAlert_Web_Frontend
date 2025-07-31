import React from "react";
import '../css/contactus.css';  

const Contact = () => {
  return (
    <section className="contact-section" aria-labelledby="contact-title">
      <header className="contact-hero">
        <h2 id="contact-title" className="contact-title">Contact Us</h2>
        <p className="contact-tagline">
          We'd love to hear from you! Reach out through any of the methods below.
        </p>
      </header>

      <div className="contact-display">
        <p><strong>Email:</strong> <a href="mailto:petalert@gmail.com">petalert@gmail.com</a></p>
        <p><strong>Phone:</strong> +977 9849610810</p>
        <p><strong>Location:</strong> Kathmandu, Nepal</p>
        <p><strong>Support Hours:</strong> Available 24/7 on our website</p>
      </div>
    </section>
  );
};

export default Contact;
