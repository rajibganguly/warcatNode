// departmentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../api';

// Define the initial state for departments
const initialState = {
    data: [],
    loading: false,
    error: null
};

// Define an async thunk to fetch departments data
export const fetchDepartments = createAsyncThunk(
    'departments/fetchDepartments',
    async ({ userId, roleType }) => { // Change to accept a single object argument
        console.log(roleType,'call api');
        try {
            const response = await API.getAllDepartments(userId, roleType);
            return response.data;
        } catch (error) {
            // Throw error to be handled by rejectWithValue in createSlice
            throw error.response.data;
        }
    }
);


// Create a departments slice
const departmentsSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // action.error contains the rejected action's payload
            });
    }
});

export const departmentsSelector = (state) => state.departments;

export default departmentsSlice.reducer;
