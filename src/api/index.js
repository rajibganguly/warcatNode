import axios from 'axios';

// Set global default headers
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const getAllDepartments = (userId, role_type) => {
    console.log(process.env.REACT_APP_API)
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

const getAllTask = (userId, role_type) => {
    return axios({
        method: 'get',
        url: `${process.env.REACT_APP_API}/tasks?userId=${userId}&role_type=${role_type}`
    });
};

const updateDepartment = (formData) => {
    return axios({
        method: 'put',
        url: `${process.env.REACT_APP_API}/edit-register-user-with-department`,
        data: formData
    });
};

export const API = {
    getAllDepartments,
    taskStatusPercentages,
    getAllTask,
    updateDepartment
};
