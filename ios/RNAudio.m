//
//  RNAudio.m
//  VideoMusic
//
//  Created by 叶墨沫 on 2023/10/16.
//


#import "RNAudio.h"
#import <React/RCTUtils.h>

#import <React/RCTEventEmitter.h>


@implementation RNAudio{
  NSMutableDictionary *_playerPool;
  NSMutableDictionary *_callbackPool;
  BOOL _isRouteClose;
}

@synthesize _key = _key;

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

//添加监听
//参考https://developer.apple.com/documentation/avfaudio/responding_to_audio_route_changes?language=objc
//用处为监听用户的耳机等。根据AVAudioSessionRouteChangeReason来确定音频设备发生变化的原因，并根据与此决定用户行为
//音频设备变化回调函数，参考https://developer.apple.com/documentation/avfaudio/responding_to_audio_route_changes?language=objc
-(void)audioSessionRouterChangeObserver:(NSNotification *)notifacation{
  NSDictionary* userInfo = notifacation.userInfo;
  AVAudioPlayer* player = [self playerForKey:_key];
  AVAudioSessionRouteChangeReason routerChangeReason = [userInfo[@"AVAudioSessionRouteChangeReason"] longValue];
  //TODO，待事件转发部署
  if (routerChangeReason ==  AVAudioSessionRouteChangeReasonNewDeviceAvailable){
    [player play];
  }
  else if(routerChangeReason == AVAudioSessionRouteChangeReasonOldDeviceUnavailable){
    //此处原因是断掉链接
    [self setIsRouteClose:true];
    [player pause];
  }
}
//音频中断观察回调函数，参考https://developer.apple.com/documentation/avfaudio/handling_audio_interruptions?language=objc
-(void) audioSessionInterruptChangeObserver:(NSNotification *)notification{
  NSDictionary* userInfo = notification.userInfo;
  AVAudioPlayer* player = [self playerForKey:_key];
  AVAudioSessionInterruptionType type = [userInfo[@"AVAudioSessionInterruptionTypeKey"] longValue];
  if (type == AVAudioSessionInterruptionTypeBegan){
    [player pause];
  }else if(type == AVAudioSessionInterruptionTypeEnded){
    //判断是否是蓝牙断联导致的音频中断
    if ([self isRouteClose]){
      [player pause];
    }else{
      [player play];
    }
  }
}
//获取和设置是否是设备断联，防止中断和route改变发生冲突
-(void) setIsRouteClose:(BOOL)isRouteClose{
  if (!_isRouteClose){
    _isRouteClose = false;
  }else{
    _isRouteClose = isRouteClose;
  }
}
-(BOOL) isRouteClose{
  if (!_isRouteClose){
    return false;
  }else{
    return _isRouteClose;
  }
}

//获取audio的存储
- (NSMutableDictionary *)playerPool{
  if (!_playerPool){
    _playerPool = [NSMutableDictionary new];
  }
  return _playerPool;
}
-(NSMutableDictionary *)callBackPool{
  if (_callbackPool){
    _callbackPool =  [NSMutableDictionary new];
  }
  return _callbackPool;
}
//根据key获取player
-(AVAudioPlayer *) playerForKey:(NSNumber *)key{

  return [[self playerPool] objectForKey:key];
}
//获取player的key
- (NSNumber *) keyForPlayer:(AVAudioPlayer *)player{
  return [[[self playerPool] allKeysForObject:player] firstObject];
}
//存储回调
- (RCTResponseSenderBlock)callBackForKey:(NSNumber *)key{
  return [[self callBackPool] objectForKey:key];
}
//目录搜索
-(NSString *)getDirectory:(int) directory{
  //第一个参数为搜索目录，第二个为搜索类型，最后一个为是否扩展~符号进行主目录的string返回
  //主要就是来找音乐
  return [NSSearchPathForDirectoriesInDomains(directory,NSUserDomainMask,YES) firstObject];
}

