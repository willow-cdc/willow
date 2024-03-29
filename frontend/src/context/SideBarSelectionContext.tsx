import React from "react";
import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const initialStateValue = location.pathname.includes("/pipelines") ? 1 : 0;
  const [selectedSideBarIndex, setSelectedSideBarIndex] =
    useState(initialStateValue);

  return (
    <SideBarSelectionContext.Provider
      value={{ selectedSideBarIndex, setSelectedSideBarIndex }}
    >
      {children}
    </SideBarSelectionContext.Provider>
  );
};

export default SideBarSelectionContext;
