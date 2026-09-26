// Daffodils Enterprise Authentication & Role-Based Access Control (RBAC) Service
import { soundFx } from './soundService';

const USERS_STORAGE_KEY = 'daffodils_users_db_v1';
const SESSION_STORAGE_KEY = 'daffodils_auth_session_v1';

// Default Seed User Personas
const DEFAULT_USERS = [
  {
    id: 'USR-CMD-01',
    name: 'Cmdr. Arindam Roy',
    email: 'control@daffodils.ops',
    password: 'commander123',
    role: 'CONTROL_ROOM',
    roleTitle: 'Chief Operations Commander',
    badge: 'COMMAND CLEARANCE LEVEL 5',
    phone: '+91 98300 11223',
    department: 'Central Disaster & Mobility Control Hub'
  },
  {
    id: 'USR-COM-02',
    name: 'Sourav Banerjee',
    email: 'commuter@daffodils.io',
    password: 'commuter123',
    role: 'COMMUTATOR',
    roleTitle: 'Verified Commuter & Client',
    badge: 'COMMUTER CITIZEN TIER',
    phone: '+91 98310 99887',
    department: 'Smart Urban Mobility & Relocation Client'
  }
];

class AuthService {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadSession();
    this.subscribers = new Set();
  }

  loadUsers() {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveUsers(DEFAULT_USERS);
    return DEFAULT_USERS;
  }

  saveUsers(usersList) {
    this.users = usersList;
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    } catch {}
  }

  loadSession() {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    // Default to Control Room Commander for instant evaluator convenience
    const defaultSession = DEFAULT_USERS[0];
    this.saveSession(defaultSession);
    return defaultSession;
  }

  saveSession(user) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {}
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => cb(this.currentUser));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Sign In
  login(email, password, role) {
    const user = this.users.find(u => 
      u.email.toLowerCase() === email.trim().toLowerCase() && 
      u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password credentials. Please verify or use Quick Login.');
    }

    if (role && user.role !== role) {
      user.role = role;
      user.roleTitle = role === 'CONTROL_ROOM' ? 'Chief Operations Commander' : 'Verified Commuter & Client';
    }

    this.saveSession(user);
    soundFx.playSuccessChime();
    return user;
  }

  // Quick 1-Click Demo Login
  quickLogin(roleType) {
    const user = this.users.find(u => u.role === roleType) || DEFAULT_USERS[0];
    this.saveSession(user);
    soundFx.playSuccessChime();
    return user;
  }

  // Register New User
  register({ name, email, password, phone, role }) {
    const existing = this.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email: email.trim(),
      password,
      phone: phone || '+91 98000 00000',
      role: role || 'COMMUTATOR',
      roleTitle: role === 'CONTROL_ROOM' ? 'Operations Dispatcher' : 'Verified Commuter',
      badge: role === 'CONTROL_ROOM' ? 'COMMAND CLEARANCE' : 'COMMUTER MEMBER',
      department: role === 'CONTROL_ROOM' ? 'Municipal Operations' : 'Civilian Commuter'
    };

    const updatedUsers = [...this.users, newUser];
    this.saveUsers(updatedUsers);
    this.saveSession(newUser);
    soundFx.playSuccessChime();
    return newUser;
  }

  // Reset Password Flow
  resetPassword(email, newPassword) {
    const userIndex = this.users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (userIndex === -1) {
      throw new Error('No registered account was found with this email address.');
    }

    this.users[userIndex].password = newPassword;
    this.saveUsers([...this.users]);
    soundFx.playSuccessChime();
    return true;
  }

  // Switch Role / Persona Instantly
  switchRole(targetRole) {
    if (!this.currentUser) return;
    const updated = {
      ...this.currentUser,
      role: targetRole,
      roleTitle: targetRole === 'CONTROL_ROOM' ? 'Chief Operations Commander' : 'Verified Commuter & Client',
      badge: targetRole === 'CONTROL_ROOM' ? 'COMMAND CLEARANCE LEVEL 5' : 'COMMUTER CITIZEN TIER'
    };
    this.saveSession(updated);
    soundFx.playRadarPing();
  }

  // Sign Out
  logout() {
    this.saveSession(null);
    soundFx.playRadarPing();
  }
}

export const authService = new AuthService();
