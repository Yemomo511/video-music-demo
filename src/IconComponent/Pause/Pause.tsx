import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import imageUrl from '../../image/image';

interface props{
    onPress:()=>void,
    paused?:boolean
}
export default function Pause({onPress,paused=true}:props) {
  return (
    <TouchableWithoutFeedback
      onPress={onPress}>
      <FastImage
        source={
          paused ? imageUrl.video.startFooter : imageUrl.video.pausedFooter
        }
        style={{
          width: 30,
          height: 30,
        }}></FastImage>
    </TouchableWithoutFeedback>
  );
}
