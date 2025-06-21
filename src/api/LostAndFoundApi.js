import axios from './axiosInstance';

export const getLostAndFound = () => axios.get('/lostandfound');
export const addLostAndFound = (data) => axios.post('/lostandfound', data);
export const updateLostAndFound = (id, data) => axios.put(`/lostandfound/${id}`, data);
export const deleteLostAndFound = (id) => axios.delete(`/lostandfound/${id}`);
