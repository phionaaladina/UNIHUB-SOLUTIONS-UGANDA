
import React from "react";
import ServiceHero from "../components/ServiceHero";
import ServiceCard from "../components/ServiceCard";
import "../styles/ServiceHero.css";
import "../styles/ServiceCard.css";
import WebDev from '../assets/webdev.jpg';
import Ecommerce from '../assets/eComm.jpeg';
import MobApp from '../assets/mobApp.jpeg';
import ITSuppt from '../assets/itSupport.jpg';
import HelpDesk from '../assets/helpDesk.jpg';
import Cyber from '../assets/cyber.jpg';
import Network from '../assets/network.jpg';
import Compliance from '../assets/compliance.jpg';
import Cloud from '../assets/cloud.jpg';
import Repair from '../assets/repair.jpg';
import Equipment from '../assets/equipment.png';
import SmartHome from '../assets/smarthome.jpg';
import Data from '../assets/data.jpg';
import Training from '../assets/training.jpg';
import Marketing from '../assets/marketing.jpg';

// Replace these with your actual data later
const categories = [
  {
    sectionTitle: "Web and Software Development",
    services: [
      {
        title: "Web Development",
        image: WebDev,
        description:
          "We design & develop dynamic, user-friendly websites & web applications that are tailored to your business needs. We create responsive & high-performing web solutions that improve user engagement and drive business results.",
      },
      {
        title: "Ecommerce Platform Development",
        image: Ecommerce,
        description:
          "Looking to build an online store or marketplace? Our experts help businesses set up secure, scalable, and user-friendly e-commerce platforms that offer seamless shopping experiences for your customers.",
      },
      {
        title: "Mobile App Development",
        image: MobApp,
        description:
          "Expand your reach with custom mobile applications for iOS and Android. Our mobile development services ensure your app is intuitive, feature-rich, and optimized for the best user experience.",
      },
    ],
  },
  {
    sectionTitle: "Managed IT Services",
    services: [
      {
        title: "IT support & Maintenance",
        image: ITSuppt,
        description:
          "Let us handle your day-to-day IT operations with continuous monitoring, updates, and technical support, so you can focus on what matters most — growing your business.",
      },
      {
        title: "IT Help Desk Support ",
        image: HelpDesk,
        description:
          "Our dedicated team offers remote and on-site support to resolve technical issues swiftly, ensuring minimal downtime and maximum productivity for your business.",
      },
      {
        title: "Network Setup & Management",
        image: Network,
        description:
          "We design, implement, and manage business network infrastructures, ensuring high performance, security, and reliability.",
      },
    ],
  },
  {
    sectionTitle: "Cyber Security & Cloud Migration Services",
    services: [
      {
        title: "Risk Assessment & Protection",
        image: Cyber,
        description:
          "Safeguard your business from cyber threats with our comprehensive cybersecurity services, including risk assessments, vulnerability testing, and strategic security planning.",
      },
      {
        title: "Compliance & Regulatory Support",
        image: Compliance,
        description:
          "We assist businesses in adhering to industry-specific security regulations and data protection laws to ensure compliance and avoid costly penalties.",
      },
      {
        title: "Seamless Cloud Migration",
        image: Cloud,
        description:
          "Move your business operations to the cloud with ease. We provide cloud migration services that enable you to store, manage, and access your data more securely and efficiently, all while cutting costs.",
      },
    ],
  },
  {
    sectionTitle: "Hardware & Infrastructure Services",
    services: [
      {
        title: "Computer Repair & Maintenance",
        image: Repair,
        description:
          "Our experienced technicians offer fast and reliable repair services for all types of computers and devices, ensuring your hardware is always up and running.",
      },
      {
        title: "IT Equipment Sales & Leasing",
        image: Equipment,
        description:
          "Whether you need to buy or lease new IT equipment, we provide a range of computers, servers, and networking devices to meet your business needs.",
      },
      {
        title: "Smart Home & Office Installation",
        image: SmartHome,
        description:
          "We specialize in the setup and installation of automated systems for homes and offices, ensuring your environment is tech-friendly and optimized for productivity.",
      },
    ],
  },
  {
    sectionTitle: "Specialized IT Services",
    services: [
      {
        title: "Data & Business Intelligence",
        image: Data,
       description: `Optimize operations with smart insights and powerful data tools.\n• Database Administration & Consulting.\n• Business Intelligence & Analytics`
      },
      
       {
        title: "IT Training & Skill Development",
        image: Training,
        description:
          `Build internal capacity with expert-led technical training and certification. \n• IT Training & Certification \n• Customized tech upskilling programs`,
      },
      {
        title: "Digital Marketing Technology",
        image: Marketing,
        description:
          `Boost your digital footprint using modern marketing tools and platforms.
\n• SEO & Social Media Tools.
\n• Marketing Automation Platforms.
\n• Analytics Integration.`,
      },
    ],
  },
];

function Services() {
  return (
    <div>
      <ServiceHero />
      {categories.map((category, index) => (
        <ServiceCard
          key={index}
          sectionTitle={category.sectionTitle}
          services={category.services}
        />
      ))}
    </div>
  );
}

export default Services;
