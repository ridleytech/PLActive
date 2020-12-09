//
//  PlayKey.m
//  PianoLessons
//
//  Created by Randall Ridley on 7/2/20.
//

#import "React/RCTLog.h"
#import "PlayKey.h"

@implementation PlayKey

//https://www.indiegamemusic.com/help.php?id=3
//https://rollout.io/blog/building-a-midi-music-app-for-ios-in-swift/

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initGraph:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    @try{
      
      [self initGraph];
      
      resolve(@{ @"key": @"graph started" });
    }
    @catch(NSException *exception){
      reject(@"get_error",exception.reason, nil);
    }
  });
}

RCT_EXPORT_METHOD(playKey:(int)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    @try{
      
      [self playKey:key];
      
      resolve(@{ @"key played": [NSString stringWithFormat:@"%i %i",key, self->currentNote] });
    }
    @catch(NSException *exception){
      reject(@"get_error",exception.reason, nil);
    }
  });
}

- (void)playKey:(int)val {
  
  //OSStatus status = 0;
  
  //val = 3;
  currentOctave = 3;
  sustainValue = 0;
  
  MIDINoteMessage thisMessage;
  
  if (currentOctave == 1)
  {
    thisMessage.note = val + 12;
  }
  else if (currentOctave == 2)
  {
    thisMessage.note = val + 36;
  }
  else if (currentOctave == 3)
  {
    thisMessage.note = val + 60;
  }
  else if (currentOctave == 4)
  {
    thisMessage.note = val + 84;
  }
  else if (currentOctave == 5)
  {
    thisMessage.note = val + 108;
  }
  else if (currentOctave == 6)
  {
    thisMessage.note = val + 132;
  }
  else
  {
    thisMessage.note = val + 156;
  }
  
  //thisMessage.note = val + (currentOctave * 20);
  
  NSLog(@"thisMessage.note: %i",thisMessage.note);
  
  if (sustain)
  {
    thisMessage.duration = sustainValue;
  }
  else
  {
    thisMessage.duration = 0;
  }
  
  thisMessage.velocity = 90;
  thisMessage.releaseVelocity = 0;
  thisMessage.channel = 1;
  
  //NSLog(@"played on beat: %i",currentBeat);
  
  currentNote = thisMessage.note;
  
  NSLog(@"currentOctave: %i",currentOctave);
  NSLog(@"note: %i",(unsigned int)currentNote);
  
  UInt32 onVelocity = 90;
  UInt32 noteCommand = kMIDIMessage_NoteOn << 4 | 0;
  
  MusicDeviceMIDIEvent (_samplerUnit, noteCommand, thisMessage.note, onVelocity, 0);
}

RCT_EXPORT_METHOD(releaseKey:(int)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  
  if (currentOctave == 3)
  {
    key += 60;
  }
  else if (currentOctave == 2)
  {
    key += 36;
  }
  else if (currentOctave == 1)
  {
    key += 12;
  }
  else if (currentOctave == 4)
  {
    key += 84;
  }
  else if (currentOctave == 5)
  {
    key += 108;
  }
  else if (currentOctave == 6)
  {
    key += 132;
  }
  else
  {
    key += 156;
  }
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    @try{
      
      UInt32 noteCommand = kMIDIMessage_NoteOff << 4 | 0;
      MusicDeviceMIDIEvent (self->_samplerUnit, noteCommand, key, 90, 0);
      
      resolve(@{ @"key stopped": [NSString stringWithFormat:@"%i",key] });
    }
    @catch(NSException *exception){
      reject(@"get_error",exception.reason, nil);
    }
  });
}

#pragma mark - AUGraph

