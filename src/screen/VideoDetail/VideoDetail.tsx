import React, { useEffect } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import VideoView from '../../components/VideoView/VideoView';
import mp4 from '../../assets/app.mp4';
import Animated from 'react-native-reanimated';
import { useStoryStore ,StoryType} from '../../store/modules/story';
import { Text, Touchable, View ,StatusBar as StatusBarNative} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import  StatusBar from "../../components/StatusBar/StatusBarBackground"
import { useFocusEffect } from '@react-navigation/native';
function VideoDetail({route}: {route: any}) {
  const {storyList,addStory,removeStory,clearStory} = useStoryStore((state)=>state)
  
  useEffect(()=>{

    
  },[storyList])
  if (!route.params) {
    return (
      <View>
        <VideoView
          source={mp4}
          paused={true}
          title="那维莱特"
          id="asd"></VideoView>
          <StatusBarNative translucent={true} barStyle="light-content"></StatusBarNative>
          <TouchableOpacity onPress={()=>{
            addStory({
                id:"aaa",
                title:"yemomo",
                content:"yemomo",
            })
          }}>
            <Text>添加浏览记录</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            clearStory()
          }}>
            <Text>清除所有浏览记录</Text>
          </TouchableOpacity>
      </View>
    );
  }
  const {currentTime, fullTime, paused,id} = route.params;
  return (
        <Animated.View>
          <VideoView
            source={mp4}
            paused={paused}
            title="那维莱特"
            id={id}
            currentTime={currentTime}
            fullTime={fullTime}></VideoView>
        </Animated.View>
  );
}
export default VideoDetail;