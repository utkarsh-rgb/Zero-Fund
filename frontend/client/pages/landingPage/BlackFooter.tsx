import React from "react";
import "./BlackFooter.css";

const BlackFooter: React.FC = () => {
  return (
    <footer className="bg-black py-10 flex items-center justify-center">
      <h3 className="reflection-text font-sans text-5xl md:text-7xl font-extrabold drop-shadow-[0_0_40px_rgba(255,255,255,0.05)]">
        Zero Fund Venture
      </h3>
    </footer>
  );
};

export default BlackFooter;
