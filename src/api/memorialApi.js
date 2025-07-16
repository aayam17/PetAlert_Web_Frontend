import axios from './axiosInstance';

// Basic CRUD for memorial entries
export const getMemorials = () => axios.get('/memorials');

export const addMemorial = (data) => axios.post('/memorials', data);

export const updateMemorial = (id, data) => axios.put(`/memorials/${id}`, data);

export const deleteMemorial = (id) => axios.delete(`/memorials/${id}`);

/**
 * Uploads a file and returns the uploaded file URL.
 * @param {File} file
 * @returns {Promise<string>} fileUrl
 */
export const uploadMemorialImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.fileUrl;
};
