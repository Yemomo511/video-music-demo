import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Slider from '@react-native-community/slider';
import style from 'common/style';
export default function SliderBar({
    videoTime,
    setVideoTime,
    ref
}:{
    videoTime:{
        currentTime: number,
        playableDuration: number,
        seekableDuration: number,
    },
    setVideoTime:React.Dispatch<React.SetStateAction<{
        currentTime: number;
        playableDuration: number;
        seekableDuration: number;
    }>>,
}) {
    const progressValue = useMemo(()=>{
        return videoTime.currentTime/videoTime.seekableDuration
    },[videoTime])
    const onSliderChange = (event:any)=>{
        setVideoTime({
            ...videoTime,
            currentTime:event*videoTime.seekableDuration
        })
    }
    const translateTime = (time:number)=>{
        const hour = Math.floor(time/3600)
        const minuteTime = time%3600
        const minute = Math.floor(minuteTime/60)
        const second = Math.floor(time%60)
        return `${hour>0?`${hour}:`:""}${minute>10?minute:"0"+minute}:${second>10?second:"0"+second}`
    }
    const fullTime = useMemo(()=>{
        return translateTime(videoTime.seekableDuration)
    },[videoTime])
    const currentTime = useMemo(()=>{
        return translateTime(videoTime.currentTime)
    },[videoTime])
  return (
    <View style={styles.box}>
        <Slider 
        value={progressValue} 
        onValueChange={onSliderChange}
        style={styles.slider}></Slider>
        <Text style={{
            color:"black",
            fontSize:12,
        }}>{currentTime}/{fullTime}</Text>
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
        width:(style.DeviceWidth-100)*0.6,
    }
})