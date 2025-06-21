import React from "react";
import '../css/aboutus.css'; 

const AboutUs = () => {
  return (
    <section className="about-section">
      <div className="about-hero">
        <h1 className="about-title">About <span>PetAlert</span></h1>
        <p className="about-tagline">
          Caring for your pets with innovation and love.
        </p>
      </div>
      <div className="about-content">
        <p>
          At <strong>PetAlert</strong>, we are passionate about connecting pet owners with trusted veterinary services and resources to ensure your beloved companions enjoy a happy, healthy life.
        </p>
        <p>
          Our mission is to foster a supportive community where pets and their families receive expert care combined with cutting-edge technology, making pet care seamless and accessible.
        </p>
        <p>
          From managing vaccination records to scheduling vet appointments, lost & found boards, and heartfelt memorials, <strong>PetAlert</strong> is your all-in-one trusted partner for pet care.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
