
import { CreateReportCardRequest, CreateUserRequest, ReportCard, UpdateUserRequest, User } from '@/types/user';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // چون ما توکن می‌فرستیم، نیازی به cookie نیست
});

// 🧠 افزودن توکن JWT از sessionStorage یا localStorage به هر درخواست
api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No token found in storage!');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🧩 هندل خطاهای پاسخ
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Response - Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// ----------------------------
// تعریف API های جداگانه
// ----------------------------



export const userApi = {
  // دریافت همه کاربران
  getUsers: (): Promise<User[]> => 
    api.get('/users').then(response => {
      const data = response.data;
      console.log('📊 Users API Response:', data);
      return Array.isArray(data) ? data : [];
    }),

  // ایجاد کاربر جدید
  createUser: (userData: CreateUserRequest): Promise<User> =>
    api.post('/users', userData).then(response => response.data),

  // آپلود عکس پروفایل
  uploadProfileImage: (userId: number, imageFile: File): Promise<User> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return api.post(`/users/${userId}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data);
  },

  // حذف کاربر
  deleteUser: (userId: number): Promise<void> =>
    api.delete(`/users/${userId}`),

  // دریافت کاربر به همراه کارنامه‌ها
  getUserWithReportCards: (userId: number): Promise<User> =>
    api.get(`/users/${userId}/report-cards`).then(response => response.data),

  // آپدیت کاربر
  updateUser: (userId: number, userData: UpdateUserRequest): Promise<User> =>
    api.patch(`/users/${userId}`, userData).then(response => response.data),
};

// Report Cards API
export const reportCardApi = {
  // ایجاد کارنامه جدید
  createReportCard: (reportCardData: CreateReportCardRequest, file: File): Promise<ReportCard> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', reportCardData.userId.toString());
    formData.append('title', reportCardData.title);
    formData.append('uploadedBy', reportCardData.uploadedBy.toString());
    
    if (reportCardData.description) {
      formData.append('description', reportCardData.description);
    }

    console.log('📁 Creating report card with data:', reportCardData);
    console.log('📁 File info:', { name: file.name, size: file.size, type: file.type });

    return api.post('/report-cards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data);
  },

  // دریافت همه کارنامه‌ها
  getReportCards: (): Promise<ReportCard[]> =>
    api.get('/report-cards').then(response => {
      const data = response.data;
      console.log('📊 ReportCards API Response:', data);
      return Array.isArray(data) ? data : [];
    }),

  // دریافت کارنامه‌های یک کاربر
  getReportCardsByUser: (userId: number): Promise<ReportCard[]> =>
    api.get(`/report-cards/user/${userId}`).then(response => {
      const data = response.data;
      return Array.isArray(data) ? data : [];
    }),

  // دریافت یک کارنامه خاص
  getReportCard: (reportCardId: number): Promise<ReportCard> =>
    api.get(`/report-cards/${reportCardId}`).then(response => response.data),

  // آپدیت کارنامه
  updateReportCard: (reportCardId: number, reportCardData: { title?: string; description?: string }): Promise<ReportCard> =>
    api.patch(`/report-cards/${reportCardId}`, reportCardData).then(response => response.data),

  // حذف کارنامه
  deleteReportCard: (reportCardId: number): Promise<void> =>
    api.delete(`/report-cards/${reportCardId}`),
};

export default api;
