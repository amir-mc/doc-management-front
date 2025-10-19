import axios from 'axios';
import { User, CreateUserRequest, UpdateUserRequest, ReportCard, CreateReportCardRequest } from '../types/user';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // افزایش timeout به 30 ثانیه
});

// اضافه کردن interceptor برای لاگ کردن درخواست‌ها
api.interceptors.request.use(
  (config) => {
    console.log('📤 Making API Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('📤 API Request Error:', error);
    return Promise.reject(error);
  }
);

// اضافه کردن interceptor برای لاگ کردن پاسخ‌ها
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response Success:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('📥 API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const userApi = {
  // دریافت همه کاربران
  getUsers: (): Promise<User[]> => 
    api.get('/users').then(response => response.data),

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
};

export const reportCardApi = {
  // ایجاد کارنامه جدید
  createReportCard: (reportCardData: CreateReportCardRequest, file: File): Promise<ReportCard> => {
    const formData = new FormData();
    
    // اضافه کردن فایل
    formData.append('file', file);
    
    // اضافه کردن داده‌های متنی
    formData.append('userId', reportCardData.userId.toString());
    formData.append('title', reportCardData.title);
    formData.append('uploadedBy', reportCardData.uploadedBy.toString());
    
    if (reportCardData.description) {
      formData.append('description', reportCardData.description);
    }

    console.log('📁 FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    return api.post('/report-cards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // افزایش timeout برای آپلود فایل
    }).then(response => response.data);
  },


  // دریافت همه کارنامه‌ها
  getReportCards: (): Promise<ReportCard[]> =>
    api.get('/report-cards').then(response => response.data),

  // دریافت کارنامه‌های یک کاربر
  getReportCardsByUser: (userId: number): Promise<ReportCard[]> =>
    api.get(`/report-cards/user/${userId}`).then(response => response.data),

  // حذف کارنامه
  deleteReportCard: (reportCardId: number): Promise<void> =>
    api.delete(`/report-cards/${reportCardId}`),
};