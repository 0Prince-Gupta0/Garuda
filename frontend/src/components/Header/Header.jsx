import React, { useContext, useEffect, useRef } from "react";
import logo from "../../assets/images/logo3.png";
import { NavLink, Link } from "react-router-dom";
import profile from "../../assets/images/avatar-icon.png";
import { BiMenu } from "react-icons/bi";
import { AuthContext } from "../../context/AuthContext";

const navLinks = [
  {
    path: "/",
    display: "Home",
  },
  {
    path: "/doctors",
    display: "Find a Doctor",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { user, role, token } = useContext(AuthContext);

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky_header");
      } else {
        headerRef.current.classList.remove("sticky_header");
      }
    });

    useEffect(() => {
      handleStickyHeader();

      return () => window.removeEventListener("scroll", handleStickyHeader);
    });
  };

  const toggleMenu = () => {
    menuRef.current.classList.toggle("show_menu");
  };

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <img src={logo} alt=""></img>
          </div>
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600]"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4">
            {token && user ? (
              <div>
                <Link
                  to={
                    role === "doctor"
                      ? "/doctors/profile/me"
                      : "/user/profile/me"
                  }
                  className="flex items-center gap-4"
                >
                  <h2 className="text-[16px] font-[600] text-headingColor">
                    {" "}
                    {user?.name || "User"}
                  </h2>
                  <figure className="w-[35px] h-[35px] rounded-full overflow-hidden flex items-center justify-center">
                    <img
                      src={user?.photo || profile}
                      className="w-full h-full object-cover"
                      alt="User Profile"
                    />
                  </figure>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer"></BiMenu>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
