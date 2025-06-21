import axios from './axiosInstance';

export const getMemorials = () => axios.get('/memorials');
export const addMemorial = (data) => axios.post('/memorials', data);
export const updateMemorial = (id, data) => axios.put(`/memorials/${id}`, data);
export const deleteMemorial = (id) => axios.delete(`/memorials/${id}`);
