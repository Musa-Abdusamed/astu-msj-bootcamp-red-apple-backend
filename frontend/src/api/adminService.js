import api from './axios';

export const adminService = {
  // ==========================================
  // 1. STATS & ANALYTICS
  // ==========================================
  getStats: async () => {
    try {
      const res = await api.get('/admin/stats');
      return res.data;
    } catch {
      const [usersRes, batchesRes, appsRes, subsRes] = await Promise.allSettled([
        api.get('/users'),
        api.get('/batches'),
        api.get('/applications'),
        api.get('/submissions'),
      ]);
      const users = (usersRes.status === 'fulfilled' ? usersRes.value.data?.data : []) || [];
      const batches = (batchesRes.status === 'fulfilled' ? batchesRes.value.data?.data : []) || [];
      const applications = (appsRes.status === 'fulfilled' ? appsRes.value.data?.data : []) || [];
      const submissions = (subsRes.status === 'fulfilled' ? subsRes.value.data?.data : []) || [];

      return {
        data: {
          totalStudents: users.filter((u) => u.role === 'student').length,
          totalMentors: users.filter((u) => u.role === 'mentor').length,
          activeBatches: batches.filter((b) => b.isActive !== false).length,
          pendingApplications: applications.filter((a) => a.status === 'Pending').length,
          totalSubmissions: submissions.length,
        },
      };
    }
  },

  // ==========================================
  // 2. APPLICATIONS & ADMISSIONS
  // ==========================================
  submitApplication: async (data) => {
    const res = await api.post('/applications', data);
    return res.data;
  },

  getApplicationStatus: async () => {
    const res = await api.get('/applications/status');
    return res.data;
  },

  getApplications: async () => {
    const res = await api.get('/applications');
    return res.data;
  },

  acceptApplication: async (id) => {
    const res = await api.patch(`/applications/${id}/accept`);
    return res.data;
  },

  rejectApplication: async (id) => {
    const res = await api.patch(`/applications/${id}/reject`);
    return res.data;
  },

  updateApplicationStatus: async (id, status) => {
    const s = (status || '').toLowerCase();
    if (s === 'rejected' || s === 'reject') {
      const res = await api.patch(`/applications/${id}/reject`);
      return res.data;
    } else {
      const res = await api.patch(`/applications/${id}/accept`);
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
  getBatchAttendance: async (batchId, date) => {
    const res = await api.get(`/attendances/batch/${batchId}`, { params: { date } });
    return res.data;
  },

  getAttendanceRecords: async (batchId, date) => {
    const res = await api.get(`/attendances/batch/${batchId}`, { params: { date } });
    return res.data;
  },

  markAttendance: async (data) => {
    const res = await api.post('/attendances', data);
    return res.data;
  },

  markBulkAttendance: async (batchId, date, status = 'present') => {
    const res = await api.post('/attendances', { batchId, date, status });
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
