import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../constants";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from "./Icons";

const PAYMENT_METHODS = ["Visa", "Mastercard", "RuPay", "UPI", "Net Banking"];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "X", href: "https://x.com", Icon: XIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeIcon },
];

const Footer = ({ user }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <section className="footer-newsletter">
        <div className="footer-newsletter-copy">
          <h2>Join the list</h2>
          <p>Early access to new drops, restocks and private offers</p>
        </div>
        {subscribed ? (
          <p className="newsletter-success" role="status">
            Thanks for subscribing. Watch your inbox.
          </p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        )}
      </section>

      <div className="footer-main">
        <div className="footer-col footer-brand-col">
          <Link to="/" className="footer-brand">
            SHOPKART
          </Link>
          <p>
            Fashion, tech and home essentials, curated for the way you live now.
            Delivered to your door.
          </p>
          <div className="footer-socials">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
              >
                <Icon width={20} height={20} />
              </a>
            ))}
          </div>
        </div>

        <nav className="footer-col" aria-label="Shop">
          <h3>Shop</h3>
          <ul>
            <li>
              <Link to="/products">New In</Link>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link to={`/products?category=${category}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Customer care">
          <h3>Customer Care</h3>
          <ul>
            <li>
              <Link to="/info/shipping">Shipping &amp; Delivery</Link>
            </li>
            <li>
              <Link to="/info/returns">Returns &amp; Exchanges</Link>
            </li>
            <li>
              <Link to="/info/faq">FAQs</Link>
            </li>
            <li>
              <Link to="/info/contact">Contact Us</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Account">
          <h3>My Account</h3>
          <ul>
            {user ? (
              <>
                <li>
                  <Link to="/profile">My Profile</Link>
                </li>
                <li>
                  <Link to="/orders">Track Orders</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Create Account</Link>
                </li>
              </>
            )}
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/cart">Shopping Bag</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Company">
          <h3>Company</h3>
          <ul>
            <li>
              <Link to="/info/about">About Us</Link>
            </li>
            <li>
              <Link to="/info/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/info/terms">Terms of Service</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SHOPKART. All rights reserved.</p>
        <ul className="payment-methods" aria-label="Accepted payment methods">
          {PAYMENT_METHODS.map((method) => (
            <li key={method}>{method}</li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
