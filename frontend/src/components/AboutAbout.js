import React from "react";
import "../styles/AboutAbout.css";
import aboutImage from "../assets/cyber1.jpg"; 

const AboutAbout = () => {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2 className="about-title">Who we are</h2>
        <p>
          Unihub Solutions Uganda is a fast-growing ICT company that
          provides automated, end-to-end technology solutions for businesses,
          institutions, and individuals.
        </p>
        <p>
          We bring together a skilled team of engineers, designers, and
          consultants with a shared vision: to make innovative, affordable, and
          scalable technology accessible across Uganda and beyond. Our strength
          lies in offering customized solutions tailored to the needs of each
          client — whether you’re a small startup, a large enterprise, or a
          government agency.
        </p>
      </div>
      <div className="about-image">
        <img src={aboutImage} alt="Technology Illustration" />
      </div>
    </section>
  );
};

export default AboutAbout;
