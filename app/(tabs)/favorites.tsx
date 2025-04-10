import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Heart } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Heart size={48} color={colors.textSecondary} />
      <Text style={styles.text}>No favorites yet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});