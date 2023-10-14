import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import style from '../../common/style';
import Video from 'react-native-video';
import imageUrl from '../../image/image';
import FastImage from 'react-native-fast-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import SliderBar from '../SliderBar/SliderBar';
import LinearGradient from 'react-native-linear-gradient';
import Voice from '../Voice/Voice';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {shareVideoTrans} from '../../shareTransition/shareTransition';
interface props {
  source: string;
  paused: boolean;
  title: string;
  currentTime?: number;
  fullTime?: number;
  id: string;
}
interface videoTime {
  currentTime: number;
  playableDuration: number;
  seekableDuration: number;
}
export default function VideoView(props: props) {
  const {source, paused, currentTime: currentTimePass, fullTime} = props;
  const navigation: any = useNavigation();
  const [pausedState, setPausedState] = useState<boolean>(() => {
    return paused;
  });
  const [allTimeData, setAllTimeData] = useState({
    playableDuration: fullTime ? fullTime : 1,
    seekableDuration: 1,
  });
  const [currentTime, setCurrentTime] = useState<number>(
    currentTimePass == undefined ? 0 : currentTimePass,
  );
  const [videoTimeMySet, setVideoTimeMySet] = useState(
    currentTimePass == undefined ? 0 : currentTimePass,
  );
  const [isOpenVoice, setIsOpenVoice] = useState(true);
  const videoRef: any = useRef();
  const footerShow = useSharedValue<boolean>(false);
  const videoTransY = useSharedValue<number>(0);
  useEffect(() => {
    setCurrentTime(currentTimePass == undefined ? 0 : currentTimePass);
    setAllTimeData(()=>{
      return {
        playableDuration: fullTime == undefined ? 0 : fullTime,
        seekableDuration: fullTime == undefined ? 0 : fullTime,
      }
    })
    setPausedState(paused);
  }, [paused,currentTimePass,fullTime]);
  useEffect(() => {
    if (videoRef?.current?.seek != undefined) {
      videoRef?.current?.seek(videoTimeMySet);
    }
    setCurrentTime(videoTimeMySet);
  }, [videoTimeMySet]);
  
  const footerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(0, withSpring(footerShow.value ? 1 : 0)),
      transform: [
        {
          translateY: withDelay(0, withTiming(footerShow.value ? 0 : 50)),
        },
      ],
    };
  });
  const naVAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(0, withSpring(footerShow.value ? 1 : 0)),
      transform: [
        {
          translateY: withDelay(0, withTiming(footerShow.value ? 0 : -50)),
        },
      ],
    };
  });
  const videoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: withTiming(videoTransY.value)}],
    };
  });
  //底部组件
  const toFullScreen = useCallback(() => {
    videoTransY.value =style.DeviceHeight / 2 - (style.DeviceWidth * (9 / 16)) / 2;
    
    navigation.push('全屏视频', {
      source: source,
      paused: pausedState,
      currentTime: currentTime,
      fullTime: allTimeData.seekableDuration,
      id: props.id,
    });
    setPausedState(true);
  },[currentTime,paused,fullTime]);
  const renderFooter = useMemo(() => {
    return (
      <Animated.View style={[footerAnimatedStyle]}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(0,0,0,0.1)']}
          style={{
            width: '100%',
          }}>
          <View style={[styles.footerBox]}>
            <TouchableWithoutFeedback
              onPress={() => {
                setPausedState(!pausedState);
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
            </TouchableWithoutFeedback>
            {/*进度条组件 */}

            <SliderBar
              currentTimeState={currentTime}
              allTime={allTimeData}
              setVideoTime={setVideoTimeMySet}></SliderBar>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                //组件渲染即可
                setIsOpenVoice(!isOpenVoice);
              }}>
              <Voice isOpenVoice={isOpenVoice}></Voice>
            </TouchableOpacity>
            <TouchableOpacity onPress={toFullScreen}>
              <FastImage
                source={imageUrl.video.fullScreen}
                style={{
                  width: 30,
                  height: 30,
                }}></FastImage>
            </TouchableOpacity>
            {/*全屏控件*/}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }, [footerShow, pausedState, currentTime, allTimeData, isOpenVoice]);

  //顶部组件
  const renderNav = useMemo(() => {
    return (
      <Animated.View style={[naVAnimatedStyle,{
        width:"100%",
      }]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(255,255,255,0)']}
          style={{
            width: '100%',
          }}>
          <View style={[styles.bottomBox]}>
            <FastImage
              source={imageUrl.common.back}
              style={{
                width: 30,
                height: 30,
              }}></FastImage>
            <FastImage
              source={imageUrl.common.option}
              style={{
                width: 30,
                height: 30,
              }}></FastImage>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }, []);

  //整体渲染
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        footerShow.value = !footerShow.value;
      }}>
      <Animated.View style={styles.box}>
        <Animated.View
          style={[styles.videoAnimatedBox]}
          sharedTransitionTag="video">
          <Animated.View
            style={[styles.videoTranslateYView, videoAnimatedStyle]}>
            <Video
              paused={pausedState}
              source={source}
              style={styles.videoBox}
              onLoad={(event: any) => {
                setAllTimeData(() => {
                  return {
                    playableDuration: event.duration,
                    seekableDuration: event.duration,
                  };
                });
              }}
              onProgress={(event: videoTime) => {
                setCurrentTime(() => {
                  return event.currentTime;
                });
              }}
              muted={!isOpenVoice}
              ref={videoRef}
              currentPlaybackTime={currentTime}></Video>
          </Animated.View>
        </Animated.View>
        <View
          style={{
            ...styles.upOnVideoBox,
          }}>
          {renderNav}
          {renderFooter}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  box: {
    position: 'relative',
    overflow: 'hidden',
  },
  videoAnimatedBox: {
    backgroundColor: 'black',
    height: style.DeviceWidth * (9 / 16),
  },
  videoTranslateYView: {},
  videoBox: {
    width: '100%',
    height: style.DeviceWidth * (9 / 16),
  },
  upOnVideoBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
  },
  footerBox: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBox: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
  },
});
