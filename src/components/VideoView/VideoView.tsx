import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
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
import {useDeviceStore} from '../../store/modules/device';
import Orientation from 'react-native-orientation-locker';
import SliderBar from '../SliderBar/SliderBar';
import SliderBarFullScreen from '../SliderBarFullScreen/SliderBarFullScreen';
import LinearGradient from 'react-native-linear-gradient';
import Voice from '../../IconComponent/Voice/Voice';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import FullScreenHorizon from '../../IconComponent/FullScreenHorizon/FullScreenHorizon';
import FullScreenVertical from '../../IconComponent/FullScreenVertical/FullScreenVertical';
import Pause from '../../IconComponent/Pause/Pause';
import MessageSwitch from '../../IconComponent/MessageSwitch/MessageSwitch';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import StatusBarBackground from '../StatusBar/StatusBarBackground';
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
  const {setState: setDeviceState, orientation} = useDeviceStore(
    state => state,
  );
  const {top} = useSafeAreaInsets();
  //state
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
  const [videoState, setVideoState] = useState([
    style.DeviceWidth,
    style.DeviceWidth * (9 / 16),
  ]);
  const videoRef: any = useRef();
  const [isOpenMessage, setIsOpenMessage] = useState(true);
  //shareValue
  const footerShow = useSharedValue<boolean>(false);
  const videoTransY = useSharedValue<number>(0);
  const videoHeight = useSharedValue<number>(style.DeviceWidth * (9 / 16));
  const videoWidth = useSharedValue<number>(style.DeviceWidth);

  useEffect(() => {
    setCurrentTime(currentTimePass == undefined ? 0 : currentTimePass);
    setAllTimeData(() => {
      return {
        playableDuration: fullTime == undefined ? 0 : fullTime,
        seekableDuration: fullTime == undefined ? 0 : fullTime,
      };
    });
    setPausedState(paused);
  }, [paused, currentTimePass, fullTime]);

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
  const videoHorizonStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(videoWidth.value),
      height: withTiming(videoHeight.value),
    };
  });

  const toFullScreen = useCallback(() => {
    videoTransY.value =
      style.DeviceHeight / 2 - (style.DeviceWidth * (9 / 16)) / 2;
    navigation.push('全屏视频', {
      source: source,
      paused: pausedState,
      currentTime: currentTime,
      fullTime: allTimeData.seekableDuration,
      id: props.id,
    });
    setPausedState(true);
  }, [currentTime, paused, fullTime]);

  const toHorizon = useCallback(() => {
    StatusBar.setHidden(true);
    (videoWidth.value = style.DeviceHeight),
      (videoHeight.value = style.DeviceWidth),
      setVideoState([style.DeviceHeight, style.DeviceWidth]);
    setDeviceState({
      orientation: 'landscape',
    });
    Orientation.lockToLandscape();
  }, [videoHeight, videoWidth, setVideoState]);

  const toPortrait = useCallback(() => {
    StatusBar.setHidden(false);
    (videoWidth.value = style.DeviceWidth),
      (videoHeight.value = style.DeviceWidth * (9 / 16)),
      setVideoState([style.DeviceWidth, style.DeviceWidth * (9 / 16)]);
    setDeviceState({
      orientation: 'portrait',
    });
    Orientation.lockToPortrait();
  }, []);

  //底部组件
  const renderFooter = useMemo(() => {
    return (
      <Animated.View style={[footerAnimatedStyle]}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(0,0,0,0.1)']}
          style={{
            width: '100%',
          }}>
          <View style={[styles.footerBox]}>
            <Pause
              onPress={() => {
                setPausedState(!pausedState);
              }}
              paused={pausedState}></Pause>
            {/*进度条组件 */}
            <SliderBar
              currentTimeState={currentTime}
              allTime={allTimeData}
              setVideoTime={setVideoTimeMySet}></SliderBar>
            <Voice
              isOpenVoice={isOpenVoice}
              onPress={() => {
                //组件渲染即可
                setIsOpenVoice(!isOpenVoice);
              }}></Voice>
            <FullScreenHorizon
              onPress={
                orientation !== 'landscape' ? toHorizon : toPortrait
              }></FullScreenHorizon>
            <FullScreenVertical onPress={toFullScreen}></FullScreenVertical>
            {/*全屏控件*/}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }, [
    footerShow,
    pausedState,
    currentTime,
    allTimeData,
    isOpenVoice,
    orientation,
  ]);

  //全屏横屏底部组件
  const renderFooterFull = useMemo(() => {
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
          <View
            style={{
              padding: orientation == 'landscape' ? 20 : 10,
            }}>
            <SliderBarFullScreen
              style={{
                width: style.DeviceHeight - 40,
              }}
              currentTimeState={currentTime}
              allTime={allTimeData}
              setVideoTime={setVideoTimeMySet}></SliderBarFullScreen>
            <View style={styles.footerBox}>
              {/*暂停与开始 */}
              <Pause
                onPress={() => {
                  setPausedState(!pausedState);
                }}
                paused={pausedState}></Pause>
              <MessageSwitch
                onPress={() => {
                  setIsOpenMessage(!isOpenMessage);
                }}
                isOpen={isOpenMessage}></MessageSwitch>
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
              <FullScreenHorizon
                onPress={
                  orientation !== 'landscape' ? toHorizon : toPortrait
                }></FullScreenHorizon>
            </View>
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
    orientation,
  ]);
  //顶部组件
  const renderNav = useMemo(() => {
    return (
      <Animated.View
        style={[
          naVAnimatedStyle,
          {
            width: '100%',
          },
        ]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(255,255,255,0)']}
          style={{
            width: '100%',
          }}>
          <View
            style={[
              styles.bottomBox,
              {
                padding: orientation == 'landscape' ? 20 : 10,
              },
            ]}>
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
  }, [orientation]);

  //整体渲染
  return (
    <View>
    <StatusBarBackground backgroundColor='black' barStyle='light-content'></StatusBarBackground>
    <TouchableWithoutFeedback
      onPress={() => {
        footerShow.value = !footerShow.value;
      }}>
      <Animated.View
        style={[
          styles.box,
        ]}>

        <Animated.View
          style={[
            styles.videoAnimatedBox,
            videoHorizonStyle,
            {
              width: videoState[0],
              height: videoState[1],
            },
          ]}
          sharedTransitionTag="video">
          <Animated.View
            style={[styles.videoTranslateYView, videoAnimatedStyle]}>
            <Video
              paused={pausedState}
              source={source}
              style={{
                ...styles.videoBox,
                width: videoState[0],
                height: videoState[1],
              }}
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
            {orientation == 'landscape' ? renderFooterFull : renderFooter}
          </KeyboardAvoidingView>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    position: 'relative',
    overflow: 'hidden',
  },
  videoAnimatedBox: {
    backgroundColor: 'black',
    // height: style.DeviceWidth * (9 / 16),
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
    paddingTop: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
  },
  bottomBox: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
  },
});
