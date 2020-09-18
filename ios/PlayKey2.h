//
//  PlayKey2.h
//  PianoLessons
//
//  Created by Randall Ridley on 9/17/20.
//

#import <Foundation/Foundation.h>
#import <AudioToolbox/MusicPlayer.h>
#import <AudioToolbox/AudioToolbox.h>
#import "React/RCTBridgeModule.h"

NS_ASSUME_NONNULL_BEGIN

@interface PlayKey2 : NSObject <RCTBridgeModule> {
  
  AUNode ioNode, mixerNode, samplerNode;
  AUGraph _processingGraph;

  AudioUnit _samplerUnit,_mixerUnit,_ioUnit;
}



@end

NS_ASSUME_NONNULL_END
