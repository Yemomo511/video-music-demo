import React, { useEffect } from 'react'
import { NativeModules,View,Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface props{
    backgroundColor?:string,
    barStyle?:"default"|"light-content"|"dark-content",
    translucent?:boolean,
    hidden?:boolean,
    animated?:"none"|"fade"|"slide",
}

export default function StatusBarBackground({
    barStyle="dark-content",
    backgroundColor,
    hidden=false,
    animated="none",
}:props) {
    const {StatusBarStyle} = NativeModules
    console.log(StatusBarStyle)
    useEffect(()=>{
        StatusBarStyle.setStyle(barStyle,animated);
    },[barStyle,animated])
    useEffect(()=>{
        StatusBarStyle.setHidden(hidden,animated);
    },[hidden,animated])
    const insets  = useSafeAreaInsets()
    useEffect(()=>{
        console.log(insets)
    },[insets])
    return (
    <View style={{        
        height:Platform.OS==="ios"?insets.top:0,
        width:"100%",
        backgroundColor:backgroundColor,
    }}>
    </View>)
}
