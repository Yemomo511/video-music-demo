import React from 'react'
import { TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import imageUrl from '../../image/image';

interface Props{
    onPress:()=>void,
    isOpen?:boolean
}
export default function MessageSwitch({onPress,isOpen=true}:Props) {
  return (
    <TouchableWithoutFeedback
    onPress={onPress}>
    <FastImage
      source={
        isOpen
          ? imageUrl.video.messageOpen
          : imageUrl.video.messageClose
      }
      style={{
        width: 40,
        height: 40,
      }}></FastImage>
  </TouchableWithoutFeedback>
  )
}
