import api from './axios';

export const adminService = {
  // ==========================================
  // 1. STATS & ANALYTICS
  // ==========================================
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  // ==========================================
  // 2. APPLICATIONS & ADMISSIONS
  // ==========================================
  getApplications: async () => {
    const res = await api.get('/applications');
    return res.data;
  },

  updateApplicationStatus: async (id, status) => {
    if (status.toLowerCase() === 'approved' || status.toLowerCase() === 'approve') {
      const res = await api.patch(`/applications/${id}/approve`);
      return res.data;
    } else if (status.toLowerCase() === 'rejected' || status.toLowerCase() === 'reject') {
      const res = await api.patch(`/applications/${id}/reject`);
      return res.data;
    } else {
      const res = await api.patch(`/applications/${id}`, { status });
      return res.data;
    }
  },

  // ==========================================
  // 3. USER MANAGEMENT
  // ==========================================
  getUsers: async (params) => {
    const res = await api.get('/users', { params });
    return res.data;
  },

  createUser: async (userData) => {
    const res = await api.post('/users', userData);
    return res.data;
  },

  updateUser: async (id, userData) => {
    const res = await api.put(`/users/${id}`, userData);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },

  // ==========================================
  // 4. BATCH / COHORT MANAGEMENT
  // ==========================================
  getBatches: async () => {
    const res = await api.get('/batches');
    return res.data;
  },

  createBatch: async (batchData) => {
    const res = await api.post('/batches', batchData);
    return res.data;
  },

  assignMentorToBatch: async (batchId, mentorId) => {
    const res = await api.post(`/batches/${batchId}/mentors`, { mentorId });
    return res.data;
  },

  enrollStudentToBatch: async (batchId, studentId) => {
    const res = await api.post(`/batches/${batchId}/students`, { studentId });
    return res.data;
  },

  // ==========================================
  // 5. ATTENDANCE OVERSIGHT
  // ==========================================
  getAttendanceRecords: async (batchId, date) => {
    const res = await api.get('/attendance', { params: { batchId, date } });
    return res.data;
  },

  markAttendance: async (data) => {
    const res = await api.post('/attendance', data);
    return res.data;
  },

  markBulkAttendance: async (batchId, date, status = 'present') => {
    // Note: If bulk attendance API does not exist, this will fail. 
    // It is up to the backend to implement this endpoint.
    const res = await api.post('/attendance/bulk', { batchId, date, status });
    return res.data;
  },

  // ==========================================
  // 6. ASSIGNMENTS & SUBMISSIONS
  // ==========================================
  getAssignments: async () => {
    const res = await api.get('/assignments');
    return res.data;
  },

  createAssignment: async (data) => {
    const res = await api.post('/assignments', data);
    return res.data;
  },

  getSubmissions: async (assignmentId) => {
    const res = await api.get(`/submissions${assignmentId && assignmentId !== 'all' ? `/assignment/${assignmentId}` : ''}`);
    return res.data;
  },

  gradeSubmission: async (id, gradeData) => {
    const res = await api.patch(`/submissions/${id}/grade`, gradeData);
    return res.data;
  },

  // ==========================================
  // 7. ANNOUNCEMENTS
  // ==========================================
  getAnnouncements: async () => {
    const res = await api.get('/announcements');
    return res.data;
  },

  createAnnouncement: async (data) => {
    const res = await api.post('/announcements', data);
    return res.data;
  },

  deleteAnnouncement: async (id) => {
    const res = await api.delete(`/announcements/${id}`);
    return res.data;
  },

  // ==========================================
  // 8. CURRICULUM & RESOURCES
  // ==========================================
  getCurriculumSchedules: async () => {
    const res = await api.get('/schedules');
    return res.data;
  },

  createCurriculumSchedule: async (data) => {
    const res = await api.post('/schedules', data);
    return res.data;
  },

  getResources: async () => {
    const res = await api.get('/resources');
    return res.data;
  },

  createResource: async (data) => {
    const res = await api.post('/resources', data);
    return res.data;
  },

  deleteResource: async (id) => {
    const res = await api.delete(`/resources/${id}`);
    return res.data;
  },
};
