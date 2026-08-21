import api from './axios';
import {
  initialBatches,
  initialUsers,
  initialApplications,
  initialAttendanceRecords,
  initialAssignments,
  initialSubmissions,
  initialAnnouncements,
  initialCurriculumSchedules,
  initialResources,
  getAdminStats,
} from '../utils/mockData';

// Local storage helper for persisting mock data during local development
const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(`msj_admin_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(`msj_admin_${key}`, JSON.stringify(data));
  } catch {
    // ignore
  }
};

export const adminService = {
  // ==========================================
  // 1. STATS & ANALYTICS
  // ==========================================
  getStats: async () => {
    try {
      const res = await api.get('/admin/stats');
      return res.data;
    } catch {
      const users = getStored('users', initialUsers);
      const batches = getStored('batches', initialBatches);
      const applications = getStored('applications', initialApplications);
      const submissions = getStored('submissions', initialSubmissions);
      return {
        success: true,
        data: getAdminStats(users, batches, applications, submissions),
      };
    }
  },

  // ==========================================
  // 2. APPLICATIONS & ADMISSIONS
  // ==========================================
  getApplications: async () => {
    const res = await api.get('/applications');
    return res.data;
  },

  submitApplication: async (appData) => {
    const res = await api.post('/applications', appData);
    return res.data;
  },

  updateApplicationStatus: async (id, status) => {
    if (status.toLowerCase() === 'accepted' || status.toLowerCase() === 'accept') {
      const res = await api.patch(`/applications/${id}/accept`);
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

  updateUser: async (id, updates) => {
    const res = await api.put(`/users/${id}`, updates);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },

  // ==========================================
  // 4. BATCHES & COHORTS
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
    try {
      const res = await api.get('/attendance', { params: { batchId, date } });
      return res.data;
    } catch {
      let records = getStored('attendance', initialAttendanceRecords);
      if (batchId && batchId !== 'all') {
        records = records.filter((r) => r.batchId === batchId);
      }
      if (date) {
        records = records.filter((r) => r.date === date);
      }
      return { success: true, count: records.length, data: records };
    }
  },

  markAttendance: async (data) => {
    try {
      const res = await api.post('/attendance', data);
      return res.data;
    } catch {
      const records = getStored('attendance', initialAttendanceRecords);
      const newRecord = {
        _id: 'att_' + Date.now(),
        studentId: data.studentId,
        studentName: data.studentName || 'Student',
        batchId: data.batchId,
        date: data.date,
        status: data.status || 'present',
        markedBy: 'Admin',
        note: data.note || '',
      };
      // Overwrite if same student and date exists
      const filtered = records.filter((r) => !(r.studentId === data.studentId && r.date === data.date));
      const updated = [newRecord, ...filtered];
      setStored('attendance', updated);
      return { success: true, message: 'Attendance recorded', data: newRecord };
    }
  },

  markBulkAttendance: async (batchId, date, status = 'present') => {
    const users = getStored('users', initialUsers).filter((u) => u.role === 'student' && u.batchId === batchId);
    const records = getStored('attendance', initialAttendanceRecords);
    const newRecords = users.map((u) => ({
      _id: 'att_' + Math.random().toString(36).substr(2, 9),
      studentId: u._id,
      studentName: u.fullName,
      batchId,
      date,
      status,
      markedBy: 'Admin',
      note: 'Bulk marked by Admin',
    }));

    const existingFiltered = records.filter((r) => !(r.batchId === batchId && r.date === date));
    const updated = [...newRecords, ...existingFiltered];
    setStored('attendance', updated);
    return { success: true, message: `Marked ${newRecords.length} students as ${status}` };
  },

  // ==========================================
  // 6. ASSIGNMENTS & SUBMISSIONS
  // ==========================================
  getAssignments: async () => {
    try {
      const res = await api.get('/assignments');
      return res.data;
    } catch {
      const assignments = getStored('assignments', initialAssignments);
      return { success: true, count: assignments.length, data: assignments };
    }
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
    try {
      const res = await api.get('/announcements');
      return res.data;
    } catch {
      const announcements = getStored('announcements', initialAnnouncements);
      return { success: true, count: announcements.length, data: announcements };
    }
  },

  createAnnouncement: async (data) => {
    try {
      const res = await api.post('/announcements', data);
      return res.data;
    } catch {
      const announcements = getStored('announcements', initialAnnouncements);
      const newAnn = {
        _id: 'ann_' + Date.now(),
        title: data.title,
        content: data.content,
        targetAudience: data.targetAudience || 'all',
        batchId: data.batchId || null,
        urgent: !!data.urgent,
        author: 'Admin Office',
        publishDate: new Date().toISOString().split('T')[0],
      };
      const updated = [newAnn, ...announcements];
      setStored('announcements', updated);
      return { success: true, message: 'Announcement broadcasted', data: newAnn };
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      const res = await api.delete(`/announcements/${id}`);
      return res.data;
    } catch {
      const announcements = getStored('announcements', initialAnnouncements);
      const updated = announcements.filter((a) => a._id !== id);
      setStored('announcements', updated);
      return { success: true, message: 'Announcement deleted' };
    }
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
