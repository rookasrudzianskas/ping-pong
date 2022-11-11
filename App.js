import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';

export default function App() {

    const ballAnimatedStyles = useAnimatedStyle(() => {
        return {
            top: 200,
            left: 160,
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
