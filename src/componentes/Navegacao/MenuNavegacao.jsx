import { useState } from "react";
import { Link } from "react-router-dom";
import MenuItem from "./MenuItem";
import { useAuth } from "../../contexts/AuthContext";

import logo from "/assets/img/icon/loyola-logo-v2.png";

import navitemlist from "../../dataJson/navitemlist.json";

export default function NavMenu() {
  const { isAuthenticated } = useAuth();
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
            {/* Login Button - Only show login when not authenticated */}
            {!isAuthenticated() && (
              <div className="ak-header-login" style={{ marginLeft: "20px" }}>
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
                    borderRadius: "25px",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    border: "2px solid var(--primary-color)",
                  }}
                >
                  <span>🔐</span>
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
