import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import VideoView from '../../components/VideoView/VideoView'
import mp4 from "../../assets/app.mp4"
export default function VideoDetail() {
  return (
    <SafeAreaView>
      <VideoView source={mp4} paused={true} title='那维莱特' id='asd'></VideoView>
    </SafeAreaView>
  )
}
