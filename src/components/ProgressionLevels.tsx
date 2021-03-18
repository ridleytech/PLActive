import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  Button,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
  Linking,
  TouchableNativeFeedbackBase,
  KeyboardAvoidingView,
} from 'react-native';

import {useDispatch, useSelector, connect} from 'react-redux';
import Slider from '@react-native-community/slider';
//import styles from './styles';
import data from '../data/questions.json';
import playImg from '../../images/play-btn2.png';
import pauseImg from '../../images/pause-btn2.png';
import Instructions from './Instructions';
import ResultsViewProgression from './ResultsViewProgression';
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

const {height, width} = Dimensions.get('window');

const ProgressionLevels = ({level, mode, props}) => {
  const dispatch = useDispatch();
  const accessFeature = useSelector((state) => state.accessFeature);
  const highestCompletedProgressionLevel = useSelector(
    (state) => state.highestCompletedProgressionLevel,
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
  const [currentAnswerList, setCurrentAnswerList] = useState([null]);
  const [storedData, setStoredData] = useState(null);
  const [passScore, setPassScore] = useState(0);

  const [selectionColors, setSelectionColors] = useState([
    '#EFEFEF',
    '#EFEFEF',
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
  const [canAnswer, setCanAnswer] = useState(true);
  const [canCheck, setCanCheck] = useState(true);

  const [answerState, setAnswerState] = useState('#E2E7ED');

  const loggedIn = useSelector((state) => state.loggedIn);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [quizTime, setQuizTime] = useState(0);
  const [isQuizTimerActive, setisQuizTimerActive] = useState(false);
  const [score, setScore] = useState(0);

  const txt0 = useRef(null);
  const txt1 = useRef(null);
  const txt2 = useRef(null);
  const txt3 = useRef(null);
  const txt4 = useRef(null);
  const txt5 = useRef(null);
  const txt6 = useRef(null);
  const txt7 = useRef(null);
  const txt8 = useRef(null);

  useEffect(() => {
    console.log('base level changed');
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

    setSelectionColors([
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
      '#EFEFEF',
    ]);
    setCurrentAnswerList([]);

    if (currentQuestion1 < questionList.length - 1) {
      currentQuestion1 += 1;

      console.log(
        'currentQuestion next: ' +
          JSON.stringify(questionList[currentQuestion1]),
      );

      if (level > 0) {
        setCurrentTrack({
          name: questionList[currentQuestion1].file,
          id: currentQuestion1.toString(),
        });

        var filename =
          questionList[currentQuestion1].file.toLowerCase() + '.mp3';

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
      setCurrentAnswerList([
        questionList[currentQuestion1].Answers[0],
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ]);
      setCurrentQuestionInd(currentQuestion1);
      //populateAnswers(questionList, currentQuestion1);
    } else {
      console.log('set quiz finished');
      setisQuizTimerActive(false);
      setQuizFinished(true);
      setQuizStarted(false);
    }
  };

  //init load

  useEffect(() => {
    // if (level > 0) {
    //   // console.log('on load int');
    //   // console.log('loadCount int: ' + loadCount);

    // }

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

  useEffect(() => {
    console.log('currentAnswerList: ' + currentAnswerList);
  }, [currentAnswerList]);

  const populateInstructions = () => {
    console.log('populate instructions: ' + level);

    var instructions; // = data.Progression.level3Instructions;

    if (level == 1) {
      instructions = data.Progression.level1Instructions;
      setPassScore(data.Progression.level1PassScore);
    } else if (level == 2) {
      instructions = data.Progression.level2Instructions;
      setPassScore(data.Progression.level2PassScore);
    } else if (level == 3) {
      instructions = data.Progression.level3Instructions;
      setPassScore(data.Progression.level3PassScore);
    } else if (level == 4) {
      instructions = data.Progression.level4Instructions;
      setPassScore(data.Progression.level4PassScore);
    } else if (level == 5) {
      instructions = data.Progression.level5Instructions;
      setPassScore(data.Progression.level5PassScore);
    } else if (level == 6) {
      instructions = data.Progression.level6Instructions;
      setPassScore(data.Progression.level6PassScore);
    } else if (level == 7) {
      instructions = data.Progression.level7Instructions;
      setPassScore(data.Progression.level7PassScore);
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

        dispatch({
          type: 'SET_PROGRESSION_PROGRESS',
          level: {highestCompletedProgressionLevel: level.toString()},
        });

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
    console.log('postLeaderboard base');
    dispatch(saveTestScore(score, quizTime));

    dispatch({type: 'SET_MODE', mode: 0});
    dispatch({type: 'SET_LEVEL', level: 0});
    dispatch({type: 'SET_LEADERBOARD_MODE', mode: 5});
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

  const filterBlanks = (ob) => {
    return ob != '';
  };

  const selectAnswer2 = () => {
    var al = answerList.slice();

    txt0.current.blur();
    txt1.current.blur();
    txt2.current.blur();
    txt3.current.blur();
    txt4.current.blur();
    txt5.current.blur();
    txt6.current.blur();
    txt7.current.blur();
    txt8.current.blur();

    console.log('answerList: ' + JSON.stringify(al));

    var currentQuestion = questionList[currentQuestionInd];

    console.log('currentQuestion: ' + JSON.stringify(currentQuestion));

    var fca = currentAnswerList.filter(filterBlanks);

    console.log('fca: ' + fca);

    currentQuestion.userAnswer = fca;

    console.log('current answer: ' + currentQuestion.Answers);

    var isCorrect = true;
    var sc = selectionColors.slice();

    var lookup = {
      db: 'c#',
      eb: 'd#',
      gb: 'f#',
      ab: 'g#',
      bb: 'a#',
    };

    currentQuestion.Answers.map((answer, index) => {
      console.log(
        'answer' + index + ':' + answer + ' user: ' + currentAnswerList[index],
      );

      // if(answer == "Db" || answer == "C#")
      // {
      //   currentAnswerList[index]
      // }

      var hasAccidental = lookup[currentAnswerList[index].toLowerCase()];

      if (hasAccidental) {
        console.log('hasAccidental: ' + hasAccidental);
      } else {
        hasAccidental = '';
      }

      if (
        answer.toLowerCase() == currentAnswerList[index].toLowerCase() ||
        answer.toLowerCase() == hasAccidental.toLowerCase()
      ) {
        console.log('correct');
        sc[index] = 'rgb( 114,255,133)';
      } else {
        //console.log('correct');
        isCorrect = false;
        sc[index] = 'rgb(255,93,93)';
      }
    });

    currentQuestion.isCorrect = isCorrect;

    console.log('result: ' + isCorrect);

    // console.log(
    //   'currentQuestion.userAnswer: ' +
    //     JSON.stringify(currentQuestion.userAnswer),
    // );

    // var sc = selectionColors.slice();
    // var answerInd = answers.indexOf(currentAnswer);

    if (isCorrect) {
      var ca = correctAnswers;
      ca++;
      setCorrectAnswers(ca);

      //sc[answerInd] = 'rgb( 114,255,133)';

      console.log('correct');
    } else {
      console.log('not');
      //sc[answerInd] = 'rgb(255,93,93)';
    }

    setSelectionColors(sc);

    al.push(questionList[currentQuestionInd]);

    setAnswerList(al);

    //setCanAnswer(false);
    setCanCheck(false);
    setCanPlay(false);

    stopAudio();

    setTimeout(() => {
      setCurrentAnswer(null);
      setCanCheck(true);
      setCanPlay(true);

      nextQuestion();
      setAnswerState('#E2E7ED');
    }, 2000);
  };

  const debugResults = () => {
    console.log('debugResults');
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
      level: {highestCompletedProgressionLevel: level.toString()},
    });

    setCorrectAnswers(12);
    setQuizFinished(true);
    setQuizStarted(false);
  };

  const mainMenu = (passed) => {
    console.log(`main menu base ${level} passed: ${passed}`);

    if (!passed) {
    } else {
      var currentLevel = level;

      if (loggedIn) {
        if (passed) {
          if (currentLevel == 4) {
            //was last level. go to main menu
            console.log('last level. go to main');
            dispatch({type: 'SET_MODE', mode: 0});
            dispatch({type: 'SET_LEVEL', level: 0});
            props.navigation.navigate('CHALLENGES');
          } else {
            dispatch({type: 'SET_MODE', mode: 5});
            dispatch({type: 'SET_LEVEL', level: currentLevel + 1});

            console.log(`set level: ${currentLevel + 1}`);
          }
          //dispatch(saveProgress(level));
        } else {
          console.log('restart quiz');
        }
      } else {
        //upgrade();
        //show login

        if (accessFeature > 0) {
          dispatch({type: 'SET_MODE', mode: 0});
          dispatch({type: 'SET_LEVEL', level: 0});
          dispatch({type: 'SHOW_LOGIN'});
          props.navigation.navigate('CHALLENGES');
        } else {
          dispatch({type: 'SET_MODE', mode: 5});
          dispatch({type: 'SET_LEVEL', level: currentLevel + 1});

          console.log(`set level: ${currentLevel + 1}`);
        }
      }
    }

    //move to level update method

    setRestarted(true);
    setCurrentAnswer(null);
    setCorrectAnswers(0);
  };

  const storeData = async (level) => {
    console.log(`highestCompletedProgressionLevel: ${level}`);

    if (level < highestCompletedProgressionLevel) {
      console.log('less than highest level. stop save');
      return;
    }

    try {
      console.log('try to save highestCompletedProgressionLevel');
      await AsyncStorage.setItem(
        'highestCompletedProgressionLevel',
        level.toString(),
      );

      console.log('highestCompletedProgressionLevel saved');
    } catch (error) {
      console.log('highestCompletedProgressionLevel not saved');
      // Error saving data
    }
  };

  const populateAnswers = (questions, ind) => {
    console.log('populateAnswers');
    var answersData; // = shuffle(data.Progression.level3Answers);

    if (level == 1) {
      answersData = shuffle(data.Progression.level1Answers);
    } else if (level == 2) {
      answersData = shuffle(data.Progression.level2Answers);
    } else if (level == 3) {
      answersData = shuffle(data.Progression.level3Answers);
    } else if (level == 4) {
      answersData = shuffle(data.Progression.level4Answers);
    }

    console.log('answersData: ' + JSON.stringify(answersData));

    console.log('questions: ' + JSON.stringify(questions));

    console.log('questions[ind]: ' + JSON.stringify(questions[ind]));

    // var answer = questions[ind].Answer;

    // console.log('question answer: ' + answer);

    // var answerInd = answersData.indexOf(answer);

    // console.log('answerInd: ' + answerInd);

    var answers = [];
    // var answerTxt = answersData[answerInd];
    // answers.push(answerTxt);

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
    //console.log('window width: ' + width);

    setisQuizTimerActive(true);

    var questions = [];

    if (level == 1) {
      questions = shuffle(data.Progression.level1Questions);
    } else if (level == 2) {
      questions = shuffle(data.Progression.level2Questions);
    } else if (level == 3) {
      questions = shuffle(data.Progression.level3Questions);
    } else if (level == 4) {
      questions = shuffle(data.Progression.level4Questions);
    } else if (level == 5) {
      questions = shuffle(data.Progression.level5Questions);
    } else if (level == 6) {
      questions = shuffle(data.Progression.level6Questions);
    } else if (level == 7) {
      questions = shuffle(data.Progression.level7Questions);
    }

    //console.log('theAnswer: ' + answerInd);

    console.log('base questions: ' + JSON.stringify(questions));

    setCurrentQuestionInd(0);
    setCurrentAnswer('');
    setCorrectAnswers(0);
    setAnswerList([]);
    //populateAnswers(questions, 0);

    setQuizStarted(true);
    setRestarted(false);
    setQuizFinished(false);

    if (level > 0) {
      console.log('level: ' + JSON.stringify(level));

      var newTracks = [];

      questions.map((question) => {
        var filename = question.file.toLowerCase();

        console.log('filename: ' + filename);

        var ob = {
          file: filename + '.mp3',
        };

        question.file = filename;

        newTracks.push(ob);
      });

      console.log('base questions2: ' + JSON.stringify(questions));

      setTrackFile(newTracks[0].file);

      console.log('file: ' + newTracks[0].file);

      console.log('newTracks length base: ' + newTracks.length);

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

      setCanPlay(true);

      setCurrentTrack({
        name: questions[0].file,
      });

      console.log('newTracks: ' + JSON.stringify(newTracks));
    }

    setQuestionList(questions);

    //console.log('questions: ' + JSON.stringify(questions));

    var question = questions[0];

    setCurrentAnswerList([
      questions[0].Answers[0],
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);

    console.log('question: ' + JSON.stringify(question));
    console.log('theAnswer: ' + JSON.stringify(questions[0].Answers));
  };

  // restore current test

  const retrieveTestData = async () => {
    try {
      var value = await AsyncStorage.getItem('progressionTestProgress' + level);

      if (value !== null) {
        // We have data!!
        console.log(`progressionTestProgress${level}: ${value}`);

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
        console.log(`no saved progressionTestProgress${level} data`);

        value = 0;
        //this.storePitchData(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const removeTestData = async () => {
    try {
      await AsyncStorage.removeItem('progressionTestProgress' + level);

      console.log(`progressionTestProgress${level} deleted`);
    } catch (error) {
      // Error saving data
      console.log(`cant delete progressionTestProgress${level}`);
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
      await AsyncStorage.setItem('progressionTestProgress' + level, formatted);

      console.log(`progressionTestProgress${level} stored`);
    } catch (error) {
      // Error saving data
      console.log(`cant create progressionTestProgress${level}: ` + error);
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

    setCurrentAnswerList([question.Answers[0], '', '', '', '', '', '', '', '']);
  };

  const debugAudio = () => {
    console.log('debugAudio');

    setisQuizTimerActive(true);

    var questions = [];

    if (level == 1) {
      questions = shuffle(data.Progression.level1Questions);
    } else if (level == 2) {
      questions = shuffle(data.Progression.level2Questions);
    } else if (level == 3) {
      questions = shuffle(data.Progression.level3Questions);
    } else if (level == 4) {
      questions = shuffle(data.Progression.level4Questions);
    } else if (level == 5) {
      questions = shuffle(data.Progression.level5Questions);
    } else if (level == 6) {
      questions = shuffle(data.Progression.level6Questions);
    } else if (level == 7) {
      questions = shuffle(data.Progression.level7Questions);
    }

    //console.log('theAnswer: ' + answerInd);

    console.log('base questions: ' + JSON.stringify(questions));

    setCurrentQuestionInd(0);
    setCurrentAnswer('');
    setCorrectAnswers(0);
    setQuestionList(questions);
    setAnswerList([]);
    //populateAnswers(questions, 0);

    setQuizStarted(true);
    setRestarted(false);
    setQuizFinished(false);

    if (level > 0) {
      var newTracks = [];

      questions.map((question) => {
        // var ob = {
        //   file: question.file.toLowerCase() + '.mp3',
        // };

        //newTracks.push(ob);

        //setTrackFile(newTracks[0].file);

        // console.log('file: ' + newTracks[0].file);
        // console.log('newTracks length base: ' + newTracks.length);

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

    // setCurrentTrack({
    //   name: questions[0].file,
    // });

    // //console.log('questions: ' + JSON.stringify(questions));

    // var question = questions[0];

    // console.log('question: ' + JSON.stringify(question));
    // console.log('newTracks: ' + JSON.stringify(newTracks));
    // console.log('theAnswer: ' + JSON.stringify(questions[0].Answers));
  };

  const hasLetter = (inputtxt) => {
    console.log('inputtxt: ' + inputtxt);

    //[a-gA-G]{1}[bB|#]

    var letters = /[a-zA-Z]/g;

    var count = (inputtxt.match(letters) || []).length;

    console.log('count: ' + count);

    return count;

    // if (inputtxt.match(letters)) {
    //   return true;
    // } else {
    //   //alert('message');
    //   return false;
    // }
  };

  const changeVal = (val, index) => {
    console.log('val: ' + val + ' index: ' + index);
    if (val) {
      var cal = currentAnswerList;

      // if (cal[index]) {
      //   console.log('has letter: ' + hasLetter(cal[index]));
      // }

      //console.log('has letter: ' + hasLetter(cal[index]));

      //var count = hasLetter(cal[index]);

      // console.log('count: ' + count);

      // if (count > 1) {
      //   return;
      // }

      cal[index] = val;
      console.log('updated cal: ' + cal);

      //return if val contains letter and not "b" or "#"

      setCurrentAnswerList(cal);
    } else {
      // setCurrentAnswer(null);
      // setCanAnswer(false);
    }

    setCanAnswer(true);
  };

  var modename = 'Progression Training';

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
                Quiz - Progression Training Level {level}
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
                {level < 4
                  ? 'Listen to the chord progression below, then write the chord (using the number system) in the boxes.'
                  : 'Listen to the chord progression below, then write the chord name and quality in the boxes.'}
              </Text>

              {level > 0 ? (
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
            <ScrollView
              style={
                {
                  //backgroundColor: 'red'
                }
              }>
              <View
                style={{
                  paddingLeft: '5%',
                  paddingRight: '5%',
                  //height: '100%',
                  //backgroundColor: 'pink',
                  paddingTop: 20,
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    //backgroundColor: 'yellow',
                  }}>
                  <TextInput
                    keyboardType={level < 4 ? 'number-pad' : 'ascii-capable'}
                    maxLength={6}
                    ref={txt0}
                    onChangeText={(text) => changeVal(text, 0)}
                    style={[
                      styles.inputTxt,
                      {marginRight: 10, backgroundColor: selectionColors[0]},
                    ]}
                    key={questionList[currentQuestionInd].Answers[0]}>
                    {questionList[currentQuestionInd].Answers[0]}
                  </TextInput>
                  <TextInput
                    keyboardType={level < 4 ? 'number-pad' : 'ascii-capable'}
                    maxLength={6}
                    ref={txt1}
                    onChangeText={(text) => changeVal(text, 1)}
                    style={[
                      styles.inputTxt,
                      {
                        marginRight: 10,
                        backgroundColor: selectionColors[1],
                      },
                    ]}
                    key={'1a'}>
                    {currentAnswerList[1]}
                  </TextInput>
                  <TextInput
                    keyboardType={level < 4 ? 'number-pad' : 'ascii-capable'}
                    maxLength={6}
                    ref={txt2}
                    onChangeText={(text) => changeVal(text, 2)}
                    style={[
                      styles.inputTxt,
                      {
                        //backgroundColor: 'green'
                        backgroundColor: selectionColors[2],
                      },
                    ]}
                    key={'2a'}>
                    {currentAnswerList[2]}
                  </TextInput>

                  <TextInput
                    keyboardType={level < 4 ? 'number-pad' : 'ascii-capable'}
                    maxLength={6}
                    ref={txt3}
                    onChangeText={(text) => changeVal(text, 3)}
                    style={[
                      styles.inputTxt,
                      {
                        marginRight: 10,
                        display: questionList[currentQuestionInd].Answers[3]
                          ? 'flex'
                          : 'none',
                        backgroundColor: selectionColors[3],
                      },
                    ]}
                    key={'3a'}>
                    {currentAnswerList[3]}
                  </TextInput>
                  <TextInput
                    keyboardType={level < 4 ? 'number-pad' : 'ascii-capable'}
                    maxLength={6}
                    ref={txt4}
                    onChangeText={(text) => changeVal(text, 4)}
                    style={[
                      styles.inputTxt,
                      {
                        marginRight: 10,
                        display: questionList[currentQuestionInd].Answers[4]
                          ? 'flex'
                          : 'none',
                        backgroundColor: selectionColors[4],
                      },
                    ]}
                    key={'4a'}>
                    {currentAnswerList[4]}
                  </TextInput>
                  <TextInput
                    keyboardType={level < 4 ? 'number-pad' : 'ascii-capable'}
                    maxLength={6}
                    ref={txt5}
                    onChangeText={(text) => changeVal(text, 5)}
                    style={[
                      styles.inputTxt,
                      {
                        display: questionList[currentQuestionInd].Answers[5]
                          ? 'flex'
                          : 'none',
                        backgroundColor: selectionColors[5],
                      },
                    ]}
                    key={'5a'}>
                    {currentAnswerList[5]}
                  </TextInput>
                  <TextInput
                    keyboardType={level < 4 ? 'number-pad' : 'ascii-capable'}
                    maxLength={6}
                    ref={txt6}
                    onChangeText={(text) => changeVal(text, 6)}
                    style={[
                      styles.inputTxt,
                      {
                        marginRight: 10,
                        display: questionList[currentQuestionInd].Answers[6]
                          ? 'flex'
                          : 'none',
                        backgroundColor: selectionColors[6],
                      },
                    ]}
                    key={'6a'}>
                    {currentAnswerList[6]}
                  </TextInput>
                  <TextInput
                    keyboardType={level < 4 ? 'number-pad' : 'ascii-capable'}
                    maxLength={6}
                    ref={txt7}
                    onChangeText={(text) => changeVal(text, 7)}
                    style={[
                      styles.inputTxt,
                      {
                        marginRight: 10,
                        display: questionList[currentQuestionInd].Answers[7]
                          ? 'flex'
                          : 'none',
                        backgroundColor: selectionColors[7],
                      },
                    ]}
                    key={'7a'}>
                    {currentAnswerList[7]}
                  </TextInput>
                  <TextInput
                    keyboardType={level < 4 ? 'number-pad' : 'ascii-capable'}
                    maxLength={6}
                    ref={txt8}
                    onChangeText={(text) => changeVal(text, 8)}
                    style={[
                      styles.inputTxt,
                      {
                        display: questionList[currentQuestionInd].Answers[8]
                          ? 'flex'
                          : 'none',
                        backgroundColor: selectionColors[8],
                      },
                    ]}
                    key={'8a'}>
                    {currentAnswerList[8]}
                  </TextInput>
                  <View style={{height: 500, width: 20}} />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => selectAnswer2()}
              disabled={!canAnswer}
              style={{
                height: 60,
                backgroundColor: canAnswer === true ? '#3AB24A' : 'gray',
                justifyContent: 'center',
                alignItems: 'center',
                bottom: 0,
                width: '100%',
                position: 'absolute',
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
        <ResultsViewProgression
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
          hasAudio={true}
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

//export default ProgressionLevels;
export default connect(mapStateToProps, {saveTestScore, saveProgress})(
  ProgressionLevels,
);

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
  inputTxt: {
    height: 50,
    //backgroundColor: 'lightgray',
    //width: width > 450 ? '32.5%' : '31.5%',
    width: width > 450 ? '32.5%' : width < 400 ? '30.5%' : '31.5%',
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 10,
  },
});
