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
    return departmentsAll;
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
    return allMeetings;
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

export const getStatusText = (status) => {
  switch (status) {
    case 'totalassigned':
      return 'TOTAL ASSIGNED';
    case 'initiated':
      return 'ASSIGNED';
    case 'inprogress':
      return 'IN PROGRESS';
    case 'completed':
      return 'COMPLETED';
    default:
      return 'Pending';
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

export const dateSelected = (dateString) => {
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

/**
   * @description Private function for add Task
   */
export const addTaskPost = async (body) => {
  try {
    const addMeeting = await ApiConfig.requestData('post', '/add-task', null, body);
    return addMeeting;
  } catch (error) {
  }
};

/**
 * @description Private function for parent Task edit
 */
export const parentTaskEdit = async (body) => {
  try {
    const editTask = await ApiConfig.requestData('post', '/edit-task', null, body);
    return editTask;
  } catch (error) {
  }
};

/**
* @description Private function for Add Task 
*/

export const handleAddTask = async (transformedData) => {
  try {
    console.log(transformedData, 'transformed data');
    const formDataSend = new FormData();
    formDataSend.append('departmentData', JSON.stringify(transformedData));
    const saveData = await ApiConfig.requestData('post', '/add-task', null, transformedData);
    return saveData;
    console.log(saveData);
  } catch (error) {
    console.error('Error occurred:', error);
  }

};

export const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const handleAddNote = async (body, taskId) => {
  try {
    const sendNote = await ApiConfig.requestData('post', '/tasks/' + taskId + '/add-note', null, body);
    return sendNote;
  } catch (error) {
  }
};

export const handleCompletionReport = async (body, taskId) => {
  try {
    const completionReport = await ApiConfig.requestData('post', '/tasks/' + taskId + '/upload-completion-details', null, body);
    return completionReport;
  } catch (error) {
  }
};

export const fetchRoleType = () => {
  const localSt = JSON.parse(localStorage.getItem("user"));
  const currentRoleType = localSt?.role_type ?? '';
  return currentRoleType;
};

const formatRole = (role) => {
  return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const formatStatus = (status) => {
  if (status === 1) {
    return 'Accepted';
  }
  if (status === 2) {
    return 'Rejected';
  }
  return 'Pending';
}

export const getCommaSeparatedRoles = (tagArray) => {
  return tagArray.map(role => formatRole(role)).join(', ');
};

export const formatPercentage = (value) => {
  const num = Number(value);
  return isNaN(num) ? '0' : num.toFixed(0);
};
// Function to extract file name from URL
export const getFileNameFromUrl = (url) => {
  if (!url) return '';
  return url.split('/').pop();
};

export const formatVerifiedStatus = (admin_verified_status) => {
  let VerifiedOrNot = admin_verified_status === 1? '(Verified)' : admin_verified_status === 2? '(Rejected)' : admin_verified_status === 0 ? '' : '(Unverified)';
  return VerifiedOrNot;
}

export const getRoleTypename = (roleType) => {
  switch (roleType) {
    case 'secretary':
      return 'Secretary';
    case 'head_of_Office':
      return 'Head Of Office';
    default:
      return 'Unknown';
  }
};