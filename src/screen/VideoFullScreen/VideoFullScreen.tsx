import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import VideoViewFullscreen from '../../components/VideoViewFullscreen/VideoViewFullScreen';
import mp4 from '../../assets/app.mp4';
import Animated from 'react-native-reanimated';
export default function VideoFullScreen({route}: {route: any}) {
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
