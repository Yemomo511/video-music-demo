import React, { useMemo } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewComponent, ViewStyle } from 'react-native'
import Slider from '@react-native-community/slider';
import style from '../../common/style';
import imageUrl from '../../image/image';
export default function SliderBarFullScreen({
    style={},
    currentTimeState,
    allTime,
    setVideoTime,
}:{
    style?: StyleProp<ViewStyle>
    currentTimeState:number,
    allTime:{
        playableDuration: number;
        seekableDuration: number;
    }
    setVideoTime:React.Dispatch<React.SetStateAction<number>>,
}) {
    const progressValue = useMemo(()=>{
        return currentTimeState/allTime.seekableDuration
    },[currentTimeState])
    const onSliderChange = (event:any)=>{
        setVideoTime(event*allTime.seekableDuration)
    }
    const translateTime = (time:number)=>{
        const hour = Math.floor(time/3600)
        const minuteTime = time%3600
        const minute = Math.floor(minuteTime/60)
        const second = Math.floor(time%60)
        return `${hour>0?`${hour}:`:""}${minute>10?minute:"0"+minute}:${second>10?second:"0"+second}`
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
            color:"white",
            fontSize:12,
            alignSelf:"flex-start"
        }}>{currentTime}/{fullTime}</Text>
        <Slider 
        value={progressValue} 
        onValueChange={onSliderChange}
        tapToSeek={true}
        style={[styles.slider,style]}
        thumbImage={imageUrl.video.bilibili}
        minimumTrackTintColor={"pink"}
        >
        </Slider>
    </View>
  )
}
const styles = StyleSheet.create({
    box:{
        flexDirection:"column",
        columnGap:10,
        justifyContent:"center",
        alignItems:"center",
        padding:10,
    },
    slider:{
        width:(style.DeviceWidth-20),
        height:20,
    }
})