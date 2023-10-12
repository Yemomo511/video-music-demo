import React from 'react';
import FastImage from 'react-native-fast-image';
import imageUrl from '../../image/image';
export default function Voice({isOpenVoice}:{
    isOpenVoice:boolean
}) {
  return (
    <FastImage
      source={
        isOpenVoice ? imageUrl.video.voiceOpen : imageUrl.video.voiceClose
      }
      style={{
        width: 30,
        height: 30,
      }}></FastImage>
  );
}
