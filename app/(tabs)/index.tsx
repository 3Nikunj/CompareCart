import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useSearchStore } from '@/stores/search-store';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { SearchSkeleton } from '@/components/SearchSkeleton';
import { RecentSearches } from '@/components/RecentSearches';
import { colors } from '@/constants/colors';
import { Product } from '@/types/product';

export default function SearchScreen() {
  const { 
    query,
    products,
    recentSearches,
    isLoading,
    setQuery,
    searchProducts,
    clearSearch,
    clearRecentSearches
  } = useSearchStore();

  const handleSearch = () => {
    if (query.trim()) {
      searchProducts(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
    searchProducts(search);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearch}
        onClear={handleClear}
      />

      {!query && !products.length ? (
        <RecentSearches
          searches={recentSearches}
          onSelect={handleRecentSearch}
          onClear={clearRecentSearches}
        />
      ) : isLoading ? (
        <SearchSkeleton />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
});