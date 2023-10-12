/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,  
  StyleSheet,
  useColorScheme,

} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import VideoView from './src/components/VideoView/VideoView';
import mp4 from "./src/assets/app.mp4"
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <VideoView source={mp4} paused={false} title={"飞书会议"}></VideoView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
});

export default App;
