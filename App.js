import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {useEffect} from "react";

const FPS = 60;
const DELTA = 1000 / FPS;
const SPEED = 6;

const normalizeVector = (vector) => {
    // this is c in pythagorean theorem
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    return ({
        x: vector.x / magnitude,
        y: vector.y / magnitude,
    })
}

export default function App() {
    const targetPositionX = useSharedValue(200);
    const targetPositionY = useSharedValue(200);
    const { height, width } = useWindowDimensions();
    const direction = useSharedValue(normalizeVector({
        x: Math.random(),
        y: Math.random(),
    }));

    useEffect(() => {
        const interval = setInterval(update, DELTA);
        return () => clearInterval(interval);
    }, []);

    const update = () => {
        const nextX = targetPositionX.value + direction.value.x * SPEED;
        const nextY = targetPositionY.value + direction.value.y * SPEED;

        if(nextY < 0 || nextY > height) {
            console.log("WE HIT THE TOP WALL");
            direction.value = { x: direction.value.x, y: -direction.value.y}
        }

        if(nextX < 0 || nextX > width) {
            console.log("WE HIT THE SIDE WALL");
            direction.value = { x: -direction.value.x, y: direction.value.y}
        }

        targetPositionX.value = withTiming(nextX, {duration: DELTA, easing: Easing.linear});
        targetPositionY.value = withTiming(nextY, {duration: DELTA, easing: Easing.linear});
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
