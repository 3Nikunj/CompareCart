import React from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { colors } from '@/constants/colors';

export function SearchSkeleton() {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((key) => (
        <Animated.View
          key={key}
          style={[styles.card, { opacity }]}
        >
          <View style={styles.image} />
          <View style={styles.content}>
            <View style={styles.title} />
            <View style={styles.description} />
            <View style={styles.footer}>
              <View style={styles.price} />
              <View style={styles.button} />
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    height: 20,
    width: '80%',
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  description: {
    height: 16,
    width: '60%',
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    height: 16,
    width: 80,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  button: {
    height: 32,
    width: 100,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
});