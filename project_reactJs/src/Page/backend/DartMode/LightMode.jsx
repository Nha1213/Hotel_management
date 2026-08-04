import { useState, useEffect } from "react";
import "./style.css";

const LightMode = (props) => {
  const {title} = props;
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  return (
    <div className="dashboard-header">
      <h2>{title}</h2>

      <button
        className="live-btn"
        onClick={() => setDarkMode(!darkMode)}
        aria-pressed={darkMode}
      >
        <span></span>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default LightMode;
