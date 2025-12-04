
import { EmployeeInfo } from '../types';

const USERS_KEY = 'boiler_kpi_users_db';
const SESSION_KEY = 'boiler_kpi_current_session';

export interface UserAccount {
  id: string;
  email: string; // Changed from username to email
  password: string; 
  fullName: string;
  role: string;
  department: string;
  avatar?: string;
}

export const authService = {
  // Get all users
  getUsers: (): UserAccount[] => {
    try {
      const usersStr = localStorage.getItem(USERS_KEY);
      return usersStr ? JSON.parse(usersStr) : [];
    } catch (e) {
      return [];
    }
  },

  // Save users
  saveUsers: (users: UserAccount[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Register new user
  register: (data: Omit<UserAccount, 'id'>): { success: boolean; message: string; user?: UserAccount } => {
    const users = authService.getUsers();
    
    // Check if email exists
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'Email này đã được đăng ký.' };
    }

    const newUser: UserAccount = {
      ...data,
      id: `NV-${Math.floor(1000 + Math.random() * 9000)}`, // Generate random ID like NV-1234
    };

    users.push(newUser);
    authService.saveUsers(users);
    
    // Auto login after register
    authService.setSession(newUser);

    return { success: true, message: 'Đăng ký thành công!', user: newUser };
  },

  // Login
  login: (email: string, password: string): { success: boolean; message: string; user?: UserAccount } => {
    const users = authService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
      return { success: false, message: 'Sai email hoặc mật khẩu.' };
    }

    authService.setSession(user);
    return { success: true, message: 'Đăng nhập thành công!', user };
  },

  // Set Session
  setSession: (user: UserAccount) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  // Get Current Session
  getCurrentUser: (): UserAccount | null => {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch (e) {
      return null;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};
