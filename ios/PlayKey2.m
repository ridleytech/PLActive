//
//  PlayKey2.m
//  PianoLessons
//
//  Created by Randall Ridley on 9/17/20.
//

#import "React/RCTLog.h"
#import "PlayKey2.h"

@implementation PlayKey2

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initGraph2:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    @try{
      
      [self initGraph];
      
      resolve(@{ @"key": @"graph started2" });
    }
    @catch(NSException *exception){
      reject(@"get_error",exception.reason, nil);
    }
  });
}

- (void) initGraph {
  
  OSStatus result = noErr;
  
  //Then, specify the common portion of an audio unit's identify, used for all audio units in the graph.

  AudioComponentDescription cd = {};
  cd.componentManufacturer = kAudioUnitManufacturer_Apple;
  //Instantiate an audio processing graph.

  result = NewAUGraph (&_processingGraph);
  NSCAssert (result == noErr, @"Unable to create an AUGraph object. Error code: %d '%.4s'", (int) result, (const char *)&result);
  //Next, you need to specify the sampler unit to be used as the first node of the graph.

  cd.componentType = kAudioUnitType_MusicDevice;
  cd.componentSubType = kAudioUnitSubType_Sampler;
  //Now, create a new sampler node, and check for errors.

  result = AUGraphAddNode (_processingGraph, &cd, &samplerNode);
  NSCAssert (result == noErr, @"Unable to add the Sampler unit to the audio processing graph. Error code: %d '%.4s'", (int) result, (const char *)&result);
  
  //Specify the Output unit, to be used as the second and final node of the graph - and add the Output unit node to the graph.

  cd.componentType = kAudioUnitType_Output;
  cd.componentSubType = kAudioUnitSubType_RemoteIO;
  result = AUGraphAddNode (_processingGraph, &cd, &ioNode);
  NSCAssert (result == noErr, @"Unable to add the Output unit to the audio processing graph. Error code: %d '%.4s'", (int) result, (const char *)&result);
  //Add the mixer unit to the graph.

  cd.componentType = kAudioUnitType_Mixer;
  cd.componentSubType = kAudioUnitSubType_MultiChannelMixer;
  result = AUGraphAddNode (_processingGraph, &cd, &mixerNode);
  NSCAssert (result == noErr, @"Unable to add the Output unit to the audio processing graph. Error code: %d '%.4s'", (int) result, (const char *)&result);
  //Finally, open the graph.

  result = AUGraphOpen (_processingGraph);
  NSCAssert (result == noErr, @"Unable to open the audio processing graph. Error code: %d '%.4s'", (int) result, (const char *)&result);
  //Now that the graph is open, you can get references to all the nodes and store them as audio units.

  //First, get a reference to the sampler node and store it in the samplerUnit variable.

  result = AUGraphNodeInfo (_processingGraph, samplerNode, 0, &_samplerUnit);
  NSCAssert (result == noErr, @"Unable to obtain a reference to the Sampler unit. Error code: %d '%.4s'", (int) result, (const char *)&result);
  //Now load a soundfont into the mixer unit.

  [self loadSoundFont:@"Chateau Grand-v1.8" withPatch:1 withBank:kAUSampler_DefaultMelodicBankMSB withSampler:_samplerUnit];
  //Now create a new mixer unit. This is necessary because if we want to have more than one.

  result = AUGraphNodeInfo (_processingGraph, mixerNode, 0, &_mixerUnit);
  NSCAssert (result == noErr, @"Unable to obtain a reference to the Sampler unit. Error code: %d '%.4s'", (int) result, (const char *)&result);
  //Rest needs


      // Obtain a reference to the I/O unit from its node
      result = AUGraphNodeInfo (_processingGraph, ioNode, 0, &_ioUnit);
      NSCAssert (result == noErr, @"Unable to obtain a reference to the I/O unit. Error code: %d '%.4s'", (int) result, (const char *)&result);
       
      // Define the number of input busses on the mixer unit
      UInt32 busCount = 1;
       
      // Set the input channels property on the mixer unit
      result = AudioUnitSetProperty (
      _mixerUnit,
      kAudioUnitProperty_ElementCount,
      kAudioUnitScope_Input,
      0,
      &busCount,
      sizeof (busCount)
      );
      NSCAssert (result == noErr, @"AudioUnitSetProperty Set mixer bus count. Error code: %d '%.4s'", (int) result, (const char *)&result);
       
      // Connect the sampler unit to the mixer unit
      result = AUGraphConnectNodeInput(_processingGraph, samplerNode, 0, mixerNode, 0);
       
      // Set the volume of the channel
      AudioUnitSetParameter(_mixerUnit, kMultiChannelMixerParam_Volume, kAudioUnitScope_Input, 0, 1, 0);
       
      NSCAssert (result == noErr, @"Couldn't connect speech synth unit output (0) to mixer input (1). Error code: %d '%.4s'", (int) result, (const char *)&result);
       
      // Connect the output of the mixer node to the input of he io node
      result = AUGraphConnectNodeInput (_processingGraph, mixerNode, 0, ioNode, 0);
      NSCAssert (result == noErr, @"Unable to interconnect the nodes in the audio processing graph. Error code: %d '%.4s'", (int) result, (const char *)&result);
       
      // Print a graphic version of the graph
      CAShow(_processingGraph);
       
      // Start the graph
      result = AUGraphInitialize (_processingGraph);
       
      NSAssert (result == noErr, @"Unable to initialze AUGraph object. Error code: %d '%.4s'", (int) result, (const char *)&result);
       
      // Start the graph
      result = AUGraphStart (_processingGraph);
      NSAssert (result == noErr, @"Unable to start audio processing graph. Error code: %d '%.4s'", (int) result, (const char *)&result);
       
      // Play middle c on the sampler - sampler unit to send the command to, midi command i.e. note on, note number, velocity
  
  //[NSTimer scheduledTimerWithTimeInterval:5.0 target:self selector:@selector(playNotes:) userInfo:nil repeats:NO];
}

