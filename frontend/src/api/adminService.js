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
    try {
      const res = await api.get('/applications');
      return res.data;
    } catch {
      const apps = getStored('applications', initialApplications);
      return { success: true, count: apps.length, data: apps };
    }
  },

  submitApplication: async (appData) => {
    try {
      const res = await api.post('/applications', appData);
      return res.data;
    } catch {
      const apps = getStored('applications', initialApplications);
      const newApp = {
        _id: 'app_' + Date.now(),
        fullName: appData.fullName,
        email: appData.email,
        phone: appData.phone || '+251911000000',
        telegramHandle: appData.telegramHandle || '@' + (appData.fullName ? appData.fullName.toLowerCase().replace(/\s+/g, '_') : 'applicant'),
        gender: appData.gender || 'Not specified',
        department: appData.department || 'Software Engineering',
        year: appData.year || '3rd Year',
        university: appData.university || 'ASTU',
        githubUrl: appData.githubUrl || appData.github || '',
        codeforcesUrl: appData.codeforcesUrl || '',
        leetcodeUrl: appData.leetcodeUrl || '',
        motivation: appData.motivation || appData.statement || 'Excited to learn and build real-world software.',
        roleAtApplication: 'student',
        trackPreference: appData.trackPreference || appData.track || 'Frontend Track (Summer 2026)',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      const updated = [newApp, ...apps];
      setStored('applications', updated);
      return { success: true, message: 'Application submitted successfully', data: newApp };
    }
  },

  updateApplicationStatus: async (id, status) => {
    try {
      const res = await api.patch(`/applications/${id}`, { status });
      return res.data;
    } catch {
      const apps = getStored('applications', initialApplications);
      const updated = apps.map((a) => (a._id === id ? { ...a, status } : a));
      setStored('applications', updated);
      return { success: true, message: `Application marked as ${status}` };
    }
  },

  // ==========================================
  // 3. USER MANAGEMENT
  // ==========================================
  getUsers: async (params) => {
    try {
      const res = await api.get('/users', { params });
      return res.data;
    } catch {
      let users = getStored('users', initialUsers);
      if (params?.role && params.role !== 'all') {
        users = users.filter((u) => u.role === params.role);
      }
      return { success: true, count: users.length, data: users };
    }
  },

  createUser: async (userData) => {
    try {
      const res = await api.post('/users', userData);
      return res.data;
    } catch {
      const users = getStored('users', initialUsers);
      const rolePrefix = userData.role === 'student' ? 'st' : userData.role === 'mentor' ? 'mnt' : 'adm';
      const newId = `msj-${rolePrefix}-${users.length + 1}-2026`;
      const newUser = {
        _id: 'usr_' + Date.now(),
        userId: newId,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role || 'student',
        phone: userData.phone || '+251900000000',
        batchId: userData.batchId || null,
        isActive: true,
        attendance: 100,
        progress: 'In Progress',
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updated = [newUser, ...users];
      setStored('users', updated);
      return { success: true, message: 'User created successfully', data: newUser };
    }
  },

  updateUser: async (id, updates) => {
    try {
      const res = await api.put(`/users/${id}`, updates);
      return res.data;
    } catch {
      const users = getStored('users', initialUsers);
      const updated = users.map((u) => (u._id === id ? { ...u, ...updates } : u));
      setStored('users', updated);
      return { success: true, message: 'User updated successfully' };
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    } catch {
      const users = getStored('users', initialUsers);
      const updated = users.filter((u) => u._id !== id);
      setStored('users', updated);
      return { success: true, message: 'User deleted successfully' };
    }
  },

  // ==========================================
  // 4. BATCHES & COHORTS
  // ==========================================
  getBatches: async () => {
    try {
      const res = await api.get('/batches');
      return res.data;
    } catch {
      const batches = getStored('batches', initialBatches);
      return { success: true, count: batches.length, data: batches };
    }
  },

  createBatch: async (batchData) => {
    try {
      const res = await api.post('/batches', batchData);
      return res.data;
    } catch {
      const batches = getStored('batches', initialBatches);
      const newBatch = {
        _id: 'batch_' + Date.now(),
        name: batchData.name,
        track: batchData.track || batchData.name,
        description: batchData.description || '',
        startDate: batchData.startDate,
        endDate: batchData.endDate,
        isActive: batchData.isActive !== undefined ? batchData.isActive : true,
        mentorIds: batchData.mentorIds || [],
        studentCount: 0,
      };
      const updated = [newBatch, ...batches];
      setStored('batches', updated);
      return { success: true, message: 'Batch created successfully', data: newBatch };
    }
  },

  assignMentorToBatch: async (batchId, mentorId) => {
    try {
      const res = await api.post(`/batches/${batchId}/mentors`, { mentorId });
      return res.data;
    } catch {
      const batches = getStored('batches', initialBatches);
      const updated = batches.map((b) => {
        if (b._id === batchId) {
          const mentorIds = b.mentorIds ? [...new Set([...b.mentorIds, mentorId])] : [mentorId];
          return { ...b, mentorIds };
        }
        return b;
      });
      setStored('batches', updated);
      return { success: true, message: 'Mentor assigned to batch' };
    }
  },

  enrollStudentToBatch: async (batchId, studentId) => {
    try {
      const res = await api.post(`/batches/${batchId}/students`, { studentId });
      return res.data;
    } catch {
      const users = getStored('users', initialUsers);
      const updatedUsers = users.map((u) => (u._id === studentId ? { ...u, batchId } : u));
      setStored('users', updatedUsers);

      const batches = getStored('batches', initialBatches);
      const updatedBatches = batches.map((b) => (b._id === batchId ? { ...b, studentCount: (b.studentCount || 0) + 1 } : b));
      setStored('batches', updatedBatches);
      return { success: true, message: 'Student successfully enrolled' };
    }
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
    try {
      const res = await api.post('/assignments', data);
      return res.data;
    } catch {
      const assignments = getStored('assignments', initialAssignments);
      const batches = getStored('batches', initialBatches);
      const batchObj = batches.find((b) => b._id === data.batchId);
      const newAssignment = {
        _id: 'asg_' + Date.now(),
        title: data.title,
        batchId: data.batchId,
        batchName: batchObj ? batchObj.name : 'All Batches',
        deadline: data.deadline,
        maxScore: Number(data.maxScore) || 100,
        description: data.description,
        instructions: data.instructions,
        createdAt: new Date().toISOString(),
      };
      const updated = [newAssignment, ...assignments];
      setStored('assignments', updated);
      return { success: true, message: 'Assignment created successfully', data: newAssignment };
    }
  },

  getSubmissions: async (assignmentId) => {
    try {
      const res = await api.get(`/submissions${assignmentId ? `/assignment/${assignmentId}` : ''}`);
      return res.data;
    } catch {
      let submissions = getStored('submissions', initialSubmissions);
      if (assignmentId && assignmentId !== 'all') {
        submissions = submissions.filter((s) => s.assignmentId === assignmentId);
      }
      return { success: true, count: submissions.length, data: submissions };
    }
  },

  gradeSubmission: async (id, gradeData) => {
    try {
      const res = await api.patch(`/submissions/${id}/grade`, gradeData);
      return res.data;
    } catch {
      const submissions = getStored('submissions', initialSubmissions);
      const updated = submissions.map((s) => {
        if (s._id === id) {
          return {
            ...s,
            score: Number(gradeData.score),
            feedback: gradeData.feedback,
            status: gradeData.status || 'graded',
            gradedAt: new Date().toISOString(),
          };
        }
        return s;
      });
      setStored('submissions', updated);
      return { success: true, message: 'Submission graded successfully' };
    }
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
    try {
      const res = await api.get('/schedules');
      return res.data;
    } catch {
      const schedules = getStored('schedules', initialCurriculumSchedules);
      return { success: true, count: schedules.length, data: schedules };
    }
  },

  createCurriculumSchedule: async (data) => {
    try {
      const res = await api.post('/schedules', data);
      return res.data;
    } catch {
      const schedules = getStored('schedules', initialCurriculumSchedules);
      const newSchedule = {
        _id: 'sch_' + Date.now(),
        weekNumber: Number(data.weekNumber) || schedules.length + 1,
        title: data.title,
        topics: data.topics || [],
      };
      const updated = [...schedules, newSchedule];
      setStored('schedules', updated);
      return { success: true, message: 'Curriculum schedule added', data: newSchedule };
    }
  },

  getResources: async () => {
    try {
      const res = await api.get('/resources');
      return res.data;
    } catch {
      const resources = getStored('resources', initialResources);
      return { success: true, count: resources.length, data: resources };
    }
  },

  createResource: async (data) => {
    try {
      const res = await api.post('/resources', data);
      return res.data;
    } catch {
      const resources = getStored('resources', initialResources);
      const newRes = {
        _id: 'res_' + Date.now(),
        title: data.title,
        description: data.description,
        link: data.link,
        topic: data.topic || 'General',
        mentorName: data.mentorName || 'Admin Office',
        createdAt: new Date().toISOString().split('T')[0],
      };
      const updated = [newRes, ...resources];
      setStored('resources', updated);
      return { success: true, message: 'Learning resource added', data: newRes };
    }
  },

  deleteResource: async (id) => {
    try {
      const res = await api.delete(`/resources/${id}`);
      return res.data;
    } catch {
      const resources = getStored('resources', initialResources);
      const updated = resources.filter((r) => r._id !== id);
      setStored('resources', updated);
      return { success: true, message: 'Resource removed' };
    }
  },
};
