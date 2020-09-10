import React, {useEffect, useState, lazy} from 'react';
import {Text, Button, View, Image} from 'react-native';
import TrackPlayer, {
  TrackPlayerEvents,
  STATE_PLAYING,
  STATE_PAUSED,
} from 'react-native-track-player';
import {
  useTrackPlayerProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player/lib/hooks';
import Slider from '@react-native-community/slider';
import styles from './styles';
import track from '../../images/black.png';

// const songDetails = {
//   id: '1',
//   url: require('../audio/golf.mp3'),
//   title: 'The Greatest Song',
//   album: 'Great Album',
//   artist: 'A Great Dude',
//   artwork: 'https://picsum.photos/300',
// };

//https://therohanbhatia.com/blog/music-player-app-using-react-native-hooks/

const songDetails = {
  id: '1',
  url: require('../audio/major2ndC.mp3'),
  title: 'Major 2nd',
  album: 'Piano Lesson with Warren',
  artist: 'Randall Ridley',
  artwork: 'https://picsum.photos/300',
};

const tracks = {
  major2ndC: require('../audio/major2ndC.mp3'),
  major3rdC: require('../audio/major3rdC.mp3'),
  perfect4thC: require('../audio/perfect4thC.mp3'),
  perfect5thC: require('../audio/perfect5thC.mp3'),
};

const trackSelect = (track) => {
  if (track === null) {
    return tracks.major2ndC;
  }

  const tracksArray = {
    major2ndC: tracks.major2ndC,
    major3rdC: tracks.major3rdC,
    perfect4thC: tracks.perfect4thC,
    perfect5thC: tracks.perfect5thC,
  };

  return tracksArray[track];
};

const trackPlayerInit = async () => {
  await TrackPlayer.setupPlayer();
  TrackPlayer.updateOptions({
    stopWithApp: true,
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_JUMP_FORWARD,
      TrackPlayer.CAPABILITY_JUMP_BACKWARD,
    ],
  });

  return true;
};

const Player3 = () => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [loadCount, setLoadCount] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [addingTrack, setAddingTrack] = useState(false);
  const [currentQuestionInd, setCurrentQuestionInd] = useState(0);
  const [questionList] = useState([
    'major2ndC',
    'major3rdC',
    'perfect4thC',
    'perfect5thC',
  ]);
  const [currentTrack, setCurrentTrack] = useState({
    name: 'major2ndC',
    id: '1',
  });
  const {position, duration} = useTrackPlayerProgress(150);

  const nextQuestion = () => {
    setAddingTrack(true);

    var currentQuestion1 = currentQuestionInd;
    currentQuestion1 += 1;

    TrackPlayer.reset();

    setCurrentTrack({
      name: questionList[currentQuestion1],
      id: currentQuestion1.toString(),
    });

    setCurrentQuestionInd(currentQuestion1);
  };

  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
    };
    startPlayer();

    console.log('on load');
    console.log('loadCount: ' + loadCount);

    var lc = loadCount;
    lc++;
    setLoadCount(lc);
  }, []);

  useEffect(() => {
    if (loadCount === 0) {
      setAddingTrack(true);
    } else {
      setAddingTrack(false);
    }
  }, [loadCount]);

  useEffect(() => {
    console.log('currentQuestion changed: ' + currentTrack.name);
  }, [currentQuestionInd]);

  useEffect(() => {
    console.log('addingTrack changed: ' + addingTrack);

    if (addingTrack === true) {
      console.log('track added');
      TrackPlayer.add({
        id: currentQuestionInd.toString(),
        url: trackSelect(currentTrack.name),
        type: 'default',
        title: songDetails.title,
        album: songDetails.album,
        artist: songDetails.artist,
        artwork: songDetails.artwork,
      });

      setAddingTrack(false);
    }
  }, [addingTrack]);

  useEffect(() => {
    console.log('currentTrack changed');

    // console.log('add track: ' + currentTrack.name);
  }, [currentTrack]);

  //default code below this line

  //this hook updates the value of the slider whenever the current position of the song changes
  useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);

      //console.log('position: ' + position + ' duration: ' + duration);
    }
  }, [position, duration]);

  //setTimeout(addTrack, 1000);

  //setup 1st track
  // useEffect(() => {
  //   setTimeout(() => {
  //     TrackPlayer.seekTo(0);
  //     setSliderValue(0);
  //   }, 1000);
  // }, [currentTrack]);

  useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], (event) => {
    //console.log(event);
    if (event.state === STATE_PLAYING) {
      setIsPlaying(true);
    }
    // else if (event.state === STATE_PAUSED) {
    //   TrackPlayer.stop();
    // }
    else {
      console.log('paused');
      setIsPlaying(false);
      if (position / duration > 0.9) {
        console.log('reset track ' + currentTrack.name);
        TrackPlayer.seekTo(0);
        setSliderValue(0);
      }
    }
  });

  const onButtonPressed = () => {
    if (!isPlaying) {
      TrackPlayer.play();
      //setIsPlaying(true);
    } else {
      TrackPlayer.pause();
      //setIsPlaying(false);
    }
  };

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async (value) => {
    await TrackPlayer.seekTo(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          backgroundColor: '#222222',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '80%',
        }}>
        <View style={styles.controlsContainer}>
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={1}
            value={sliderValue}
            minimumTrackTintColor="#16ADE5"
            maximumTrackTintColor="#707070"
            onSlidingStart={slidingStarted}
            onSlidingComplete={slidingCompleted}
            thumbTintColor="#00000000"
            //trackImage={track}
          />
        </View>
      </View>

      <View>
        <Text>Question {currentQuestionInd}</Text>
      </View>

      <Button
        title={'Submit'}
        onPress={nextQuestion}
        style={styles.playButton}
        disabled={!isTrackPlayerInit}
        color="#000000"
      />

      <Button
        title={isPlaying ? 'Pause' : 'Play'}
        onPress={onButtonPressed}
        style={styles.playButton}
        disabled={!isTrackPlayerInit}
        color="#000000"
      />

      {/* <Button
        title={'Remove Track'}
        onPress={removeTrack}
        style={styles.playButton}
        disabled={!isTrackPlayerInit}
        color="#000000"
      /> */}
    </View>
  );
};

export default Player3;
