import React from "react";
import { createContext, useState } from "react";

interface ContextObj {
  selectedSideBarIndex: number;
  setSelectedSideBarIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const SideBarSelectionContext = createContext({} as ContextObj);

export const SideBarSelectionContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedSideBarIndex, setSelectedSideBarIndex] = useState(0);

  return (
    <SideBarSelectionContext.Provider
      value={{ selectedSideBarIndex, setSelectedSideBarIndex }}
    >
      {children}
    </SideBarSelectionContext.Provider>
  );
};

export default SideBarSelectionContext;
