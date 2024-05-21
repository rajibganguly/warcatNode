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