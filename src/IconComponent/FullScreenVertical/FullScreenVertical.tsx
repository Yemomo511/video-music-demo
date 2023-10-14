import React from 'react'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import imageUrl from '../../image/image'

export default function FullScreenVertical({
    onPress
}:{
    onPress:()=>void
}) {
  return (
    <TouchableOpacity onPress={onPress}>
    <FastImage
      source={imageUrl.video.fullScreen}
      style={{
        width: 30,
        height: 30,
      }}></FastImage>
  </TouchableOpacity>
  )
}
