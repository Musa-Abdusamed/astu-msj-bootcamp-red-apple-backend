import api from './axios';

export const mentorService = {
  // Batches
  getBatches: async () => {
    const response = await api.get('/batches');
    return response.data;
  },
  getBatchDetails: async (id) => {
    const response = await api.get(`/batches/${id}`);
    return response.data;
  },
  getStudents: async (role = 'student') => {
    const response = await api.get(`/users?role=${role}`);
    return response.data;
  },

  // Assignments & Grading
  createAssignment: async (data) => {
    const response = await api.post('/assignments', data);
    return response.data;
  },
  getBatchAssignments: async (batchId) => {
    const response = await api.get(`/assignments/batch/${batchId}`);
    return response.data;
  },
  getAssignmentSubmissions: async (assignmentId) => {
    const response = await api.get(`/submissions/assignment/${assignmentId}`);
    return response.data;
  },
  gradeSubmission: async (id, data) => {
    const response = await api.patch(`/submissions/${id}/grade`, data);
    return response.data;
  },

  // Attendance
  getBatchAttendance: async (batchId, date) => {
    const response = await api.get(`/attendances/batch/${batchId}`, { params: { date } });
    return response.data;
  },
  markAttendance: async (data) => {
    const response = await api.post('/attendances', data);
    return response.data;
  },
  updateAttendance: async (id, data) => {
    const response = await api.put(`/attendances/${id}`, data);
    return response.data;
  },
  getStudentAttendance: async (studentId) => {
    const response = await api.get(`/attendances/student/${studentId}`);
    return response.data;
  },

  // Progress
  createProgress: async (data) => {
    const response = await api.post('/progress', data);
    return response.data;
  },
  updateProgress: async (id, data) => {
    const response = await api.patch(`/progress/${id}`, data);
    return response.data;
  },
  deleteProgress: async (id) => {
    const response = await api.delete(`/progress/${id}`);
    return response.data;
  },
  getStudentProgress: async (studentId) => {
    const response = await api.get(`/progress/student/${studentId}`);
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
  createResource: async (data) => {
    const response = await api.post('/resources', data);
    return response.data;
  },
  deleteResource: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  },

  // Announcements
  getAnnouncements: async (params) => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },
};
