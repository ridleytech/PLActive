//
//  PlayKey.h
//  PianoLessons
//
//  Created by Randall Ridley on 7/2/20.
//

#import <Foundation/Foundation.h>
#import <AudioToolbox/MusicPlayer.h>
#import <AudioToolbox/AudioToolbox.h>
#import <UIKit/UIKit.h>
#import "React/RCTBridgeModule.h"

NS_ASSUME_NONNULL_BEGIN

enum {
  kMIDIMessage_NoteOn    = 0x9,
  kMIDIMessage_NoteOff   = 0x8,
};

typedef struct {
  
  AudioStreamBasicDescription asbd;
  AudioSampleType *data;
  UInt32 numFrames;
  
} SoundBuffer, *SoundBufferPtr;


#define MAXBUFS  12
#define NUMFILES 12

typedef struct {
  
  UInt32 frameNum;
  UInt32 maxNumFrames;
  SoundBuffer soundBuffer[MAXBUFS];
  
} SourceAudioBufferData, *SourceAudioBufferDataPtr;


@interface PlayKey : NSObject <RCTBridgeModule> {
  
  AudioUnit _ioUnit, _mixerUnit, _samplerUnit, _kickUnit, _samplerRevUnit, _kickRevUnit, _eqUnit, _compUnit, _limiterUnit,_vocalUnit;
  
  AUNode ioNode, mixerNode, samplerNode, kickNode, eqNode, compNode, limiterNode, samRevNode, kickRevNode, lowNode, midNode, highNode,vocalNode;
  
  MusicSequence currentSequence;
  UInt32 currentTrackInd;
  MusicTrack currentTrack;
  int currentOctave;
  bool sustain;
  int sustainValue;
  int currentNote;
  AUGraph _processingGraph;
  UInt32 numBuses;
  bool graphStarted;
  
  SourceAudioBufferData mUserData;
}



@end

NS_ASSUME_NONNULL_END
