import React, { createContext, useState } from 'react';

export const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
  const [state, setState] = useState("Initial value");

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};