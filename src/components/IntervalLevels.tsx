import React, {useEffect, useState, lazy} from 'react';
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
} from 'react-native';
import TrackPlayer, {
  TrackPlayerEvents,
  STATE_PLAYING,
  STATE_PAUSED,
} from 'react-native-track-player';
import {useDispatch} from 'react-redux';

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
import Instructions from './Instructions';
import ResultsView from './ResultsView';

import {saveProgress} from '../thunks/';

const tracks = {
  minor2ndC: require('../audio/minor2ndC.mp3'),
  major2ndC: require('../audio/major2ndC.mp3'),
  minor3rdC: require('../audio/minor3rdC.mp3'),
  major3rdC: require('../audio/major3rdC.mp3'),
  perfect4thC: require('../audio/perfect4thC.mp3'),
  augmented4thC: require('../audio/augmented4thC.mp3'),
  perfect5thC: require('../audio/perfect5thC.mp3'),
  minor6thC: require('../audio/minor6thC.mp3'),
  major6thC: require('../audio/major6thC.mp3'),
  minor7thC: require('../audio/minor7thC.mp3'),
  major7thC: require('../audio/major7thC.mp3'),
  octaveC: require('../audio/octaveC.mp3'),
  minor9thC: require('../audio/minor9thC.mp3'),
  major9thC: require('../audio/major9thC.mp3'),
  minor11thC: require('../audio/minor11thC.mp3'),
  major11thC: require('../audio/major11thC.mp3'),
  minor13thC: require('../audio/minor13thC.mp3'),
  major13thC: require('../audio/major13thC.mp3'),
};

const trackSelect = (track) => {
  if (track === null) {
    return tracks.minor3rdC;
  }

  const tracksArray = {
    minor2ndC: tracks.minor2ndC,
    major2ndC: tracks.major2ndC,
    minor3rdC: tracks.minor3rdC,
    major3rdC: tracks.major3rdC,
    augmented4thC: tracks.augmented4thC,
    perfect4thC: tracks.perfect4thC,
    perfect5thC: tracks.perfect5thC,
    minor6thC: tracks.minor6thC,
    minor7thC: tracks.minor7thC,
    major6thC: tracks.major6thC,
    major7thC: tracks.major7thC,
    minor9thC: tracks.minor9thC,
    major9thC: tracks.major9thC,
    minor11thC: tracks.minor11thC,
    major11thC: tracks.major11thC,
    minor13thC: tracks.minor13thC,
    major13thC: tracks.major13thC,
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

const IntervalLevels = ({level, mode}) => {
  const dispatch = useDispatch();

  //console.log('selectedLevel: ' + level);

  // var instructions; // = data.Interval.level3Instructions;

  // if (level == 1) {
  //   instructions = shuffle(data.Interval.level1Instructions);
  // } else if (level == 2) {
  //   instructions = shuffle(data.Interval.level2Instructions);
  // } else if (level == 3) {
  //   instructions = shuffle(data.Interval.level3Instructions);
  // } else if (level == 4) {
  //   instructions = shuffle(data.Interval.level4Instructions);
  // } else if (level == 5) {
  //   instructions = shuffle(data.Interval.level5Instructions);
  // }

  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [loadCount, setLoadCount] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  //const [addingTrack, setAddingTrack] = useState(false);
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

  const {position, duration} = useTrackPlayerProgress(150);
  const [restarted, setRestarted] = useState(true);
  const [canAnswer, setCanAnswer] = useState(false);
  const [canCheck, setCanCheck] = useState(true);

  const [answerState, setAnswerState] = useState('#E2E7ED');

  const nextQuestion = () => {
    var currentQuestion1 = currentQuestionInd;

    setSelectionColors(['#EFEFEF', '#EFEFEF', '#EFEFEF', '#EFEFEF']);

    if (currentQuestion1 < questionList.length - 1) {
      //setAddingTrack(true);

      currentQuestion1 += 1;

      if (level > 1) {
        //TrackPlayer.reset();

        setCurrentTrack({
          name: questionList[currentQuestion1].file,
          id: currentQuestion1.toString(),
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
      const startPlayer = async () => {
        let isInit = await trackPlayerInit();
        setIsTrackPlayerInit(isInit);
      };
      startPlayer();

      TrackPlayer.reset();

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

  useEffect(
    () => () => {
      console.log('unmount');
      TrackPlayer.destroy();
    },
    [],
  );

  //console.log('height: ' + Dimensions.get('screen').height);

  // useEffect(() => {
  //   if (loadCount === 0) {
  //     setAddingTrack(true);
  //   } else {
  //     setAddingTrack(false);
  //   }
  // }, [loadCount]);

  useEffect(() => {
    if (currentTrack) {
      console.log('currentQuestion changed: ' + currentTrack.name);
    }
  }, [currentQuestionInd]);

  const addSongData = async (list) => {
    console.log('song data length interval: ' + list.length);

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

    nextTrack();

    setTimeout(() => {
      setCurrentAnswer(null);
      setCanCheck(true);
      nextQuestion();
      setAnswerState('#E2E7ED');
    }, 2000);
  };

  const mainMenu = (passed) => {
    console.log(`mainMenu ${level + 1} ${passed}`);
    //saveProgress();

    if (passed) {
      dispatch({type: 'SET_MODE', mode: 2});
      dispatch({type: 'SET_LEVEL', level: level + 1});
      dispatch(saveProgress(level));
    } else {
      console.log('main menu');

      setRestarted(true);
      setCurrentAnswer(null);
      setCorrectAnswers(0);
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
          id: question.id.toString(),
          url: trackSelect(question.file),
          title: question.file,
          album: 'Piano Lesson with Warren',
          artist: 'Randall Ridley',
          artwork: 'https://picsum.photos/300',
        };

        newTracks.push(ob);
      });

      console.log('newTracks length interval: ' + newTracks.length);

      addSongData(newTracks);
    }

    setCurrentTrack({
      name: questions[0].file,
      id: questions[0].id,
    });

    //console.log('questions: ' + JSON.stringify(questions));

    var question = questions[0];

    console.log('question: ' + JSON.stringify(question));
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
