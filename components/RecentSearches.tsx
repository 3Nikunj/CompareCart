import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Clock, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface Props {
  searches: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export function RecentSearches({ searches, onSelect, onClear }: Props) {
  if (searches.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Clock size={20} color={colors.textSecondary} />
          <Text style={styles.title}>Recent Searches</Text>
        </View>
        <Pressable onPress={onClear}>
          <X size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {searches.map((search) => (
          <Pressable
            key={search}
            style={styles.chip}
            onPress={() => onSelect(search)}
          >
            <Text style={styles.chipText}>{search}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  scrollContent: {
    gap: 8,
  },
  chip: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: {
    color: colors.text,
    fontSize: 14,
  },
});