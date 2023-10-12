import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import SliderBar from '../SliderBarFullScreen/SliderBarFullScreen';
import LinearGradient from 'react-native-linear-gradient';
import Voice from '../Voice/Voice';
import {TextInput} from 'react-native-gesture-handler';
interface props {
  source: string;
  paused: boolean;
  title: string;
  currentTime?: number;
  fullTime?:number;
  id: string;
}
interface videoTime {
  currentTime: number;
  playableDuration: number;
  seekableDuration: number;
}
export default function VideoViewFullscreen(props: props) {
  const {source, paused, currentTime: currentTimePass,fullTime} = props;
  const [pausedState, setPausedState] = useState<boolean>(() => {
    return paused;
  });
  const [allTimeData, setAllTimeData] = useState({
    playableDuration: fullTime?fullTime:1,
    seekableDuration: 1,
  });
  const [currentTime, setCurrentTime] = useState<number>(
    currentTimePass == undefined ? 0 : currentTimePass,
  );
  const [videoTimeMySet, setVideoTimeMySet] = useState(currentTimePass == undefined ? 0 : currentTimePass);
  const [isOpenVoice, setIsOpenVoice] = useState(true);
  const [isOpenMessage, setIsOpenMessage] = useState(true);
  const videoRef = useRef<any>();
  const footerShow = useSharedValue<boolean>(false);

  useEffect(() => {
    if (videoRef?.current?.seek != undefined) {
      videoRef?.current?.seek(videoTimeMySet);
    }
  }, [videoTimeMySet]);

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
  //底部组件
  const renderFooter = useMemo(() => {
    return (
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(0,0,0,0.5)']}
        style={{
          width: '100%',
        }}>
        <Animated.View
          style={[
            footerAnimatedStyle,
            {
              justifyContent: 'flex-end',
            },
          ]}>
          <SliderBar
            currentTimeState={currentTime}
            allTime={allTimeData}
            setVideoTime={setVideoTimeMySet}></SliderBar>
          <View style={styles.footerBox}>
            {/*暂停与开始 */}
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
                  width: 40,
                  height: 40,
                }}></FastImage>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                setIsOpenMessage(!isOpenMessage);
              }}>
              <FastImage
                source={
                  isOpenMessage
                    ? imageUrl.video.messageOpen
                    : imageUrl.video.messageClose
                }
                style={{
                  width: 40,
                  height: 40,
                }}></FastImage>
            </TouchableWithoutFeedback>
            {/*弹幕输入框 */}
            <TextInput
              style={{
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: 1000,
                width: '50%',
                height: 40,
                paddingLeft: 10,
              }}
              selectionColor={'pink'}
              placeholder="发个弹幕记录一下当下"
              placeholderTextColor={'rgba(0,0,0,0.7)'}></TextInput>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                //组件渲染即可
                setIsOpenVoice(!isOpenVoice);
              }}>
              <Voice isOpenVoice={isOpenVoice}></Voice>
            </TouchableOpacity>
            <TouchableOpacity>
              <FastImage
                source={imageUrl.video.fullScreen}
                style={{
                  width: 40,
                  height: 40,
                }}></FastImage>
            </TouchableOpacity>
          </View>
          {/*全屏控件*/}
        </Animated.View>
      </LinearGradient>
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
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(255,255,255,0)']}
        style={{
          width: '100%',
        }}>
        <Animated.View style={[naVAnimatedStyle, styles.bottomBox]}>
          <FastImage
            source={imageUrl.common.back}
            style={{
              width: 40,
              height: 40,
            }}></FastImage>
          <FastImage
            source={imageUrl.common.option}
            style={{
              width: 40,
              height: 40,
            }}></FastImage>
        </Animated.View>
      </LinearGradient>
    );
  }, []);

  //整体渲染
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        footerShow.value = !footerShow.value;
      }}>
      <Animated.View style={styles.box}>
        <Animated.View>
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
            muted={isOpenVoice}
            ref={videoRef}
            currentPlaybackTime={currentTime}></Video>
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
  videoBox: {
    width: style.DeviceWidth,
    height: style.DeviceHeight,
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
