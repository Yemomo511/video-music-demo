//
//  StatusBarStyle.h
//  VideoMusic
//
//  Created by 叶墨沫 on 2023/10/16.
//
#import <UIKit/UIKey.h>
#import <UIKit/UIStatusBarManager.h>

#import <React/RCTConvert.h>
#import <React/RCTEventEmitter.h>

@interface RCTConvert (UIStatusBar)

+(UIStatusBarStyle)UIStatusBarStyle:(id)json;
+(UIStatusBarAnimation)UIStatusBarAnimation:(id)json;


@end

@interface  StatusBarStyle : RCTEventEmitter

@end
