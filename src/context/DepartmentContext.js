// DepartmentContext.js
import React, { createContext, useState } from 'react';

export const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
    const [selectedDepartmentData, setSelectedDepartmentData] = useState([{ id: "", secratary: {}, hedOffice: {} }]);
    const [allDepartmentList, setAllDepartmentList] = useState([{ id: "", secratary: {}, hedOffice: {} }]);

  return (
    <DepartmentContext.Provider value={{ selectedDepartmentData, setSelectedDepartmentData, allDepartmentList, setAllDepartmentList }}>
      {children}
    </DepartmentContext.Provider>
  );
};

