import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import style from 'common/style';
import Video from 'react-native-video';
import imageUrl from '../../image/image';
import FastImage from 'react-native-fast-image';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import SliderBar from '../SliderBar/SliderBar';
interface props {
  source: string;
  paused: boolean;
  title: string
}
interface videoTime {
  currentTime: number;
  playableDuration: number;
  seekableDuration: number;
}
export default function VideoView(props: props) {
  const {source, paused} = props;
  const [pausedState, setPausedState] = useState<boolean>(() => {
    return paused;
  });
  const [videoTime,setVideoTime] = useState(()=>({
    currentTime: 0,
    playableDuration: 0,
    seekableDuration: 0,
  }))
  const [videoTimeMySet,setVideoTimeMySet] = useState(()=>({
    currentTime: 0,
    playableDuration: 0,
    seekableDuration: 0,
  }))
  const videoRef = useRef()
  const footerShow = useSharedValue<boolean>(false)

  //依赖项更改
  useEffect(()=>{
    footerShow.value = pausedState
  },[pausedState])
  useEffect(()=>{
    videoRef?.current?.seek(videoTimeMySet.currentTime)
  },[videoTimeMySet])

  const footerAnimatedStyle = useAnimatedStyle(()=>{
    return {
      opacity:withDelay(footerShow.value?0:1000,withSpring(footerShow.value?1:0)),
      transform:[{
        translateY:withDelay(footerShow.value?0:1000,withTiming(footerShow.value?0:50))
      }]
    }
  })
  const naVAnimatedStyle = useAnimatedStyle(()=>{
    return {
      opacity:withDelay(footerShow.value?0:1000,withSpring(footerShow.value?1:0)),
      transform:[{
        translateY:withDelay(footerShow.value?0:1000,withTiming(footerShow.value?0:-50))
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
                ? imageUrl.video.startFooter
                : imageUrl.video.pausedFooter
            }
            style={{
              width: 30,
              height: 30,
            }}></FastImage>
        </TouchableOpacity>
        {/*进度条组件 */}
        <SliderBar videoTime={videoTime} setVideoTime={setVideoTimeMySet}></SliderBar>
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
  }, [footerShow,pausedState]);
  
  //顶部组件
  const renderNav = useMemo(()=>{
    return (
      <Animated.View style={[
        naVAnimatedStyle,
        styles.bottomBox
      ]}>
        <FastImage source={imageUrl.common.back} style={{
          width:30,
          height:30,
        }}></FastImage>
        <FastImage source={imageUrl.common.option} style={{
          width:30,
          height:30,
        }}></FastImage>
      </Animated.View>
    )
  },[])
  return (
    <TouchableOpacity
      style={styles.box}
      onPress={() => {
        setPausedState(!pausedState);
      }}>
      <Video
        paused={pausedState}
        source={source}
        style={styles.videoBox}
        onProgress={(event:videoTime)=>{
          setVideoTime(event)
        }}
        ref={videoRef}
        currentPlaybackTime={
          videoTime.currentTime
        }
        ></Video>
      <View style={{
        ...styles.upOnVideoBox,
        }}>
        {
        renderNav
        }
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
    overflow:"hidden",
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
    zIndex:99,
  },
  footerBox:{
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBox:{
    padding:10,
    flexDirection:"row",
    justifyContent:"space-between",
    alignContent:"center",
    width:"100%",
  }
});
