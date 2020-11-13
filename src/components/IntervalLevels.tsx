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
  AsyncStorage,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import Slider from '@react-native-community/slider';
//import styles from './styles';
import CheckBox from 'react-native-check-box';
import data from '../data/questions.json';
import enabledImg from '../../images/checkbox-enabled.png';
import disabledImg from '../../images/checkbox-disabled.png';
import playImg from '../../images/play-btn2.png';
import pauseImg from '../../images/pause-btn2.png';
import Instructions from './Instructions';
import ResultsView from './ResultsView';
//import {AsyncStorage} from 'react-native-community/async-storage';
import {saveProgress} from '../thunks/';

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
var currentNote;

const IntervalLevels = ({level, mode}) => {
  const dispatch = useDispatch();

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

  const isTrial = useSelector((state) => state.isTrial);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        //console.log('the seconds: ' + interval);

        currentNote.getCurrentTime((seconds1) => {
          console.log('at ' + seconds1);

          setTrackInfo({
            position: seconds1,
            duration: currentNote.getDuration(),
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

  useEffect(() => {
    console.log('track info changed: ' + JSON.stringify(trackInfo));

    var pos = trackInfo.position / trackInfo.duration;

    console.log('slider val: ' + pos);

    if (pos > 0) {
      setSliderValue(pos);
    }
  }, [trackInfo]);

  const nextQuestion = () => {
    var currentQuestion1 = currentQuestionInd;

    setSelectionColors(['#EFEFEF', '#EFEFEF', '#EFEFEF', '#EFEFEF']);

    if (currentQuestion1 < questionList.length - 1) {
      currentQuestion1 += 1;

      if (level > 1) {
        //TrackPlayer.reset();

        setCurrentTrack({
          name: questionList[currentQuestion1].file,
          id: currentQuestion1.toString(),
        });

        var filename =
          questionList[currentQuestion1].file.toLowerCase() + '.mp3';

        currentNote = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound ' + filename, error);
            return;
          }
          // loaded successfully
          console.log('file ' + filename + ' loaded');

          //currentNote.play();
        });
      }
      setCurrentQuestionInd(currentQuestion1);
      populateAnswers(questionList, currentQuestion1);
    } else {
      setQuizFinished(true);
      setQuizStarted(false);
    }
  };

  useEffect(() => {
    if (level > 1) {
      console.log('on load int');
      console.log('loadCount int: ' + loadCount);

      var lc = loadCount;
      lc++;
      setLoadCount(lc);
    }

    var instructions; // = data.Interval.level3Instructions;

    if (level == 1) {
      instructions = shuffle(data.Interval.level1Instructions);
    } else if (level == 2) {
      instructions = shuffle(data.Interval.level2Instructions);
    } else if (level == 3) {
      instructions = shuffle(data.Interval.level3Instructions);
    } else if (level == 4) {
      instructions = shuffle(data.Interval.level4Instructions);
    } else if (level == 5) {
      instructions = shuffle(data.Interval.level5Instructions);
    }

    setInstructions(instructions);
  }, []);

  //console.log('height: ' + Dimensions.get('screen').height);

  useEffect(() => {
    if (currentTrack) {
      console.log('currentQuestion changed: ' + currentTrack.name);
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
          type: 'SET_INTERVAL_PROGRESS',
          level: {highestCompletedIntervalLevel: level.toString()},
        });

        storeData(level);
      }
    }
  }, [quizFinished]);

  useEffect(
    () => () => {
      console.log('unmount');
      if (currentNote) {
        currentNote.release();
      }
    },
    [],
  );

  useEffect(() => {
    console.log('currentTrack changed');

    // console.log('add track: ' + currentTrack.name);
  }, [currentTrack]);

  const onButtonPressed = () => {
    if (!isPlaying) {
      currentNote.play();
      setIsActive(true);
      setIsPlaying(true);
    } else {
      currentNote.pause();
      setIsPlaying(false);
      setIsActive(false);
    }
  };

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async (value) => {
    currentNote.setCurrentTime(value * trackInfo.duration);
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

    console.log('answerList: ' + JSON.stringify(al));

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
      type: 'SET_INTERVAL_PROGRESS',
      level: {highestCompletedIntervalLevel: level.toString()},
    });

    setCorrectAnswers(12);
    setQuizFinished(true);
    setQuizStarted(false);
  };

  const mainMenu = (passed) => {
    console.log(`mainMenu ${level + 1} ${passed}`);
    //saveProgress();

    var currentLevel = level;

    if (isTrial) {
      dispatch({type: 'SET_MODE', mode: 0});
    } else {
      if (passed) {
        dispatch({type: 'SET_MODE', mode: 2});
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
    console.log(`highestCompletedIntervalLevel: ${level}`);

    try {
      console.log('try to save');
      await AsyncStorage.setItem(
        'highestCompletedIntervalLevel',
        level.toString(),
      );
    } catch (error) {
      // Error saving data
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

    var questions;

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

    if (level > 1) {
      var newTracks = [];

      questions.map((question) => {
        var ob = {
          file: question.file.toLowerCase() + '.mp3',
        };

        newTracks.push(ob);
      });

      setTrackFile(newTracks[0].file);

      console.log('file: ' + newTracks[0].file);

      console.log('newTracks length interval: ' + newTracks.length);

      currentNote = new Sound(newTracks[0].file, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound ' + newTracks[0].file, error);
          return;
        }
        // loaded successfully
        console.log(
          'duration in seconds: ' +
            currentNote.getDuration() +
            'number of channels: ' +
            currentNote.getNumberOfChannels(),
        );

        setTrackInfo({position: 0, duration: currentNote.getDuration()});

        //currentNote.play();
      });
    }

    setCurrentTrack({
      name: questions[0].file,
    });

    //console.log('questions: ' + JSON.stringify(questions));

    var question = questions[0];

    console.log('question: ' + JSON.stringify(question));
    console.log('newTracks: ' + JSON.stringify(newTracks));
    console.log('theAnswer: ' + JSON.stringify(questions[0].Answers));
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
                }}>
                Quiz - Interval Training Level {level}
              </Text>

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

              {level > 1 ? (
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

export default IntervalLevels;

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
});
