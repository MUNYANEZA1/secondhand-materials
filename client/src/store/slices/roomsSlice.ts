
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  type: 'study_room' | 'meeting_room' | 'lab' | 'classroom' | 'auditorium';
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  hourlyRate?: number;
  description: string;
  equipment: string[];
  location: {
    building: string;
    floor: number;
    room: string;
  };
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  attendees: number;
}

interface RoomsState {
  rooms: Room[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    building: string;
    type: string;
    capacity: number;
    date: string;
    startTime: string;
    endTime: string;
  };
}

const initialState: RoomsState = {
  rooms: [],
  bookings: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    building: 'All',
    type: 'All',
    capacity: 1,
    date: '',
    startTime: '',
    endTime: '',
  },
};

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockRooms: Room[] = [
      {
        id: '1',
        name: 'Study Room A',
        building: 'Library',
        floor: 2,
        capacity: 4,
        type: 'study_room',
        amenities: ['Whiteboard', 'WiFi', 'Power Outlets'],
        images: ['https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400'],
        isAvailable: true,
        description: 'Quiet study room perfect for group work and collaboration.',
        equipment: ['Whiteboard', 'Markers', 'Projector'],
        location: {
          building: 'Library',
          floor: 2,
          room: 'A-201',
        },
      },
      {
        id: '2',
        name: 'Conference Room B',
        building: 'Student Center',
        floor: 1,
        capacity: 12,
        type: 'meeting_room',
        amenities: ['Projector', 'WiFi', 'Video Conferencing'],
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'],
        isAvailable: true,
        hourlyRate: 25,
        description: 'Professional meeting room with modern amenities.',
        equipment: ['Projector', 'Screen', 'Conference Phone'],
        location: {
          building: 'Student Center',
          floor: 1,
          room: 'SC-105',
        },
      },
    ];
    
    return mockRooms;
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRoomSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setRoomFilters: (state, action: PayloadAction<Partial<RoomsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearRoomFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rooms';
      });
  },
});

export const { 
  setRoomSearchTerm,
  setRoomFilters, 
  clearRoomFilters 
} = roomsSlice.actions;

export default roomsSlice.reducer;
