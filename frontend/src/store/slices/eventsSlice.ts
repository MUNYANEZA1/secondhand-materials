
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  coverImage: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
    type: 'student' | 'faculty' | 'club' | 'organization';
  };
  ticketInfo: {
    type: 'free' | 'paid';
    price?: number;
    capacity: number;
    registered: number;
    maxPerUser: number;
  };
  tags: string[];
  attendees?: string[];
  createdAt: string;
  updatedAt: string;
}

interface EventsState {
  items: Event[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    category: string;
    status: string;
    type: string;
  };
}

const initialState: EventsState = {
  items: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    category: 'All',
    status: 'All',
    type: 'All'
  }
};

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Startup Pitch Competition',
    description: 'Present your innovative startup ideas to industry experts and compete for funding opportunities.',
    date: '2024-12-15',
    time: '6:00 PM - 9:00 PM',
    location: 'Engineering Building Auditorium',
    category: 'Competition',
    status: 'upcoming',
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    organizer: {
      id: 'org1',
      name: 'Entrepreneurship Club',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      verified: true,
      type: 'club'
    },
    ticketInfo: {
      type: 'free',
      capacity: 200,
      registered: 87,
      maxPerUser: 1
    },
    tags: ['technology', 'startup', 'competition'],
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering the latest trends in AI and machine learning applications.',
    date: '2024-12-20',
    time: '2:00 PM - 5:00 PM',
    location: 'Computer Science Lab 101',
    category: 'Workshop',
    status: 'upcoming',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    organizer: {
      id: 'org2',
      name: 'Dr. Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2c2cac3?w=100',
      verified: true,
      type: 'faculty'
    },
    ticketInfo: {
      type: 'paid',
      price: 25,
      capacity: 50,
      registered: 42,
      maxPerUser: 1
    },
    tags: ['ai', 'machine-learning', 'workshop'],
    createdAt: '2024-11-02T10:00:00Z',
    updatedAt: '2024-11-02T10:00:00Z'
  }
];

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters: Partial<EventsState['filters']>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockEvents;
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<EventsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      });
  }
});

export const { setSearchTerm, setFilters, clearFilters } = eventsSlice.actions;
export default eventsSlice.reducer;
