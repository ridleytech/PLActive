import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {useDispatch} from 'react-redux';

const ResultsViewInterval = ({
  correctAnswers,
  total,
  mainMenu,
  answerList,
  avgScore,
  level,
  loggedIn,
  mode,
}) => {
  const [showStuff, setResults] = useState({show: false});
  const [passed, setPassed] = useState(false);

  const viewResults = () => {
    console.log('go');
    setResults({show: true});
  };

  //   useEffect(() => {
  //     setResults({show: true});
  //   }, []);

  // ' + JSON.stringify(answerList));

  var per = parseInt((correctAnswers / total) * 100);

  console.log('per: ' + per);

  //per = 80;

  var scoreWidth = per + '%';
  var avgWidth = avgScore + '%';

  var results;

  useEffect(() => {
    if (per >= 85) {
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
          {/* <Text
            style={{
              fontFamily: 'Helvetica Neue',
              fontSize: 20,
              marginTop: 20,
              width: '100%',
              textAlign: 'center',
              //color: {results==="Pass" ? "green" : "red"}
            }}>
            {results}
          </Text> */}
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
                fontSize: 25,
                fontFamily: 'Helvetica Neue',
                fontWeight: 'bold',
                color: 'white',
              }}>
              View Results
            </Text>
          </TouchableOpacity>

          {showStuff.show === true ? (
            <View style={{marginTop: 20}}>
              {mode == 1 ? (
                <Text style={{marginTop: 20}}>
                  Using your keyboard, listen to the audio below then write the
                  correct note letter name in the box below.
                </Text>
              ) : null}

              {answerList.map((ob, index) => {
                return (
                  <View key={ob}>
                    <Text
                      style={{
                        marginTop: 10,
                        color: 'black',
                        fontSize: 15,
                        fontFamily: 'Helvetica Neue',
                      }}>
                      {index + 1}. {ob.Question}
                    </Text>

                    {ob.Answer === ob.userAnswer ? (
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
                          Correct: {ob.Answer}
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
                            Your Answer: {ob.userAnswer}
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
                            Correct Answer: {ob.Answer}
                          </Text>
                        </View>
                      </>
                    )}
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
          {!loggedIn && passed
            ? ' JOIN TO START LEVEL ' + (level + 1)
            : passed
            ? ' START LEVEL ' + (level + 1)
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

export default ResultsViewInterval;
