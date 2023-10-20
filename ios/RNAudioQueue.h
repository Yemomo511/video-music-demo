//
//  RNAudioQueue.h
//  VideoMusic
//
//  Created by 叶墨沫 on 2023/10/20.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <AudioToolbox/AudioQueue.h>
@interface RNAudioQueue : RCTEventEmitter<RCTBridgeModule>

@property (nonatomic,assign) OSStatus _audioQueue;

@end
