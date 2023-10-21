import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {NativeModules, NativeEventEmitter, InteractionManager} from 'react-native';
import {ImageResolvedAssetSource} from 'react-native';
import {useEvent} from 'react-native-reanimated';

type categoryType =
  | 'Ambient'
  | 'SoloAmbient'
  | 'Playback'
  | 'Record'
  | 'PlayAndRecord'
  | 'AudioProcessing'
  | 'MultiRoute';
type modeType =
  | 'Default'
  | 'VoiceChat'
  | 'GameChat'
  | 'VideoRecording'
  | 'Measurement'
  | 'MoviePlayback'
  | 'VideoChat';

interface audioDataType {
  duration: number;
  numberOfChannels: number;
}
interface RNAudioType {
  init: (
    name: string,
    id: number,
    options: any,
    callback: (error: any, data: audioDataType) => void,
  ) => void;
  play: (id: number, callback: (array: any) => void) => void;
  pause: (id: number, callback: () => void) => void;
  realse: (id: number, callback: () => void) => void;
  stop: (id: number, callback: () => void) => void;
  enabled: (enabled: boolean) => void;
  setCategory: (category: categoryType) => void;
  setMode: (mode: modeType) => void;
  getCurrentTime: (
    key: number,
    callback: (data: number, error: string) => void,
  ) => void;
  setCurrentTime: (
    ket: number,
    currentTime: number,
    callback: (string: string) => void,
  ) => void;
  getVolume: (key: number, callback: () => void) => void;
  setVolume: (key: number, volume: number, callback: () => void) => void;
  //常量
  MainBundlePath: string;
  NSDocumentDirectory: string;
  NSLibraryDirectory: string;
  NSCachesDirectory: string;
  playEvent: string;
  currentTimeEvent: string;
}
type configType = 'MAIN_BUNDLE' | 'DOCUMENT' | 'LIBRARY' | 'CACHE';
//Audio的所有方法进行封装，AVAudioPlayer只能播放本地音频
const RNAudio: RNAudioType = NativeModules.RNAudio;
const EventEmitter = new NativeEventEmitter(NativeModules.RNAudio);
const PLAY_EVENT = RNAudio.playEvent;
const CURRENT_TIME_EVENT = RNAudio.currentTimeEvent;
const configOptions = {
  MAIN_BUNDLE: RNAudio.MainBundlePath,
  DOCUMENT: RNAudio.NSDocumentDirectory,
  LIBRARY: RNAudio.NSLibraryDirectory,
  CACHE: RNAudio.NSCachesDirectory,
};

export default function useAudio(
  id: number = 0,
  name: string = '',
  options: any = {},
  config: configType = 'MAIN_BUNDLE',
) {
  const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');
  const option = useEvent(options);
  const [audioData, setAudioData] = useState<audioDataType>();
  const [isPlayState, setIsPlayState] = useState<boolean>(false);
  const [currentTimeState, setCurrentTimeState] = useState<number>(0);
  const [myCurrentTimeState,setMyCurrentTimeState] = useState<number>(0)
  const fileName = useMemo(() => {
    let asset = resolveAssetSource(name);
    if (asset) {
      return asset.uri;
    } else {
      return configOptions[config] + '/' + name;
    }
  }, [name, config]);
  useEffect(() => {
    //监听hook,看看是否蓝牙有发生改变
    EventEmitter.addListener(PLAY_EVENT, (data: any) => {
      setIsPlayState(data.isPlaying);
    });
    EventEmitter.addListener(CURRENT_TIME_EVENT, (data: any) => {
      setCurrentTimeState(data.currentTime);
    });
    return () => {
      EventEmitter.removeAllListeners(PLAY_EVENT);
      EventEmitter.removeAllListeners(CURRENT_TIME_EVENT);
      // clearInterval(interval)
    };
  }, []);
  //轮询查看currentTime进行进度更新，IOS未提供事件函数，悲
  useEffect(() => {
    if (!isPlayState) {
      return;
    }
    const getTimeInterval = setInterval(() => {
      InteractionManager.runAfterInteractions(() => {
        getCurrentTime(id, (currentTime: number, error: string) => {
          setCurrentTimeState(currentTime);
        });
      });
    }, 500);
    return () => {
      clearInterval(getTimeInterval);
    };
  }, [isPlayState]);

  useEffect(()=>{
    if(isPlayState){
      setCurrentTime(id,myCurrentTimeState,(error:string)=>{
        if (error){
          console.log(error)
        }
      })
    }
  },[myCurrentTimeState])

  const init = (
    fileName: string,
    id: number,
    options: any,
    callback: (error: any, data: audioDataType) => void,
  ) => {
    RNAudio.init(fileName, id, options || {}, callback);
  };
  useEffect(() => {
    console.log(option.current.worklet);
    init(fileName, id, option, (error: any, data: audioDataType) => {
      setAudioData(data);
    });
    RNAudio.enabled(true);
  }, [id, fileName, option]);
  const play = (key: number) => {
    RNAudio.play(key, (array: any) => {
      setIsPlayState(false);
      console.log(array);
    });
    setIsPlayState(true);
  };
  const pause = (key: number, callback: () => void) => {
    RNAudio.pause(key, callback);
    setIsPlayState(false);
  };
  const realse = (key: number, callback: () => void) => {
    RNAudio.realse(key, callback);
    setIsPlayState(false);
  };
  const stop = (key: number, callback: () => void) => {
    RNAudio.stop(key, callback);
  };
  const setCategory = (category: categoryType) => {
    RNAudio.setCategory(category);
  };
  const setMode = (mode: modeType) => {
    RNAudio.setMode(mode);
  };
  const getCurrentTime = (
    key: number,
    callback: (data: number, error: string) => void,
  ) => {
    RNAudio.getCurrentTime(key, callback);
  };
  const setCurrentTime = (
    key: number,
    currentTime: number,
    callback: (error: string) => void,
  ) => {
    RNAudio.setCurrentTime(key, currentTime, callback);
  };
  const getVolume = (key: number, callback: () => void) => {
    RNAudio.getVolume(key, callback);
  };
  const setVolume = (key: number, volume: number, callback: () => void) => {
    RNAudio.setVolume(key, volume, callback);
  };

  const basicFunc = {
    init,
    play,
    pause,
    realse,
    stop,
    setCategory,
    setMode,
    getCurrentTime,
    setCurrentTime,
    getVolume,
    setVolume,
  };

  return {
    audioData,
    RNAudio,
    basicFunc,
    isPlayState,
    currentTimeState,
    setMyCurrentTimeState
  };
}
