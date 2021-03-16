import React, {useEffect, useState, lazy, useRef} from 'react';
import {
  Text,
  Button,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  Dimensions,
  Animated,
} from 'react-native';

import Slider from '@react-native-community/slider';
//import styles from './styles';
import CheckBox from 'react-native-check-box';
import data from '../data/questions.json';
import enabledImg from '../../images/checkbox-enabled.png';
import disabledImg from '../../images/checkbox-disabled.png';

import playImg from '../../images/play-btn.png';
import pauseImg from '../../images/pause-btn.png';

//https://therohanbhatia.com/blog/music-player-app-using-react-native-hooks/
//https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
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

const PlayerMidi = () => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [loadCount, setLoadCount] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [addingTrack, setAddingTrack] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [currentQuestionInd, setCurrentQuestionInd] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const [questionList] = useState(questions);
  const [answerList, setAnswerList] = useState([]);
  const [answers, setAnswers] = useState(answersData);
  const [keyIndex, setKeyIndex] = useState(0);
  const [currentKeys, setCurrentKeys] = useState(null);
  const [currentKey, setCurrentKey] = useState(null);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('screen').width,
  );

  const [position, setPosition] = useState(0);
  const xPos = useState(new Animated.Value(0))[0];

  //console.log('position: ' + position);

  const [currentTrack, setCurrentTrack] = useState({
    name: questions[0].file,
    id: questions[0].id,
    keys: questions[0].keys,
  });

  const duration = 4;

  //const [currentTrack, setCurrentTrack] = useState(null);

  var testView = NativeModules.PlayKey;
  const playTimer = useRef(null);
  const playTimer2 = useRef(null);
  const progressTimer = useRef(null);
  const progressBar1 = useRef(null);

  const moveView = () => {
    // console.log('move');

    console.log('progressBar1: ' + progressBar1.current);

    Animated.timing(xPos, {
      toValue: screenWidth * 0.9,
      duration: 6000,
      useNativeDriver: false,
    }).start();
  };

  //console.log('screenWidth: ' + screenWidth);

  // clearInterval(progressTimer.current);

  // progressTimer.current = setInterval(() => {
  //   console.log('update progress');

  //   if (position <= screenWidth - 80) {
  //     var pos = position + screenWidth / 8;

  //     setPosition(pos);
  //   } else {
  //     clearInterval(progressTimer.current);
  //   }
  // }, 250);

  const pressKey = (key) => {
    //console.log('pressKey');

    testView.playKey(key).then((result) => {
      //console.log('show', result);
    });

    setTimeout(() => {
      releaseKey(key);
    }, 1000);
  };

  const releaseKey = (key) => {
    //console.log('releaseKey');

    testView.releaseKey(key).then((result) => {
      //console.log('show', result);
    });

    var ki = keyIndex + 1;

    setKeyIndex(ki);
  };

  const nextQuestion = () => {
    if (audioClip) {
      audioClip.release();
    }

    var currentQuestion1 = currentQuestionInd;

    if (currentQuestion1 < questionList.length - 1) {
      setAddingTrack(true);

      currentQuestion1 += 1;
      setCurrentQuestionInd(currentQuestion1);

      var answersData = shuffle(data.Interval.level2Answers);
      setAnswers(answersData);
    } else {
      setQuizFinished(true);
      setQuizStarted(false);
    }
  };

  //slider

  useEffect(() => {
    if (!isSeeking && position && duration) {
      //console.log('update slider');

      setSliderValue(position / duration);

      //console.log('position: ' + position + ' duration: ' + duration);
    }
  }, [position, duration]);

  //current question

  useEffect(() => {
    console.log('currentQuestionInd changed: ' + currentQuestionInd);

    setCurrentTrack({
      name: questions[currentQuestionInd].file,
      id: questions[currentQuestionInd].id,
      keys: questions[currentQuestionInd].keys,
    });
  }, [currentQuestionInd]);

  //keyIndex

  useEffect(() => {
    // console.log(`keyIndex: ${keyIndex} key len: ${currentTrack.keys.length}`);
    // //if another note, play it

    console.log('keyIndex changed');

    if (currentKeys && isPlaying === true) {
      //console.log('play next note');
      if (keyIndex < currentTrack.keys.length) {
        var ck = currentKeys[keyIndex];
        setCurrentKey(ck);

        playTimer2.current = setTimeout(() => {
          pressKey(currentKeys[keyIndex]);
        }, 2000);
      } else {
        setCanPlay(false);
      }
    } else {
      //console.log('restarted key index: ' + keyIndex);
      //console.log('reset key index');
      //setKeyIndex(0);
      setCanPlay(true);
    }
  }, [keyIndex]);

  //canPlay

  useEffect(() => {
    if (canPlay) {
    } else {
      console.log('reset key index');
      setKeyIndex(0);
      setIsPlaying(false);
    }
  }, [canPlay]);

  //currentKeys

  useEffect(() => {
    //console.log('current keys changed: ' + JSON.stringify(currentKeys));
    // if (currentKeys) {
    //   playSequence();
    // }
  }, [currentKeys]);

  //currentTrack

  useEffect(() => {
    setPosition(0);
    console.log('currentTrack changed: ' + JSON.stringify(currentTrack));

    setCurrentKeys(currentTrack.keys);

    console.log(`name: ${currentTrack.name} keys: ${currentTrack.keys}`);

    // console.log('add track: ' + currentTrack.name);
  }, [currentTrack]);

  const playSequence = () => {
    if (isPlaying) {
      console.log('stop: ' + playTimer);
      clearTimeout(playTimer.current);
      clearTimeout(playTimer2.current);
      //releaseKey(currentKey);
      setIsPlaying(false);
      //setCanPlay(false);

      xPos.stopAnimation(({value}) => console.log('Final Value: ' + value));
    } else {
      console.log('playSequence');

      var ck = currentKeys[keyIndex];
      setCurrentKey(ck);
      setIsPlaying(true);

      moveView();

      playTimer.current = setTimeout(() => {
        pressKey(currentKeys[keyIndex]);
      }, 1000);
    }
  };

  //default code below this line

  const onButtonPressed = () => {
    if (!isPlaying) {
      //TrackPlayer.play();
    } else {
      //TrackPlayer.pause();
    }
  };

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async (value) => {
    //await TrackPlayer.seekTo(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  const setChecked = (ob) => {
    if (ob === currentAnswer) {
      setCurrentAnswer(null);
    } else {
      setCurrentAnswer(ob);
    }

    console.log('ob: ' + JSON.stringify(ob));
  };

  const selectAnswer = () => {
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

  return (
    <>
      <View style={styles.mainContainer}>
        <View
          style={{
            backgroundColor: '#222222',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '80%',
            paddingLeft: 20,
            paddingRight: 20,
          }}>
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={onButtonPressed}>
              <Image source={playImg} />
            </TouchableOpacity>
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

        {/* <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 20,
            height: 20,
            alignItems: 'center',
          }}>
          <View
            ref={progressBar1}
            style={{
              flex: 1,
              backgroundColor: 'gray',
              marginLeft: 20,
              marginRight: 20,
            }}>

            <Animated.View
              style={{
                width: xPos,
                height: 20,
                backgroundColor: 'red',
              }}></Animated.View>
          </View>
        </View> */}

        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={playSequence}
          style={styles.playButton}
          color="#000000"
        />
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
          <View>
            {answers
              ? answers.map((ob, index) => {
                  return (
                    <View
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
                      }}
                      key={index}>
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
      </View>
      <TouchableOpacity
        onPress={() => selectAnswer()}
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

export default PlayerMidi;

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
