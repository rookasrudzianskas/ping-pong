import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import Animated, {
    Easing,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import {useEffect, useState} from "react";
import {GestureHandlerRootView, PanGestureHandler} from "react-native-gesture-handler";

const FPS = 60;
const DELTA = 1000 / FPS;
const SPEED = 10;
const BALL_WIDTH = 20;

const islandDimensions = { x: 150, y: 11, w: 127, h: 37};

const normalizeVector = (vector) => {
    // this is c in pythagorean theorem
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    return ({
        x: vector.x / magnitude,
        y: vector.y / magnitude,
    })
}

const Game = () => {
    const { height, width } = useWindowDimensions();

    const playerPos = useSharedValue({
        x: width / 4,
        y: height - 100,
    });

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(true);

    const PlayerDimensions = { x: width / 4, y: height - 100, w: width / 2, h: 37};
    const targetPositionX = useSharedValue(width / 2);
    const targetPositionY = useSharedValue(height / 2);
    const direction = useSharedValue(normalizeVector({
        x: Math.random(),
        y: Math.random(),
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            if(!gameOver) {
                update();
            }
        }, DELTA);
        return () => clearInterval(interval);
    }, [gameOver]);

    const update = () => {
        let nextPos = getNextPos(direction.value);
        let newDirection = direction.value;

        // Wall collision
        if(nextPos.y > height - BALL_WIDTH) {
            setGameOver(true);
        }

        if(nextPos.y < 0) {
            newDirection = { x: direction.value.x, y: -direction.value.y}
        }

        if(nextPos.x < 0 || nextPos.x > width - BALL_WIDTH) {
            newDirection = { x: -direction.value.x, y: direction.value.y};
        }

        // Island hit detection
        if (
            nextPos.x < islandDimensions.x + islandDimensions.w &&
            nextPos.x + BALL_WIDTH > islandDimensions.x &&
            nextPos.y < islandDimensions.y + islandDimensions.h &&
            BALL_WIDTH + nextPos.y > islandDimensions.y
        ) {
            if(targetPositionX.value < islandDimensions.x || targetPositionX.value > islandDimensions.x + islandDimensions.w) {
                // Collision with left or right side of island
                newDirection = { x: -direction.value.x, y: direction.value.y};
            } else {
                // Collision with top or bottom side of island
                newDirection = { x: direction.value.x, y: -direction.value.y};
            }
            setScore((score) => score + 1);
        }

        // Player hit detection
        if (
            nextPos.x < playerPos.value.x + PlayerDimensions.w &&
            nextPos.x + BALL_WIDTH > playerPos.value.x &&
            nextPos.y < playerPos.value.y + PlayerDimensions.h &&
            BALL_WIDTH + nextPos.y > playerPos.value.y
        ) {
            if(targetPositionX.value < playerPos.value.x || targetPositionX.value > playerPos.value.x + PlayerDimensions.w) {
                // Collision with left or right side of island
                newDirection = { x: -direction.value.x, y: direction.value.y};
            } else {
                // Collision with top or bottom side of island
                newDirection = { x: direction.value.x, y: -direction.value.y};
            }
        }

        direction.value = newDirection;
        nextPos = getNextPos(newDirection);

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

    const playerAnimatedStyles = useAnimatedStyle(() => ({
        left: playerPos.value.x,
    }));

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event, ctx) => {

        },
        onActive: (event, ctx) => {
            playerPos.value = {...playerPos.value, x: event.absoluteX - PlayerDimensions.w / 2};
        },
        onEnd: (event, ctx) => {

        }
    });

    const restartGame = () => {
        targetPositionX.value = width / 2;
        targetPositionY.value = height / 2;
        setScore(0);
        setGameOver(false);
    }

    return (
        <View className="items-center justify-center h-screen">
            {gameOver ? (
                <View className="justify-center items-center">
                    <Text className="text-[100px] text-center font-extralight text-red-200 -mt-36">Game over</Text>
                    <Text className="text-[50px] text-red-400">{score}</Text>
                </View>
            ) : (
                <Text className="text-[300px] font-extralight text-gray-200 -mt-36">{score}</Text>
            )}

            {!gameOver && (<Animated.View style={[styles.ball, ballAnimatedStyles]} className="w-5 h-5 bg-black rounded-full" />)}

            <View
                style={{
                    position: 'absolute',
                    top: islandDimensions.y,
                    left: islandDimensions.x,
                    width: islandDimensions.w,
                    height: islandDimensions.h,
                    backgroundColor: 'black',
                    borderRadius: 20,
                }}
                className="flex items-center justify-center"
            >
                <Text className="text-white font-bold text-lg tracking-widest">ISLAND</Text>
            </View>

            {/* Player */}
            {gameOver ? (
                <TouchableOpacity className="bg-gray-300 px-10 py-4 rounded-xl my-12" activeOpacity={0.7} onPress={restartGame}>
                    <Text className="font-bold text-white">Restart</Text>
                </TouchableOpacity>
            ) : (
                <Animated.View
                    style={[{
                        position: 'absolute',
                        top: playerPos.value.y,
                        width: PlayerDimensions.w,
                        height: PlayerDimensions.h,
                        backgroundColor: 'black',
                        borderRadius: 20,
                    },
                        playerAnimatedStyles
                    ]}
                />
            )}
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: 200,
                        // backgroundColor: 'black',
                    }}
                >
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

export default Game;

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
