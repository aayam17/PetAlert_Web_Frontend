import axios from './axiosInstance';

// Get all lost and found entries
export const getLostAndFound = () => axios.get('/lostandfound');

// Add a new lost or found entry
export const addLostAndFound = (data) => axios.post('/lostandfound', data);

// Update an existing entry
export const updateLostAndFound = (id, data) => axios.put(`/lostandfound/${id}`, data);

// Delete an entry
export const deleteLostAndFound = (id) => axios.delete(`/lostandfound/${id}`);
