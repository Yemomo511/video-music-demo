import React, { useMemo } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewComponent, ViewStyle } from 'react-native'
import Slider from '@react-native-community/slider';
import style from '../../common/style';
import imageUrl from '../../image/image';
import { lightColors } from '../../common/color';
export default function SliderBarFullScreenForMusic({
    style={},
    currentTimeState,
    allTime,
    setTime,
}:{
    style?: StyleProp<ViewStyle>
    currentTimeState:number,
    allTime:{
        playableDuration: number;
        seekableDuration: number;
    }
    setTime:React.Dispatch<React.SetStateAction<number>>,
}) {
    const progressValue = useMemo(()=>{
        return currentTimeState/allTime.seekableDuration
    },[currentTimeState])
    const onSliderChange = (event:any)=>{
        setTime(event*allTime.seekableDuration)
    }
    const translateTime = (time:number)=>{
        const hour = Math.floor(time/3600)
        const minuteTime = time%3600
        const minute = Math.floor(minuteTime/60)
        const second = Math.floor(time%60)
        return `${hour>0?`${hour}:`:""}${minute>=10?minute:"0"+minute}:${second>=10?second:"0"+second}`
    }
    const fullTime = useMemo(()=>{
        return translateTime(allTime.seekableDuration)
    },[allTime,currentTimeState])
    const currentTime = useMemo(()=>{
        return translateTime(currentTimeState)
    },[allTime,currentTimeState])
  return (
    <View style={styles.box}>
         <Text style={{
            color:lightColors.darkPrimary,
            fontSize:12,
           
        }}>{currentTime}</Text>
        <Slider 
        value={progressValue} 
        onValueChange={onSliderChange}
        tapToSeek={true}
        style={[styles.slider,style]}
        thumbImage={imageUrl.music.icon}
        minimumTrackTintColor={lightColors.darkPrimary}
        maximumTrackTintColor={lightColors.mediumGrey}
        >
        </Slider>
        <Text style={{
            color:lightColors.darkPrimary,
            fontSize:12,
        }}>{fullTime}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    box:{
        flexDirection:"row",
        columnGap:10,
        justifyContent:"center",
        alignItems:"center",
    },
    slider:{
        width:(style.DeviceWidth-120),
        height:20,
    }
})