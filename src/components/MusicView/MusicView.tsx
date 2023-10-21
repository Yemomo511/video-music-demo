import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import useAudio from '../../hooks/useAudio/useAudio';
import Back from '../../IconComponent/Back';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import style from '../../common/style';
import Share from '../../IconComponent/Share/Share';
import {lightColors} from '../../common/color';
import MusicPlayer from '../MusicCard/MusicCard';
import StatusBarBackground from '../StatusBar/StatusBarBackground';
import MusicBottom from '../MusicBottom/MusicBottom';
interface props {
  title?: string;
  author?: string;
}

export default function MusicView(props: props) {
  const {title = 'グランドエスケープ (Movie edit) - (逃离地面)', author = '三浦透子/RADWIMPS《天気の子》'} = props;
  const [id, setId] = useState<number>(1);
  const {basicFunc, 
        isPlayState,currentTimeState,audioData,setMyCurrentTimeState} = useAudio(
    id,
    'walk_grass.mp3',
    {},
    'MAIN_BUNDLE',
  );
  const {top,bottom} = useSafeAreaInsets();
  useEffect(() => {
    console.log(isPlayState);
  }, []);
 
  const allTime = useMemo(()=>{
    console.log(audioData);
    return {
      playableDuration:audioData != undefined ?audioData.duration:0,
      seekableDuration:audioData != undefined ?audioData.duration:0,
    }
  },[audioData])
  const setTime = useCallback((currentTime:number)=>{
      basicFunc.setCurrentTime(id,currentTime,()=>{
      })
  },[id])
  const renderBottom = useCallback(()=>{
    return (
      <MusicBottom 
      isPlay={isPlayState}
      currentTime={currentTimeState} 
      allTime={allTime}
      play={()=>{
        if (isPlayState){
          basicFunc.pause(id,()=>{
          })
        }else{
          basicFunc.play(id)
        }
      }}
      last={()=>{}}
      next={()=>{}}
      setTime={setMyCurrentTimeState}></MusicBottom>
    )
  },[allTime,currentTimeState,basicFunc,id])

  return (
    <View>
      <View
        style={[
          styles.box,
          {
            paddingTop: top,
            paddingBottom:bottom,
          },
        ]}>
        <View>
          <View style={styles.header}>
            <Back onPress={() => {}} size={30}></Back>
            <View style={styles.textInfo}>
                <Text style={[styles.title]} numberOfLines={1}>{title}</Text>
              <Text style={styles.author} numberOfLines={1}>{author}</Text>
            </View>
            <Share onPress={() => {}} size={30}></Share>
          </View>
          <MusicPlayer isPause={!isPlayState}></MusicPlayer>
        </View>
        <View style={[styles.bottom]}>
           {renderBottom()}
        </View>
      </View>
      <View style={styles.background}></View>
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: style.DeviceWidth,
    height: style.DeviceHeight,
    zIndex: -1,
    backgroundColor: 'rgba(0,20,200,0.1)',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  textInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: lightColors.white,
  },
  author: {
    fontSize: 16,
    color: lightColors.gray,
    flexWrap:"nowrap",
  },
  bottom: {
    padding: 10,
  },
});
