import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { mockProducts } from '@/mocks/products';
import { colors } from '@/constants/colors';
import { ExternalLink, ArrowLeft } from 'lucide-react-native';
import * as Linking from 'expo-linking';

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const product = mockProducts.find(p => p.id === id);

  if (!product) return null;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: product.name,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <ArrowLeft color={colors.text} size={24} />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            {Object.entries(product.specs).map(([key, value]) => (
              <View key={key} style={styles.specRow}>
                <Text style={styles.specKey}>{key}</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available at</Text>
            {Object.entries(product.prices).map(([store, data]) => (
              <Pressable
                key={store}
                style={styles.storeButton}
                onPress={() => Linking.openURL(data.url)}
              >
                <Text style={styles.storeName}>{store}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>${data.price.toFixed(2)}</Text>
                  <ExternalLink size={16} color={colors.primary} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  specKey: {
    color: colors.textSecondary,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  specValue: {
    color: colors.text,
    fontSize: 14,
  },
  storeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  storeName: {
    color: colors.text,
    fontSize: 16,
    textTransform: 'capitalize',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});