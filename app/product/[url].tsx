import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react-native';
import * as Linking from 'expo-linking';

interface ProductDetails {
  name: string;
  description: string;
  image: string;
  price: number;
  specs: Record<string, string>;
  available: boolean;
}

export default function ProductScreen() {
  const { url } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In production, this would be your product details scraping endpoint
        const response = await fetch(`YOUR_API_ENDPOINT/product-details?url=${encodeURIComponent(url as string)}`);
        
        if (!response.ok) {
          throw new Error('Failed to load product details');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [url]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: product?.name || 'Product Details',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerLeft: () => (
            <Pressable onPress={router.back}>
              <ArrowLeft color={colors.text} size={24} />
            </Pressable>
          ),
        }}
      />
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <AlertCircle size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={router.back}>
            <Text style={styles.retryText}>Go Back</Text>
          </Pressable>
        </View>
      ) : product ? (
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

            <Pressable
              style={styles.visitButton}
              onPress={() => Linking.openURL(url as string)}
            >
              <Text style={styles.visitText}>
                Visit Store - ${product.price.toFixed(2)}
              </Text>
              <ExternalLink size={16} color={colors.text} />
            </Pressable>
          </View>
        </ScrollView>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: colors.error,
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
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
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
  },
  visitText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});