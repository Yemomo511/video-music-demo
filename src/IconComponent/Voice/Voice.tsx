import React from 'react';
import FastImage from 'react-native-fast-image';
import imageUrl from '../../image/image';
import { TouchableOpacity } from 'react-native';
export default function Voice({isOpenVoice,onPress}: {
  isOpenVoice: boolean
  onPress:()=>void
}) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}>
      <FastImage
        source={
          isOpenVoice ? imageUrl.video.voiceOpen : imageUrl.video.voiceClose
        }
        style={{
          width: 30,
          height: 30,
        }}></FastImage>
    </TouchableOpacity>
  );
}
