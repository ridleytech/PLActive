import React, {useEffect, useState, useMemo} from 'react';
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
  Alert,
  Linking,
} from 'react-native';

import {useDispatch, useSelector, connect} from 'react-redux';

import Slider from '@react-native-community/slider';
//import styles from './styles';
import data from '../data/questions.json';
import playImg from '../../images/play-btn2.png';
import pauseImg from '../../images/pause-btn2.png';
import Instructions from './Instructions';
import ResultsViewPitch from './ResultsViewPitch';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyboardView from './KeyboardView';
import KeyboardView2 from './KeyboardView2';
import {saveTestScore, saveProgress} from '../thunks/';

//https://nicedoc.io/zmxv/react-native-sound

var testView = NativeModules.PlayKey;

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

//https://github.com/zmxv/react-native-sound

var Sound = require('react-native-sound');
var audioClip;

const {height, width} = Dimensions.get('window');
const aspectRatio = height / width;

const PitchLevels = ({level, mode, props}) => {
  const dispatch = useDispatch();
  const accessFeature = useSelector((state) => state.accessFeature);
  const isAdmin = useSelector((state) => state.isAdmin);

  const highestCompletedPitchLevel = useSelector(
    (state) => state.highestCompletedPitchLevel,
  );

  // level = 3;
  // dispatch({type: 'SET_LEVEL', level: 3});

  //console.log('selectedLevel: ' + level);
  const [canPlay, setCanPlay] = useState(false);

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

  const [trackInfo, setTrackInfo] = useState({position: 0, duration: 0});
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

  const loggedIn = useSelector((state) => state.loggedIn);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [quizTime, setQuizTime] = useState(0);
  const [isQuizTimerActive, setisQuizTimerActive] = useState(false);
  const [storedData, setStoredData] = useState(null);
  const [passScore, setPassScore] = useState(0);
  const [score, setScore] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);

  const [displayAnswer, setDisplayAnswer] = useState(null);
  const [canCheck, setCanCheck] = useState(true);

  useEffect(() => {
    //console.log('pitch level changed');
    populateInstructions();
  }, [level]);

  //quiz timer

  useEffect(() => {
    let interval = null;

    if (isQuizTimerActive) {
      //console.log('start quiz timer');
      interval = setInterval(() => {
        //console.log('the seconds: ' + quizTime);

        setQuizTime((quizTime) => quizTime + 1);
      }, 1000);
    } else if (!isQuizTimerActive && quizTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isQuizTimerActive, quizTime]);

  //audio playhead

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        //console.log('the seconds: ' + interval);

        audioClip.getCurrentTime((seconds1) => {
          //console.log('at ' + seconds1);

          setTrackInfo({
            position: seconds1,
            duration: audioClip.getDuration(),
          });

          //if (seconds1 == 0 || seconds1 > 5) {
          if (seconds1 == 0) {
            stopAudio();
          }
        });
        setSeconds((seconds) => seconds + 1);
      }, 250);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  //track info changed

  useEffect(() => {
    //console.log('track info changed: ' + JSON.stringify(trackInfo));

    var pos = trackInfo.position / trackInfo.duration;

    //console.log('slider val: ' + pos);

    if (pos > 0) {
      setSliderValue(pos);
    }
  }, [trackInfo]);

  Animated.timing(opacity, {
    toValue: 1,
    duration: 1500,
    useNativeDriver: false,
  }).start();

  const stopAudio = () => {
    setIsActive(false);
    setIsPlaying(false);

    // audioClip.pause();
    // audioClip.stop();

    audioClip.stop(() => {
      // Note: If you want to play a sound after stopping and rewinding it,
      // it is important to call play() in a callback.
      //whoosh.play();
      //console.log('stop');
    });

    setSliderValue(0);
  };

  const nextQuestion = () => {
    if (audioClip) {
      audioClip.release();
    }

    var currentQuestion1 = currentQuestionInd;

    if (currentQuestion1 < questionList.length - 1) {
      currentQuestion1 += 1;

      setCurrentTrack({
        name: questionList[currentQuestion1].file,
        id: currentQuestion1.toString(),
      });

      var filename = questionList[currentQuestion1].file.toLowerCase() + '.mp3';

      audioClip = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound ' + filename, error);

          return;
        }
        // loaded successfully
        console.log('file ' + filename + ' loaded');

        //audioClip.setCategory('Playback');

        //audioClip.play();
      });

      setCurrentQuestionInd(currentQuestion1);
      //populateAnswers(questionList, currentQuestion1);
    } else {
      setisQuizTimerActive(false);

      setQuizFinished(true);
      setQuizStarted(false);
    }
  };

  //init load

  useEffect(() => {
    // console.log('on load pitch');
    // console.log('loadCount pitch: ' + loadCount);

    console.log('screen width: ' + width);

    //dispatch(saveProgress());

    // var lc = loadCount;
    // lc++;
    // setLoadCount(lc);

    Sound.setCategory('Playback');

    populateInstructions();
    retrieveTestData();
  }, []);

  useEffect(() => {
    if (quizStarted) {
      storeTestData();
    }
  }, [answerList]);

  useEffect(() => {
    if (storedData != null) {
      console.log('got the test data. resume quiz');
      resumeQuiz();
    }
  }, [storedData]);

  const populateInstructions = () => {
    var instructions; // = data.Interval.level3Instructions;

    if (level == 1) {
      instructions = data.Pitch.level1Instructions;
      setPassScore(data.Pitch.level1PassScore);
    } else if (level == 2) {
      instructions = data.Pitch.level2Instructions;
      setPassScore(data.Pitch.level2PassScore);
    } else if (level == 3) {
      instructions = data.Pitch.level3Instructions;
      setPassScore(data.Pitch.level3PassScore);
    } else if (level == 4) {
      instructions = data.Pitch.level4Instructions;
      setPassScore(data.Pitch.level4PassScore);
    } else if (level == 5) {
      instructions = data.Pitch.level5Instructions;
      setPassScore(data.Pitch.level5PassScore);
    }

    setInstructions(instructions);
  };

  useEffect(() => {
    console.log('passScore: ' + passScore);
  }, [passScore]);

  //console.log('height: ' + Dimensions.get('screen').height);

  //current question index changed

  useEffect(() => {
    if (currentTrack) {
      console.log('currentQuestion changed: ' + currentTrack.name);
    }
  }, [currentQuestionInd]);

  //quiz finished changed

  useEffect(() => {
    if (quizFinished) {
      console.log('quiz finished');

      console.log(`ca: ${correctAnswers} total: ${questionList.length}`);

      var per = parseInt((correctAnswers / questionList.length) * 100);

      setScore(per);

      console.log(`per levels: ${per}`);

      removeTestData();

      if (per >= passScore) {
        console.log('store data');

        dispatch({
          type: 'SET_PITCH_PROGRESS',
          level: {highestCompletedPitchLevel: level.toString()},
        });

        if (!loggedIn) {
          if (accessFeature > 0) {
            if (level == 1) {
              storeData(level);
            }
          } else {
            //store data if in app store safe mode
            console.log('store data in safe mode');

            storeData(level);
          }
        } else {
          storeData(level);
          //dispatch(saveTestScore(per, quizTime));
          dispatch(saveProgress());
        }
      }
    }
  }, [quizFinished]);

  const postLeaderboard = () => {
    console.log('postLeaderboard pitch');
    dispatch(saveTestScore(score, quizTime));

    dispatch({type: 'SET_MODE', mode: 0});
    dispatch({type: 'SET_LEVEL', level: 0});
    dispatch({type: 'SET_LEADERBOARD_MODE', mode: 1});

    props.navigation.navigate('LEADER BOARD');
  };

  //unmount

  useEffect(
    () => () => {
      //console.log('unmount');

      setSeconds(0);
      setIsActive(false);
      setisQuizTimerActive(false);

      if (audioClip) {
        audioClip.release();
      }
    },
    [],
  );

  //current track changed

  useEffect(() => {
    //console.log('currentTrack changed');
    // console.log('add track: ' + currentTrack.name);
  }, [currentTrack]);

  const onButtonPressed = () => {
    if (!isPlaying) {
      audioClip.play((success) => {
        if (success) {
          console.log('successfully finished playing');
          setIsActive(false);

          setIsPlaying(false);
          setSliderValue(0);
        }
      });
      setIsActive(true);
      setIsPlaying(true);
    } else {
      audioClip.pause();
      setIsPlaying(false);
      setIsActive(false);
    }
  };

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async (value) => {
    audioClip.setCurrentTime(value * trackInfo.duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  const selectAnswer2 = () => {
    var al = answerList.slice();

    console.log('answerList pitch: ' + JSON.stringify(al));

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
      setDisplayAnswer(lcAnswers.join(', ').toUpperCase());
    }

    al.push(questionList[currentQuestionInd]);

    //setCanAnswer(false);
    setAnswerList(al);
    //setCanAnswer(false);
    //setCanPlay(false);

    Keyboard.dismiss();
    setCanCheck(false);

    stopAudio();

    // setTimeout(() => {
    //   setCurrentAnswer(null);
    //   nextQuestion();
    //   setCanPlay(true);

    //   setAnswerState('#E2E7ED');
    // }, 2000);
  };

  const selectNextQuestion = () => {
    setCanCheck(true);
    setCanAnswer(false);
    setDisplayAnswer(null);
    setCurrentAnswer(null);
    setCanPlay(true);
    nextQuestion();
    setAnswerState('#E2E7ED');
  };

  const debugResults = () => {
    console.log('debugResults');
    setHasAudio(true);
    setCorrectAnswers(0);
    setRestarted(false);
    setQuizFinished(true);
    setQuizStarted(false);

    setAnswerList([
      {
        Answers: ['2', '5', '1'],
        file: 'p12',
        userAnswer: '2',
        isCorrect: false,
      },
      {
        Answers: ['1', '4', '1'],
        file: 'p11',
        userAnswer: '1',
        isCorrect: false,
      },
    ]);
    setQuestionList([
      {
        Answers: ['2', '5', '1'],
        file: 'p12',
        userAnswer: '5',
        isCorrect: false,
      },
      {
        Answers: ['1', '4', '1'],
        file: 'p11',
        userAnswer: '7',
        isCorrect: false,
      },
    ]);
  };

  const debugResults1 = () => {
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
    console.log(`pitch ${level} passed: ${passed}`);

    if (!passed) {
    } else {
      var currentLevel = level;

      if (loggedIn) {
        if (passed) {
          if (currentLevel == 3) {
            //was last level. go to main menu
            console.log('last level. go to main');
            dispatch({type: 'SET_MODE', mode: 0});
            dispatch({type: 'SET_LEVEL', level: 0});
            props.navigation.navigate('CHALLENGES');
          } else {
            dispatch({type: 'SET_MODE', mode: 1});
            dispatch({type: 'SET_LEVEL', level: currentLevel + 1});

            console.log(`set level: ${currentLevel + 1}`);
          }
          //dispatch(saveProgress(level));
        } else {
          console.log('restart quiz');
        }
      } else {
        //upgrade();

        // setTimeout(() => {
        //   dispatch({type: 'SET_MODE', mode: 0});
        //   dispatch({type: 'SET_LEVEL', level: 0});
        // }, 1000);

        //show login

        if (accessFeature > 0) {
          dispatch({type: 'SET_MODE', mode: 0});
          dispatch({type: 'SET_LEVEL', level: 0});
          dispatch({type: 'SHOW_LOGIN'});
          props.navigation.navigate('CHALLENGES');
        } else {
          dispatch({type: 'SET_MODE', mode: 2});
          dispatch({type: 'SET_LEVEL', level: currentLevel + 1});
          console.log(`set level: ${currentLevel + 1}`);
        }

        // return;

        // Alert.alert(
        //   null,
        //   //`Please log in or join the Premium membership to unlock this level.`,
        //   `Please log in to unlock this level.`,
        //   [
        //     //{text: 'JOIN MEMBERSHIP', onPress: () => upgrade()},
        //     {text: 'LOGIN', onPress: () => upgrade()},
        //     {
        //       text: 'GO TO MAIN MENU',
        //       onPress: () => {
        //         console.log('main menu');
        //         dispatch({type: 'SET_MODE', mode: 0});
        //         dispatch({type: 'SET_LEVEL', level: 0});
        //       },
        //     },
        //     {text: 'CANCEL', onPress: () => {}},
        //   ],
        //   {cancelable: false},
        // );
      }
    }

    setRestarted(true);
    setCurrentAnswer(null);
    setCorrectAnswers(0);
  };

  const upgrade = () => {
    let url = 'http://pianolessonwithwarren.com/memberships/';

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const storeData = async (level) => {
    console.log(`highestCompletedPitchLevel: ${level}`);

    if (level < highestCompletedPitchLevel) {
      console.log('less than highest level. stop save');
      return;
    }

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

    setisQuizTimerActive(true);

    //audioClip.play();

    //setIsActive(true);

    var questions = [];

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
    setHasAudio(true);

    var newTracks = [];

    //console.log('questions: ' + JSON.stringify(questions));

    questions.map((question) => {
      var ob = {
        file: question.file.toLowerCase() + '.mp3',
      };

      newTracks.push(ob);
    });

    setTrackFile(newTracks[0].file);

    console.log('file: ' + newTracks[0].file);

    console.log('newTracks: ' + JSON.stringify(newTracks));
    console.log('theAnswer: ' + JSON.stringify(questions[0].Answers));

    audioClip = new Sound(newTracks[0].file, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound ' + newTracks[0].file, error);
        return;
      }
      // loaded successfully

      //audioClip.setCategory('Playback');

      console.log(
        'duration in seconds: ' +
          audioClip.getDuration() +
          ' number of channels: ' +
          audioClip.getNumberOfChannels(),
      );

      setTrackInfo({position: 0, duration: audioClip.getDuration()});

      //audioClip.play();
    });

    setCurrentQuestionInd(0);
    setCurrentAnswer('');
    setCorrectAnswers(0);
    setQuestionList(questions);
    setAnswerList([]);
    //populateAnswers(questions, 0);

    setQuizStarted(true);
    setRestarted(false);
    setQuizFinished(false);

    setCurrentTrack({
      name: questions[0].file,
    });

    //console.log('questions: ' + JSON.stringify(questions));

    setCanPlay(true);

    var question = questions[0];

    console.log('question: ' + JSON.stringify(question));

    //debug view results
    // setRestarted(false);
    // setQuizFinished(true);
    // setQuizStarted(false);
  };

  // restore current test

  const retrieveTestData = async () => {
    try {
      var value = await AsyncStorage.getItem('pitchTestProgress' + level);

      if (value !== null) {
        // We have data!!
        console.log(`pitchTestProgress${level}: ${value}`);

        Alert.alert(
          null,
          `You currently have Level ${level} quiz in progress. Would you like to resume?`,
          [
            {text: 'YES', onPress: () => setStoredData(value)},
            //{text: 'JOIN MEMBERSHIP', onPress: () => this.upgrade()},
            {
              text: 'CANCEL',
              onPress: () => {
                removeTestData();
              },
            },
          ],
          {cancelable: false},
        );

        //setStoredData(value);
      } else {
        console.log(`no saved pitchTestProgress${level} data`);

        value = 0;
        //this.storePitchData(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const removeTestData = async () => {
    try {
      await AsyncStorage.removeItem('pitchTestProgress' + level);

      console.log(`pitchTestProgress${level} deleted`);
    } catch (error) {
      // Error saving data
      console.log(`cant delete pitchTestProgress${level}`);
    }
  };

  const storeTestData = async () => {
    var testData = {
      correctAnswers: correctAnswers,
      quizTime: quizTime,
      level: level,
      mode: mode,
      answerList: answerList,
      questionList: questionList,
    };

    var formatted = JSON.stringify(testData);

    console.log('storeTestData: ' + formatted);

    try {
      await AsyncStorage.setItem('pitchTestProgress' + level, formatted);

      console.log(`pitchTestProgress${level} stored`);
    } catch (error) {
      // Error saving data
      console.log(`cant create pitchTestProgress${level}: ` + error);
    }
  };

  const resumeQuiz = () => {
    console.log('resumeQuiz');

    setisQuizTimerActive(true);

    //console.log('theAnswer: ' + answerInd);

    //console.log('storedData: ' + storedData);

    var json = JSON.parse(storedData);

    var newQuestions = json.questionList;

    //console.log('newQuestions: ' + newQuestions);

    //return;

    console.log('answerList: ' + JSON.stringify(json.answerList));

    var currentTestIndex = json.answerList.length;

    console.log('currentTestIndex: ' + currentTestIndex);

    setCurrentQuestionInd(currentTestIndex);

    setCurrentAnswer('');
    setCorrectAnswers(json.correctAnswers);

    setQuestionList(newQuestions);
    setAnswerList(json.answerList);
    //populateAnswers(newQuestions[currentTestIndex], 0);

    setQuizTime(json.quizTime);

    setQuizStarted(true);
    setRestarted(false);
    setQuizFinished(false);

    //return;

    console.log('newQuestions: ' + JSON.stringify(newQuestions));

    //if (level > 1) {
    var newTracks = [];

    newQuestions.map((question) => {
      var ob = {
        file: question.file.toLowerCase() + '.mp3',
      };

      newTracks.push(ob);
    });

    var file = newTracks[currentTestIndex].file;

    setTrackFile(file);

    console.log('file: ' + file);
    console.log('newTracks length triads: ' + newTracks.length);

    audioClip = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound ' + file, error);
        return;
      }
      console.log('file loaded successfully: ' + file);

      //audioClip.setCategory('Playback');

      // loaded successfully
      console.log(
        'duration in seconds: ' +
          audioClip.getDuration() +
          ' number of channels: ' +
          audioClip.getNumberOfChannels(),
      );

      setTrackInfo({position: 0, duration: audioClip.getDuration()});

      //audioClip.play();
    });

    setCurrentTrack({
      name: newQuestions[currentTestIndex].file,
    });

    console.log('newTracks: ' + JSON.stringify(newTracks));
    //}

    setCanPlay(true);

    //console.log('questions: ' + JSON.stringify(questions));

    var question = newQuestions[currentTestIndex];

    console.log('question: ' + JSON.stringify(question));
    console.log('theAnswer: ' + JSON.stringify(question.Answer));
  };

  const debugAudio = () => {
    console.log('debugAudio');

    setisQuizTimerActive(true);

    var questions = [];

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

    //console.log('theAnswer: ' + answerInd);

    console.log('interval questions: ' + JSON.stringify(questions));

    if (level > 1) {
      questions.map((question) => {
        var filename = question.file.toLowerCase() + '.mp3';
        console.log('filename: ' + filename);

        audioClip = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound ' + filename, error);
            return;
          }
          // loaded successfully
          console.log('file ' + filename + ' loaded');

          //audioClip.setCategory('Playback');

          //setTrackInfo({position: 0, duration: audioClip.getDuration()});
          //audioClip.play();
        });
      });

      //setCanPlay(true);
    }
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
          {isAdmin ? (
            <TouchableOpacity
              onPress={() => selectNextQuestion()}
              style={{
                height: 60,
                backgroundColor: '#3AB24A',
                justifyContent: 'center',
                alignItems: 'center',
                top: 45,
                right: 0,
                width: 100,
                position: 'absolute',
                zIndex: 3,
              }}>
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: 'Helvetica Neue',
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {'SKIP'}
              </Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.mainContainer}>
            <ScrollView>
              <View
                style={{
                  padding: 20,
                }}>
                <Text
                  style={{
                    fontFamily: 'Helvetica Neue',
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#3AB24A',
                    width: '95%',
                  }}>
                  Quiz - Pitch Recognition Level {level}
                </Text>

                {/* <Text>File: {trackFile}</Text> */}

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: 'Helvetica Neue',
                      fontSize: 15,
                      marginTop: 15,
                    }}>
                    Question
                  </Text>

                  <Text
                    style={{
                      fontFamily: 'Helvetica Neue',
                      fontSize: 15,
                      marginTop: 15,
                      color: '#3AB24A',
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    {currentQuestionInd + 1}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Helvetica Neue',
                      fontSize: 15,
                      marginTop: 15,
                    }}>
                    {' '}
                    of
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Helvetica Neue',
                      fontSize: 15,
                      marginTop: 15,
                      color: '#3AB24A',
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    {questionList.length}
                  </Text>
                </View>
                <Text
                  style={{
                    marginTop: 15,
                    marginBottom: 15,
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
                    paddingLeft: 12,
                    paddingRight: 12,
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: 50,
                      paddingTop: Platform.OS === 'android' ? 10 : 0,
                      paddingBottom: Platform.OS === 'android' ? 10 : 0,
                    }}>
                    <TouchableOpacity
                      disabled={!canPlay}
                      onPress={onButtonPressed}
                      style={{marginRight: Platform.OS === 'ios' ? 12 : 10}}>
                      {isPlaying ? (
                        <Image
                          source={pauseImg}
                          style={{width: 25, height: 25}}
                        />
                      ) : (
                        <Image
                          source={playImg}
                          style={{width: 25, height: 25}}
                        />
                      )}
                    </TouchableOpacity>

                    <Slider
                      //disabled={!canPlay}
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
                //autoCapitalize="none"
                autoCompleteType="off"
                style={{
                  width: 70,
                  height: 70,
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

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100%',
                }}>
                {displayAnswer ? 'Correct Answer: ' + displayAnswer : null}
              </Text>

              <View style={{height: 250}} />
            </ScrollView>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'black',
                flex: 1,
                //maxHeight: '85%',
              }}>
              {/* randall to do. debug this for android screens */}
              {/* {Platform.OS === 'ios' && aspectRatio < 1.6 ? (
                <KeyboardView2 />
              ) : Platform.OS === 'ios' && aspectRatio > 1.6 ? (
                <KeyboardView />
              ) : null} */}

              {width > 450 ? <KeyboardView2 /> : <KeyboardView />}

              <TouchableOpacity
                onPress={() =>
                  !canCheck ? selectNextQuestion() : selectAnswer2()
                }
                disabled={!canAnswer}
                style={{
                  position: 'absolute',
                  bottom: 0,
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
                  {!canCheck ? 'NEXT' : 'SUBMIT'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : quizFinished ? (
        <ResultsViewPitch
          avgScore={80}
          answerList={answerList}
          correctAnswers={correctAnswers}
          total={questionList.length}
          mainMenu={mainMenu}
          level={level}
          loggedIn={loggedIn}
          mode={mode}
          passScore={passScore}
          postLeaderboard={postLeaderboard}
          hasAudio={hasAudio}
        />
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loggedIn: state.loggedIn,
    level: state.level,
  };
};

export default connect(mapStateToProps, {saveTestScore, saveProgress})(
  PitchLevels,
);

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

//blackKeyWidth = 5;

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
