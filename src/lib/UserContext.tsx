import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LuckyChang, ChangStyle } from '../types';
import { INITIAL_USER } from '../constants';

interface UserContextType {
  user: User;
  addChang: (chang: LuckyChang, cost: number, style: ChangStyle) => void;
  updateBalance: (amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('lucky_chang_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Force update avatar if it's the old one
      if (parsed.avatar.includes('ADBb0uiBBnb4wbrqmnglxeN-f6O_65Er9BflnuxOu2PZkyPvga6uSU3aMqpyupEbpw0VDN4anMEAAz9Eu6UYkvV6fZbU4ozKqkTGdv3qpqzLdQ0beDYRCA7KPuNYI4-eTQtlPVOKQWTYK2sYAmViDN2vPCcJWDP0E2DKMZLcON4A6HUZQAYObrjBV2R0zs_IZIsRNUX43_hlDak3L25cGcTHdShHJ7JL0qNXw4QFDr3_ftR8c5zLor1-p1MY0uUgvFyT_GQtJMJbnqq7Cg')) {
        parsed.avatar = INITIAL_USER.avatar;
      }
      // Ensure DIY is in generationCount
      if (!parsed.generationCount.diy) {
        parsed.generationCount.diy = 0;
      }
      return parsed;
    }
    return INITIAL_USER;
  });

  useEffect(() => {
    localStorage.setItem('lucky_chang_user', JSON.stringify(user));
  }, [user]);

  const addChang = (chang: LuckyChang, cost: number, style: ChangStyle) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance - cost,
      collection: [...prev.collection, chang],
      generationCount: {
        ...prev.generationCount,
        [style]: prev.generationCount[style] + 1
      }
    }));
  };

  const updateBalance = (amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
  };

  return (
    <UserContext.Provider value={{ user, addChang, updateBalance }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
