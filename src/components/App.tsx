import React, {Component, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  NativeModules,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Button,
} from 'react-native';
import CheckBox from 'react-native-check-box';
var testView = NativeModules.PlayKey;

// import WhiteIcon from '../../images/blank.jpg';
// import BlackIcon from '../../images/black.png';
// import RB from '../../RoundButtonPart';

import data from '../data/questions.json';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import reducers from '../reducers';

import enabledImg from '../../images/checkbox-enabled.png';
import disabledImg from '../../images/checkbox-disabled.png';
import Header from './Header';
import ResultsView from './ResultsView';
import Instructions from './Instructions';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));
const store = createStore(reducers, enhancer);

//https://www.npmjs.com/package/react-native-check-box

//cant update git

class App extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentQuestion: null,
      currentIndex: 0,
      questions: [],
      quizFinished: false,
      correctAnswers: 0,
      correctAnswersList: [],
      inCorrectAnswersList: [],
      answerList: [],
      isSelected: false,
      currentAnswer: null,
      quizStarted: false,
      restarted: true,
      data: data,
    };

    //console.log('data: ' + JSON.stringify(data));
  }

  //{this.state.currentQuestion.Question}
  componentDidMount() {
    //this.startQuiz();
    //this.debugAnswers();
  }

  debugAnswers = () => {
    var answers = this.shuffle(data.Interval.level1Answers);
    var questions = this.shuffle(data.Interval.level1Questions);

    this.setState({
      answers: answers,
      questions: questions,
      currentQuestion: questions[0],
    });
  };

  componentDidUpdate(prevProps, nextState) {
    //console.log("update1: " + JSON.stringify(prevState) )

    if (this.state.quizFinished != nextState.quizFinished) {
      //console.log('quizFinished changed');
      //this.getQuestion();
      //console.log('quiz quizFinished: ' + JSON.stringify(this.state));
      // var len =
      //   this.state.inCorrectAnswersList.length +
      //   this.state.correctAnswersList.length;
      // console.log('answer lists: ' + len);
    } else if (this.state.answers != nextState.answers) {
      //console.log('got answers');
      // var answerList = this.state.answerList.slice();
      // var currentQuestion = this.state.currentQuestion;
      // currentQuestion.userAnswer = 'Major 2nd';
      // answerList.push(this.state.currentQuestion);
      // this.setState({
      //   answerList: answerList,
      // });
    } else if (this.state.currentQuestion != nextState.currentQuestion) {
      this.createAnswers();
    }
  }

  startQuiz = () => {
    this.setState({
      currentQuestion: null,
      currentIndex: 0,
      questions: [],
      quizFinished: false,
      correctAnswers: 0,
      isSelected: false,
      currentAnswer: null,
      quizStarted: true,
      restarted: false,
      answerList: [],
    });

    // console.log(
    //   'question: ' + JSON.stringify(questions[this.state.currentIndex]),
    // );

    var questions = this.shuffle(data.Interval.level1Questions);

    //console.log('questions: ' + JSON.stringify(questions));

    var question = questions[0];

    //console.log('question: ' + JSON.stringify(question));

    this.setState({
      currentQuestion: question,
      questions: questions,
    });

    //console.log('state: ' + JSON.stringify(this.state));
  };

  createAnswers = () => {
    var answers = this.shuffle(data.Interval.level1Answers);
    var filtered = answers.filter(
      (ob) => ob !== this.state.currentQuestion.Answer,
    );

    const shuffled = filtered.sort(() => 0.5 - Math.random());

    console.log(
      'currentQuestion: ' + JSON.stringify(this.state.currentQuestion),
    );

    // Get sub-array of first n elements after shuffled
    let selected = shuffled.slice(0, 3);
    selected.push(this.state.currentQuestion.Answer);
    selected = this.shuffle(selected);

    console.log('filtered: ' + JSON.stringify(selected));

    this.setState({
      answers: selected,
    });

    console.log('answers: ' + JSON.stringify(answers));
  };

  getQuestion = () => {
    var ci = this.state.currentIndex;

    if (ci < this.state.questions.length - 1) {
      ci++;

      console.log('ci: ' + ci);

      var question = this.state.questions[ci];

      this.setState({
        currentQuestion: question,
        currentIndex: ci,
      });
    } else {
      this.setState({
        quizFinished: true,
        quizStarted: false,
      });
    }

    //this.createAnswers();
  };

  shuffle(array) {
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
  }

  selectAnswer = (ob) => {
    // var correctAnswers = this.state.correctAnswersList.slice();
    // var inCorrectAnswers = this.state.inCorrectAnswersList.slice();
    var answerList = this.state.answerList.slice();

    var currentQuestion = this.state.currentQuestion;
    currentQuestion.userAnswer = ob;

    if (ob === this.state.currentQuestion.Answer) {
      var ca = this.state.correctAnswers;
      ca++;
      this.setState({
        correctAnswers: ca,
      });
      console.log('correct');

      //correctAnswers.push(this.state.currentQuestion);
    } else {
      //inCorrectAnswers.push(this.state.currentQuestion);

      console.log('not');
    }

    answerList.push(currentQuestion);

    // console.log('correctAnswers: ' + JSON.stringify(correctAnswers));
    // console.log('inCorrectAnswers: ' + JSON.stringify(inCorrectAnswers));

    //inCorrectAnswers.push(this.state.currentQuestion);

    this.setState({
      currentAnswer: null,
      // correctAnswersList: correctAnswers,
      // inCorrectAnswersList: inCorrectAnswers,
      answerList: answerList,
    });

    this.getQuestion();
  };

  selectAnswer2 = () => {
    var answerList = this.state.answerList.slice();

    var currentQuestion = this.state.currentQuestion;
    currentQuestion.userAnswer = this.state.currentAnswer;

    if (this.state.currentAnswer === this.state.currentQuestion.Answer) {
      var ca = this.state.correctAnswers;
      ca++;
      this.setState({
        correctAnswers: ca,
      });
      console.log('correct');

      //correctAnswers.push(this.state.currentQuestion);
    } else {
      //inCorrectAnswers.push(this.state.currentQuestion);

      console.log('not');
    }

    answerList.push(currentQuestion);

    // console.log('correctAnswers: ' + JSON.stringify(correctAnswers));
    // console.log('inCorrectAnswers: ' + JSON.stringify(inCorrectAnswers));

    //inCorrectAnswers.push(this.state.currentQuestion);

    this.setState({
      currentAnswer: null,
      // correctAnswersList: correctAnswers,
      // inCorrectAnswersList: inCorrectAnswers,
      answerList: answerList,
    });

    this.getQuestion();
  };

  setChecked = (ob) => {
    if (ob === this.state.currentAnswer) {
      this.setState({
        currentAnswer: null,
      });
    } else {
      this.setState({
        currentAnswer: ob,
      });
    }

    console.log('ob: ' + JSON.stringify(ob));
    // console.log(
    //   'current answer: ' + JSON.stringify(this.state.currentQuestion.Answer),
    // );
  };

  mainMenu = () => {
    console.log('main menu');

    this.setState({
      restarted: true,
      currentAnswer: null,
      correctAnswersList: [],
      inCorrectAnswersList: [],
    });
    //this.startQuiz();
  };

  render() {
    return (
      <>
        <Provider store={store}>
          <SafeAreaView></SafeAreaView>
          <Header />

          {this.state.restarted ? (
            <Instructions startQuiz={() => this.startQuiz()} />
          ) : this.state.quizStarted ? (
            <>
              <View
                style={{
                  padding: 20,
                  // backgroundColor: 'yellow',
                }}>
                <Text
                  style={{
                    fontFamily: 'Helvetica Neue',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Quiz - Interval Training
                </Text>
                <Text
                  style={{
                    fontFamily: 'Helvetica Neue',
                    fontSize: 15,
                    marginTop: 15,
                  }}>
                  Question {this.state.currentIndex + 1} of{' '}
                  {this.state.questions.length}
                </Text>
                <Text
                  style={{
                    marginTop: 30,
                    marginBottom: 20,
                    fontFamily: 'Helvetica Neue',
                  }}>
                  {this.state.currentQuestion
                    ? this.state.currentQuestion.Question
                    : null}
                </Text>

                {this.state.answers
                  ? this.state.answers.map((ob, index) => {
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
                          }}>
                          <CheckBox
                            style={{paddingRight: 10}}
                            onClick={() => {
                              this.setChecked(ob);
                            }}
                            isChecked={this.state.currentAnswer === ob}
                            checkedImage={
                              <Image
                                source={enabledImg}
                                style={styles.enabled}
                              />
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
                      );
                    })
                  : null}
              </View>
              <TouchableOpacity
                onPress={() => this.selectAnswer2()}
                disabled={!this.state.currentAnswer}
                style={{
                  height: 60,
                  backgroundColor: this.state.currentAnswer
                    ? '#3AB24A'
                    : 'gray',
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
          ) : this.state.quizFinished ? (
            <ResultsView
              avgScore={80}
              answerList={this.state.answerList}
              correctAnswers={this.state.correctAnswers}
              total={this.state.questions.length}
              mainMenu={() => this.mainMenu()}
            />
          ) : null}
        </Provider>
      </>
    );
  }
}

export default App;

let offset = 100;

const styles = StyleSheet.create({
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
