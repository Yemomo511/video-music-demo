import React from 'react'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import imageUrl from '../../image/image'

export default function FullScreenHorizon({
  onPress
}:{
  onPress:()=>void
}) {
  
    return (
      <TouchableOpacity onPress={onPress}>
      <FastImage
        source={imageUrl.video.horizonFull}
        style={{
          width: 30,
          height: 30,
        }}></FastImage>
    </TouchableOpacity>
    )  
}
