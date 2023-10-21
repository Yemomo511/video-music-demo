import React from 'react'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import imageUrl from '../../image/image'

export default function Share({onPress,size=20}:{
    onPress:()=>void,
    size?:number,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
        <FastImage style={{
            height:size,
            width:size,
        }} source={imageUrl.common.share}></FastImage>
    </TouchableOpacity>
  )
}
