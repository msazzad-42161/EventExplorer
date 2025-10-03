import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  GestureResponderEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  FadeInRight,
  FadeOutRight,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

type FABProps = {
  expanded?: boolean; // controls whether text is shown
  label?: string;     // text label (default: "Buy Tickets")
  icon?: keyof typeof Ionicons.glyphMap; // Ionicons name
  onPress?: (event: GestureResponderEvent) => void;
};

const FAB: React.FC<FABProps> = ({
  expanded = false,
  label = "Buy Tickets",
  icon = "ticket",
  onPress,
}) => {
  const width = useSharedValue(expanded ? 160 : 56);

  React.useEffect(() => {
    width.value = withTiming(expanded ? 160 : 56, { duration: 250 });
  }, [expanded]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <Animated.View style={[styles.fab, animatedStyle]}>
      <TouchableOpacity
        style={styles.fabContent}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Ionicons name={icon} size={24} color="#fff" />
        {expanded && <Animated.Text entering={FadeInRight} exiting={FadeOutRight} style={styles.fabText}>{label}</Animated.Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 32,
    right: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    overflow: "hidden",
  },
  fabContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  fabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default FAB;
