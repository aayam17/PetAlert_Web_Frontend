import axios from './axiosInstance';

export const getVaccinationRecords = () => axios.get('/vaccinationrecords');
export const addVaccinationRecord = (data) => axios.post('/vaccinationrecords', data);
export const updateVaccinationRecord = (id, data) => axios.put(`/vaccinationrecords/${id}`, data);
export const deleteVaccinationRecord = (id) => axios.delete(`/vaccinationrecords/${id}`);
