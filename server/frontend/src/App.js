import { Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import LoginPanel from "./components/Login/Login";
import "./components/assets/bootstrap.min.css";
import "./components/assets/style.css";
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
  const team = [
    {
      name: "Maya Chen",
      role: "Customer Experience Lead",
      detail: "Maya helps drivers compare their options and feel confident at every step of the search.",
      email: "maya.chen@bestcardealership.com",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=720&h=560&q=85",
      alt: "Maya Chen meeting with a customer",
    },
    {
      name: "Daniel Brooks",
      role: "Dealer Partnerships Manager",
      detail: "Daniel works with our dealership partners to keep local listings helpful and up to date.",
      email: "daniel.brooks@bestcardealership.com",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=720&h=560&q=85",
      alt: "Daniel Brooks collaborating with colleagues",
    },
    {
      name: "Sofia Martinez",
      role: "Sales Advisor",
      detail: "Sofia brings hands-on automotive experience and a no-pressure approach to finding the right car.",
      email: "sofia.martinez@bestcardealership.com",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=720&h=560&q=85",
      alt: "Sofia Martinez speaking with a customer",
    },
  ];

  return (
    <main className="site-page">
      <section className="page-intro">
        <p className="eyebrow">About us</p>
        <h1>Good drives begin with good people.</h1>
        <p>We bring drivers and trusted dealerships together to make finding your next car a more straightforward, confident experience.</p>
      </section>
      <section className="about-grid team-grid" aria-label="Meet our team">
        {team.map((member) => (
          <article className="team-card" key={member.email}>
            <img className="team-photo" src={member.image} alt={member.alt} loading="lazy" />
            <div className="team-card-body">
              <h2>{member.name}</h2>
              <p className="team-role">{member.role}</p>
              <p className="team-detail">{member.detail}</p>
              <a className="team-email" href={`mailto:${member.email}`}>{member.email}</a>
            </div>
          </article>
        ))}
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
