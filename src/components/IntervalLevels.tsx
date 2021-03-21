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
  Alert,
  Linking,
} from 'react-native';

import {useDispatch, useSelector, connect} from 'react-redux';
import Slider from '@react-native-community/slider';
//import styles from './styles';
import CheckBox from 'react-native-check-box';
import data from '../data/questions.json';
import enabledImg from '../../images/checkbox-enabled.png';
import disabledImg from '../../images/checkbox-disabled.png';
import playImg from '../../images/play-btn2.png';
import pauseImg from '../../images/pause-btn2.png';
import Instructions from './Instructions';
import ResultsViewInterval from './ResultsViewInterval';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveTestScore, saveProgress} from '../thunks/';

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

var Sound = require('react-native-sound');
var audioClip;

const IntervalLevels = ({level, mode, props}) => {
  const dispatch = useDispatch();
  const accessFeature = useSelector((state) => state.accessFeature);
  const intervalmode = useSelector((state) => state.intervalmode);

  const highestCompletedIntervalBrokenLevel = useSelector(
    (state) => state.highestCompletedIntervalBrokenLevel,
  );

  const highestCompletedIntervalBlockedLevel = useSelector(
    (state) => state.highestCompletedIntervalBlockedLevel,
  );

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
  const [storedData, setStoredData] = useState(null);
  const [passScore, setPassScore] = useState(0);

  const [selectionColors, setSelectionColors] = useState([
    '#EFEFEF',
    '#EFEFEF',
    '#EFEFEF',
    '#EFEFEF',
  ]);
  const [height, setHeight] = useState(60);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [trackFile, setTrackFile] = useState(null);

  const [trackInfo, setTrackInfo] = useState({position: 0, duration: 0});
  const [restarted, setRestarted] = useState(true);
  const [canAnswer, setCanAnswer] = useState(false);
  const [canCheck, setCanCheck] = useState(true);

  const [answerState, setAnswerState] = useState('#E2E7ED');

  const loggedIn = useSelector((state) => state.loggedIn);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [quizTime, setQuizTime] = useState(0);
  const [isQuizTimerActive, setisQuizTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);

  const [displayAnswer, setDisplayAnswer] = useState(null);

  useEffect(() => {
    console.log('interval level changed');
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

    setSelectionColors(['#EFEFEF', '#EFEFEF', '#EFEFEF', '#EFEFEF']);

    if (currentQuestion1 < questionList.length - 1) {
      currentQuestion1 += 1;

      if (level > 1) {
        setCurrentTrack({
          name: questionList[currentQuestion1].tempfile,
          id: currentQuestion1.toString(),
        });

        var filename =
          questionList[currentQuestion1].tempfile.toLowerCase() + '.mp3';

        console.log('filename next: ' + filename);

        audioClip = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound ' + filename, error);
            return;
          }
          // loaded successfully
          console.log('file ' + filename + ' loaded');

          //audioClip.play();

          //audioClip.setCategory('Playback');
        });
      }
      setCurrentQuestionInd(currentQuestion1);
      populateAnswers(questionList, currentQuestion1);
    } else {
      console.log('set quiz finished');
      setisQuizTimerActive(false);
      setQuizFinished(true);
      //setQuestionList([])
      setQuizStarted(false);
    }
  };

  //init load

  useEffect(() => {
    if (level > 1) {
      // console.log('on load int');
      // console.log('loadCount int: ' + loadCount);

      // var lc = loadCount;
      // lc++;
      // setLoadCount(lc);

      Sound.setCategory('Playback');
    }

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
    console.log('populate instructions: ' + level);

    var instructions; // = data.Interval.level3Instructions;

    if (level == 1) {
      instructions = data.Interval.level1Instructions;
      setPassScore(data.Interval.level1PassScore);
    } else if (level == 2) {
      instructions = data.Interval.level2Instructions;
      setPassScore(data.Interval.level2PassScore);
    } else if (level == 3) {
      instructions = data.Interval.level3Instructions;
      setPassScore(data.Interval.level3PassScore);
    } else if (level == 4) {
      instructions = data.Interval.level4Instructions;
      setPassScore(data.Interval.level4PassScore);
    } else if (level == 5) {
      instructions = data.Interval.level5Instructions;
      setPassScore(data.Interval.level5PassScore);
    }

    setInstructions(instructions);
  };

  useEffect(() => {
    console.log('passScore: ' + passScore);
  }, [passScore]);

  //console.log('height: ' + Dimensions.get('screen').height);

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

      console.log(`per levels: ${per} passScore: ${passScore}`);

      removeTestData();

      if (per >= passScore) {
        console.log('store data');

        if (intervalmode == 1) {
          dispatch({
            type: 'SET_INTERVAL_BROKEN_PROGRESS',
            level: {highestCompletedIntervalBrokenLevel: level.toString()},
          });
        } else {
          dispatch({
            type: 'SET_INTERVAL_BLOCKED_PROGRESS',
            level: {highestCompletedIntervalBlockedLevel: level.toString()},
          });
        }

        if (!loggedIn) {
          console.log('quiz finished not logged in');

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
          console.log('logged in store data');
          storeData(level);
          dispatch(saveProgress());
          //dispatch(saveTestScore(per, quizTime));
        }
      }
    }
  }, [quizFinished]);

  const postLeaderboard = () => {
    console.log('postLeaderboard interval');
    dispatch(saveTestScore(score, quizTime));

    dispatch({type: 'SET_MODE', mode: 0});
    dispatch({type: 'SET_LEVEL', level: 0});
    dispatch({type: 'SET_LEADERBOARD_MODE', mode: 2});

    props.navigation.navigate('LEADER BOARD');
  };

  //unmount

  useEffect(
    () => () => {
      //console.log('unmount');

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

  const setChecked = (ob) => {
    if (ob === currentAnswer) {
      setCurrentAnswer(null);
      setCanAnswer(false);
    } else {
      setCurrentAnswer(ob);
      setCanAnswer(true);
    }

    //console.log('ob: ' + JSON.stringify(ob));
  };

  const selectAnswer2 = () => {
    var al = answerList.slice();

    console.log('answerList interval: ' + JSON.stringify(al));

    var currentQuestion = questionList[currentQuestionInd];

    currentQuestion.userAnswer = currentAnswer;

    var sc = selectionColors.slice();
    var answerInd = answers.indexOf(currentAnswer);

    if (currentAnswer === questionList[currentQuestionInd].Answer) {
      var ca = correctAnswers;
      ca++;
      setCorrectAnswers(ca);

      sc[answerInd] = 'rgb( 114,255,133)';

      console.log('correct');
    } else {
      console.log('not');
      sc[answerInd] = 'rgb(255,93,93)';
    }

    setSelectionColors(sc);

    al.push(questionList[currentQuestionInd]);

    setAnswerList(al);

    setCanAnswer(false);
    setCanCheck(false);
    setCanPlay(false);

    if (level > 1) {
      stopAudio();
    }

    //setDisplayAnswer(currentQuestion.Answers.join(', '));

    setTimeout(() => {
      setCurrentAnswer(null);
      setCanCheck(true);
      setCanPlay(true);
      nextQuestion();
      setAnswerState('#E2E7ED');
    }, 2000);
  };

  const selectNextQuestion = () => {
    setDisplayAnswer(null);
    setCurrentAnswer(null);
    setCanCheck(true);
    setCanPlay(true);
    nextQuestion();
    setAnswerState('#E2E7ED');
  };

  const debugResults = () => {
    console.log('debugResults');

    if (level > 1) {
      setHasAudio(true);
    }

    setCorrectAnswers(0);
    setRestarted(false);
    setQuizFinished(true);
    setQuizStarted(false);

    setAnswerList([
      {
        Answers: ['2', '5', '1'],
        file: 'p12',
        userAnswer: ['2'],
        isCorrect: false,
      },
      {
        Answers: ['1', '4', '1'],
        file: 'p11',
        userAnswer: ['1'],
        isCorrect: false,
      },
    ]);
    setQuestionList([
      {
        Answers: ['2', '5', '1'],
        file: 'p12',
        userAnswer: ['2'],
        isCorrect: false,
      },
      {
        Answers: ['1', '4', '1'],
        file: 'p11',
        userAnswer: ['1'],
        isCorrect: false,
      },
    ]);
  };

  const debugResults1 = () => {
    console.log('debugResults');

    dispatch({
      type: 'SET_INTERVAL_PROGRESS',
      level: {highestCompletedIntervalBrokenLevel: level.toString()},
    });

    setCorrectAnswers(12);
    setQuizFinished(true);
    setQuizStarted(false);
  };

  const mainMenu = (passed) => {
    console.log(`main menu interval ${level} passed: ${passed}`);

    if (!passed) {
    } else {
      var currentLevel = level;

      if (loggedIn) {
        if (passed) {
          if (currentLevel == 5) {
            //was last level. go to main menu
            console.log('last level. go to main');
            dispatch({type: 'SET_MODE', mode: 0});
            dispatch({type: 'SET_LEVEL', level: 0});
            props.navigation.navigate('CHALLENGES');
          } else {
            dispatch({type: 'SET_MODE', mode: 2});
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

    //move to level update method

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
    if (intervalmode == 1) {
      console.log(`highestCompletedIntervalBrokenLevel: ${level}`);

      if (level < highestCompletedIntervalBrokenLevel) {
        console.log('less than highest level. stop save');
        return;
      }

      try {
        console.log('try to save highestCompletedIntervalBrokenLevel');
        await AsyncStorage.setItem(
          'highestCompletedIntervalBrokenLevel',
          level.toString(),
        );

        console.log('highestCompletedIntervalBrokenLevel saved');
      } catch (error) {
        console.log('highestCompletedIntervalBrokenLevel not saved');
        // Error saving data
      }
    } else {
      console.log(`highestCompletedIntervalBlockedLevel: ${level}`);

      if (level < highestCompletedIntervalBlockedLevel) {
        console.log('less than highest level. stop save');
        return;
      }

      try {
        console.log('try to save highestCompletedIntervalBlockedLevel');
        await AsyncStorage.setItem(
          'highestCompletedIntervalBlockedLevel',
          level.toString(),
        );

        console.log('highestCompletedIntervalBlockedLevel saved');
      } catch (error) {
        console.log('highestCompletedIntervalBlockedLevel not saved');
        // Error saving data
      }
    }
  };

  const populateAnswers = (questions, ind) => {
    //console.log('populateAnswers');
    var answersData; // = shuffle(data.Interval.level3Answers);

    if (level == 1) {
      answersData = shuffle(data.Interval.level1Answers);
    } else if (level == 2) {
      answersData = shuffle(data.Interval.level2Answers);
    } else if (level == 3) {
      answersData = shuffle(data.Interval.level3Answers);
    } else if (level == 4) {
      answersData = shuffle(data.Interval.level4Answers);
    } else if (level == 5) {
      answersData = shuffle(data.Interval.level5Answers);
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

    var questions = [];

    if (level == 1) {
      questions = shuffle(data.Interval.level1Questions);
    } else if (level == 2) {
      questions = shuffle(data.Interval.level2Questions);
    } else if (level == 3) {
      questions = shuffle(data.Interval.level3Questions);
    } else if (level == 4) {
      questions = shuffle(data.Interval.level4Questions);
    } else if (level == 5) {
      questions = shuffle(data.Interval.level5Questions);
    }

    //console.log('theAnswer: ' + answerInd);

    console.log('interval questions: ' + JSON.stringify(questions));

    setCurrentQuestionInd(0);
    setCurrentAnswer('');
    setCorrectAnswers(0);
    //setQuestionList(questions);
    setAnswerList([]);
    populateAnswers(questions, 0);

    setQuizStarted(true);
    setRestarted(false);
    setQuizFinished(false);

    if (level > 1) {
      setHasAudio(true);

      var newTracks = [];

      var chordSequence = 'blocked';

      if (intervalmode == 1) {
        chordSequence = 'broken';
      }

      questions.map((question) => {
        var filename = question.file.toLowerCase() + chordSequence;

        console.log('filename: ' + filename);

        var ob = {
          tempfile: filename + '.mp3',
        };

        question.tempfile = filename;

        newTracks.push(ob);
      });

      console.log('interval questions2: ' + JSON.stringify(questions));

      setTrackFile(newTracks[0].tempfile);

      console.log('file: ' + newTracks[0].tempfile);

      console.log('newTracks length interval: ' + newTracks.length);

      audioClip = new Sound(
        newTracks[0].tempfile,
        Sound.MAIN_BUNDLE,
        (error) => {
          if (error) {
            console.log(
              'failed to load the sound ' + newTracks[0].tempfile,
              error,
            );
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
        },
      );

      setCanPlay(true);

      setCurrentTrack({
        name: questions[0].tempfile,
      });

      console.log('newTracks: ' + JSON.stringify(newTracks));
    } else {
      setHasAudio(false);
    }

    setQuestionList(questions);

    //console.log('questions: ' + JSON.stringify(questions));

    var question = questions[0];

    console.log('question: ' + JSON.stringify(question));
    console.log('theAnswer: ' + JSON.stringify(questions[0].Answers));
  };

  // restore current test

  const retrieveTestData = async () => {
    try {
      var value = await AsyncStorage.getItem(
        'intervalTestProgress' + intervalmode + level,
      );

      if (value !== null) {
        // We have data!!
        console.log(`intervalTestProgress${intervalmode}${level}: ${value}`);

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
        console.log(
          `no saved intervalTestProgress${intervalmode}${level} data`,
        );

        value = 0;
        //this.storePitchData(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const removeTestData = async () => {
    try {
      await AsyncStorage.removeItem(
        'intervalTestProgress' + intervalmode + level,
      );

      console.log(`intervalTestProgress${intervalmode}${level} deleted`);
    } catch (error) {
      // Error saving data
      console.log(`cant delete intervalTestProgress${intervalmode}${level}`);
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
      await AsyncStorage.setItem(
        'intervalTestProgress' + intervalmode + level,
        formatted,
      );

      console.log(`intervalTestProgress${intervalmode}${level} stored`);
    } catch (error) {
      // Error saving data
      console.log(
        `cant create intervalTestProgress${intervalmode}${level}: ` + error,
      );
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

    console.log(
      'currentQuestion: ' + JSON.stringify(newQuestions[currentTestIndex]),
    );

    setQuestionList(newQuestions);
    setAnswerList(json.answerList);
    populateAnswers(newQuestions, currentTestIndex);
    //setAnswers(newQuestions[currentTestIndex].Answers);

    setQuizTime(json.quizTime);

    setQuizStarted(true);
    setRestarted(false);
    setQuizFinished(false);

    //return;

    console.log('newQuestions: ' + JSON.stringify(newQuestions));

    if (level > 1) {
      var newTracks = [];

      newQuestions.map((question) => {
        var ob = {
          tempfile: question.tempfile.toLowerCase() + '.mp3',
        };

        newTracks.push(ob);
      });

      var file = newTracks[currentTestIndex].tempfile;

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
    }
  };

  const debugAudio = () => {
    console.log('debugAudio');

    setisQuizTimerActive(true);

    var questions = [];

    if (level == 1) {
      questions = shuffle(data.Interval.level1Questions);
    } else if (level == 2) {
      questions = shuffle(data.Interval.level2Questions);
    } else if (level == 3) {
      questions = shuffle(data.Interval.level3Questions);
    } else if (level == 4) {
      questions = shuffle(data.Interval.level4Questions);
    } else if (level == 5) {
      questions = shuffle(data.Interval.level5Questions);
    }

    //console.log('theAnswer: ' + answerInd);

    console.log('interval questions: ' + JSON.stringify(questions));

    setCurrentQuestionInd(0);
    setCurrentAnswer('');
    setCorrectAnswers(0);
    setQuestionList(questions);
    setAnswerList([]);
    populateAnswers(questions, 0);

    setQuizStarted(true);
    setRestarted(false);
    setQuizFinished(false);

    if (level > 1) {
      var newTracks = [];

      questions.map((question) => {
        // var ob = {
        //   file: question.file.toLowerCase() + '.mp3',
        // };

        //newTracks.push(ob);

        //setTrackFile(newTracks[0].file);

        // console.log('file: ' + newTracks[0].file);
        // console.log('newTracks length interval: ' + newTracks.length);

        var chordSequence = 'blocked';

        if (intervalmode == 1) {
          chordSequence = 'broken';
        }

        var filename = question.file.toLowerCase() + chordSequence + '.mp3';
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

    // setCurrentTrack({
    //   name: questions[0].file,
    // });

    // //console.log('questions: ' + JSON.stringify(questions));

    // var question = questions[0];

    // console.log('question: ' + JSON.stringify(question));
    // console.log('newTracks: ' + JSON.stringify(newTracks));
    // console.log('theAnswer: ' + JSON.stringify(questions[0].Answers));
  };

  var modename;

  //console.log('IL mode: ' + mode);

  if (mode === 2) {
    modename = 'Interval Training';
  } else {
    modename = 'Pitch Recognition';
  }

  //console.log('IL modename: ' + modename);

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
                  color: '#3AB24A',
                  width: '95%',
                }}>
                Quiz - Interval Training Level {level}
              </Text>

              <Text style={styles.scaleHeader}>C Major Scale</Text>

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

              {level > 1 ? (
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
                    }}>
                    <TouchableOpacity
                      disabled={!canPlay}
                      onPress={onButtonPressed}
                      style={{marginRight: 12}}>
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
              ) : null}
            </View>

            <ScrollView style={{paddingLeft: 20, paddingRight: 20}}>
              {answers
                ? answers.map((ob, index) => {
                    return (
                      // <TouchableOpacity
                      //   onPress={() => selectAnswer2('Perfect 4th')}>
                      <View
                        key={index}
                        style={{
                          height: 65,
                          backgroundColor: selectionColors[index],
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
                          disabled={!canCheck}
                          onClick={() => {
                            setChecked(ob);
                          }}
                          isChecked={currentAnswer === ob}
                          checkedImage={
                            <Image source={enabledImg} style={styles.enabled} />
                          }
                          unCheckedImage={
                            <Image
                              source={disabledImg}
                              style={styles.disabled}
                            />
                          }
                        />
                        <Text key={ob}>{ob}</Text>
                      </View>
                      //</TouchableOpacity>
                    );
                  })
                : null}
            </ScrollView>
            <TouchableOpacity
              onPress={() => selectAnswer2()}
              disabled={!canAnswer}
              style={{
                height: 60,
                backgroundColor: canAnswer === true ? '#3AB24A' : 'gray',
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
        </>
      ) : quizFinished ? (
        <ResultsViewInterval
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

//export default IntervalLevels;
export default connect(mapStateToProps, {saveTestScore, saveProgress})(
  IntervalLevels,
);

let offset = 100;

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
  scaleHeader: {
    fontSize: 18,
    fontFamily: 'Helvetica Neue',
    fontWeight: 'bold',
    marginTop: 20,
  },
});
