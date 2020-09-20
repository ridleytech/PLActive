import React, {useEffect, useState, lazy} from 'react';
import {
  Text,
  Button,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
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
//import styles from './styles';
import CheckBox from 'react-native-check-box';
import data from '../data/questions.json';
import enabledImg from '../../images/checkbox-enabled.png';
import disabledImg from '../../images/checkbox-disabled.png';

import playImg from '../../images/play-btn2.png';
import pauseImg from '../../images/pause-btn2.png';

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

//console.log('data: ' + JSON.stringify(data));

const shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

var questions = shuffle(data.Interval.level2Questions);
var answersData = shuffle(data.Interval.level2Answers);
//var questions = data.Interval.level2Questions;

//console.log('questions: ' + JSON.stringify(questions));

var question = questions[0];

console.log('question: ' + JSON.stringify(question));

const PlayerAudio = () => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [loadCount, setLoadCount] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [addingTrack, setAddingTrack] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionInd, setCurrentQuestionInd] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // const [questionList] = useState([
  //   'major2ndC',
  //   'major3rdC',
  //   'perfect4thC',
  //   'perfect5thC',
  // ]);
  const [questionList] = useState(questions);
  const [answerList, setAnswerList] = useState([]);
  const [answers, setAnswers] = useState(answersData);

  const [currentTrack, setCurrentTrack] = useState({
    name: questions[0].file,
    id: questions[0].id,
  });
  const {position, duration} = useTrackPlayerProgress(150);

  const nextQuestion = () => {
    var currentQuestion1 = currentQuestionInd;

    if (currentQuestion1 < questionList.length - 1) {
      setAddingTrack(true);

      currentQuestion1 += 1;

      TrackPlayer.reset();

      setCurrentTrack({
        name: questionList[currentQuestion1].file,
        id: currentQuestion1.toString(),
      });

      setCurrentQuestionInd(currentQuestion1);

      var answersData = shuffle(data.Interval.level2Answers);
      setAnswers(answersData);
    } else {
      setQuizFinished(true);
      setQuizStarted(false);
    }

    // setAddingTrack(true);

    // var currentQuestion1 = currentQuestionInd;
    // currentQuestion1 += 1;

    // TrackPlayer.reset();

    // setCurrentTrack({
    //   name: questionList[currentQuestion1].file,
    //   id: currentQuestion1.toString(),
    // });

    // setCurrentQuestionInd(currentQuestion1);
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

  const setChecked = (ob) => {
    if (ob === currentAnswer) {
      setCurrentAnswer(null);

      // this.setState({
      //   currentAnswer: null,
      // });
    } else {
      // this.setState({
      //   currentAnswer: ob,
      // });
      setCurrentAnswer(ob);
    }

    console.log('ob: ' + JSON.stringify(ob));
    // console.log(
    //   'current answer: ' + JSON.stringify(currentQuestion.Answer),
    // );
  };

  const selectAnswer2 = () => {
    var al = answerList.slice();

    console.log('al: ' + JSON.stringify(al));

    var currentQuestion = questionList[currentQuestionInd];
    currentQuestion.userAnswer = currentAnswer;

    if (currentAnswer === questionList[currentQuestionInd].Answer) {
      var ca = correctAnswers;
      ca++;
      setCorrectAnswers(ca);
      console.log('correct');
    } else {
      console.log('not');
    }

    al.push(questionList[currentQuestionInd]);

    setCurrentAnswer(null);
    setAnswerList(al);

    nextQuestion();
  };

  const getQuestion = () => {
    var ci = currentQuestionInd;

    if (ci < questionList.length - 1) {
      ci++;

      console.log('ci: ' + ci);

      var question = questionList[ci];

      this.setState({
        currentQuestion: question,
        currentQuestionInd: ci,
      });
    } else {
      this.setState({
        quizFinished: true,
        quizStarted: false,
      });
    }

    //this.createAnswers();
  };

  return (
    <>
      <View style={styles.mainContainer}>
        {/* <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={onButtonPressed}
          style={styles.playButton}
          disabled={!isTrackPlayerInit}
          color="#000000"
        /> */}
        <View
          style={{
            padding: 20,
            // backgroundColor: 'yellow',
          }}>
          <Text
            style={{
              fontFamily: 'Helvetica Neue',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Quiz - Interval Training Level 2
          </Text>
          <Text
            style={{
              fontFamily: 'Helvetica Neue',
              fontSize: 15,
              marginTop: 15,
            }}>
            Question {currentQuestionInd + 1} of {questionList.length}
          </Text>
          <Text
            style={{
              marginTop: 30,
              marginBottom: 20,
              fontFamily: 'Helvetica Neue',
            }}>
            {questionList[currentQuestionInd]
              ? questionList[currentQuestionInd].Question
              : null}
          </Text>

          <View
            style={{
              backgroundColor: '#222222',
              marginLeft: 'auto',
              marginRight: 'auto',
              paddingLeft: 20,
              paddingRight: 20,
              marginBottom: 20,
              marginTop: 10,
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={onButtonPressed}
                style={{marginRight: 20}}>
                {isPlaying ? (
                  <Image source={pauseImg} />
                ) : (
                  <Image source={playImg} />
                )}
              </TouchableOpacity>

              <Slider
                width="85%"
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
            {answers
              ? answers.map((ob, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        height: 65,
                        backgroundColor: '#EFEFEF',
                        marginBottom: 15,
                        borderRadius: 8,
                        overflow: 'hidden',
                        alignContent: 'center',
                        paddingLeft: 18,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <CheckBox
                        style={{paddingRight: 10}}
                        onClick={() => {
                          setChecked(ob);
                        }}
                        isChecked={currentAnswer === ob}
                        checkedImage={
                          <Image source={enabledImg} style={styles.enabled} />
                        }
                        unCheckedImage={
                          <Image source={disabledImg} style={styles.disabled} />
                        }
                      />
                      <Text key={ob}>{ob}</Text>
                    </View>
                  );
                })
              : null}
          </View>
        </View>
        {/* <Button
        title={'Remove Track'}
        onPress={removeTrack}
        style={styles.playButton}
        disabled={!isTrackPlayerInit}
        color="#000000"
      /> */}
      </View>
      <TouchableOpacity
        onPress={() => selectAnswer2()}
        disabled={!currentAnswer}
        style={{
          height: 60,
          backgroundColor: currentAnswer ? '#3AB24A' : 'gray',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}>
        <Text
          style={{
            fontSize: 25,
            fontFamily: 'Helvetica Neue',
            fontWeight: 'bold',
            color: 'white',
          }}>
          SUBMIT
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default PlayerAudio;

let offset = 100;

const styles = StyleSheet.create({
  controlsContainer: {
    width: '80%',
    justifyContent: 'flex-start',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  checkbox: {
    alignSelf: 'center',
  },
  previewBtn: {
    marginTop: 50,
  },
  whiteKeys: {
    marginTop: 140,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  blackKeys: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon2: {
    position: 'absolute',
    left: 30 + offset,
    zIndex: 1,
  },
  icon3: {
    position: 'absolute',
    left: 78 + offset,
    zIndex: 1,
  },
  icon4: {
    position: 'absolute',
    left: 173 + offset,
    zIndex: 1,
  },
  icon5: {
    position: 'absolute',
    left: 222 + offset,
    zIndex: 1,
  },
  icon6: {
    position: 'absolute',
    left: 270 + offset,
    zIndex: 1,
  },
  above: {
    position: 'absolute',
    left: 320,
    zIndex: 3,
  },
});
