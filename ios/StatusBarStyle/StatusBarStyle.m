//
//  StatusBarStyle.m
//  VideoMusic
//
//  Created by 叶墨沫 on 2023/10/16.
//

#import "StatusBarStyle.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <UIKit/UIStatusBarManager.h>

@implementation RCTConvert(UIStatusBar)

RCT_ENUM_CONVERTER(UIStatusBarStyle, (@{
  @"default":@(UIStatusBarStyleDefault),
  @"light-content":@(UIStatusBarStyleLightContent),
  @"dark-content":@(UIStatusBarStyleDarkContent),
}), UIStatusBarStyleDefault, integerValue);


RCT_ENUM_CONVERTER(UIStatusBarAnimation, (@{
  @"node":@(UIStatusBarAnimationNone),
  @"slide":@(UIStatusBarAnimationSlide),
  @"fade":@(UIStatusBarAnimationFade),
}), UIStatusBarAnimationNone, integerValue)
@end

@implementation StatusBarStyle

//参考链接https://developer.apple.com/documentation/uikit/uiapplication/1622923-setstatusbarstyle

RCT_EXPORT_MODULE(StatusBarStyle);


RCT_EXPORT_METHOD(setHidden:(BOOL) hidden
                  withAnimation:(UIStatusBarAnimation) statusBarAnimation){
  dispatch_async(dispatch_get_main_queue(),  ^(void){
    [[UIApplication sharedApplication] setStatusBarHidden:hidden withAnimation:statusBarAnimation];
  });
};

RCT_EXPORT_METHOD(setStyle:(UIStatusBarStyle) style
                  Animationed:(BOOL) animated){
  dispatch_async(dispatch_get_main_queue(),^(void){
    [[UIApplication sharedApplication] setStatusBarStyle:style animated:animated];
  });
}
@end