//Delete代理协议，会在完成播放时执行
-(void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag{
  //让单一线程执行此函数
  @synchronized (self) {
    NSNumber *key = [self keyForPlayer:player];
    //判断是否为本例的audio
    if (key == nil){
      return ;
    }
    [player pause];
    //TODO:按理说要发送通知
    //完成时触发完成的回调
    RCTResponseSenderBlock callBack = [self callBackForKey:key];
    if (callBack){
      //执行回调
      callBack(
        [NSArray arrayWithObjects:[NSNumber numberWithBool:flag], nil]);
      //本次音乐执行完毕，移除本次音乐
      [[self callBackPool] removeObjectForKey:key];
    }
  }
}
RCT_EXPORT_MODULE();
//开启RCTEventEmiiter事件调度
-(NSArray<NSString *> *) supportedEvents{
  return @[@"onPlayerChange"];
}

//暴露常量，notifacation需要接受很多的专业词汇

-(NSDictionary *)constantsToExport{
  return [NSDictionary
          dictionaryWithObjectsAndKeys:
           [NSNumber numberWithBool:NO], @"IsAndroid",
           [[NSBundle mainBundle] bundlePath],
           @"MainBundlePath",
           [self getDirectory:NSDocumentDirectory],
           @"NSDocumentDirectory",
           [self getDirectory:NSLibraryDirectory],
           @"NSLibraryDirectory",
           [self getDirectory:NSCachesDirectory],
          @"NSCachesDirectory", nil];
};
//初始化
RCT_EXPORT_METHOD(init:(NSString *)fileName
                  Key:(nonnull NSNumber *)key
                  WithOptions:(NSDictionary *)options
                  WithCallback:(RCTResponseSenderBlock) withCallback){
  NSError* error;
  NSURL* fileNameUrl;
  AVAudioPlayer* player;
  NSCharacterSet *allowedCharacters = [NSCharacterSet URLQueryAllowedCharacterSet];
  NSString *fileNameEscaped = [fileName stringByAddingPercentEncodingWithAllowedCharacters:allowedCharacters];
  NSLog(@"%@",fileNameEscaped);
  if ([fileNameEscaped hasPrefix:@"http"]){
    fileNameUrl = [NSURL URLWithString:fileNameEscaped];
    NSURLRequest *request = [NSURLRequest requestWithURL:fileNameUrl];
    NSURLSession *session = [NSURLSession sharedSession];
    //目前这里有bug，待进一步处理
    NSData *data = [NSData dataWithContentsOfURL:fileNameUrl];
    player = [[AVAudioPlayer alloc] initWithData:data error:&error];
    }
  else{
    fileNameUrl = [NSURL URLWithString:fileNameEscaped];
    player = [[AVAudioPlayer alloc] initWithContentsOfURL:fileNameUrl error:&error];
  }
  if (player){
    //同步执行
    @synchronized (self) {
      //player初始化
      player.delegate = self;
      player.enableRate = YES;
      [player prepareToPlay];
      [[self playerPool] setObject:player forKey:key];
      
      withCallback(@[[NSNull null],
                     [
                       NSDictionary dictionaryWithObjectsAndKeys:
                         [NSNumber numberWithDouble:[player duration]],
                     @"duration",
                     [NSNumber numberWithUnsignedLong:[player numberOfChannels]],
                       @"numberOfChannels",
                       nil]
                   ]);
    }
  }else{
      withCallback(@[RCTJSErrorFromNSError(error),[NSNull null]]);
    }
  }


//默认启动
RCT_EXPORT_METHOD(enabled:(BOOL) enabled){
  AVAudioSession* audioSession = [AVAudioSession sharedInstance];
  //AVAudioSessionCategorySoloAmbient 打断其他app，允许独自播放
  [audioSession setCategory:AVAudioSessionCategorySoloAmbient error:nil];
  //激活AVAudioSession
  [audioSession setActive:enabled error:nil];
}
//设置categroy
RCT_EXPORT_METHOD(setCategory:(NSString *)category){
  AVAudioSession* audioSession = [AVAudioSession sharedInstance];
  NSString* categoryName = nil;
  if ([categoryName isEqual:@"Ambient"]) {
      category = AVAudioSessionCategoryAmbient;
  } else if ([categoryName isEqual:@"SoloAmbient"]) {
      category = AVAudioSessionCategorySoloAmbient;
  } else if ([categoryName isEqual:@"Playback"]) {
      category = AVAudioSessionCategoryPlayback;
  } else if ([categoryName isEqual:@"Record"]) {
      category = AVAudioSessionCategoryRecord;
  } else if ([categoryName isEqual:@"PlayAndRecord"]) {
      category = AVAudioSessionCategoryPlayAndRecord;
  }else if ([categoryName isEqual:@"AudioProcessing"]) {
    category = AVAudioSessionCategoryAudioProcessing;
  }
  else if ([categoryName isEqual:@"MultiRoute"]) {
      category = AVAudioSessionCategoryMultiRoute;
  }
  if (category){
    [audioSession setCategory:categoryName error:nil];
  }
  
  
}
//设置mode
RCT_EXPORT_METHOD(setMode:(NSString *) modeName){
  AVAudioSession* audioSession = [AVAudioSession sharedInstance];
  NSString* mode = nil;
  if ([mode isEqual:@"Default"]){
    mode = AVAudioSessionModeDefault;
  }
  else if([mode isEqual:@"VoiceChat"]){
    mode = AVAudioSessionModeVoiceChat;
  }
  else if([mode isEqual:@"GameChat"]){
    mode = AVAudioSessionModeGameChat;
  }
  //录制视频
  else if([mode isEqual:@"VideoRecording"]){
    mode = AVAudioSessionModeVideoRecording;
  }
  //播放视频
  else if([mode isEqual:@"MoviePlayback"]){
    mode = AVAudioSessionModeMoviePlayback;
  }
  else if([mode isEqual:@"Measurement"]){
    mode = AVAudioSessionModeMeasurement;
  }
  else if([mode isEqual:@"VideoChat"]){
    mode = AVAudioSessionModeVideoChat;
  }
  [audioSession setMode:mode error:nil];
}
//播放
RCT_EXPORT_METHOD(play:(nonnull NSNumber *) key withCallBack:(RCTResponseSenderBlock) callBack){
  AVAudioSession* audioSession = [AVAudioSession sharedInstance];
  //播放开始时，激活音频设置
  [audioSession setActive:YES error:nil];
  //开启设备监听
  [self setUpRouteChangeNotification];
  [self setUpInterruptChangeNotification];
  //设置当前播放的音频key
  self._key = key;
  //查找是否有player，并进行播放
  AVAudioPlayer* player = [self playerForKey:key];
  if (player){
    //配置他的回调，根据传来的
    [[self callBackPool]setObject:[callBack copy] forKey:key];
    [player play];
    callBack(@[@"sucess"]);
  }else{
    callBack(@[@"no player"]);
  }
}
//暂停
RCT_EXPORT_METHOD(pause:(nonnull NSNumber *) key withCallback:(RCTResponseSenderBlock) callBack){
  AVAudioPlayer* player = [self playerForKey:key];
  if (player){
    [player pause];
    //调用回调函数，暂停很普通，看看后期能不能用jsi进行通知
    callBack(@[]);
  }
}
//停止 停止播放并撤消系统播放所需的设置。
RCT_EXPORT_METHOD(realse:(nonnull NSNumber *) key withCallback:(RCTResponseSenderBlock) callBack){
  AVAudioPlayer* player = [self playerForKey:key];
  if (player){
    [player stop];
    [[self playerPool] removeObjectForKey:key];
    [[self callBackPool] removeObjectForKey:key];
    //移除监听
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    callBack(@[]);
  }
}

RCT_EXPORT_METHOD(stop:(nonnull NSNumber *)key withCallback:(RCTResponseSenderBlock) callBack){
  AVAudioPlayer* player =  [self playerForKey:key];
  if (player){
    [player stop];
    player.currentTime = 0;
    callBack(@[]);
  }
}


//路由变化监听函数
-(void)setUpRouteChangeNotification{
  [[NSNotificationCenter defaultCenter]addObserver:self
                                          selector:@selector(audioSessionRouterChangeObserver:)
                                              name:AVAudioSessionRouteChangeNotification
                                            object:nil ];
}
-(void)setUpInterruptChangeNotification{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(audioSessionInterruptChangeObserver:) name:AVAudioSessionInterruptionNotification
                                             object:nil];
}


@end