- (void)playNotes:(NSTimer*)timer {
  
  NSLog(@"playNotes");
  
  MusicDeviceMIDIEvent(_samplerUnit, 0x90, 60, 127, 0);
}

-(void) loadSoundFont: (NSString*) path withPatch: (int) patch withBank: (UInt8) bank withSampler: (AudioUnit) sampler {
 
NSLog(@"Sound font: %@", path);
 
NSURL *presetURL = [[NSURL alloc] initFileURLWithPath:[[NSBundle mainBundle] pathForResource:path ofType:@"sf2"]];
[self loadFromDLSOrSoundFont: (NSURL *)presetURL withBank: bank withPatch: patch withSampler:sampler];
[presetURL relativePath];
//[presetURL release];
}
 
// Load a SoundFont into a sampler
-(OSStatus) loadFromDLSOrSoundFont: (NSURL *)bankURL withBank: (UInt8) bank withPatch: (int)presetNumber withSampler: (AudioUnit) sampler {
OSStatus result = noErr;
 
// fill out a bank preset data structure
AUSamplerBankPresetData bpdata;
  bpdata.bankURL = (__bridge CFURLRef) bankURL;
bpdata.bankMSB = bank;
bpdata.bankLSB = kAUSampler_DefaultBankLSB;
bpdata.presetID = (UInt8) presetNumber;
 
// set the kAUSamplerProperty_LoadPresetFromBank property
result = AudioUnitSetProperty(sampler,
kAUSamplerProperty_LoadPresetFromBank,
kAudioUnitScope_Global,
0,
&bpdata,
sizeof(bpdata));
 
// check for errors
NSCAssert (result == noErr,
@"Unable to set the preset property on the Sampler. Error code:%d '%.4s'",
(int) result,
(const char *)&result);
 
return result;
}

@end