- (void)initGraph {
  
  if(_processingGraph)
  {
    NSLog(@"graph already started in xcode");
  }
  
  OSStatus status = 0;
  OSStatus result = noErr;
  
  NewAUGraph (&_processingGraph);
  
  AudioComponentDescription cd = {};
  cd.componentManufacturer     = kAudioUnitManufacturer_Apple;
  
  //----------------------------------------
  // Add 3 Sampler unit nodes to the graph
  //----------------------------------------
  
  cd.componentType = kAudioUnitType_MusicDevice;
  cd.componentSubType = kAudioUnitSubType_Sampler;
  
  AUGraphAddNode (_processingGraph, &cd, &samplerNode);
  
  AudioComponentDescription cd2 = {};
  cd2.componentManufacturer     = kAudioUnitManufacturer_Apple;
  
  cd2.componentType = kAudioUnitType_Mixer;
  cd2.componentSubType = kAudioUnitSubType_MultiChannelMixer;
  result = AUGraphAddNode (_processingGraph, &cd2, &mixerNode);
  NSCAssert (result == noErr, @"Unable to add the Output unit to the audio processing graph. Error code: %d '%.4s'", (int) result, (const char *)&result);
  
  AudioComponentDescription cd3 = {};
  cd3.componentManufacturer     = kAudioUnitManufacturer_Apple;
  cd3.componentType = kAudioUnitType_Output;
  cd3.componentSubType = kAudioUnitSubType_RemoteIO;  // Output to speakers
  
  AUGraphAddNode (_processingGraph, &cd3, &ioNode);
  
  AUGraphOpen (_processingGraph);
  
  //--------------------------------
  // Set the bus count for the mixer
  //--------------------------------
  
  const Float64 kGraphSampleRate = 44100.0;
  
  bool interleaved = true;
  int nChannels = 2;
  
  AudioStreamBasicDescription mClientFormat;
  
  //mClientFormat.SetCanonical(2, true);
  mClientFormat.mSampleRate = kGraphSampleRate;
  //mClientFormat.Print();
  mClientFormat.mFormatID = kAudioFormatLinearPCM;
#if CA_ENV_MACOSX
  int sampleSize = sizeof(Float32);
  mClientFormat.mFormatFlags = kAudioFormatFlagsNativeFloatPacked;
#else
  int sampleSize = sizeof(AudioSampleType);
  mClientFormat.mFormatFlags = kAudioFormatFlagsCanonical;
#endif
  mClientFormat.mBitsPerChannel = 8 * sampleSize;
  mClientFormat.mChannelsPerFrame = nChannels;
  mClientFormat.mFramesPerPacket = 1;
  if (interleaved)
    mClientFormat.mBytesPerPacket = mClientFormat.mBytesPerFrame = nChannels * sampleSize;
  else {
    mClientFormat.mBytesPerPacket = mClientFormat.mBytesPerFrame = sampleSize;
    mClientFormat.mFormatFlags |= kAudioFormatFlagIsNonInterleaved;
  }
  
  numBuses = 3;
  
  AudioUnitSetProperty(_mixerUnit,
                       kAudioUnitProperty_ElementCount,
                       kAudioUnitScope_Input,
                       0,
                       &numBuses,
                       sizeof(numBuses));
  
  OSStatus result2 = noErr;
  
  int estimatedSamplesPerBlock = 4096;
  
  result2 = AudioUnitSetProperty(_mixerUnit, kAudioUnitProperty_MaximumFramesPerSlice,
                              kAudioUnitScope_Global, 0, & estimatedSamplesPerBlock, sizeof(estimatedSamplesPerBlock));
  
  UInt32 prop1;
  UInt32 propSize1 = sizeof(prop1);
  
  AudioUnitGetProperty(_mixerUnit, kAudioUnitProperty_ElementCount, kAudioUnitScope_Input, 0, &prop1, &propSize1);
  
  NSLog(@"mixer bus count: %i",(unsigned int)prop1);
  
  AURenderCallbackStruct rcbs;
  rcbs.inputProc = &renderInput;
  rcbs.inputProcRefCon = &mUserData;
  
  result = AUGraphSetNodeInputCallback(_processingGraph, mixerNode, 2, &rcbs);
  
  AUGraphNodeInfo (_processingGraph, samplerNode, 0, &_samplerUnit);
  AUGraphNodeInfo (_processingGraph, ioNode, 0, &_ioUnit);
  AUGraphNodeInfo (_processingGraph, mixerNode, 0, &_mixerUnit);
  
  AUGraphConnectNodeInput (_processingGraph, samplerNode, 0, mixerNode, 1);
  
  result = AudioUnitSetParameter(_mixerUnit, kMultiChannelMixerParam_Volume, kAudioUnitScope_Input, 0, 1, 0);
  result = AudioUnitSetParameter(_mixerUnit, kMultiChannelMixerParam_Pan, kAudioUnitScope_Input, 0, 0, 0);
  
  result = AUGraphAddRenderNotify(_processingGraph, renderNotification, &mUserData);
  
  //[self initDefaultTracks];
  
  // Connect the mixer unit to the output unit
  
  AUGraphConnectNodeInput (_processingGraph, mixerNode, 0, ioNode, 0);
  
  AUGraphInitialize (_processingGraph);
  
  AUGraphStart(_processingGraph);
  
  [self initDefaultSounds];
}

- (void)initDefaultSounds {
  
  // Load the second instrument - sampler
  
  [self loadSoundFont:@"Chateau Grand-v1.8" withPatch:0 withBank:kAUSampler_DefaultMelodicBankMSB withSampler:_samplerUnit];
}

#pragma mark - Render Notifcations

static void SilenceData(AudioBufferList *inData) {
  
  for (UInt32 i = 0; i < inData->mNumberBuffers; i++)
  {
    memset(inData->mBuffers[i].mData, 0, inData->mBuffers[i].mDataByteSize);
  }
}

