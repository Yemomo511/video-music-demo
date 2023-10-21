import React, { useEffect } from 'react'
import { StyleSheet, Text, Touchable, View } from 'react-native'
import style from '../../common/style'
import { lightColors } from '../../common/color'
import { RadialGradient } from 'react-native-gradients'
import FastImage from 'react-native-fast-image'
import imageUrl from '../../image/image'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withRepeat, withTiming,Easing, cancelAnimation } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function MusicCard({
  isPause=true
}:{
  isPause?:boolean
}) {
  const rotateValue = useSharedValue(0)
  const barRotateValue = useSharedValue(-20)
  useEffect(()=>{
    if (isPause){
      barRotateValue.value = withTiming(-20)
    }else{
      barRotateValue.value = withTiming(20)
    }
  },[isPause])
  useEffect(()=>{
    if (isPause){
      cancelRotate()
    }else{
      startRotate()
    }
  },[isPause])
  const RadialGradientList =[
    {
      color:lightColors.black,
      offset:"0%",
      opacity:"1",
    },
    {
      color:lightColors.black,
      offset:"100%",
      opacity:"0.1",
    },
  ]
  const cancelRotate = ()=>{
    cancelAnimation(rotateValue)
  }
  const startRotate = ()=>{
    rotateValue.value =withRepeat(withTiming(360,{
      duration:10000,
      easing:Easing.linear,
    }),-1)
  }
  
  const posterAnimatedStyle = useAnimatedStyle(()=>{
    return{
      transform:[
        {
          rotateZ:`${rotateValue.value}deg`
        }
      ]
    }
  })
  const barAnimatedStyle = useAnimatedStyle(()=>{
    return{
      transform:[
        {
          rotateZ:`${barRotateValue.value}deg`
        }
      ]
    }
  })
  return (
    <View style={{
      justifyContent:"center",
      alignItems:"center",
    }}>
      <Animated.View style={[styles.barBox,barAnimatedStyle]}>
        <FastImage source={imageUrl.music.bar} style={styles.bar}></FastImage>
      </Animated.View>
      <View style={styles.cardBox}>
        <View style={{
          position:"absolute",
          width:"100%",
          height:"100%",
          borderRadius:style.DeviceWidth*0.7,
          overflow:'hidden',
          zIndex:0,
        }}>
          <RadialGradient 
          x="50%" y="50%" rx="50%" ry="50%"
          colorList={RadialGradientList}></RadialGradient>
        </View>
        {/* 模拟一个唱片*/}
        <Animated.View style={[posterAnimatedStyle,styles.blackCard]}>
          {/**唱片图片 */}
          <FastImage source={imageUrl.music.poster} style={styles.poster}></FastImage>
        </Animated.View>
      </View>
      <TouchableOpacity onPress={()=>{
      }}>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
    barBox:{
      width:style.DeviceWidth,
      height:1,
      marginBottom:style.DeviceWidth*0.3,
      zIndex:99,
      alignItems:"center",
    },
    bar:{
      width:"100%",
      height:style.DeviceWidth,
      position:"relative",
      transform:[
        {scale:0.8},
        {translateY:-style.DeviceWidth*0.59},
        {rotateY:"180deg"}
      ],
      zIndex:99,
    },
    cardBox:{
        position:"relative",
        width:style.DeviceWidth*0.7,
        height:style.DeviceWidth*0.7,
        borderRadius:style.DeviceWidth*0.7,
        borderColor:lightColors.white,
        borderWidth:1,
        justifyContent:"center",
        alignItems:"center",
    },
    blackCard:{
      width:"90%",
      height:"90%",
      borderRadius:style.DeviceWidth * 0.50,
      backgroundColor:lightColors.black,
      justifyContent:"center",
      alignItems:"center",
      zIndex:1,
    },
    poster:{
      width:"70%",
      height:"70%",
      zIndex:1,
      borderRadius:style.DeviceWidth * 0.50,
    }
})
