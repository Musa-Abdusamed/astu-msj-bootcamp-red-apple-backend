import api from './axios';

export const sharedService = {
  // Messages
  sendMessage: async (data) => {
    const response = await api.post('/messages', data);
    return response.data;
  },
  getInbox: async () => {
    const response = await api.get('/messages/inbox');
    return response.data;
  },
  getConversation: async (userId) => {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
  },
  markMessageRead: async (id) => {
    const response = await api.patch(`/messages/${id}/read`);
    return response.data;
  },

  // Settings
  changePassword: async (data) => {
    const response = await api.patch('/auth/change-password', data);
    return response.data;
  },
  updateAvatar: async (formData) => {
    const response = await api.patch('/auth/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Users (for messaging recipients, etc.)
  getUsers: async (role = '', search = '') => {
    const query = new URLSearchParams();
    if (role) query.append('role', role);
    if (search) query.append('search', search);
    const response = await api.get(`/users?${query.toString()}`);
    return response.data;
  },
};
