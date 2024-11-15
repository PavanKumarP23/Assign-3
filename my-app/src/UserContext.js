import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user] = useState('Pavan Kumar');
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}
