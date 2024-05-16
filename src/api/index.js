import axios from 'axios';

// Set global default headers
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const getAllDepartments = (userId, role_type) => {
    console.log(role_type,'role_typerole_typerole_typerole_typerole_typerole_typerole_type')
    return axios({
        method: 'get',
        url: `${process.env.REACT_APP_API}/departments?userId=${userId}&role_type=${role_type}`
    });
};


const taskStatusPercentages = (userId, role_type) => {
    
    return axios({
        method: 'get',
        url: `${process.env.REACT_APP_API}/task-status-percentages?userId=${userId}&role_type=${role_type}`
    });
};

export const API = {
    getAllDepartments,
    taskStatusPercentages
};
