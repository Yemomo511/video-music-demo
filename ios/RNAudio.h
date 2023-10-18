//
//  RNAudio.h
//  VideoMusic
//
//  Created by 叶墨沫 on 2023/10/16.
//


#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#else
#import "RCTBridgeModule.h"
#endif

#import <AVFoundation/AVFoundation.h>
#import "AVFAudio/AVFAudio.h"
#import <React/RCTEventEmitter.h>

//集成RCTEventEmitter，进行事件监听和转发
@interface RNAudio : RCTEventEmitter<RCTBridgeModule,AVAudioPlayerDelegate>

@property (nonatomic,weak) NSNumber *_key;
@property (nonatomic,assign) BOOL isRouteClose;
@end
