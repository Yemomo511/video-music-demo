import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { NativeModules } from 'react-native'
import {ImageResolvedAssetSource} from "react-native"
import { useEvent } from 'react-native-reanimated'

type categoryType = "Ambient" | "SoloAmbient" | "Playback" | "Record" | "PlayAndRecord" | "AudioProcessing" | "MultiRoute";
type modeType = "Default" | "VoiceChat"  | "GameChat" | "VideoRecording" | "Measurement" | "MoviePlayback" | "VideoChat" 
interface RNAudioType{
    init:(name:string,id:number,options:any,callback:(error:any,data:object)=>void)=>void
    play:(id:number,callback:()=>void)=>void
    pause:(id:number,callback:()=>void)=>void
    realse:(id:number,callback:()=>void)=>void
    stop:(id:number,callback:()=>void)=>void
    enabled:(enabled:boolean)=>void
    setCategory:(category:categoryType)=>void
    setMode: (mode:modeType)=>void
    //常量
    MainBundlePath:string
    NSDocumentDirectory:string
    NSLibraryDirectory:string
    NSCachesDirectory:string
}

//Audio的所有方法进行封装
const RNAudio:RNAudioType
 = NativeModules.RNAudio
type configType = "MAIN_BUNDLE"|"DOCUMENT"|"LIBRARY"|"CACHE"
const configOptions ={
    MAIN_BUNDLE:RNAudio.MainBundlePath,
    DOCUMENT:RNAudio.NSDocumentDirectory,
    LIBRARY:RNAudio.NSLibraryDirectory,
    CACHE:RNAudio.NSCachesDirectory,
}
export default function useAudio(id:number=0,name:string="",options:any={},config:configType="MAIN_BUNDLE") {
    const resolveAssetSource = require("react-native/Libraries/Image/resolveAssetSource");
    const option = useEvent(options)
    const [audioData,setAudioData] = useState<object>()
    const fileName = useMemo(()=>{
        let asset = resolveAssetSource(name);
        if (asset){
            return asset.uri;
        }else{
            return configOptions[config] + "/" + name;
        }
    },[name,config])
   
  const init = (fileName:string,id:number,options:any,callback:(error:any,data:object)=>void)=>{
    RNAudio.init(fileName,id,options || {},callback)
  }
  useEffect(()=>{
    console.log(option.current.worklet)
    init(fileName,id,option,(error:any,data:object)=>{
        setAudioData(data)
        console.log(data)
    })
    RNAudio.enabled(true)
  },[id,fileName,option])
  const play = (key:number,callback:()=>void)=>{
    RNAudio.play(key,callback);
  }
  const pause = (key:number,callback:()=>void)=>{
    RNAudio.pause(key,callback);
  }
  const realse = (key:number,callback:()=>void)=>{
    RNAudio.realse(key,callback);
  }
  const stop = (key:number,callback:()=>void)=>{
    RNAudio.stop(key,callback)
  }
  const setCategory = (category:categoryType)=>{
    RNAudio.setCategory(category);
  }
  const setMode = (mode:modeType)=>{
    RNAudio.setMode(mode);
  }

  const basicFunc = {
    play,
    pause,
    realse,
    stop,
    setCategory,
    setMode
  }

  return {audioData,RNAudio,basicFunc}
}
