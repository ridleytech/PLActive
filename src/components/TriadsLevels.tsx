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
import ResultsViewTriads from './ResultsViewTriads';
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

const TraidsLevels = ({level, mode, props}) => {
  const dispatch = useDispatch();
  const accessFeature = useSelector((state) => state.accessFeature);
  const triadmode = useSelector((state) => state.triadmode);

  const highestCompletedTriadsBlockedLevel = useSelector(
    (state) => state.highestCompletedTriadsBlockedLevel,
  );

  const highestCompletedTriadsBrokenLevel = useSelector(
    (state) => state.highestCompletedTriadsBrokenLevel,
  );

  //console.log('selectedLevel: ' + level);

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
  const [passScore, setPassScore] = useState(0);

  const [selectionColors, setSelectionColors] = useState([
    '#EFEFEF',
    '#EFEFEF',
    '#EFEFEF',
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

  useEffect(() => {
    console.log('triads level changed');
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

          if (seconds1 == 0) {
            setIsActive(false);
            setIsPlaying(false);
            setSliderValue(0);
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

  const nextQuestion = () => {
    var currentQuestion1 = currentQuestionInd;

    setSelectionColors([
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
    ]);

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

        //audioClip.play();

        audioClip.setCategory('Playback');
      });
      setCurrentQuestionInd(currentQuestion1);
      populateAnswers(questionList, currentQuestion1);
    } else {
      console.log('set quiz finished');
      setisQuizTimerActive(false);
      setQuizFinished(true);
      setQuizStarted(false);
    }
  };

  //init load

  useEffect(() => {
    if (level > 1) {
      // console.log('on load int');
      // console.log('loadCount int: ' + loadCount);

      var lc = loadCount;
      lc++;
      setLoadCount(lc);
    }

    populateInstructions();
  }, []);

  const populateInstructions = () => {
    console.log('populate instructions: ' + level);

    var instructions; // = data.Triads.level3Instructions;

    if (level == 1) {
      instructions = shuffle(data.Triads.level1Instructions);
      setPassScore(data.Triads.level1PassScore);
    } else if (level == 2) {
      instructions = shuffle(data.Triads.level2Instructions);
      setPassScore(data.Triads.level2PassScore);
    } else if (level == 3) {
      instructions = shuffle(data.Triads.level3Instructions);
      setPassScore(data.Triads.level3PassScore);
    } else if (level == 4) {
      instructions = shuffle(data.Triads.level4Instructions);
      setPassScore(data.Triads.level4PassScore);
    } else if (level == 5) {
      instructions = shuffle(data.Sevenths.level5Instructions);
      setPassScore(data.Sevenths.level5PassScore);
    } else if (level == 6) {
      instructions = shuffle(data.Sevenths.level6Instructions);
      setPassScore(data.Sevenths.level6PassScore);
    } else if (level == 7) {
      instructions = shuffle(data.Sevenths.level7Instructions);
      setPassScore(data.Sevenths.level7PassScore);
    } else if (level == 8) {
      instructions = shuffle(data.Sevenths.level8Instructions);
      setPassScore(data.Sevenths.level8PassScore);
    } else if (level == 9) {
      instructions = shuffle(data.Sevenths.level9Instructions);
      setPassScore(data.Sevenths.level9PassScore);
    } else if (level == 10) {
      instructions = shuffle(data.Sevenths.level10Instructions);
      setPassScore(data.Sevenths.level10PassScore);
    }

    setInstructions(instructions);
  };

  useEffect(() => {
    if (passScore > 0) {
      console.log('passScore: ' + passScore);
    }
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

      if (per >= passScore) {
        console.log('store data');

        if (triadmode == 1) {
          dispatch({
            type: 'SET_TRIADS_BROKEN_PROGRESS',
            level: {highestCompletedTriadsBrokenLevel: level.toString()},
          });
        } else {
          dispatch({
            type: 'SET_TRIADS_BLOCKED_PROGRESS',
            level: {highestCompletedTriadsBlockedLevel: level.toString()},
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
    console.log('postLeaderboard triads');
    dispatch(saveTestScore(score, quizTime));

    dispatch({type: 'SET_MODE', mode: 0});
    dispatch({type: 'SET_LEVEL', level: 0});
    props.navigation.navigate('LEADER BOARD');
  };

  //unmount

  useEffect(
    () => () => {
      //console.log('unmount');

      setisQuizTimerActive(false);

      if (audioClip) {
        audioClip.release();
        audioClip = null;
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
      audioClip.play();
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

    console.log('answerList triads: ' + JSON.stringify(al));

    var currentQuestion = questionList[currentQuestionInd];

    currentQuestion.userAnswer = currentAnswer;

    var sc = selectionColors.slice();
    var answerInd = answers.indexOf(currentAnswer);

    console.log('currentAnswer: ' + JSON.stringify(currentAnswer));

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

    setTimeout(() => {
      setCurrentAnswer(null);
      setCanCheck(true);
      nextQuestion();
      setAnswerState('#E2E7ED');
    }, 2000);
  };

  const debugResults = () => {
    console.log('debugResults');

    dispatch({
      type: 'SET_TRIADS_PROGRESS',
      level: {highestCompletedTriadsLevel: level.toString()},
    });

    setCorrectAnswers(12);
    setQuizFinished(true);
    setQuizStarted(false);
  };

  const mainMenu = (passed) => {
    console.log(`main menu triads ${level} passed: ${passed}`);

    if (!passed) {
    } else {
      var currentLevel = level;

      if (loggedIn) {
        if (passed) {
          if (currentLevel == 10) {
            //was last level. go to main menu
            console.log('last level. go to main');
            dispatch({type: 'SET_MODE', mode: 0});
            dispatch({type: 'SET_LEVEL', level: 0});
            props.navigation.navigate('CHALLENGES');
          } else {
            dispatch({type: 'SET_MODE', mode: 3});
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
    if (triadmode == 1) {
      console.log(`highestCompletedTriadsBrokenLevel: ${level}`);

      if (level < highestCompletedTriadsBrokenLevel) {
        console.log('less than highest level. stop save');
        return;
      }

      try {
        console.log('try to save highestCompletedTriadsBrokenLevel');
        await AsyncStorage.setItem(
          'highestCompletedTriadsBrokenLevel',
          level.toString(),
        );

        console.log('highestCompletedTriadsBrokenLevel saved');
      } catch (error) {
        console.log('highestCompletedTriadsBrokenLevel not saved');
        // Error saving data
      }
    } else {
      console.log(`highestCompletedTriadsBlockedLevel: ${level}`);

      if (level < highestCompletedTriadsBlockedLevel) {
        console.log('less than highest level. stop save');
        return;
      }

      try {
        console.log('try to save highestCompletedTriadsBlockedLevel');
        await AsyncStorage.setItem(
          'highestCompletedTriadsBlockedLevel',
          level.toString(),
        );

        console.log('highestCompletedTriadsBlockedLevel saved');
      } catch (error) {
        console.log('highestCompletedTriadsBlockedLevel not saved');
        // Error saving data
      }
    }
  };

  const populateAnswers = (questions, ind) => {
    //console.log('populateAnswers');
    var answersData; // = shuffle(data.Triads.level3Answers);

    if (level == 1) {
      answersData = shuffle(data.Triads.level1Answers);
    } else if (level == 2) {
      answersData = shuffle(data.Triads.level2Answers);
    } else if (level == 3) {
      answersData = shuffle(data.Triads.level3Answers);
    } else if (level == 4) {
      answersData = shuffle(data.Triads.level4Answers);
    } else if (level == 5) {
      answersData = shuffle(data.Sevenths.level5Answers);
    } else if (level == 6) {
      answersData = shuffle(data.Sevenths.level6Answers);
    } else if (level == 7) {
      answersData = shuffle(data.Sevenths.level7Answers);
    } else if (level == 8) {
      answersData = shuffle(data.Sevenths.level8Answers);
    } else if (level == 9) {
      answersData = shuffle(data.Sevenths.level9Answers);
    } else if (level == 10) {
      answersData = shuffle(data.Sevenths.level10Answers);
    }

    //console.log('answersData: ' + answersData);

    // var answer = questions[ind].Answer;

    // //console.log('question answer: ' + answer);

    // var answerInd = answersData.indexOf(answer);

    // //console.log('answerInd: ' + answerInd);

    // var answers = [];
    // var answerTxt = answersData[answerInd];
    // answers.push(answerTxt);

    // var ind = 0;

    // for (var i = 0; i < answersData.length; i++) {
    //   if (ind > 2) {
    //     break;
    //   }

    //   if (answersData[i] != answer) {
    //     answers.push(answersData[i]);
    //     ind++;
    //   }
    // }

    //var shuffledAnswers = shuffle(answers);

    //console.log(`shuffledAnswers: ${shuffledAnswers}`);

    setAnswers(answersData);
  };

  const populateAnswers1 = (questions, ind) => {
    //console.log('populateAnswers');
    var answersData; // = shuffle(data.Triads.level3Answers);

    if (level == 1) {
      answersData = shuffle(data.Triads.level1Answers);
    } else if (level == 2) {
      answersData = shuffle(data.Triads.level2Answers);
    } else if (level == 3) {
      answersData = shuffle(data.Triads.level3Answers);
    } else if (level == 4) {
      answersData = shuffle(data.Triads.level4Answers);
    } else if (level == 5) {
      answersData = shuffle(data.Triads.level5Answers);
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

    var stuff = data.Triads.Chords;

    if (level == 10) {
      // var newStuff = ['C', 'D', 'E', 'F'];

      // stuff.concat(newStuff);

      stuff.push('C');
      stuff.push('D');
      stuff.push('E');
      stuff.push('F');
    }

    var questions = shuffle(stuff);
    var qualites;

    if (level == 1) {
      qualites = data.Triads.level1Answers;
    } else if (level == 2) {
      qualites = data.Triads.level2Answers;
    } else if (level == 3) {
      qualites = data.Triads.level3Answers;
    } else if (level == 4) {
      qualites = data.Triads.level4Answers;
    } else if (level == 5) {
      qualites = data.Sevenths.level5Answers;
    } else if (level == 6) {
      qualites = data.Sevenths.level6Answers;
    } else if (level == 7) {
      qualites = data.Sevenths.level7Answers;
    } else if (level == 8) {
      qualites = data.Sevenths.level8Answers;
    } else if (level == 9) {
      qualites = data.Sevenths.level9Answers;
    } else if (level == 10) {
      qualites = data.Sevenths.level10Answers;
    }

    //console.log('theAnswer: ' + answerInd);

    console.log('triads questions: ' + JSON.stringify(questions));

    var newQuestions = [];

    console.log('qualites: ' + JSON.stringify(qualites));

    questions.map((question) => {
      var randQualityInd;

      if (level == 1) {
        //if level 1, only choose major and minor
        randQualityInd = Math.floor(Math.random() * 2);
      } else {
        randQualityInd = Math.floor(Math.random() * qualites.length);
      }

      //console.log('randQualityInd: ' + randQualityInd);
      //console.log('randQuestionInd: ' + JSON.stringify(randQuestionInd));

      var note = {};

      var chordSequence = 'blocked';

      if (triadmode == 1) {
        chordSequence = 'broken';
      }

      var quality = qualites[randQualityInd];

      //console.log('quality: ' + quality);

      var chordType = 'triad';
      var qualityfile = quality;

      //console.log('qualityfile1: ' + qualityfile);

      qualityfile = qualityfile.replace(' ', '');

      //console.log('qualityfile2: ' + qualityfile);

      if (level > 4) {
        chordType = 'seventh';
        qualityfile = qualityfile.replace('7', '').trim();
      }

      //console.log('qualityfile3: ' + qualityfile);

      var filename = qualityfile + chordType + chordSequence + question;

      // chordType = 'seventh';
      // quality = 'minor b5';

      if (quality.includes('b5')) {
        filename = 'minor' + chordType + 'b5' + chordSequence + question;
      }

      //console.log('theAnswer: ' + JSON.stringify(note.Answer));

      note.file = filename.toLowerCase();
      note.note = question;
      note.Answer = quality;

      //console.log('note: ' + JSON.stringify(note));

      newQuestions.push(note);
    });

    newQuestions = shuffle(newQuestions);

    //return;

    setCurrentQuestionInd(0);
    setCurrentAnswer('');
    setCorrectAnswers(0);
    setQuestionList(newQuestions);
    setAnswerList([]);
    populateAnswers(questions, 0);

    setQuizStarted(true);
    setRestarted(false);
    setQuizFinished(false);

    console.log('newQuestions: ' + JSON.stringify(newQuestions));

    //if (level > 1) {
    var newTracks = [];

    newQuestions.map((question) => {
      var ob = {
        file: question.file.toLowerCase() + '.mp3',
      };

      newTracks.push(ob);
    });

    setTrackFile(newTracks[0].file);

    console.log('file: ' + newTracks[0].file);
    console.log('newTracks length triads: ' + newTracks.length);

    audioClip = new Sound(newTracks[0].file, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound ' + newTracks[0].file, error);
        return;
      }
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
      name: newQuestions[0].file,
    });

    console.log('newTracks: ' + JSON.stringify(newTracks));
    //}

    //console.log('questions: ' + JSON.stringify(questions));

    var question = newQuestions[0];

    console.log('question: ' + JSON.stringify(question));
    console.log('theAnswer: ' + JSON.stringify(question.Answer));
  };

  var modename = 'Triads and Sevenths';

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
                Quiz - Triads and Sevenths Level {level}
              </Text>

              {/* <Text style={styles.scaleHeader}>C Major Scale</Text> */}

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
                Identify the quality of the chord.
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
                  }}>
                  <TouchableOpacity
                    onPress={onButtonPressed}
                    style={{marginRight: 12}}>
                    {isPlaying ? (
                      <Image
                        source={pauseImg}
                        style={{width: 25, height: 25}}
                      />
                    ) : (
                      <Image source={playImg} style={{width: 25, height: 25}} />
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

            <ScrollView
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingLeft: 20,
                paddingRight: 20,
                //backgroundColor: 'red',
              }}>
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
                          //overflow: 'hidden',
                          alignContent: 'center',
                          paddingLeft: 18,
                          //display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginRight: 10,
                          width: '47.3%',
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
        <ResultsViewTriads
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

//export default TraidsLevels;
export default connect(mapStateToProps, {saveTestScore, saveProgress})(
  TraidsLevels,
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
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 20,
    paddingRight: 20,
  },
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
