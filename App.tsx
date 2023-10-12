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
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VideoDetail from './src/screen/VideoDetail/VideoDetail';
import VideoFullScreen from './src/screen/VideoFullScreen/VideoFullScreen';
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const {Navigator,Screen} = createNativeStackNavigator()
  return (
    <NavigationContainer>
        <Navigator initialRouteName='视频详细'>
          <Screen name="视频详细" component={VideoDetail} options={{
            headerShown:false,
          }}></Screen>
          <Screen name="全屏视频" component={VideoFullScreen} options={{
            headerShown:false,
          }}></Screen>
        </Navigator>
    </NavigationContainer>
      // <SafeAreaView style={backgroundStyle}>
      //   <VideoViewFullscreen source={mp4} paused={true} title={"飞书会议"}></VideoViewFullscreen>
      // </SafeAreaView>

  );
}

const styles = StyleSheet.create({
});

export default gestureHandlerRootHOC(App);
