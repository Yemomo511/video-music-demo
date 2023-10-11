import React, { useState } from 'react';
import {StyleSheet,  TouchableOpacity, View} from 'react-native';
import style from 'common/style'
import Video from "react-native-video"
import { Image } from 'react-native';
import imageUrl from '../../image/image';
interface props {
  source: string; 
  paused: boolean
}
export default function VideoView(props:props) {
    const {source,paused} = props;
    const [pausedState, setPausedState] = useState<boolean>(() => {
      return paused;
    });
    return (
    <TouchableOpacity
    style={styles.box}
    onPress={()=>{
      setPausedState(!pausedState);
    }}>
        <Video 
        paused={pausedState}
        source={source} 
        style={styles.videoBox}></Video>
        <View style={styles.upOnVideoBox}>
          {pausedState ? (
            <Image
              source={imageUrl.video.pause}
              style={{
                width: 70,
                height: 70,
                opacity: 0.4,
              }}
            />
          ) : null}
        </View>
    </TouchableOpacity>);
}
const styles = StyleSheet.create({
    box:{
      position:"relative",
    },
    videoBox:{
      width:style.DeviceWidth,
      height:style.DeviceWidth*(9/16),
      backgroundColor:"black",
    },
    upOnVideoBox:{
      position:"absolute",
      bottom:0,
      left:0,
      top:0,
      right:0,
      justifyContent:"center",
      alignItems:"center",
    }
})
