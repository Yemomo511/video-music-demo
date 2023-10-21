import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import SliderBarFullScreenForMusic from '../SliderBarFullScreenForMusic/SliderBarFullScreenForMusic';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import imageUrl from '../../image/image';

export default function MusicBottom({
  isPlay,
  currentTime,
  allTime,
  setTime,
  next,
  last,
  play,
}: {
  isPlay: boolean;
  currentTime: number;
  allTime: {
    playableDuration: number;
    seekableDuration: number;
  };
  setTime: React.Dispatch<React.SetStateAction<number>>;
  next: ()=>void;
  last: ()=>void;
  play: (key: number, callback: (str: string) => void) => void;
}) {
  const [isLike, setIsLike] = useState<Boolean>(false);
  const renderButton = useCallback((imgUrl:any,onPress:any)=>{
    return (
        <TouchableOpacity onPress={onPress}>
            <FastImage
            style={{
                width: 40,
                height: 40,
            }}
            source={
                imgUrl
            }></FastImage>
        </TouchableOpacity>
    )
  },[play,last,next,isLike])
  return (
    <View>
      <SliderBarFullScreenForMusic
        allTime={allTime}
        currentTimeState={currentTime}
        setTime={setTime}></SliderBarFullScreenForMusic>
      <View style={styles.buttonBox}>
        {renderButton(isLike?imageUrl.music.musicLike:imageUrl.music.musicUnLike,()=>{
            setIsLike(!isLike)
        })}
        {renderButton(imageUrl.music.lastMusic,last)}
        {renderButton(isPlay?imageUrl.music.pause:imageUrl.music.play,play)}
        {renderButton(imageUrl.music.nextMusic,next)}
        {renderButton(imageUrl.common.list,()=>{})}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 0,
  },
});
