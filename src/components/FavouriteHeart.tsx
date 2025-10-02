import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'

const AnimatedIcon = Animated.createAnimatedComponent(TouchableOpacity)

const FavouriteHeart = ({
  handleToggleFavorite,
  isFavorite,
}: {
  handleToggleFavorite: () => void
  isFavorite: boolean
}) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const handlePress = () => {
    scale.value = withSpring(1.3, { damping: 10, stiffness: 400 })
    scale.value = withSpring(1, { damping: 8, stiffness: 300 })
    handleToggleFavorite()
  }

  return (
    <AnimatedIcon style={animatedStyle} onPress={handlePress} activeOpacity={0.7}>
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={24}
        color={isFavorite ? '#FF3B30' : '#fff'}
      />
    </AnimatedIcon>
  )
}

export default FavouriteHeart

const styles = StyleSheet.create({})