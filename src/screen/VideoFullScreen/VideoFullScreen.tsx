import React, { useEffect } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import VideoViewFullscreen from '../../components/VideoViewFullscreen/VideoViewFullScreen';
import mp4 from '../../assets/app.mp4';
import Animated from 'react-native-reanimated';
import Orientation from 'react-native-orientation';
import { useFocusEffect } from '@react-navigation/native';
export default function VideoFullScreenComponent({route}: {route: any}) {
  const {currentTime, fullTime, paused, id} = route.params;
  return (
    <SafeAreaView>
        <Animated.View>
          <VideoViewFullscreen
            source={mp4}
            paused={paused}
            title="原神"
            id={id}
            currentTime={currentTime}
            fullTime={fullTime}></VideoViewFullscreen>
        </Animated.View>
    </SafeAreaView>
  );
}