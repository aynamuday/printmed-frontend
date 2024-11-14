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
      <header className="bg-[#6CB6AD] text-white p-10 text-right">
        <p className="text-4xl">{formatDateTime(dateTime)}</p>
      </header>
    );
  };

export default Header;