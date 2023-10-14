import React, { useEffect } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import VideoView from '../../components/VideoView/VideoView';
import mp4 from '../../assets/app.mp4';
import Animated from 'react-native-reanimated';
import { useStoryStore ,StoryType} from '../../store/modules/story';
import { Text, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';
function VideoDetail({route}: {route: any}) {
  const {storyList,addStory,removeStory,clearStory} = useStoryStore((state)=>state)
  
  useEffect(()=>{

    
  },[storyList])
  // useFocusEffect(()=>{
  //   Orientation.lockToPortrait()
  // })
  if (!route.params) {
    return (
      <SafeAreaView>
        <VideoView
          source={mp4}
          paused={true}
          title="那维莱特"
          id="asd"></VideoView>
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
      </SafeAreaView>
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