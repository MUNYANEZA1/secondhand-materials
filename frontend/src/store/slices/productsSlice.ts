import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  category: string;
  subcategory?: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    avatar?: string;
    reputation: number;
    verified: boolean;
  };
  location: string;
  tags: string[];
  isFree: boolean;
  isActive: boolean;
  views: number;
  likes: number;
  ownerType?: 'student' | 'university';
  staffOnly?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductsState {
  items: Product[];
  favorites: string[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    category: string;
    priceRange: [number, number];
    condition: string[];
    location: string;
    sortBy: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: ProductsState = {
  items: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    category: 'All',
    priceRange: [0, 1000],
    condition: [],
    location: '',
    sortBy: 'newest',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { page?: number; search?: string; filters?: any }) => {
    // Mock API call with expanded realistic data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockProducts: Product[] = [
      // Books Category
      {
        id: '1',
        title: 'Complete Engineering Mathematics Textbook Bundle',
        description: 'Premium collection of engineering math books including Calculus I-III, Linear Algebra, Differential Equations, and Statistics. Excellent condition with minimal highlighting.',
        price: 120,
        condition: 'excellent',
        category: 'Books',
        subcategory: 'Engineering',
        images: [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
        ],
        seller: {
          id: 'seller1',
          name: 'Marie Uwimana',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
          reputation: 4.9,
          verified: true,
        },
        location: 'Campus Library Area',
        tags: ['mathematics', 'engineering', 'textbooks', 'calculus', 'bundle'],
        isFree: false,
        isActive: true,
        views: 156,
        likes: 28,
        ownerType: 'student',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '11',
        title: 'Biology Textbook - Campbell Biology 12th Edition',
        description: 'Latest edition of Campbell Biology with comprehensive coverage of modern biology. Includes access code for online resources.',
        price: 85,
        condition: 'good',
        category: 'Books',
        subcategory: 'Science',
        images: [
          'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
        ],
        seller: {
          id: 'seller11',
          name: 'David Mukamana',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          reputation: 4.7,
          verified: true,
        },
        location: 'Science Building',
        tags: ['biology', 'science', 'campbell', 'textbook'],
        isFree: false,
        isActive: true,
        views: 98,
        likes: 15,
        ownerType: 'student',
        createdAt: '2024-01-14T08:15:00Z',
        updatedAt: '2024-01-14T08:15:00Z',
      },
      {
        id: '12',
        title: 'FREE Study Notes - Computer Science Bundle',
        description: 'Comprehensive study notes for CS courses including Data Structures, Algorithms, and Software Engineering. Free for fellow students!',
        price: 0,
        condition: 'good',
        category: 'Books',
        subcategory: 'Computer Science',
        images: [
          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400'
        ],
        seller: {
          id: 'seller12',
          name: 'Alice Mutoni',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          reputation: 4.8,
          verified: true,
        },
        location: 'Computer Lab',
        tags: ['free', 'computer science', 'notes', 'algorithms'],
        isFree: true,
        isActive: true,
        views: 245,
        likes: 72,
        ownerType: 'student',
        createdAt: '2024-01-13T16:20:00Z',
        updatedAt: '2024-01-13T16:20:00Z',
      },

      // Electronics Category
      {
        id: '2',
        title: 'MacBook Air M2 (2022) - Perfect for Students',
        description: 'Pristine condition MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Used for one semester only. Includes original charger and box.',
        price: 1100,
        condition: 'excellent',
        category: 'Electronics',
        subcategory: 'Laptops',
        images: [
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
          'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400'
        ],
        seller: {
          id: 'seller2',
          name: 'Jean Baptiste Mugabo',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          reputation: 4.8,
          verified: true,
        },
        location: 'Engineering Building',
        tags: ['laptop', 'apple', 'macbook', 'student', 'portable'],
        isFree: false,
        isActive: true,
        views: 203,
        likes: 45,
        ownerType: 'student',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T14:20:00Z',
      },
      {
        id: '13',
        title: 'iPhone 14 Pro - Mint Condition',
        description: 'Barely used iPhone 14 Pro in Space Black, 128GB. Includes original box, charger, and premium case worth $50.',
        price: 850,
        condition: 'excellent',
        category: 'Electronics',
        subcategory: 'Smartphones',
        images: [
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
        ],
        seller: {
          id: 'seller13',
          name: 'Grace Niyonzima',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
          reputation: 4.9,
          verified: true,
        },
        location: 'Student Center',
        tags: ['iphone', 'smartphone', 'apple', 'accessories'],
        isFree: false,
        isActive: true,
        views: 278,
        likes: 52,
        ownerType: 'student',
        createdAt: '2024-01-12T09:30:00Z',
        updatedAt: '2024-01-12T09:30:00Z',
      },
      {
        id: '14',
        title: 'Gaming Setup - Alienware Laptop + Peripherals',
        description: 'Complete gaming setup! Alienware m15 R6 with RTX 3070, mechanical keyboard, gaming mouse, and headset.',
        price: 1450,
        condition: 'good',
        category: 'Electronics',
        subcategory: 'Gaming',
        images: [
          'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400'
        ],
        seller: {
          id: 'seller14',
          name: 'Alex Rugamba',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          reputation: 4.6,
          verified: true,
        },
        location: 'Engineering Building',
        tags: ['gaming', 'alienware', 'laptop', 'setup'],
        isFree: false,
        isActive: true,
        views: 167,
        likes: 38,
        ownerType: 'student',
        createdAt: '2024-01-11T15:45:00Z',
        updatedAt: '2024-01-11T15:45:00Z',
      },

      // Clothing Category
      {
        id: '15',
        title: 'Winter Clothing Collection - Designer Brands',
        description: 'High-quality winter clothing collection. Includes North Face jacket, wool sweaters, thermal wear, and accessories.',
        price: 180,
        condition: 'excellent',
        category: 'Clothing',
        subcategory: 'Winter Wear',
        images: [
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
          'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'
        ],
        seller: {
          id: 'seller15',
          name: 'Emma Kamanzi',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          reputation: 4.7,
          verified: true,
        },
        location: 'Campus Library Area',
        tags: ['clothing', 'winter', 'jacket', 'brand'],
        isFree: false,
        isActive: true,
        views: 98,
        likes: 19,
        ownerType: 'student',
        createdAt: '2024-01-10T12:00:00Z',
        updatedAt: '2024-01-10T12:00:00Z',
      },
      {
        id: '16',
        title: 'Formal Business Attire Set',
        description: 'Professional business suits, dress shirts, ties, and formal shoes. Perfect for internships and job interviews.',
        price: 95,
        condition: 'good',
        category: 'Clothing',
        subcategory: 'Formal',
        images: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        ],
        seller: {
          id: 'seller16',
          name: 'Patrick Nzeyimana',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          reputation: 4.5,
          verified: true,
        },
        location: 'Business School',
        tags: ['formal', 'business', 'suits', 'professional'],
        isFree: false,
        isActive: true,
        views: 76,
        likes: 12,
        ownerType: 'student',
        createdAt: '2024-01-09T14:30:00Z',
        updatedAt: '2024-01-09T14:30:00Z',
      },

      // Furniture Category
      {
        id: '3',
        title: 'Complete Dorm Furniture Set',
        description: 'Complete dorm setup! Premium ergonomic desk, matching chair, bookshelf, desk lamp, and storage containers.',
        price: 220,
        condition: 'good',
        category: 'Furniture',
        subcategory: 'Dorm',
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
        ],
        seller: {
          id: 'seller3',
          name: 'Aisha Mutoni',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          reputation: 4.7,
          verified: true,
        },
        location: 'Student Residence',
        tags: ['furniture', 'dorm', 'desk', 'chair', 'storage'],
        isFree: false,
        isActive: true,
        views: 134,
        likes: 22,
        ownerType: 'student',
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:15:00Z',
      },
      {
        id: '17',
        title: 'Comfortable Study Chair - Ergonomic Design',
        description: 'High-quality ergonomic study chair with lumbar support. Perfect for long study sessions. Adjustable height.',
        price: 65,
        condition: 'excellent',
        category: 'Furniture',
        subcategory: 'Chairs',
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
        ],
        seller: {
          id: 'seller17',
          name: 'Samuel Habimana',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          reputation: 4.8,
          verified: true,
        },
        location: 'Library Area',
        tags: ['chair', 'ergonomic', 'study', 'comfortable'],
        isFree: false,
        isActive: true,
        views: 89,
        likes: 14,
        ownerType: 'student',
        createdAt: '2024-01-08T11:20:00Z',
        updatedAt: '2024-01-08T11:20:00Z',
      },

      // Musical Instruments Category
      {
        id: '18',
        title: 'Acoustic Guitar - Yamaha FG830',
        description: 'Beautiful Yamaha acoustic guitar in excellent condition. Includes case, picks, and tuner. Perfect for beginners.',
        price: 180,
        condition: 'excellent',
        category: 'Musical Instruments',
        subcategory: 'String Instruments',
        images: [
          'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=400',
          'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400'
        ],
        seller: {
          id: 'seller18',
          name: 'Linda Uwimana',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
          reputation: 4.9,
          verified: true,
        },
        location: 'Music Department',
        tags: ['guitar', 'acoustic', 'yamaha', 'music'],
        isFree: false,
        isActive: true,
        views: 112,
        likes: 27,
        ownerType: 'student',
        createdAt: '2024-01-07T13:45:00Z',
        updatedAt: '2024-01-07T13:45:00Z',
      },
      {
        id: '19',
        title: 'Digital Piano - Casio CDP-S100',
        description: 'Compact digital piano with 88 weighted keys. Includes pedal, stand, and music books. Great for practice.',
        price: 320,
        condition: 'good',
        category: 'Musical Instruments',
        subcategory: 'Keyboards',
        images: [
          'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400'
        ],
        seller: {
          id: 'seller19',
          name: 'Joseph Nkurunziza',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          reputation: 4.6,
          verified: true,
        },
        location: 'Arts Building',
        tags: ['piano', 'digital', 'casio', 'keyboard'],
        isFree: false,
        isActive: true,
        views: 87,
        likes: 16,
        ownerType: 'student',
        createdAt: '2024-01-06T10:15:00Z',
        updatedAt: '2024-01-06T10:15:00Z',
      },

      // Bikes/Scooters Category
      {
        id: '20',
        title: 'Mountain Bike - Trek Marlin 7',
        description: 'Excellent condition Trek mountain bike. Perfect for campus commuting and weekend adventures. Recently serviced.',
        price: 450,
        condition: 'excellent',
        category: 'Bikes/Scooters',
        subcategory: 'Mountain Bikes',
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          'https://images.unsplash.com/photo-1544191696-15693072c551?w=400'
        ],
        seller: {
          id: 'seller20',
          name: 'Michael Uwimana',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          reputation: 4.7,
          verified: true,
        },
        location: 'Recreation Center',
        tags: ['bike', 'mountain', 'trek', 'cycling'],
        isFree: false,
        isActive: true,
        views: 156,
        likes: 31,
        ownerType: 'student',
        createdAt: '2024-01-05T14:00:00Z',
        updatedAt: '2024-01-05T14:00:00Z',
      },
      {
        id: '21',
        title: 'Electric Scooter - Xiaomi Mi Pro 2',
        description: 'High-quality electric scooter with long battery life. Perfect for quick campus transportation. Folds for easy storage.',
        price: 380,
        condition: 'good',
        category: 'Bikes/Scooters',
        subcategory: 'Electric Scooters',
        images: [
          'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400'
        ],
        seller: {
          id: 'seller21',
          name: 'Sarah Mukamana',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          reputation: 4.8,
          verified: true,
        },
        location: 'Engineering Building',
        tags: ['scooter', 'electric', 'xiaomi', 'transportation'],
        isFree: false,
        isActive: true,
        views: 203,
        likes: 45,
        ownerType: 'student',
        createdAt: '2024-01-04T16:30:00Z',
        updatedAt: '2024-01-04T16:30:00Z',
      }
    ];
    
    return {
      products: mockProducts,
      total: mockProducts.length,
    };
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.priceRange = action.payload;
    },
    setCondition: (state, action: PayloadAction<string[]>) => {
      state.filters.condition = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.favorites.indexOf(productId);
      
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(productId);
      }
      
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { 
  setSearchTerm, 
  setCategory, 
  setPriceRange, 
  setCondition,
  setFilters, 
  toggleFavorite, 
  clearFilters 
} = productsSlice.actions;

export default productsSlice.reducer;
