import React, { useEffect } from 'react'
import { NativeModules } from 'react-native'
import {ImageResolvedAssetSource} from "react-native"
interface RNAudio{
    init:(name:string,id:number,options:any,callback:(error:any)=>void)=>void
}
//Audio的所有方法进行封装
export default function useAudio() {
  const {RNAudio} = NativeModules
  const config ={
    MAIN_BUNDLE:RNAudio.MainBundlePath,
    DOCUMENT:RNAudio.NSDocumentDirectory,
    LIBRARY:RNAudio.NSLibraryDirectory,
    CACHE:RNAudio.NSCachesDirectory,
  }
  useEffect(()=>{
    const url = "walk_grass.mp3"
    let fileName;
    const resolveAssetSource = require("react-native/Libraries/Image/resolveAssetSource");
    let asset = resolveAssetSource(url);
    if (asset) {
        fileName = asset.uri;
    }else{
        fileName = config.MAIN_BUNDLE + "/" + url;
    }
    RNAudio.init(fileName,
    12,{},(error:any,data:object)=>{
        if(!error){
            console.log("data",data);
        }else{
            console.log("error",error);
        }
        console.log("inner")
    })
    RNAudio.enabled(true)
    RNAudio.play(12,(str:string)=>{
        console.log(str)
    })
    
  },[])
}
