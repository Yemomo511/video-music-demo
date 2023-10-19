import React, { useState } from 'react'
import { View } from 'react-native'
import useAudio from '../../hooks/useAudio/useAudio'
export default function MusicView() {
  const [id,setId] = useState<number>(1)
  const {basicFunc,RNAudio}=useAudio(id,"walk_grass.mp3",{},"MAIN_BUNDLE");
  return (
    <View>
    </View>
  )
}
