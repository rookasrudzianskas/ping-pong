import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
   // he are you in? are you working fine?
  return (
      <View className="items-center justify-center h-screen">
        <View style={styles.ball} className="w-5 h-5 bg-black rounded-full"/>
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
