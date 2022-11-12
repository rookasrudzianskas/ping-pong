import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {useEffect} from "react";

const FPS = 60;
const DELTA = 1000 / FPS;
const SPEED = 3;
const BALL_WIDTH = 20;

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
        let nextPos = getNextPos(direction.value);

        if(nextPos.y < 0 || nextPos.y > height - BALL_WIDTH) {
            const newDirection = { x: direction.value.x, y: -direction.value.y}
            direction.value = newDirection;
            nextPos = getNextPos(newDirection);
        }

        if(nextPos.x < 0 || nextPos.x > width - BALL_WIDTH) {
            const newDirection = { x: -direction.value.x, y: direction.value.y};
            direction.value = newDirection;
            nextPos = getNextPos(newDirection);
        }

        targetPositionX.value = withTiming(nextPos.x, {duration: DELTA, easing: Easing.linear});
        targetPositionY.value = withTiming(nextPos.y, {duration: DELTA, easing: Easing.linear});
    }

    const getNextPos = (direction) => {
        return {
            x: targetPositionX.value + direction.x * SPEED,
            y: targetPositionY.value + direction.y * SPEED,
        }
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
