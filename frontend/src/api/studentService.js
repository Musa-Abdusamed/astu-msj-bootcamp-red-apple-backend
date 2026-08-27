import api from './axios';

export const studentService = {
  // Assignments & Submissions
  getAllAssignments: async () => {
    const response = await api.get('/assignments');
    return response.data;
  },
  getBatchAssignments: async (batchId) => {
    const response = await api.get(`/assignments/batch/${batchId}`);
    return response.data;
  },
  submitAssignment: async (data) => {
    const response = await api.post('/submissions', data);
    return response.data;
  },
  getMySubmissions: async () => {
    const response = await api.get('/submissions/my');
    return response.data;
  },
  
  // Progress
  getMyProgress: async (studentId) => {
    const response = await api.get(`/progress/student/${studentId}`);
    return response.data;
  },

  // Attendance
  getMyAttendance: async (studentId) => {
    const response = await api.get(`/attendances/student/${studentId}`);
    return response.data;
  },
  getMyAttendancePercentage: async (studentId) => {
    const response = await api.get(`/attendances/student/${studentId}/percentage`);
    return response.data;
  },

  // Resources & Schedules
  getResources: async () => {
    const response = await api.get('/resources');
    return response.data;
  },
  getSchedules: async () => {
    const response = await api.get('/schedules');
    return response.data;
  },

  // Announcements
  getAnnouncements: async (params) => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },
};
