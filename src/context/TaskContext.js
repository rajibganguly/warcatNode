// MeetingsContext.js
import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [selectedTaskData, setSelectedTaskData] = useState([]);
    const [allTaskLists, setAllTaskLists] = useState([]);

  return (
    <TaskContext.Provider value={{ selectedTaskData, setSelectedTaskData, allTaskLists, setAllTaskLists }}>
      {children}
    </TaskContext.Provider>
  );
};

