import React, { useState, useEffect } from "react";

const Header = () => {
    const [dateTime, setDateTime] = useState(new Date());
  
    useEffect(() => {
      const timer = setInterval(() => {
        setDateTime(new Date());
      }, 1000); // Update every second
      
      return () => clearInterval(timer); // Cleanup on unmount
    }, []);
  
    const formatDateTime = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleDateString(undefined, options);
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return `${formattedDate} | ${formattedTime}`;
    };
  
    return (
      <header className="bg-[#6CB6AD] text-white font-semibold px-4 py-3 sm:px-6 sm:py-4 md:px-10 md:py-6 flex flex-row items-center justify-between gap-2 sm:gap-4 top-0 w-full">
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl ml-auto">
          {formatDateTime(dateTime)}
        </p>
      </header>
    );
  };

export default Header;