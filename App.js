import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {useEffect} from "react";

const FPS = 60;
const DELTA = 1000 / FPS;
const SPEED = 0.5;

export default function App() {
    const targetPositionX = useSharedValue(0);
    const targetPositionY = useSharedValue(0);
    const directionX = useSharedValue(0);
    const directionY = useSharedValue(1);

    useEffect(() => {
        const interval = setInterval(update, DELTA);
        return () => clearInterval(interval);
    }, []);

    const update = () => {
        targetPositionX.value = withTiming(targetPositionX.value * SPEED, {duration: DELTA, easing: Easing.linear});
        targetPositionY.value = withTiming(targetPositionY.value + 10 * SPEED, {duration: DELTA, easing: Easing.linear});
    }

    const ballAnimatedStyles = useAnimatedStyle(() => {
        return {
            top: targetPositionY.value,
            left: targetPositionX.value
        }
    });

  return (
      <View className="items-center justify-center h-screen">
        <Animated.View style={[styles.ball, ballAnimatedStyles]} className="w-5 h-5 bg-black rounded-full"/>
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },
    ball: {
      position: 'absolute',
    }
});
