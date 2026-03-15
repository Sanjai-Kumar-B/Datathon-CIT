import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
};

export const teacherService = {
  /**
   * Ask the AI assistant for teaching suggestions.
   */
  askAssistant: async (question, childAge, language = 'en') => {
    const response = await api.post('/teacher-assistant', {
      question,
      child_age: parseInt(childAge),
      language,
    });
    return response.data;
  },

  /**
   * Translate text using Gemini.
   */
  translateText: async (text, targetLanguage) => {
    const response = await api.post('/translate', {
      text,
      target_language: targetLanguage,
    });
    return response.data;
  },

  /**
   * Generate flashcards for a topic.
   */
  generateFlashcards: async (topic, childAge, count = 5, language = 'en', resourceId = null) => {
    const response = await api.post('/generate-flashcards', {
      topic,
      child_age: parseInt(childAge),
      count: parseInt(count),
      language: language,
      resource_id: resourceId,
    });
    return response.data;
  },

  /**
   * Upload a resource (PDF, URL, etc.)
   */
  uploadResource: async (formData) => {
    const response = await api.post('/upload-resource', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get all resources for a teacher
   */
  getResources: async (teacherId) => {
    const response = await api.get(`/resources/${teacherId}`);
    return response.data;
  },
};
export const getStudentFeed = async (studentId) => {
  const response = await api.get(`/student-feed/${studentId}`);
  return response.data;
};

export default api;
export const publishActivity = async (teacherId, studentId, activityType, content) => {
  const response = await api.post('/publish-activity', {
    teacher_id: teacherId,
    student_id: studentId,
    activity_type: activityType,
    content: content,
  });
  return response.data;
};

/**
 * Progress Tracking APIs
 */
export const completeActivity = async (studentId, activityId, topic, score) => {
  const response = await api.post('/complete-activity', {
    student_id: studentId,
    activity_id: activity_id,
    topic: topic,
    score: parseInt(score),
  });
  return response.data;
};

export const getStudentProgress = async (studentId) => {
  const response = await api.get(`/student-progress/${studentId}`);
  return response.data;
};

export const getClassProgress = async (classId) => {
  const response = await api.get(`/class-progress/${classId}`);
  return response.data;
};

/**
 * AI Video & Recommendations
 */
export const generateVideo = async (resourceId) => {
  const response = await api.post('/generate-video', {
    resource_id: resourceId,
  });
  return response.data;
};

export const getRecommendations = async (studentId) => {
  const response = await api.get(`/recommendations/${studentId}`);
  return response.data;
};
