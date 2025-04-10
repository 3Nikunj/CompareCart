import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, SearchResponse } from '@/types/product';

const SERPER_API_KEY = '129b6c7d8256535bc9211f21f55b3f8705d5fe64';
const SERPER_API_URL = 'https://google.serper.dev/search';
const MAX_RECENT_SEARCHES = 10;

interface SearchState {
  query: string;
  products: Product[];
  recentSearches: string[];
  isLoading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  searchProducts: (query: string) => Promise<void>;
  clearSearch: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: '',
      products: [],
      recentSearches: [],
      isLoading: false,
      error: null,

      setQuery: (query) => set({ query }),

      searchProducts: async (query) => {
        if (!query.trim()) {
          set({ products: [], isLoading: false, error: null });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(SERPER_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': SERPER_API_KEY,
            },
            body: JSON.stringify({
              q: `${query} buy online`,
              type: 'shopping',
            }),
          });

          if (!response.ok) {
            throw new Error('Search failed');
          }

          const data = await response.json();
          console.log('API Response:', data); // Debug log

          // Check if we have shopping results
          if (!data.shopping || !Array.isArray(data.shopping)) {
            set({
              products: [],
              isLoading: false,
              error: 'No products found'
            });
            return;
          }

          // Transform the API response into our Product type
          const products: Product[] = data.shopping.map((item: any) => ({
            id: String(Math.random()), // Generate a unique ID
            title: item.title || 'Unknown Product',
            description: item.snippet || '',
            price: parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) || 0,
            currency: 'USD',
            // Use imageUrl from the API response, with a fallback
            image: item.imageUrl || 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=800',
            merchant: item.merchant?.name || item.source || 'Unknown Merchant',
            url: item.link || '#',
            rating: item.rating ? parseFloat(item.rating) : undefined,
            reviews: item.reviews ? parseInt(String(item.reviews).replace(/[^0-9]/g, ''), 10) : undefined,
          }));

          set({
            products,
            isLoading: false,
            error: products.length === 0 ? 'No products found' : null
          });

          if (products.length > 0) {
            get().addRecentSearch(query.trim());
          }

        } catch (err) {
          console.error('Search error:', err);
          set({
            products: [],
            isLoading: false,
            error: 'Failed to search products'
          });
        }
      },

      clearSearch: () => set({ 
        query: '', 
        products: [],
        error: null 
      }),

      addRecentSearch: (query) => set((state) => {
        const searches = [query, ...state.recentSearches.filter(s => s !== query)]
          .slice(0, MAX_RECENT_SEARCHES);
        return { recentSearches: searches };
      }),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'search-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);