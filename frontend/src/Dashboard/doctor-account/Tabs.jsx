/* eslint-disable react/prop-types */

import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";
import { BiMenu } from "react-icons/bi";

const Tabs = ({ tab, setTab }) => {
  const { dispatch } = useContext (AuthContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };
  return (
    <div>
      <span className="lg:hidden">
        <BiMenu className="w-6 h-6 cursor-pointer" />
        </span>
        <div className="g:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md">
          <button
          onClick={()=>{setTab("overview")
          }}
            className={`${
              tab === "overview"
                ? "bg-indigo-100 text-primaryColor"
                : "bg-transparent text-headingColor"
            } w-full btn mt-0 rounded-md`}
          >
            Overview
          </button>
          <button
          onClick={()=>{setTab("appointments")}}
            className={`${
              tab === "appointments"
                ? "bg-indigo-100 text-primaryColor"
                : "bg-transparent text-headingColor"
            } w-full btn mt-0 rounded-md`}
          >
           Appointments
          </button>
          <button
          onClick={()=>{setTab("setting")}}
            className={`${
              tab === "setting"
                ? "bg-indigo-100 text-primaryColor"
                : "bg-transparent text-headingColor"
            } w-full btn mt-0 rounded-md`}
          >
           Profile
          </button>
          <div className="mt-[50px] md:mt-[100px]">
                <button
                  onClick={handleLogout}
                  className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
                >
                  Logout
                </button>
                <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">
                  Delete account
                </button>
              </div>
        </div>
    
    </div>
  );
};

export default Tabs;
