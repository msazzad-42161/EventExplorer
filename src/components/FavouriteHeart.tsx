import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const FavouriteHeart = ({
  handleToggleFavorite,
  isFavorite,
}: {
  handleToggleFavorite: () => void;
  isFavorite: boolean;
}) => {
  const scale = useSharedValue(1);
  const animatedColor = useSharedValue(isFavorite ? 1 : 0);

  // Animate color change when isFavorite changes
  useDerivedValue(() => {
    animatedColor.value = withTiming(isFavorite ? 1 : 0, {
      duration: 1000,
    });
  }, [isFavorite]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      color: interpolateColor(animatedColor.value, [0, 1], ['gray', 'red']),
    };
  });

  const handlePress = () => {
    // Animate tap feedback
    scale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withSpring(1, { damping: 8, stiffness: 150 })
    );

    handleToggleFavorite();
  };

  return (
    <AnimatedIcon
      onPress={handlePress}
      name={'heart'}
      style={[{ fontSize: 24 }, animatedStyle]}
    />
  );
};

export default FavouriteHeart;

const styles = StyleSheet.create({});
