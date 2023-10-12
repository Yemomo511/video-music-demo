import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import VideoViewFullscreen from '../../components/VideoViewFullscreen/VideoViewFullScreen'
import mp4 from "../../assets/app.mp4"
export default function VideoFullScreen({route}:{
    route:any
}) {
    const {currentTime,fullTime} = route.params
    console.log(currentTime)
  return (
    <SafeAreaView>
        <VideoViewFullscreen source={mp4} paused={true} title="原神" id="aaa" currentTime={currentTime} fullTime={fullTime}></VideoViewFullscreen>
    </SafeAreaView>
  )
}
