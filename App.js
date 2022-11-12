import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {GestureHandlerRootView, PanGestureHandler} from "react-native-gesture-handler";
import Game from "./src/components/Game";

export default function App() {


  return (
      <GestureHandlerRootView>
          <Game />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
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
