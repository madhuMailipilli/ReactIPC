import apiService from './apiService';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', { email, password });
      const data = response.data;
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }

      if (data.status === 'success') {
        this.token = data.data.token;
        localStorage.setItem('token', this.token);
        
        // Parse JWT token to get roles
        let roles = [];
        try {
          const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
          roles = tokenPayload.roles || tokenPayload.role || [];
        } catch (error) {
          console.error('Error parsing JWT token:', error);
        }
        
        // Merge user data from API response with roles from JWT
        const userData = {
          ...data.data.user,
          roles: roles
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true, user: userData };
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      const data = response.data;
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }

      if (data.status === 'success') {
        return { success: true, message: data.message };
      }
      
      throw new Error('Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }
}

export default new AuthService();