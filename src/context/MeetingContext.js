// MeetingsContext.js
import React, { createContext, useState } from 'react';

export const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
    const [selectedMeetingsData, setSelectedMeetingsData] = useState([]);
    const [allMeetingLists, setAllMeetingLists] = useState([]);

  return (
    <MeetingContext.Provider value={{ selectedMeetingsData, setSelectedMeetingsData, allMeetingLists, setAllMeetingLists }}>
      {children}
    </MeetingContext.Provider>
  );
};

