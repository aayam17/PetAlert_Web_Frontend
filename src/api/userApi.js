import axios from "./axiosInstance";

export const updateUserProfile = async (userId, data) => {
  const formData = new FormData();
  if (data.username) formData.append("username", data.username);
  if (data.avatar) formData.append("avatar", data.avatar);

  const response = await axios.put(`/users/${userId}`, formData);
  return response.data;
};
