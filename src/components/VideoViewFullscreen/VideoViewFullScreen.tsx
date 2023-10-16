import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import style from '../../common/style';
import imageUrl from '../../image/image';
import FastImage from 'react-native-fast-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Video from 'react-native-video';
import SliderBar from '../SliderBarFullScreen/SliderBarFullScreen';
import LinearGradient from 'react-native-linear-gradient';
import Voice from '../../IconComponent/Voice/Voice';
import {TextInput} from 'react-native-gesture-handler';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {shareVideoTrans} from '../../shareTransition/shareTransition';
import FullScreenVertical from '../../IconComponent/FullScreenVertical/FullScreenVertical';
import Pause from '../../IconComponent/Pause/Pause';
import MessageSwitch from '../../IconComponent/MessageSwitch/MessageSwitch';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

export default function VideoViewFullscreen(props: props) {
  const {source, paused, currentTime: currentTimePass, fullTime, id} = props;
  const navigation: any = useNavigation();
  const inset = useSafeAreaInsets()
  const [pausedState, setPausedState] = useState<boolean>(() => {
    return paused;
  });
  const [allTimeData, setAllTimeData] = useState({
    playableDuration: fullTime ? fullTime : 1,
    seekableDuration: fullTime ? fullTime : 1,
  });
  const [currentTime, setCurrentTime] = useState<number>(
    currentTimePass == undefined ? 0 : currentTimePass,
  );
  const [videoTimeMySet, setVideoTimeMySet] = useState(
    currentTimePass == undefined ? 0 : currentTimePass,
  );
  const [isOpenVoice, setIsOpenVoice] = useState(true);
  const [isOpenMessage, setIsOpenMessage] = useState(true);
  const videoRef = useRef<any>();
  const footerShow = useSharedValue<boolean>(false);
  const offsetY = useSharedValue<number>(
    (-style.DeviceWidth * (9 / 16)) / 2 + style.DeviceHeight / 2,
  );
 
  useEffect(() => {
    setCurrentTime(currentTimePass == undefined ? 0 : currentTimePass);
    setPausedState(paused);
    setAllTimeData(() => {
      return {
        playableDuration: fullTime == undefined ? 0 : fullTime,
        seekableDuration: fullTime == undefined ? 0 : fullTime,
      };
    });
  }, [paused, currentTimePass, fullTime]);
  useEffect(() => {
    if (videoRef?.current?.seek != undefined) {
      videoRef?.current?.seek(videoTimeMySet);
    }
    setCurrentTime(() => videoTimeMySet);
  }, [videoTimeMySet]);

  // useFocusEffect(()=>{
  //   offsetY.value = (-style.DeviceWidth * (9 / 16)) / 2 + style.DeviceHeight / 2
  // })
  //定义style
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
      transform: [
        {
          translateY: withTiming(offsetY.value),
        },
      ],
    };
  });
  const toDetailScreen = useCallback(() => {
    offsetY.value = 0;
    navigation.push('视频详细', {
      source: source,
      paused: pausedState,
      currentTime: currentTime,
      fullTime: allTimeData.seekableDuration,
      id: props.id,
    });
    setPausedState(true);
  }, [currentTime, paused, fullTime]);
  //底部组件
  const renderFooter = useMemo(() => {
    return (
      <Animated.View
        style={[
          footerAnimatedStyle,
          {
            justifyContent: 'flex-end',
          },
        ]}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.1)']}
          style={{
            width: '100%',
          }}>
          <SliderBar
            currentTimeState={currentTime}
            allTime={allTimeData}
            setVideoTime={setVideoTimeMySet}></SliderBar>
          <View style={styles.footerBox}>
            {/*暂停与开始 */}
            <Pause onPress={()=>{
              setPausedState(!pausedState)
            }} paused={pausedState}></Pause>
            <MessageSwitch onPress={()=>{
              setIsOpenMessage(!isOpenMessage)
            }} isOpen={isOpenMessage}></MessageSwitch>
            {/*弹幕输入框 */}
            <TextInput
              style={{
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: 1000,
                flexDirection: 'row',
                flex: 1,
                height: 40,
                paddingLeft: 10,
              }}
              selectionColor={'pink'}
              placeholder="发个弹幕记录一下当下"
              placeholderTextColor={'rgba(0,0,0,0.7)'}></TextInput>
            <Voice
              isOpenVoice={isOpenVoice}
              onPress={() => {
                //组件渲染即可
                setIsOpenVoice(!isOpenVoice);
              }}></Voice>
            <FullScreenVertical onPress={toDetailScreen}></FullScreenVertical>
          </View>
          {/*全屏控件*/}
        </LinearGradient>
      </Animated.View>
    );
  }, [
    footerShow,
    pausedState,
    currentTime,
    allTimeData,
    isOpenVoice,
    isOpenMessage,
  ]);

  //顶部组件
  const renderNav = useMemo(() => {
    return (
      <Animated.View
        style={[
          naVAnimatedStyle,
          {
            flex: 1,
            width: '100%',
          },
        ]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
          style={{
            width: '100%',
            borderRadius: 2,
          }}>
          <View style={[styles.bottomBox]}>
            <TouchableOpacity onPress={toDetailScreen}>
              <FastImage
                source={imageUrl.common.back}
                style={{
                  width: 40,
                  height: 40,
                }}></FastImage>
            </TouchableOpacity>

            <FastImage
              source={imageUrl.common.option}
              style={{
                width: 40,
                height: 40,
              }}></FastImage>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }, [footerShow, pausedState, currentTime, allTimeData]);

  //整体渲染
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        footerShow.value = !footerShow.value;
      }} style={{
        marginTop:inset.top
      }}>
      <Animated.View style={[styles.box,{
      }]}>
        <Animated.View
          style={[styles.videoAnimatedView]}
          sharedTransitionTag="video">
          <Animated.View
            style={[styles.videoTranslateYView, videoAnimatedStyle]}
            sharedTransitionTag="videoTrans">
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 0,
            }}>
            {renderFooter}
          </KeyboardAvoidingView>
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
  videoAnimatedView: {
    backgroundColor: 'black',
    height: style.DeviceHeight,
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
    padding: 20,
    paddingTop: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBox: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
  },
});
