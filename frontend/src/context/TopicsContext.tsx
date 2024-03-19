import React from 'react';
import { createContext, useState } from 'react';

interface ContextObj {
  topics: string[];
  setTopics: React.Dispatch<React.SetStateAction<string[]>>; 
}

export const TopicsContext = createContext({} as ContextObj);

export const TopicsContextProvider = ({children}: {children: React.ReactNode}) => {
  const [topics, setTopics] = useState<string[]>([]);

  return (
    <TopicsContext.Provider
      value={{topics, setTopics}}
    >
      {children}
    </TopicsContext.Provider>
  );
};


export default TopicsContext