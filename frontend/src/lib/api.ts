import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Instance axios avec configuration de base
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/connexion';
      }
    }
    return Promise.reject(error);
  }
);

// API d'authentification
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),

  getProfile: () => api.get('/users/profile'),
};

// API des leçons
export const lessonsAPI = {
  getPublished: (categoryId?: string, level?: string) =>
    api.get('/lessons/published', { params: { categoryId, level } }),

  getBySlug: (slug: string) =>
    api.get(`/lessons/slug/${slug}`),

  search: (query: string) =>
    api.get('/lessons/search', { params: { q: query } }),

  // Admin
  getAll: () => api.get('/lessons'),

  create: (data: any) => api.post('/lessons', data),

  update: (id: string, data: any) => api.patch(`/lessons/${id}`, data),

  delete: (id: string) => api.delete(`/lessons/${id}`),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/lessons/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadAudio: (file: File) => {
    const formData = new FormData();
    formData.append('audio', file);
    return api.post('/lessons/upload/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadVideo: (file: File) => {
    const formData = new FormData();
    formData.append('video', file);
    return api.post('/lessons/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// API des catégories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),

  getOne: (id: string) => api.get(`/categories/${id}`),

  create: (data: any) => api.post('/categories', data),

  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),

  delete: (id: string) => api.delete(`/categories/${id}`),
};

// API des exercices
export const exercisesAPI = {
  getByLesson: (lessonId: string) => api.get(`/exercises/lesson/${lessonId}`),

  getOne: (id: string) => api.get(`/exercises/${id}`),

  submit: (id: string, answers: any) =>
    api.post(`/exercises/${id}/submit`, { answers }),

  getMyResults: (id: string) => api.get(`/exercises/${id}/my-results`),

  // Admin
  create: (data: any) => api.post('/exercises', data),

  update: (id: string, data: any) => api.patch(`/exercises/${id}`, data),

  delete: (id: string) => api.delete(`/exercises/${id}`),
};

// API de progression
export const progressAPI = {
  getMyProgress: () => api.get('/progress/my-progress'),

  getLessonProgress: (lessonId: string) =>
    api.get(`/progress/lesson/${lessonId}`),

  getByLesson: (lessonId: string) =>
    api.get(`/progress/lesson/${lessonId}`),

  markStatus: (lessonId: string, status: string) =>
    api.post(`/progress/lesson/${lessonId}/status`, { status }),

  updateStatus: (lessonId: string, status: string) =>
    api.post(`/progress/lesson/${lessonId}/status`, { status }),
};

// API des commentaires
export const commentsAPI = {
  getByLesson: (lessonId: string) => api.get(`/comments/lesson/${lessonId}`),

  create: (lessonId: string, content: string) =>
    api.post('/comments', { lessonId, content }),

  // Admin
  getPending: () => api.get('/comments/pending'),

  getAll: () => api.get('/comments'),

  updateStatus: (id: string, status: string) =>
    api.patch(`/comments/${id}/status`, { status }),

  delete: (id: string) => api.delete(`/comments/${id}`),
};

// API des favoris
export const favoritesAPI = {
  getMyFavorites: () => api.get('/favorites'),

  check: (lessonId: string) => api.get(`/favorites/${lessonId}/check`),

  add: (lessonId: string) => api.post(`/favorites/${lessonId}`),

  remove: (lessonId: string) => api.delete(`/favorites/${lessonId}`),
};

export default api;
