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
import imageUrl from '../../image/image';
const musicData =  [
  {
    id:1,
    title:"グランドエスケープ (Movie edit) - (逃离地面)",
    name:"三浦透子/RADWIMPS《天気の子》",
    mp4:"escape_ground.mp3",
    poster:imageUrl.music.poster.weatherSon,
  },
  {
    id:2,
    title:"植物大战僵尸",
    name:"向日葵",
    mp4:"walk_grass.mp3",
    poster:imageUrl.music.poster.pvz,
  },{
    id:3,
    title:"ただ君に晴れ",
    name:"Yorushika-負け犬にアンコールはいらない",
    mp4:"you_sunday.mp3",
    poster:imageUrl.music.poster.youSunday
  }
]
interface props {
  title?: string;
  author?: string;
}

export default function MusicView(props: props) {
  const [playerIndex,setPlayerIndex] = useState<number>(0);
  const onFinish = ()=>{
    setPlayerIndex((playerIndex)=>{
      if (playerIndex == musicData.length - 1){
        return 0
      }else{
        return playerIndex + 1
      }
    })
  }
  const {basicFunc, 
        isPlayState,currentTimeState,audioData,setMyCurrentTimeState,volumeState,
      setVolumeState} = useAudio(
    musicData[playerIndex].id,
    musicData[playerIndex].mp4,
    {},
    'MAIN_BUNDLE',
    onFinish
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
      basicFunc.setCurrentTime(musicData[playerIndex].id,currentTime,()=>{
      })
  },[musicData[playerIndex].id])
  const renderBottom = useCallback(()=>{
    return (
      <MusicBottom 
      volume={volumeState}
      setVolume={setVolumeState}
      isPlay={isPlayState}
      currentTime={currentTimeState} 
      allTime={allTime}
      play={()=>{
        if (isPlayState){
          basicFunc.pause(musicData[playerIndex].id,()=>{
          })
        }else{
          basicFunc.play(musicData[playerIndex].id)
        }
      }}
      last={()=>{
        setPlayerIndex((playerIndex)=>{
          if (playerIndex == 0){
            return musicData.length - 1
          }else{
            return playerIndex - 1
          }
        })
      }}

      next={()=>{
        setPlayerIndex((playerIndex)=>{
          if (playerIndex == musicData.length - 1){
            return 0
          }else{
            return playerIndex + 1
          }
        })
      }}
      setTime={setMyCurrentTimeState}></MusicBottom>
    )
  },[allTime,currentTimeState,basicFunc,isPlayState,playerIndex])

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
                <Text style={[styles.title]} numberOfLines={1}>{musicData[playerIndex].title}</Text>
              <Text style={styles.author} numberOfLines={1}>{musicData[playerIndex].name}</Text>
            </View>
            <Share onPress={() => {}} size={30}></Share>
          </View>
          <MusicPlayer isPause={!isPlayState} source={musicData[playerIndex].poster}></MusicPlayer>
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
