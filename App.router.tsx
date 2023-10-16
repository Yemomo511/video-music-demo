/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  Platform,
  StyleSheet,
  UIManager,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import VideoDetail from './src/screen/VideoDetail/VideoDetail';
import VideoFullScreen from './src/screen/VideoFullScreen/VideoFullScreen';
import Orientation from 'react-native-orientation-locker';
import {useDeviceStore} from './src/store/modules/device';
import {SafeAreaProvider} from 'react-native-safe-area-context';
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const orientation = useDeviceStore(state => state.orientation);
  //增加自动切换视图的动画配置
  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
    Orientation.lockToPortrait();
  }, []);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const {Navigator, Screen} = createNativeStackNavigator();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Navigator initialRouteName="视频详细">
          <Screen
            name="视频详细"
            component={VideoDetail}
            options={{
              headerShown: false,
            }}></Screen>
          <Screen
            name="全屏视频"
            component={VideoFullScreen}
            options={{
              headerShown: false,
            }}></Screen>
        </Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});

export default gestureHandlerRootHOC(App);
