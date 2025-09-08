import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg py-4 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-white font-bold text-xl"> ✒️Task & Notepad</div>
          <div className="flex space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? "text-white font-medium border-b-2 border-white pb-1" 
                  : "text-blue-100 hover:text-white transition-colors duration-200"
              }
            >
              Create Note
            </NavLink>
            <NavLink 
              to="/notes" 
              className={({ isActive }) => 
                isActive 
                  ? "text-white font-medium border-b-2 border-white pb-1" 
                  : "text-blue-100 hover:text-white transition-colors duration-200"
              }
            >
              My Notes
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
