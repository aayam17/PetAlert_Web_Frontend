import axios from './axiosInstance';

export const getVetAppointments = () => axios.get('/vetappointments');
export const addVetAppointment = (data) => axios.post('/vetappointments', data);
export const updateVetAppointment = (id, data) => axios.put(`/vetappointments/${id}`, data);
export const deleteVetAppointment = (id) => axios.delete(`/vetappointments/${id}`);
