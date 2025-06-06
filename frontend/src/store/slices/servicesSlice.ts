
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  hourlyRate?: number;
  category: string;
  serviceType: 'hourly' | 'fixed' | 'negotiable';
  availability: string;
  location: 'on-campus' | 'off-campus' | 'remote' | 'flexible';
  images: string[];
  provider: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
  };
  tags: string[];
  isActive: boolean;
  views: number;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    category: string;
    priceRange: [number, number];
    serviceType: string[];
    location: string;
    rating: number;
  };
}

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    category: 'All',
    priceRange: [0, 100],
    serviceType: [],
    location: '',
    rating: 0,
  },
};

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockServices: Service[] = [
      {
        id: '1',
        title: 'Mathematics Tutoring - Calculus & Linear Algebra',
        description: 'Experienced third-year engineering student offering comprehensive math tutoring. Specializing in Calculus I-III, Linear Algebra, and Differential Equations.',
        price: 15,
        hourlyRate: 15,
        category: 'Tutoring',
        serviceType: 'hourly',
        availability: 'Mon-Fri 6-9 PM, Weekends flexible',
        location: 'on-campus',
        images: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400'],
        provider: {
          id: 'provider1',
          name: 'Jean Claude',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          rating: 4.8,
          reviewCount: 23,
          verified: true,
        },
        tags: ['mathematics', 'calculus', 'engineering', 'tutoring'],
        isActive: true,
        views: 89,
        contactCount: 12,
        createdAt: '2024-01-10T14:20:00Z',
        updatedAt: '2024-01-10T14:20:00Z',
      },
      {
        id: '2',
        title: 'Laptop Repair & Software Installation',
        description: 'Quick and reliable computer repair services. Hardware troubleshooting, OS installation, virus removal, and software setup.',
        price: 25,
        category: 'Tech Support',
        serviceType: 'fixed',
        availability: 'Available most evenings',
        location: 'flexible',
        images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'],
        provider: {
          id: 'provider2',
          name: 'Marie Gasana',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
          rating: 4.9,
          reviewCount: 31,
          verified: true,
        },
        tags: ['computer', 'repair', 'software', 'tech'],
        isActive: true,
        views: 67,
        contactCount: 8,
        createdAt: '2024-01-09T10:15:00Z',
        updatedAt: '2024-01-09T10:15:00Z',
      },
      {
        id: '3',
        title: 'Event Photography & Videography',
        description: 'Professional photography for campus events, graduations, and personal occasions. Includes editing and digital delivery.',
        price: 50,
        category: 'Creative Services',
        serviceType: 'fixed',
        availability: 'Weekends and evenings',
        location: 'flexible',
        images: ['https://images.unsplash.com/photo-1554048612-b6a482b224ac?w=400'],
        provider: {
          id: 'provider3',
          name: 'David Nshuti',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          rating: 4.7,
          reviewCount: 18,
          verified: false,
        },
        tags: ['photography', 'videography', 'events', 'creative'],
        isActive: true,
        views: 45,
        contactCount: 6,
        createdAt: '2024-01-08T16:30:00Z',
        updatedAt: '2024-01-08T16:30:00Z',
      }
    ];
    
    return mockServices;
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setServiceCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setServiceFilters: (state, action: PayloadAction<Partial<ServicesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearServiceFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch services';
      });
  },
});

export const { 
  setSearchTerm: setServiceSearchTerm, 
  setServiceCategory, 
  setServiceFilters, 
  clearServiceFilters 
} = servicesSlice.actions;

export default servicesSlice.reducer;
