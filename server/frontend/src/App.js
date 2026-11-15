import { Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import LoginPanel from "./components/Login/Login";
import "./App.css";

function Home() {
  return (
    <main className="site-page">
      <section className="home-hero">
        <p className="eyebrow">Find your next drive</p>
        <h1>Your journey starts here.</h1>
        <p>Explore trusted dealerships and discover a car that feels right for you.</p>
        <Link className="btn btn-primary" to="/about">Meet our team</Link>
      </section>
    </main>
  );
}

function About() {
  return (
    <main className="site-page">
      <section className="page-intro">
        <p className="eyebrow">About us</p>
        <h1>Good drives begin with good people.</h1>
        <p>We bring drivers and trusted dealerships together to make finding your next car a more straightforward, confident experience.</p>
      </section>
      <section className="about-grid" aria-label="Our values">
        <article className="info-card"><span className="card-number">01</span><h2>People first</h2><p>We believe a great car buying experience starts with listening, clear information, and helpful service.</p></article>
        <article className="info-card"><span className="card-number">02</span><h2>Trusted partners</h2><p>Our dealership directory helps you connect with local teams ready to help you find the right fit.</p></article>
        <article className="info-card"><span className="card-number">03</span><h2>Here to help</h2><p>From your first search to your next question, we want every step to feel easy to navigate.</p></article>
      </section>
    </main>
  );
}

function Contact() {
  return (
    <main className="site-page contact-layout">
      <section className="page-intro contact-intro">
        <p className="eyebrow">Contact us</p>
        <h1>We’re happy to help.</h1>
        <p>Have a question about our dealerships or need a hand getting started? Reach out and our team will point you in the right direction.</p>
      </section>
      <section className="contact-card" aria-label="Contact information">
        <div><span className="contact-label">Email</span><a href="mailto:hello@dealerships.example">hello@dealerships.example</a></div>
        <div><span className="contact-label">Phone</span><a href="tel:+18005550142">+1 (800) 555-0142</a></div>
        <div><span className="contact-label">Office hours</span><p>Monday–Friday, 9:00 AM–5:00 PM</p></div>
      </section>
    </main>
  );
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPanel />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