static OSStatus renderInput(void *inRefCon,
                            AudioUnitRenderActionFlags *ioActionFlags,
                            const AudioTimeStamp *inTimeStamp,
                            UInt32 inBusNumber,
                            UInt32 inNumberFrames,
                            AudioBufferList *ioData)
{
  SourceAudioBufferDataPtr userData = (SourceAudioBufferDataPtr)inRefCon;
  
  AudioSampleType *in = userData->soundBuffer[inBusNumber].data;
  AudioSampleType *out = (AudioSampleType *)ioData->mBuffers[0].mData;
  
  //NSLog(@"inBusNumber: %i",(unsigned int)inBusNumber);
  //NSLog(@"inNumberFrames: %i",(unsigned int)inNumberFrames);
  
  UInt32 sample = userData->frameNum * userData->soundBuffer[inBusNumber].asbd.mChannelsPerFrame;
  
  //sample = do_3band(&eq,sample);
  
  //NSLog(@"sample: %i",(unsigned int)sample);
  
  // make sure we don't attempt to render more data than we have available in the source buffers
  // if one buffer is larger than the other, just render silence for that bus until we loop around again
  
  if ((userData->frameNum + inNumberFrames) > userData->soundBuffer[inBusNumber].numFrames) {
    
    UInt32 offset = (userData->frameNum + inNumberFrames) - userData->soundBuffer[inBusNumber].numFrames;
    
    if (offset < inNumberFrames)
    {
      // copy the last bit of source
      
      SilenceData(ioData);
      memcpy(out, &in[sample], ((inNumberFrames - offset) * userData->soundBuffer[inBusNumber].asbd.mBytesPerFrame));
      return noErr;
    }
    else
    {
      // we have no source data
      
      SilenceData(ioData);
      *ioActionFlags |= kAudioUnitRenderAction_OutputIsSilence;
      return noErr;
    }
  }
  
  memcpy(out, &in[sample], ioData->mBuffers[0].mDataByteSize);
  
  //printf("render input bus %ld from sample %ld\n", inBusNumber, sample);
  
  return noErr;
}

// the render notification is used to keep track of the frame number position in the source audio
// line 236

static OSStatus renderNotification(void *inRefCon,
                                   AudioUnitRenderActionFlags *ioActionFlags,
                                   const AudioTimeStamp *inTimeStamp,
                                   UInt32 inBusNumber,
                                   UInt32 inNumberFrames,
                                   AudioBufferList *ioData) {
  
  SourceAudioBufferDataPtr userData = (SourceAudioBufferDataPtr)inRefCon;
  
  if (*ioActionFlags & kAudioUnitRenderAction_PostRender) {
    
    //printf("post render notification frameNum %ld inNumberFrames %ld\n", userData->frameNum, inNumberFrames);
    
    userData->frameNum += inNumberFrames;
    
    if (userData->frameNum >= userData->maxNumFrames)
    {
      userData->frameNum = 0;
    }
  }
  
  return noErr;
}

#pragma mark - Load SoundFont

- (void)loadSoundFont: (NSString*) path withPatch: (int) patch withBank: (UInt8) bank withSampler: (AudioUnit) sampler {
  
  //NSLog(@"Sound font: %@", path);
  
  NSURL *presetURL = [[NSURL alloc] initFileURLWithPath:[[NSBundle mainBundle] pathForResource:path ofType:@"sf2"]];
  [self loadFromDLSOrSoundFont:(NSURL *)presetURL withBank:bank withPatch:patch withSampler:sampler];
  [presetURL relativePath];
}

- (OSStatus)loadFromDLSOrSoundFont: (NSURL *)bankURL withBank: (UInt8) bank withPatch: (int)presetNumber withSampler: (AudioUnit) sampler {
  OSStatus result = noErr;
  OSStatus result2 = noErr;
  
  AUSamplerBankPresetData bpdata;
  bpdata.bankURL  = (__bridge CFURLRef) bankURL;
  bpdata.bankMSB  = bank;
  bpdata.bankLSB  = kAUSampler_DefaultBankLSB;
  bpdata.presetID = (UInt8) presetNumber;

  result = AudioUnitSetProperty(sampler,
                                kAUSamplerProperty_LoadPresetFromBank,
                                kAudioUnitScope_Global,
                                0,
                                &bpdata,
                                sizeof(bpdata));
  
  int estimatedSamplesPerBlock = 4096;
  
  result2 = AudioUnitSetProperty(sampler, kAudioUnitProperty_MaximumFramesPerSlice,
                              kAudioUnitScope_Global, 0, & estimatedSamplesPerBlock, sizeof(estimatedSamplesPerBlock));
         

  
  NSCAssert (result == noErr,@"Unable to set the preset property on the Sampler. Error code:%d '%.4s'",(int) result,(const char *)&result);
  
  return result;
}
@end
