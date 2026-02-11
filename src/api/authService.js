import apiService from './apiService';

class AuthService {
  async login(email, password) {
    const response = await apiService.post('/auth/login', { email, password });
    const data = response.data;
    
    if (data.status === 'error') {
      throw new Error(data.message);
    }

    if (data.status === 'success') {
      const userData = data?.data ?? null;
      return { success: true, user: userData };
    }
    
    throw new Error('Login failed');
  }

  async register(userData) {
    const response = await apiService.post('/auth/register', userData);
    const data = response.data;
    
    if (data.status === 'error') {
      throw new Error(data.message);
    }

    if (data.status === 'success') {
      return { success: true, message: data.message };
    }
    
    throw new Error('Registration failed');
  }

  async verifySession() {
    try {
      const response = await apiService.post('/auth/decode');
      return response.data?.data ?? null;
    } catch (error) {
      return null;
    }
  }

  async logout() {
    // No backend logout endpoint needed - session cleared client-side
  }

  getUser() {
    return null;
  }
}

export default new AuthService();