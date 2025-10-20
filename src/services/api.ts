import axios from 'axios';
import { User, CreateUserRequest, UpdateUserRequest, ReportCard, CreateReportCardRequest } from '../types/user';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// اضافه کردن توکن به تمام درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// مدیریت خطاهای authentication و پاسخ‌های غیر آرایه
api.interceptors.response.use(
  (response) => {
    // اگر پاسخ آرایه نیست، آن را به آرایه تبدیل کن
    if (response.data && !Array.isArray(response.data)) {
      console.warn('API response is not an array:', response.data);
      // اگر پاسخ یک آبجکت است، آن را در یک آرایه قرار بده
      if (typeof response.data === 'object' && response.data !== null) {
        response.data = [response.data];
      } else {
        response.data = [];
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: { nationalCode: string; password: string }) =>
    api.post('/auth/login', credentials).then(response => response.data),

  register: (userData: any) =>
    api.post('/auth/register', userData).then(response => response.data),
};

export const userApi = {
  getUsers: (): Promise<User[]> => 
    api.get('/users').then(response => {
      const data = response.data;
      // اطمینان از اینکه پاسخ آرایه است
      return Array.isArray(data) ? data : [];
    }),

  createUser: (userData: CreateUserRequest): Promise<User> =>
    api.post('/users', userData).then(response => response.data),

  uploadProfileImage: (userId: number, imageFile: File): Promise<User> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return api.post(`/users/${userId}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data);
  },

  deleteUser: (userId: number): Promise<void> =>
    api.delete(`/users/${userId}`),

  getUserWithReportCards: (userId: number): Promise<User> =>
    api.get(`/users/${userId}/report-cards`).then(response => response.data),
};

export const reportCardApi = {
  createReportCard: (reportCardData: CreateReportCardRequest, file: File): Promise<ReportCard> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', reportCardData.userId.toString());
    formData.append('title', reportCardData.title);
    formData.append('uploadedBy', reportCardData.uploadedBy.toString());
    
    if (reportCardData.description) {
      formData.append('description', reportCardData.description);
    }

    return api.post('/report-cards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data);
  },

  getReportCards: (): Promise<ReportCard[]> =>
    api.get('/report-cards').then(response => {
      const data = response.data;
      // اطمینان از اینکه پاسخ آرایه است
      return Array.isArray(data) ? data : [];
    }),

  getReportCardsByUser: (userId: number): Promise<ReportCard[]> =>
    api.get(`/report-cards/user/${userId}`).then(response => {
      const data = response.data;
      return Array.isArray(data) ? data : [];
    }),

  deleteReportCard: (reportCardId: number): Promise<void> =>
    api.delete(`/report-cards/${reportCardId}`),
};