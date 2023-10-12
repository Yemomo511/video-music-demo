import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import VideoView from '../../components/VideoView/VideoView';
import mp4 from '../../assets/app.mp4';
import Animated from 'react-native-reanimated';
export default function VideoDetail({route}: {route: any}) {
  if (!route.params) {
    return (
      <SafeAreaView>
        <VideoView
          source={mp4}
          paused={true}
          title="那维莱特"
          id="asd"></VideoView>
      </SafeAreaView>
    );
  }
  const {currentTime, fullTime, paused, id} = route.params;
  return (
    <SafeAreaView>
        <Animated.View>
          <VideoView
            source={mp4}
            paused={paused}
            title="那维莱特"
            id={id}
            currentTime={currentTime}
            fullTime={fullTime}></VideoView>
        </Animated.View>
    </SafeAreaView>
  );
}
