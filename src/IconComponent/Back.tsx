import React from 'react'
import { View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { TouchableOpacity } from 'react-native-gesture-handler'
import imageUrl from '../image/image'
export default function Back({onPress,size=20}:{
    onPress:()=>void,
    size?:number,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
        <FastImage style={{
            height:size,
            width:size,
        }} source={imageUrl.common.back}></FastImage>
    </TouchableOpacity>
  )
}
