
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Ride {
  id: string;
  type: 'offer' | 'request';
  driver: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
  };
  origin: string;
  destination: string;
  date: string;
  time: string;
  availableSeats: number;
  price: number;
  description: string;
  preferences: string[];
  car: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
  };
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

interface RidesState {
  rides: Ride[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    type: string;
    date: string;
    origin: string;
    destination: string;
    maxPrice: number;
  };
}

const initialState: RidesState = {
  rides: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    type: 'All',
    date: '',
    origin: '',
    destination: '',
    maxPrice: 100,
  },
};

export const fetchRides = createAsyncThunk(
  'rides/fetchRides',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockRides: Ride[] = [
      {
        id: '1',
        type: 'offer',
        driver: {
          id: 'user1',
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          rating: 4.8,
          verified: true,
        },
        origin: 'Campus',
        destination: 'Downtown Mall',
        date: '2024-02-15',
        time: '14:30',
        availableSeats: 3,
        price: 8,
        description: 'Going to the mall for shopping. Happy to share the ride!',
        preferences: ['No smoking', 'Music okay'],
        car: {
          make: 'Honda',
          model: 'Civic',
          color: 'Blue',
          licensePlate: 'ABC123',
        },
        status: 'active',
        createdAt: '2024-02-10T10:00:00Z',
      },
      {
        id: '2',
        type: 'request',
        driver: {
          id: 'user2',
          name: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          rating: 4.6,
          verified: false,
        },
        origin: 'Campus',
        destination: 'Airport',
        date: '2024-02-16',
        time: '08:00',
        availableSeats: 1,
        price: 25,
        description: 'Need a ride to catch morning flight. Will contribute to gas!',
        preferences: ['Quiet ride', 'No detours'],
        car: {
          make: '',
          model: '',
          color: '',
          licensePlate: '',
        },
        status: 'active',
        createdAt: '2024-02-11T15:30:00Z',
      },
    ];
    
    return mockRides;
  }
);

const ridesSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    setRideSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setRideFilters: (state, action: PayloadAction<Partial<RidesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearRideFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRides.fulfilled, (state, action) => {
        state.loading = false;
        state.rides = action.payload;
      })
      .addCase(fetchRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rides';
      });
  },
});

export const { 
  setRideSearchTerm,
  setRideFilters, 
  clearRideFilters 
} = ridesSlice.actions;

export default ridesSlice.reducer;
