import axios from './axiosInstance';

// Get all memorials
export const getMemorials = () => axios.get('/memorials');

// Add a new memorial entry
export const addMemorial = (data) => axios.post('/memorials', data);

// Update an existing memorial
export const updateMemorial = (id, data) => axios.put(`/memorials/${id}`, data);

// Delete a memorial
export const deleteMemorial = (id) => axios.delete(`/memorials/${id}`);
