/* eslint-disable react-hooks/rules-of-hooks */
// import { useContext, useEffect } from 'react';
// import { DepartmentContext } from '../context/DepartmentContext';
import ApiConfig from '../config/ApiConfig';



  /**
   * @description Private function for fetch department data
   */
 export const fetchDepartmentData = async () => {
    const localData = localStorage.getItem("user");
    const userObj = JSON.parse(localData)
    try {
      const params = {
        userId: userObj._id,
        role_type: userObj.role_type
      };
      const departmentsAll = await ApiConfig.requestData('get', '/departments', params, null);
      return departmentsAll ;
     // setAllDepartmentList(departmentsAll)
    } catch (error) {
    }
  };


    /**
   * @description Private function for fetch meeting data
   */
 export const fetchMeetingData = async () => {
    const localData = localStorage.getItem("user");
    const userObj = JSON.parse(localData)
    try {
      const params = {
        userId: userObj._id,
        role_type: userObj.role_type
      };
      const allMeetings = await ApiConfig.requestData('get', '/meetings', params, null);
      return allMeetings ;
     // setAllDepartmentList(departmentsAll)
    } catch (error) {
    }
  };


  /**
   * @description Private function for fetch Task data
   */
 export const fetchTaskData = async () => {
  const localData = localStorage.getItem("user");
  const userObj = JSON.parse(localData)
  try {
    const params = {
      userId: userObj._id,
      role_type: userObj.role_type
    };
    const allTasks = await ApiConfig.requestData('get', '/tasks', params, null);
    return allTasks;
  } catch (error) {
  }
};


  // Function to format the date
  export const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB');
  };


  export const formatDateWithmonth = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');
  };


  /**
   * @description Private function for fetch Task data
   */
 export const addMeetings = async (body) => {
  try {
    const addMeeting = await ApiConfig.requestData('post', '/add-meeting', null, body);
    return addMeeting;
  } catch (error) {
  }
};