import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import * as Linking from 'expo-linking';
import { Product } from '@/types/product';
import { useRouter } from 'expo-router';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [imageError, setImageError] = React.useState(false);
  const router = useRouter();
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency,
  }).format(product.price);

  const fallbackImage = 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=800&q=80';

  const handlePress = async () => {
    try {
      // Check if URL is valid
      const supported = await Linking.canOpenURL(product.url);
      
      if (supported) {
        await Linking.openURL(product.url);
      } else {
        console.log('Cannot open URL:', product.url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <Pressable 
      style={styles.container}
      onPress={handlePress}
    >
      <Image 
        source={{ uri: imageError ? fallbackImage : product.image }} 
        style={styles.image}
        onError={() => setImageError(true)}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{formattedPrice}</Text>
            <Text style={styles.merchant}>{product.merchant}</Text>
          </View>

          {product.rating && (
            <View style={styles.rating}>
              <Star size={16} color={colors.primary} fill={colors.primary} />
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1)}
                {product.reviews && (
                  <Text style={styles.reviews}>
                    {' '}({product.reviews.toLocaleString()})
                  </Text>
                )}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  merchant: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
  },
  reviews: {
    color: colors.textSecondary,
  },
});