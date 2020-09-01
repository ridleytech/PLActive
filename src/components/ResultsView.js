import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

const ResultsView = ({
  correctAnswers,
  total,
  mainMenu,
  answerList,
  avgScore,
}) => {
  const [showStuff, setResults] = useState({show: false});

  viewResults = () => {
    console.log('go');
    setResults({show: true});
  };

  //   useEffect(() => {
  //     setResults({show: true});
  //   }, []);

  console.log('answerList results: ' + JSON.stringify(answerList));

  var per = parseInt((correctAnswers / total) * 100);

  console.log('per: ' + per);

  //per = 80;

  var scoreWidth = per + '%';
  var avgWidth = avgScore + '%';

  var results;

  if (per > 85) {
    results = 'Great job! You passed.';
  } else {
    results = 'You need to score 6 out 7 to pass.';
  }
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
              {answerList.map((ob) => {
                return (
                  <View key={ob}>
                    <Text style={{marginTop: 20}}>{ob.Question}</Text>
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
                          {ob.Answer}
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
                            {ob.userAnswer}
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
                            {ob.Answer}
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
        onPress={() => mainMenu()}
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
          RESTART QUIZ
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

export default ResultsView;
