import React, { useEffect, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Slider from '@react-native-community/slider';
import style from '../../common/style';
import imageUrl from '../../image/image';
export default function SliderBar({
    currentTimeState,
    allTime,
    setVideoTime,
}:{
    currentTimeState:number,
    allTime:{
        playableDuration: number;
        seekableDuration: number;
    }
    setVideoTime:React.Dispatch<React.SetStateAction<number>>,
}) {
    const progressValue = useMemo(()=>{
        return currentTimeState/allTime.seekableDuration
    },[currentTimeState,allTime])
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
        <Slider 
        value={progressValue} 
        onValueChange={onSliderChange}
        tapToSeek={true}
        style={styles.slider}
        thumbImage={imageUrl.video.bilibili}
        minimumTrackTintColor={"pink"}
        >
        </Slider>
        <Text style={{
            color:"white",
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
        width:(style.DeviceWidth-100)*0.4,
        height:20,
    }
})