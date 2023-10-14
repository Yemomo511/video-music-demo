import React from 'react'
import Video from "react-native-video"
const VideoAnimatedComponent = React.forwardRef((props:any,ref:any)=>{
    return (
      <Video
      {...props}
      ref={ref}
      ></Video>
    )
  })
export default VideoAnimatedComponent
