import { useState } from "react";
import { Link } from "react-router-dom";
import MenuItem from "./MenuItem";
import { useAuth } from "../../contexts/AuthContext";

import logo from "/assets/img/icon/loyola-logo.svg";

import navitemlist from "../../dataJson/navitemlist.json";

export default function NavMenu() {
  const { user, isAuthenticated } = useAuth();
  const [navBar, setNavbar] = useState("");
  const [navlist, setNavList] = useState("");

  const navBarShow = () => {
    if (navBar == "") {
      setNavbar("ak-toggle_active");
    } else {
      setNavbar("");
    }

    if (navlist == "") {
      setNavList("ak-show-moblie-nav-list");
    } else {
      setNavList("");
    }
  };

  return (
    <div className="ak-main_header">
      <div className="container">
        <div className="ak-main_header_in">
          <div className="ak-main-header-left">
            <Link className="ak-site_branding" to="/">
              <img src={logo} alt="Loyola Motors Logo" />
            </Link>
          </div>
          <div className="ak-main-header-center">
            <div className="ak-nav ak-medium">
              <ul id="ak-nav_list" className={`ak-nav_list ${navlist}`}>
                {navitemlist?.map((item, i) => {
                  return <MenuItem props={item} key={i} />;
                })}
              </ul>
              <span
                onClick={() => navBarShow()}
                id="navBar"
                className={`ak-munu_toggle ${navBar}`}
              >
                <span></span>
              </span>
            </div>
          </div>
          <div className="ak-main-header-right">
            <Link to="tel:+34640162947">
              <div className="d-flex align-items-center gap-3">
                <div className="heartbeat-icon">
                  <span className="ak-heartbeat-btn">
                    <img src="/assets/img/icon/phone.svg" alt="..." />
                  </span>
                </div>
                <h6>+34 640 16 29 47</h6>
              </div>
            </Link>

            {/* Login/Dashboard Button */}
            <div className="ak-header-login" style={{ marginLeft: "20px" }}>
              {isAuthenticated() && user ? (
                <Link
                  to="/dashboard"
                  className="ak-login-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: "linear-gradient(135deg, #ff3d24, #e02912)",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "25px",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(255, 61, 36, 0.3)",
                  }}
                >
                  <span>📊</span>
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="ak-login-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: "transparent",
                    color: "var(--heading-color)",
                    textDecoration: "none",
                    border: "2px solid rgba(255, 61, 36, 0.3)",
                    borderRadius: "25px",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span>🔑</span>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
