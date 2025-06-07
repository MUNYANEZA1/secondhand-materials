import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'vendor' | 'admin' | 'university';
  reputation: number;
  verified: boolean;
  // Enhanced profile fields
  studentId?: string;
  university: string;
  major?: string;
  graduationYear?: number;
  location: string;
  bio?: string;
  contactNumber?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  // Seller specific fields
  businessName?: string;
  businessType?: 'individual' | 'company' | 'university_department';
  businessLicense?: string;
  // Statistics
  totalSales: number;
  totalPurchases: number;
  joinedAt: string;
  lastActive: string;
  // Trust & Safety
  verificationLevel: 'none' | 'email' | 'student_id' | 'full';
  trustScore: number;
  badges: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registrationStep: number;
}

// Initialize state with localStorage data
const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!(token && user)
    };
  } catch {
    return { token: null, user: null, isAuthenticated: false };
  }
};

const storedAuth = getStoredAuth();

const initialState: AuthState = {
  user: storedAuth.user,
  token: storedAuth.token,
  isAuthenticated: storedAuth.isAuthenticated,
  loading: false,
  error: null,
  registrationStep: 1,
};

// Enhanced async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enhanced mock users for different roles
    const mockUsers = {
      'demo@ines.ac.rw': {
        id: '1',
        name: 'John Uwimana',
        email: 'demo@ines.ac.rw',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        role: 'student' as const,
        reputation: 4.8,
        verified: true,
        studentId: 'INES2023001',
        university: 'INES-Ruhengeri',
        major: 'Computer Science',
        graduationYear: 2025,
        location: 'Musanze, Rwanda',
        bio: 'CS student passionate about technology and entrepreneurship.',
        contactNumber: '+250788123456',
        totalSales: 12,
        totalPurchases: 28,
        joinedAt: '2023-09-01T00:00:00Z',
        lastActive: new Date().toISOString(),
        verificationLevel: 'full' as const,
        trustScore: 95,
        badges: ['verified_student', 'trusted_seller', 'early_adopter'],
      },
      'vendor@example.com': {
        id: '2',
        name: 'Marie Mutoni',
        email: 'vendor@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
        role: 'vendor' as const,
        reputation: 4.9,
        verified: true,
        university: 'INES-Ruhengeri',
        businessName: 'Tech Solutions Rwanda',
        businessType: 'company' as const,
        location: 'Kigali, Rwanda',
        bio: 'Providing quality tech products and services to students.',
        contactNumber: '+250788654321',
        totalSales: 156,
        totalPurchases: 5,
        joinedAt: '2023-01-15T00:00:00Z',
        lastActive: new Date().toISOString(),
        verificationLevel: 'full' as const,
        trustScore: 98,
        badges: ['verified_vendor', 'top_seller', 'premium_partner'],
      },
      'admin@ines.ac.rw': {
        id: '3',
        name: 'Dr. Patrick Nzeyimana',
        email: 'admin@ines.ac.rw',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'admin' as const,
        reputation: 5.0,
        verified: true,
        university: 'INES-Ruhengeri',
        location: 'Musanze, Rwanda',
        bio: 'Platform administrator ensuring safe and fair trading.',
        totalSales: 0,
        totalPurchases: 0,
        joinedAt: '2023-01-01T00:00:00Z',
        lastActive: new Date().toISOString(),
        verificationLevel: 'full' as const,
        trustScore: 100,
        badges: ['admin', 'platform_guardian'],
      }
    };
    
    const user = mockUsers[email as keyof typeof mockUsers];
    if (user && password === 'demo123') {
      const token = 'mock-jwt-token';
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    }
    
    throw new Error('Invalid credentials');
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    role: 'student' | 'vendor';
    university: string;
    studentId?: string;
    major?: string;
    businessName?: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      reputation: 0,
      verified: false,
      university: userData.university,
      studentId: userData.studentId,
      major: userData.major,
      businessName: userData.businessName,
      businessType: userData.role === 'vendor' ? 'individual' : undefined,
      location: '',
      totalSales: 0,
      totalPurchases: 0,
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      verificationLevel: 'email',
      trustScore: 50,
      badges: ['new_member'],
    };
    
    const token = 'mock-jwt-token';
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return { user: mockUser, token };
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return profileData;
  }
);

export const verifyUser = createAsyncThunk(
  'auth/verify',
  async (verificationData: { type: 'student_id' | 'business_license'; document: string }) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { verified: true, verificationLevel: 'full' as const };
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    const storedAuth = getStoredAuth();
    if (storedAuth.token && storedAuth.user) {
      // Simulate token validation
      await new Promise(resolve => setTimeout(resolve, 500));
      return storedAuth;
    }
    throw new Error('No valid session');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setRegistrationStep: (state, action: PayloadAction<number>) => {
      state.registrationStep = action.payload;
    },
    updateLastActive: (state) => {
      if (state.user) {
        state.user.lastActive = new Date().toISOString();
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      });
  },
});

export const { logout, clearError, updateUser, setRegistrationStep, updateLastActive } = authSlice.actions;
export default authSlice.reducer;
