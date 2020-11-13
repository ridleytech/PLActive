import React, {useEffect, useState} from 'react';
import {
  Text,
  Button,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  NativeModules,
  Keyboard,
  AsyncStorage,
} from 'react-native';
import TrackPlayer, {
  TrackPlayerEvents,
  STATE_PLAYING,
  STATE_PAUSED,
} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';

import {
  useTrackPlayerProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player/lib/hooks';
import Slider from '@react-native-community/slider';
//import styles from './styles';
import data from '../data/questions.json';
import playImg from '../../images/play-btn2.png';
import pauseImg from '../../images/pause-btn2.png';
import Instructions from './Instructions';
import ResultsView from './ResultsView';
import {TextInput} from 'react-native-gesture-handler';
import WhiteIcon from '../../images/blank.jpg';
import GreenIcon from '../../images/blank-green.png';
import BlackIcon from '../../images/black.png';
import BlackGreenIcon from '../../images/black-green.png';
//import {AsyncStorage} from 'react-native-community/async-storage';
import {saveProgress} from '../thunks/';

var testView = NativeModules.PlayKey;

const tracks = {
  A: require('../../assets/audio/A.mp3'),
  A2: require('../../assets/audio/A2.mp3'),
  B: require('../../assets/audio/B.mp3'),
  B2: require('../../assets/audio/B2.mp3'),
  C: require('../../assets/audio/C.mp3'),
  C2: require('../../assets/audio/C2.mp3'),
  D: require('../../assets/audio/D.mp3'),
  D2: require('../../assets/audio/D2.mp3'),
  E: require('../../assets/audio/E.mp3'),
  E2: require('../../assets/audio/E2.mp3'),
  F: require('../../assets/audio/F.mp3'),
  F2: require('../../assets/audio/F2.mp3'),
  G: require('../../assets/audio/G.mp3'),
  G2: require('../../assets/audio/G2.mp3'),
  Db: require('../../assets/audio/Db.mp3'),
  Eb: require('../../assets/audio/Eb.mp3'),
  Gb: require('../../assets/audio/Gb.mp3'),
  Ab: require('../../assets/audio/Ab.mp3'),
  Bb: require('../../assets/audio/Bb.mp3'),
};

// const tracks = {
//   A: require('../../assets/audio/A.mp3'),
//   A2: require('../../assets/audio/A2.mp3'),
//   B: require('../../assets/audio/B.mp3'),
//   B2: require('../../assets/audio/B2.mp3'),
//   C: require('../../assets/audio/C.mp3'),
//   C2: require('../../assets/audio/C2.mp3'),
//   D: require('../../assets/audio/D.mp3'),
//   D2: require('../../assets/audio/D2.mp3'),
//   E: require('../../assets/audio/E.mp3'),
//   E2: require('../../assets/audio/E2.mp3'),
//   F: require('../../assets/audio/F.mp3'),
//   F2: require('../../assets/audio/F2.mp3'),
//   G: require('../../assets/audio/G.mp3'),
//   G2: require('../../assets/audio/G2.mp3'),
//   Db: require('../../assets/audio/Db.mp3'),
//   Eb: require('../../assets/audio/Eb.mp3'),
//   Gb: require('../../assets/audio/Gb.mp3'),
//   Ab: require('../../assets/audio/Ab.mp3'),
//   Bb: require('../../assets/audio/Bb.mp3'),
// };

const trackSelect = (track) => {
  if (track === null) {
    return tracks.A;
  }

  const tracksArray = {
    A: tracks.A,
    A2: tracks.A2,
    B: tracks.B,
    B2: tracks.B2,
    C: tracks.C,
    C2: tracks.C2,
    D: tracks.D,
    D2: tracks.D2,
    E: tracks.E,
    E2: tracks.E2,
    F: tracks.F,
    F2: tracks.F2,
    G: tracks.G,
    G2: tracks.G2,
    Db: tracks.Db,
    Eb: tracks.Eb,
    Gb: tracks.Gb,
    Ab: tracks.Ab,
    Bb: tracks.Bb,
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

//console.log('instructions level 3: ' + JSON.stringify(instructions));

//var question = questions[0];

// console.log('question: ' + JSON.stringify(question));

const PitchLevels = ({level, mode}) => {
  const dispatch = useDispatch();

  //console.log('selectedLevel: ' + level);

  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [loadCount, setLoadCount] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionInd, setCurrentQuestionInd] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(null);
  const [questionList, setQuestionList] = useState(null);
  const [answerList, setAnswerList] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [instructions, setInstructions] = useState(null);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [trackFile, setTrackFile] = useState(null);

  const {position, duration} = useTrackPlayerProgress(150);
  const [restarted, setRestarted] = useState(true);
  const opacity = useState(new Animated.Value(0))[0];

  const [answerState, setAnswerState] = useState('#E2E7ED');
  const [canAnswer, setCanAnswer] = useState(false);
  const [keyStates, setKeyStates] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const isTrial = useSelector((state) => state.isTrial);

  Animated.timing(opacity, {
    toValue: 1,
    duration: 1500,
    useNativeDriver: false,
  }).start();

  const nextQuestion = () => {
    var currentQuestion1 = currentQuestionInd;

    if (currentQuestion1 < questionList.length - 1) {
      currentQuestion1 += 1;

      //TrackPlayer.reset();

      setCurrentTrack({
        name: questionList[currentQuestion1].file,
        id: currentQuestion1.toString(),
      });

      setCurrentQuestionInd(currentQuestion1);
      populateAnswers(questionList, currentQuestion1);
    } else {
      setQuizFinished(true);
      setQuizStarted(false);
    }
  };

  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
    };
    startPlayer();

    TrackPlayer.reset();

    console.log('on load pitch');
    console.log('loadCount pitch: ' + loadCount);

    var lc = loadCount;
    lc++;
    setLoadCount(lc);

    var instructions; // = data.Pitch.level3Instructions;

    if (level == 1) {
      instructions = shuffle(data.Pitch.level1Instructions);
    } else if (level == 2) {
      instructions = shuffle(data.Pitch.level2Instructions);
    } else if (level == 3) {
      instructions = shuffle(data.Pitch.level3Instructions);
    } else if (level == 4) {
      instructions = shuffle(data.Pitch.level4Instructions);
    } else if (level == 5) {
      instructions = shuffle(data.Pitch.level5Instructions);
    }

    setInstructions(instructions);
  }, []);

  //console.log('height: ' + Dimensions.get('screen').height);

  useEffect(() => {
    if (currentTrack) {
      console.log('currentQuestion changed: ' + currentTrack.name);

      // const startPlayer = async () => {
      //   let isInit = await trackPlayerInit();
      //   setIsTrackPlayerInit(isInit);
      // };
      // startPlayer();
    }
  }, [currentQuestionInd]);

  useEffect(() => {
    if (quizFinished) {
      console.log('quiz finished');

      console.log(`ca: ${correctAnswers} total: ${questionList.length}`);

      var per = parseInt((correctAnswers / questionList.length) * 100);

      console.log(`per levels: ${per}`);

      if (per >= 85) {
        console.log('store data');

        dispatch({
          type: 'SET_PITCH_PROGRESS',
          level: {highestCompletedPitchLevel: level.toString()},
        });

        storeData(level);
      }
    }
  }, [quizFinished]);

  useEffect(
    () => () => {
      console.log('unmount');
      TrackPlayer.destroy();
    },
    [],
  );

  const addSongData = async (list) => {
    console.log('song data length pitch: ' + list.length);
    await TrackPlayer.add(list);
  };

  const nextTrack = async () => {
    await TrackPlayer.skipToNext();
    TrackPlayer.pause();
  };

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

      //console.log('prog: ' + position / duration);

      if (position / duration > 0.95) {
        TrackPlayer.seekTo(0);
        TrackPlayer.pause();
      }
    }
  }, [position, duration]);

  useTrackPlayerEvents([TrackPlayerEvents.PLAYBACK_STATE], (event) => {
    console.log(event);
    if (event.state === STATE_PLAYING) {
      setIsPlaying(true);
    }
    // else if (event.state === STATE_PAUSED) {
    //   TrackPlayer.stop();
    // }
    else {
      //console.log('paused');
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
    } else {
      TrackPlayer.pause();
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

  const selectAnswer2 = () => {
    var al = answerList.slice();

    //console.log('answerList: ' + JSON.stringify(al));

    var currentQuestion = questionList[currentQuestionInd];

    currentQuestion.userAnswer = currentAnswer;

    var lcAnswers = questionList[currentQuestionInd].Answers.map((item) => {
      console.log('item: ' + item);
      return item.toLowerCase();
    });
    console.log('lcAnswers: ' + JSON.stringify(lcAnswers));

    var caLC = currentAnswer.toLowerCase();

    console.log('caLC: ' + caLC);

    var answerIndex = lcAnswers.indexOf(caLC);

    console.log('answerIndex: ' + answerIndex);

    if (answerIndex != -1) {
      var ca = correctAnswers;
      ca++;
      setCorrectAnswers(ca);
      console.log('correct');

      setAnswerState('rgb( 114,255,133)');
    } else {
      console.log('not');
      setAnswerState('rgb(255,93,93)');
    }

    al.push(questionList[currentQuestionInd]);

    setAnswerList(al);
    setCanAnswer(false);
    Keyboard.dismiss();
    //TrackPlayer.destroy();

    nextTrack();

    setTimeout(() => {
      setCurrentAnswer(null);
      nextQuestion();

      setAnswerState('#E2E7ED');
    }, 2000);
  };

  const debugResults = () => {
    console.log('debugResults');

    storeData(level);

    dispatch({
      type: 'SET_PITCH_PROGRESS',
      level: {highestCompletedPitchLevel: level.toString()},
    });

    setCorrectAnswers(12);
    setQuizFinished(true);
    setQuizStarted(false);
  };

  const mainMenu = (passed) => {
    console.log(`mainMenu ${level} passed: ${passed}`);
    //saveProgress();

    if (isTrial) {
      dispatch({type: 'SET_MODE', mode: 0});
    } else {
      var currentLevel = level;

      if (passed) {
        dispatch({type: 'SET_MODE', mode: 1});
        dispatch({type: 'SET_LEVEL', level: currentLevel + 1});

        console.log(`set level: ${currentLevel + 1}`);
        //dispatch(saveProgress(level));
      } else {
        console.log('restart quiz');
      }

      setRestarted(true);
      setCurrentAnswer(null);
      setCorrectAnswers(0);
    }
  };

  const storeData = async (level) => {
    console.log(`highestCompletedPitchLevel: ${level}`);

    try {
      console.log('try to save');
      await AsyncStorage.setItem(
        'highestCompletedPitchLevel',
        level.toString(),
      );
    } catch (error) {
      // Error saving data
    }
  };

  const populateAnswers = (questions, ind) => {
    //console.log('populateAnswers');
    var answersData; // = shuffle(data.Pitch.level3Answers);

    if (level == 1) {
      answersData = shuffle(data.Pitch.level1Answers);
    } else if (level == 2) {
      answersData = shuffle(data.Pitch.level2Answers);
    } else if (level == 3) {
      answersData = shuffle(data.Pitch.level3Answers);
    } else if (level == 4) {
      answersData = shuffle(data.Pitch.level4Answers);
    } else if (level == 5) {
      answersData = shuffle(data.Pitch.level5Answers);
    }

    //console.log('answersData: ' + answersData);

    var answer = questions[ind].Answer;

    //console.log('question answer: ' + answer);

    var answerInd = answersData.indexOf(answer);

    //console.log('answerInd: ' + answerInd);

    var answers = [];
    var answerTxt = answersData[answerInd];
    answers.push(answerTxt);

    var ind = 0;

    for (var i = 0; i < answersData.length; i++) {
      if (ind > 2) {
        break;
      }

      if (answersData[i] != answer) {
        answers.push(answersData[i]);
        ind++;
      }
    }

    var shuffledAnswers = shuffle(answers);

    //console.log(`shuffledAnswers: ${shuffledAnswers}`);

    setAnswers(shuffledAnswers);
  };

  const startQuiz = () => {
    console.log('startQuiz');

    var questions;

    if (level == 1) {
      questions = shuffle(data.Pitch.level1Questions);
    } else if (level == 2) {
      questions = shuffle(data.Pitch.level2Questions);
    } else if (level == 3) {
      questions = shuffle(data.Pitch.level3Questions);
    } else if (level == 4) {
      questions = shuffle(data.Pitch.level4Questions);
    } else if (level == 5) {
      questions = shuffle(data.Pitch.level5Questions);
    }

    questions = questions.slice(0, 12);

    var newTracks = [];

    console.log('questions: ' + JSON.stringify(questions));

    questions.map((question) => {
      var ob = {
        id: question.id.toString(),
        url: trackSelect(question.file),
        title: question.file,
        album: 'Piano Lesson with Warren',
        artist: 'Randall Ridley',
        genre: 'R&B',
        artwork: 'https://picsum.photos/300',
      };

      newTracks.push(ob);
    });

    addSongData(newTracks);

    setTrackFile(newTracks[0].url.uri);

    console.log('url: ' + newTracks[0].url.uri);

    console.log('newTracks: ' + JSON.stringify(newTracks));
    console.log('theAnswer: ' + JSON.stringify(questions[0].Answers));

    setCurrentQuestionInd(0);
    setCurrentAnswer('');
    setCorrectAnswers(0);
    setQuestionList(questions);
    setAnswerList([]);
    populateAnswers(questions, 0);

    setQuizStarted(true);
    setRestarted(false);

    //TrackPlayer.reset();

    setCurrentTrack({
      name: questions[0].file,
      id: questions[0].id,
    });

    //console.log('questions: ' + JSON.stringify(questions));

    var question = questions[0];

    console.log('question: ' + JSON.stringify(question));
  };

  const changeVal = (val) => {
    if (val) {
      setCurrentAnswer(val);
      setCanAnswer(true);
    } else {
      setCurrentAnswer(null);
      setCanAnswer(false);
    }
  };

  const pressKey = (key: number) => {
    console.log('key: ' + key);

    var sc = keyStates.slice();

    sc[key] = true;
    setKeyStates(sc);

    if (Platform.OS === 'ios') {
      testView.playKey(key).then((result) => {
        //console.log('show', result);
      });
    } else {
      //console.log("android down")

      //testView.playKey(key);

      testView.playKeyCB(
        key,
        (msg) => {
          console.log('error: ' + msg);
        },
        (response) => {
          console.log('response: ' + response);
        },
      );
    }
  };

  const releaseKey = (key: number) => {
    var sc = keyStates.slice();

    sc[key] = false;
    setKeyStates(sc);

    if (Platform.OS === 'ios') {
      testView.releaseKey(key).then((result) => {
        //console.log('show', result);
      });
    } else {
      //testView.releaseKey(key);

      //console.log("android up")

      // testView.releaseKey(
      //     key,
      //     (msg) => {
      //       console.log('error: ' + msg);
      //     },
      //     (response) => {
      //       console.log('response: ' + response);
      //     },
      //   );

      testView.releaseKey(key);
    }
  };

  var modename;

  //console.log('PL mode: ' + mode);

  if (mode === 2) {
    modename = 'Interval Training';
  } else {
    modename = 'Pitch Recognition';
  }

  //console.log('PL modename: ' + modename);

  return (
    <>
      {restarted ? (
        <Instructions
          instructions={instructions}
          modename={modename}
          level={level}
          startQuiz={() => startQuiz()}
        />
      ) : quizStarted ? (
        <>
          <View style={styles.mainContainer}>
            <View
              style={{
                padding: 20,
              }}>
              <Text
                style={{
                  fontFamily: 'Helvetica Neue',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Quiz - Pitch Recognition Level {level}
              </Text>

              <Text>File: {trackFile}</Text>

              {/* <TouchableOpacity onPress={() => debugResults()}>
                <Text
                  style={{
                    height: 35,
                    width: 100,
                    backgroundColor: 'green',
                    color: 'white',
                    textAlign: 'center',
                    paddingTop: 7,
                  }}>
                  Debug
                </Text>
              </TouchableOpacity> */}
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
                  marginTop: 10,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',

                    paddingTop: Platform.OS === 'android' ? 10 : 0,
                    paddingBottom: Platform.OS === 'android' ? 10 : 0,
                  }}>
                  <TouchableOpacity
                    onPress={onButtonPressed}
                    style={{marginRight: Platform.OS === 'ios' ? 20 : 10}}>
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
            </View>
            <TextInput
              style={{
                width: 70,
                height: 50,
                backgroundColor: answerState,
                marginTop: 5,
                marginBottom: 30,
                borderRadius: 3,
                marginLeft: 'auto',
                marginRight: 'auto',
                fontSize: 35,
                textAlign: 'center',
              }}
              value={currentAnswer}
              onChangeText={(text) => changeVal(text)}></TextInput>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'yellow',
                flex: 1,
                maxHeight: '55%',
              }}>
              <View
                style={{
                  backgroundColor: 'black',
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                }}>
                <View
                  onTouchStart={() => pressKey(0)}
                  onTouchEnd={() => releaseKey(0)}
                  style={[styles.whiteKey]}>
                  <Image
                    source={keyStates[0] ? GreenIcon : WhiteIcon}
                    style={styles.icon}
                  />
                </View>
                <View
                  onTouchStart={() => pressKey(1)}
                  onTouchEnd={() => releaseKey(1)}
                  style={styles.blackKey2}>
                  <Image source={keyStates[1] ? BlackGreenIcon : BlackIcon} />
                </View>
                <View
                  onTouchStart={() => pressKey(2)}
                  onTouchEnd={() => releaseKey(2)}
                  style={styles.whiteKey}>
                  <Image
                    source={keyStates[2] ? GreenIcon : WhiteIcon}
                    style={styles.icon}
                  />
                </View>
                <View
                  onTouchStart={() => pressKey(3)}
                  onTouchEnd={() => releaseKey(3)}
                  style={styles.blackKey3}>
                  <Image source={keyStates[3] ? BlackGreenIcon : BlackIcon} />
                </View>
                <View
                  onTouchStart={() => pressKey(4)}
                  onTouchEnd={() => releaseKey(4)}
                  style={styles.whiteKey}>
                  <Image
                    source={keyStates[4] ? GreenIcon : WhiteIcon}
                    style={styles.icon}
                  />
                </View>
                <View
                  onTouchStart={() => pressKey(5)}
                  onTouchEnd={() => releaseKey(5)}
                  style={styles.whiteKey}>
                  <Image
                    source={keyStates[5] ? GreenIcon : WhiteIcon}
                    style={styles.icon}
                  />
                </View>
                <View
                  onTouchStart={() => pressKey(6)}
                  onTouchEnd={() => releaseKey(6)}
                  style={styles.blackKey4}>
                  <Image source={keyStates[6] ? BlackGreenIcon : BlackIcon} />
                </View>
                <View
                  onTouchStart={() => pressKey(7)}
                  onTouchEnd={() => releaseKey(7)}
                  style={styles.whiteKey}>
                  <Image
                    source={keyStates[7] ? GreenIcon : WhiteIcon}
                    style={styles.icon}
                  />
                </View>
                <View
                  onTouchStart={() => pressKey(8)}
                  onTouchEnd={() => releaseKey(8)}
                  style={styles.blackKey5}>
                  <Image source={keyStates[8] ? BlackGreenIcon : BlackIcon} />
                </View>
                <View
                  onTouchStart={() => pressKey(9)}
                  onTouchEnd={() => releaseKey(9)}
                  style={styles.whiteKey}>
                  <Image
                    source={keyStates[9] ? GreenIcon : WhiteIcon}
                    style={styles.icon}
                  />
                </View>
                <View
                  onTouchStart={() => pressKey(10)}
                  onTouchEnd={() => releaseKey(10)}
                  style={styles.blackKey6}>
                  <Image source={keyStates[10] ? BlackGreenIcon : BlackIcon} />
                </View>
                <View
                  onTouchStart={() => pressKey(11)}
                  onTouchEnd={() => releaseKey(11)}
                  style={styles.whiteKey}>
                  <Image
                    source={keyStates[11] ? GreenIcon : WhiteIcon}
                    style={styles.icon}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => selectAnswer2()}
                disabled={!canAnswer}
                style={{
                  height: 60,
                  backgroundColor: canAnswer ? '#3AB24A' : 'gray',
                  justifyContent: 'center',
                  alignItems: 'center',
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
            </View>
          </View>
        </>
      ) : quizFinished ? (
        <ResultsView
          avgScore={80}
          answerList={answerList}
          correctAnswers={correctAnswers}
          total={questionList.length}
          mainMenu={mainMenu}
          level={level}
          isTrial={isTrial}
        />
      ) : null}
    </>
  );
};

export default PitchLevels;

// var sh = Dimensions.get('screen').height;
// var h;

// if (sh == 896) {
//   //11
//   h = sh - 145;
// }
// else if (sh == 667) {

//   //SE
//   h = sh - 120;
// }

let offset = Dimensions.get('screen').width / 9.2;

let whiteKeyWidth = Dimensions.get('screen').width / 7;
let blackKeyWidth = Dimensions.get('screen').width / 13;

const styles = StyleSheet.create({
  mainContainer: {
    //backgroundColor: 'yellow',
    //position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'white',
    flex: 1,
  },
  checkbox: {
    alignSelf: 'center',
  },
  icon: {
    height: '100%',
    maxHeight: 250,
    width: whiteKeyWidth,
  },
  whiteKey: {
    height: '100%',
    maxHeight: 250,
    marginRight: 0.5,
  },
  blackKey: {position: 'absolute', zIndex: 1},
  blackKey2: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    left: offset,
  },
  blackKey3: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    left: offset + whiteKeyWidth,
  },
  blackKey4: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    left: offset + whiteKeyWidth * 3,
  },
  blackKey5: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    left: offset + whiteKeyWidth * 4,
  },
  blackKey6: {
    position: 'absolute',
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    left: offset + whiteKeyWidth * 5,
  },
});
