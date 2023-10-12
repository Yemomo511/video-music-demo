import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import style from 'common/style';
import Video from 'react-native-video';
import {Image} from 'react-native';
import imageUrl from '../../image/image';
import FastImage from 'react-native-fast-image';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { create } from 'react-test-renderer';
interface props {
  source: string;
  paused: boolean;
}
export default function VideoView(props: props) {
  const {source, paused} = props;
  const [pausedState, setPausedState] = useState<boolean>(() => {
    return paused;
  });
  const footerShow = useSharedValue<boolean>(false)
  useEffect(()=>{
    footerShow.value = pausedState
  },[pausedState])

  const footerAnimatedStyle = useAnimatedStyle(()=>{
    return {
      opacity:withDelay(footerShow.value?0:1000,withTiming(footerShow.value?1:0)),
      transform:[{
        translateY:withDelay(footerShow.value?0:1000,withTiming(footerShow.value?0:50))
      }]
    }
  })
  //底部组件
  const renderFotter = useMemo(() => {
    return (
      <Animated.View
        style={[
          styles.footerBox,
          footerAnimatedStyle,
          ]}>
        <TouchableOpacity onPress={()=>{
          setPausedState(!pausedState)
        }}>
          <FastImage
            source={
              pausedState
                ? imageUrl.video.pausedFooter
                : imageUrl.video.startFooter
            }
            style={{
              width: 30,
              height: 30,
            }}></FastImage>
        </TouchableOpacity>
        <TouchableOpacity>
          <FastImage
            source={imageUrl.video.fullScreen}
            style={{
              width: 30,
              height: 30,
            }}></FastImage>
        </TouchableOpacity>
        {/*全屏控件*/}
      </Animated.View>
    );
  }, [footerShow]);
  return (
    <TouchableOpacity
      style={styles.box}
      onPress={() => {
        setPausedState(!pausedState);
      }}>
      <Video
        paused={pausedState}
        source={source}
        style={styles.videoBox}></Video>
      <View style={{
        ...styles.upOnVideoBox,
        }}>
          <Image
            source={imageUrl.video.pause}
            style={{
              width: 50,
              height: 50,
              opacity:pausedState?1:0
            }}
          />
        {
          renderFotter
        }
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  box: {
    position: 'relative',
  },
  videoBox: {
    width: style.DeviceWidth,
    height: style.DeviceWidth * (9 / 16),
    backgroundColor: 'black',
  },
  upOnVideoBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerBox:{
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});
