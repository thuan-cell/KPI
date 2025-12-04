
import { EmployeeInfo } from '../types';

const USERS_KEY = 'boiler_kpi_users_db';
const SESSION_KEY = 'boiler_kpi_current_session';
const PENDING_REG_KEY = 'boiler_kpi_pending_registrations';

export interface UserAccount {
  id: string;
  email: string;
  password: string; 
  fullName: string;
  role: string;
  department: string;
  avatar?: string;
}

interface PendingRegistration {
  email: string;
  otp: string;
  expiresAt: number;
  data: Omit<UserAccount, 'id'>;
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

  // --- STEP 1: INITIATE REGISTRATION (Send OTP) ---
  initiateRegistration: (data: Omit<UserAccount, 'id'>): { success: boolean; message: string } => {
    const users = authService.getUsers();
    
    // 1. Check if email already exists in DB
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'Email này đã được sử dụng.' };
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 3. Save to pending storage (Expires in 5 minutes)
    const pendingData: PendingRegistration = {
        email: data.email.toLowerCase(),
        otp: otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        data: data
    };

    // Store pending registrations map
    let pendingMap: Record<string, PendingRegistration> = {};
    try {
        const str = localStorage.getItem(PENDING_REG_KEY);
        if (str) pendingMap = JSON.parse(str);
    } catch (e) {}

    pendingMap[data.email.toLowerCase()] = pendingData;
    localStorage.setItem(PENDING_REG_KEY, JSON.stringify(pendingMap));

    // 4. SIMULATE SENDING EMAIL (In real app, this calls Backend API)
    // For demo purposes, we log it or rely on the UI to show it via alert
    console.log(`[SIMULATION] Email sent to ${data.email}. OTP Code: ${otp}`);
    
    // Simulate slight network delay is handled by caller
    // We return the OTP in the message ONLY for demo purposes so user can see it in alert
    return { success: true, message: `Mã xác thực đã gửi đến ${data.email}. (Mã demo: ${otp})` };
  },

  // --- STEP 2: VERIFY OTP AND COMPLETE REGISTRATION ---
  verifyRegistration: (email: string, inputOtp: string): { success: boolean; message: string; user?: UserAccount } => {
    let pendingMap: Record<string, PendingRegistration> = {};
    try {
        const str = localStorage.getItem(PENDING_REG_KEY);
        if (str) pendingMap = JSON.parse(str);
    } catch (e) {
        return { success: false, message: 'Lỗi hệ thống xác thực.' };
    }

    const pending = pendingMap[email.toLowerCase()];

    if (!pending) {
        return { success: false, message: 'Yêu cầu đăng ký không tồn tại hoặc đã hết hạn.' };
    }

    if (Date.now() > pending.expiresAt) {
        delete pendingMap[email.toLowerCase()];
        localStorage.setItem(PENDING_REG_KEY, JSON.stringify(pendingMap));
        return { success: false, message: 'Mã xác thực đã hết hạn. Vui lòng đăng ký lại.' };
    }

    if (pending.otp !== inputOtp) {
        return { success: false, message: 'Mã xác thực không chính xác.' };
    }

    // --- OTP CORRECT: CREATE USER ---
    const users = authService.getUsers();
    const newUser: UserAccount = {
      ...pending.data,
      id: `NV-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    users.push(newUser);
    authService.saveUsers(users);
    
    // Clean up pending
    delete pendingMap[email.toLowerCase()];
    localStorage.setItem(PENDING_REG_KEY, JSON.stringify(pendingMap));
    
    // Auto login
    authService.setSession(newUser);

    return { success: true, message: 'Xác thực thành công!', user: newUser };
  },

  // Old Register (Deprecated but kept for fallback)
  register: (data: Omit<UserAccount, 'id'>): { success: boolean; message: string; user?: UserAccount } => {
    return { success: false, message: 'Use initiateRegistration instead' };
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
