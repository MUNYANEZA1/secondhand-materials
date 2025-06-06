
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'ppt' | 'dataset' | 'other';
  fileSize: string;
  category: string;
  course?: string;
  department: string;
  uploader: {
    id: string;
    name: string;
    avatar?: string;
    year?: string;
  };
  tags: string[];
  downloads: number;
  rating: number;
  ratingCount: number;
  isApproved: boolean;
  accessType: 'free' | 'view-only' | 'restricted';
  createdAt: string;
  updatedAt: string;
}

interface ResourcesState {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    category: string;
    department: string;
    fileType: string;
    accessType: string;
  };
}

const initialState: ResourcesState = {
  resources: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    category: 'All',
    department: 'All',
    fileType: 'All',
    accessType: 'All',
  },
};

export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockResources: Resource[] = [
      {
        id: '1',
        title: 'Data Structures & Algorithms - Complete Notes',
        description: 'Comprehensive notes covering all major data structures including arrays, linked lists, trees, graphs, and common algorithms.',
        fileUrl: 'https://example.com/dsa-notes.pdf',
        fileType: 'pdf',
        fileSize: '2.4 MB',
        category: 'Course Notes',
        course: 'CS 301',
        department: 'Computer Science',
        uploader: {
          id: 'user1',
          name: 'Alice Mukamana',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
          year: 'Year 3',
        },
        tags: ['datastructures', 'algorithms', 'computerscience', 'notes'],
        downloads: 245,
        rating: 4.8,
        ratingCount: 32,
        isApproved: true,
        accessType: 'free',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        title: 'Organic Chemistry Lab Report Template',
        description: 'Professional template for organic chemistry lab reports with proper formatting and structure.',
        fileUrl: 'https://example.com/chem-template.doc',
        fileType: 'doc',
        fileSize: '156 KB',
        category: 'Lab Reports',
        course: 'CHEM 205',
        department: 'Chemistry',
        uploader: {
          id: 'user2',
          name: 'Bob Nshuti',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          year: 'Year 2',
        },
        tags: ['chemistry', 'lab', 'template', 'organic'],
        downloads: 89,
        rating: 4.5,
        ratingCount: 18,
        isApproved: true,
        accessType: 'free',
        createdAt: '2024-01-12T14:20:00Z',
        updatedAt: '2024-01-12T14:20:00Z',
      },
    ];
    
    return mockResources;
  }
);

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResourceSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setResourceFilters: (state, action: PayloadAction<Partial<ResourcesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearResourceFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch resources';
      });
  },
});

export const { 
  setResourceSearchTerm,
  setResourceFilters, 
  clearResourceFilters 
} = resourcesSlice.actions;

export default resourcesSlice.reducer;
