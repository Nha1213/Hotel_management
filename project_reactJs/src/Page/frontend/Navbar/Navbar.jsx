import { NavLink } from "react-router-dom";
import "./navbar.css";
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3 fixed-top">
      <div className="container-fluid px-4">

        {/* Logo */}
        <NavLink className="navbar-brand fw-bold logo" to="/">
          BABEL SIEM REAP
        </NavLink>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">

            <li className="nav-item">
              <NavLink className="nav-link" to="/boutique">
                Boutique
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/guesthouse">
                Guesthouse
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/experiences">
                Experiences
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About Us
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/environment">
                Environmental Initiatives
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/blog">
                Blog
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/press">
                Press
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/faq">
                FAQ
              </NavLink>
            </li>

          </ul>

          {/* Button */}
          <NavLink className="btn book-btn" to="/booking">
            Book Now
          </NavLink>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;