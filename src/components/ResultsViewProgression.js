import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

//import useDynamicRefs from 'use-dynamic-refs';
import {useDispatch, useSelector} from 'react-redux';
import {create} from 'react-test-renderer';

import playImg from '../../images/play-btn2.png';
import pauseImg from '../../images/pause-btn2.png';
import Slider from '@react-native-community/slider';
var Sound = require('react-native-sound');
var audioClip;

const ResultsViewProgression = ({
  correctAnswers,
  total,
  mainMenu,
  answerList,
  avgScore,
  level,
  loggedIn,
  mode,
  passScore,
  postLeaderboard,
  hasAudio,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [currentFile, setCurrentFile] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentButtonInd, setCurrentButtonInd] = useState(null);
  const [trackInfo, setTrackInfo] = useState({position: 0, duration: 0});
  //const [getRef, setRef] = useDynamicRefs();

  const onButtonPressed = (file, index) => {
    //console.log('selectedFile: ' + file);
    //console.log('currentFile: ' + currentFile);

    setCurrentButtonInd(index);

    if (file != currentFile) {
      //stop current clip

      if (audioClip) {
        stopAudio();
      }
      setCurrentFile(file);

      //load new clip
    } else {
      //return;
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
    }
  };

  useEffect(() => {
    if (currentFile) {
      console.log('newCurrentFile: ' + currentFile);

      var filename = currentFile.toLowerCase() + '.mp3';

      console.log('filename next: ' + filename);

      audioClip = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound ' + filename, error);
          return;
        }
        // loaded successfully
        console.log('file ' + filename + ' loaded');

        audioClip.play();
        setIsActive(true);
        setIsPlaying(true);
      });
    }
  }, [currentFile]);

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

    audioClip.stop(() => {
      // Note: If you want to play a sound after stopping and rewinding it,
      // it is important to call play() in a callback.
      //whoosh.play();
      //console.log('stop');
    });

    setSliderValue(0);
  };

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async (value) => {
    audioClip.setCurrentTime(value * trackInfo.duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  //orig

  const accessFeature = useSelector((state) => state.accessFeature);

  const [showStuff, setResults] = useState({show: false});
  const [passed, setPassed] = useState(false);

  var per = parseInt((correctAnswers / total) * 100);

  const viewResults = () => {
    console.log('viewresults progression');
    setResults({show: true});
  };

  //   useEffect(() => {
  //     setResults({show: true});
  //   }, []);

  // ' + JSON.stringify(answerList));

  // console.log('answerList1: ' + JSON.stringify(answerList));

  //per = 80;

  var scoreWidth = per + '%';
  var avgWidth = avgScore + '%';

  var results;

  useEffect(() => {
    Sound.setCategory('Playback');

    if (per >= passScore) {
      results = 'Great job! You passed.';
      setPassed(true);
    } else {
      results = `You need to score ${total - 1} out ${total} to pass.`;
      setPassed(false);
    }
  }, []);
  return (
    <>
      <ScrollView>
        <View style={{padding: 20}}>
          <Text
            style={{
              fontFamily: 'Helvetica Neue',
              fontSize: 20,
              fontWeight: 'bold',
              color: '#3AB24A',
            }}>
            Quiz completed.
          </Text>
          <Text
            style={{
              fontFamily: 'Helvetica Neue',
              fontSize: 15,
              marginTop: 15,
            }}>
            {' '}
            {correctAnswers} of {total} questions answered correctly.
          </Text>

          <Text
            style={{
              fontFamily: 'Helvetica Neue',
              fontSize: 15,
              marginTop: 15,
              fontWeight: 'bold',
            }}>
            {' '}
            {results}
          </Text>

          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 20,
                height: 20,
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 15}}>Average score</Text>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'gray',
                  marginLeft: 20,
                  marginRight: 20,
                }}>
                <View
                  style={{
                    width: avgWidth,
                    height: '100%',
                    backgroundColor: '#3AB24A',
                  }}></View>
              </View>
              <Text>{avgWidth}</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 20,
                height: 20,
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 15}}>Your score</Text>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'gray',
                  marginLeft: 42,
                  marginRight: 20,
                }}>
                <View
                  style={{
                    width: scoreWidth,
                    height: '100%',
                    backgroundColor: 'orange',
                  }}></View>
              </View>
              <Text>{scoreWidth}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => viewResults()}
            style={{
              height: 60,
              backgroundColor: '#3AB24A',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
              width: '100%',
              maxWidth: 280,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Helvetica Neue',
                fontWeight: 'bold',
                color: 'white',
              }}>
              View Results
            </Text>
          </TouchableOpacity>

          {per >= passScore ? (
            <TouchableOpacity
              onPress={() => postLeaderboard()}
              style={{
                height: 60,
                backgroundColor: '#3AB24A',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                width: '100%',
                maxWidth: 280,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Helvetica Neue',
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                Post to Leader Board
              </Text>
            </TouchableOpacity>
          ) : null}

          {showStuff.show === true ? (
            <View style={{marginTop: 20}}>
              <Text style={{marginTop: 20}}>
                {level < 4
                  ? 'Listen to the chord progression below, then write the chord (using the number system) in the boxes.'
                  : 'Listen to the chord progression below, then write the chord name and quality in the boxes.'}
              </Text>

              {answerList.map((ob, index) => {
                return (
                  <View key={index}>
                    <Text
                      style={{
                        marginTop: 10,
                        color: 'black',
                        fontSize: 15,
                        fontFamily: 'Helvetica Neue',
                      }}>
                      Question {index + 1}.
                    </Text>
                    {
                      //ob.Answers.join().toLowerCase() ===
                      //ob.userAnswer.join().toLowerCase()

                      ob.isCorrect ? (
                        <View
                          style={[
                            styles.correct,
                            {marginTop: 10, borderRadius: 8, height: 50},
                          ]}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 15,
                              fontFamily: 'Helvetica Neue',
                              fontWeight: 'bold',
                            }}>
                            Correct: {ob.userAnswer.join()}
                          </Text>
                        </View>
                      ) : (
                        <>
                          <View
                            style={[
                              styles.incorrect,
                              {marginTop: 10, borderRadius: 8, height: 50},
                            ]}>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 15,
                                fontFamily: 'Helvetica Neue',
                                fontWeight: 'bold',
                              }}>
                              Your Answer: {ob.userAnswer.join()}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.correct,
                              {marginTop: 5, borderRadius: 8, height: 50},
                            ]}>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 15,
                                fontFamily: 'Helvetica Neue',
                                fontWeight: 'bold',
                              }}>
                              Correct Answer: {ob.Answers.join()}
                            </Text>
                          </View>
                        </>
                      )
                    }
                    {hasAudio ? (
                      <View
                        style={{
                          backgroundColor: '#222222',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          paddingLeft: 12,
                          paddingRight: 12,
                          marginTop: 10,
                          marginBottom: 10,
                        }}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 50,
                          }}>
                          <TouchableOpacity
                            //disabled={!canPlay}
                            onPress={() => onButtonPressed(ob.file, index)}
                            style={{marginRight: 12}}>
                            {currentButtonInd == index && isPlaying ? (
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
                            disabled={currentButtonInd != index}
                            width="85%"
                            minimumValue={0}
                            maximumValue={1}
                            value={
                              currentButtonInd == index ? sliderValue : null
                            }
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
                );
              })}
            </View>
          ) : null}
        </View>
        <View style={{height: 70}} />
      </ScrollView>

      <TouchableOpacity
        onPress={() => mainMenu(passed)}
        style={{
          height: 60,
          backgroundColor: '#3AB24A',
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
          {!loggedIn && passed && accessFeature > 0
            ? ' LOGIN TO START LEVEL ' + (level + 1)
            : passed && level < 7
            ? ' START LEVEL ' + (level + 1)
            : passed && level == 7
            ? 'LEVELS COMPLETED'
            : 'RESTART QUIZ'}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  correct: {
    backgroundColor: '#3AB24A',
    justifyContent: 'center',
    display: 'flex',
    paddingLeft: 10,
    height: 35,
  },
  incorrect: {
    backgroundColor: '#FF5D5D',
    justifyContent: 'center',
    display: 'flex',
    paddingLeft: 10,
    height: 35,
  },
});

export default ResultsViewProgression;
