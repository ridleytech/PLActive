import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Header from './Header';
import {connect} from 'react-redux';
import {getLeaderData} from '../thunks';
import SegmentedControl from '@react-native-community/segmented-control';

class Leaderboard extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentMode: 'Interval Training',
      currentLevel: 1,
      selectedIndex: 0,
      lastMode: 0,
      selectedLevelIndex: 0,
      lastIntervalLevel: 0,
      lastPitchLevel: 0,
      lastTriadsLevel: 0,
      pitchLevels: ['1', '2', '3'],
      intervalLevels: ['1', '2', '3', '4', '5'],
      triadsLevels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      currentLevelDisplayLevels: ['1', '2', '3'],
    };
  }

  componentDidMount() {
    //console.log('leaderboard did mount');

    //(level,mode)
    this.props.getLeaderData(1, 1);
  }

  str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };

  setOption = (event) => {
    console.log('update UI: ' + event.nativeEvent.selectedSegmentIndex);

    if (event.nativeEvent.selectedSegmentIndex == 0) {
      this.setState({
        currentLevelDisplayLevels: this.state.pitchLevels,
        currentMode: 'Pitch Recognition',
        lastIntervalLevel: 0,
        lastMode: event.nativeEvent.selectedSegmentIndex,
        selectedIndex: event.nativeEvent.selectedSegmentIndex,
      });
    } else if (event.nativeEvent.selectedSegmentIndex == 1) {
      this.setState({
        currentLevelDisplayLevels: this.state.intervalLevels,
        currentMode: 'Interval Training',
        lastPitchLevel: 0,
        lastMode: event.nativeEvent.selectedSegmentIndex,
        selectedIndex: event.nativeEvent.selectedSegmentIndex,
      });
    } else {
      this.setState({
        currentLevelDisplayLevels: this.state.triadsLevels,
        currentMode: 'Triads and Sevenths',
        lastTriadsLevel: 0,
        lastMode: event.nativeEvent.selectedSegmentIndex,
        selectedIndex: event.nativeEvent.selectedSegmentIndex,
      });
    }
  };

  setLevelOption = (event) => {
    this.setState({});

    if (this.state.currentMode == 'Interval Training') {
      console.log(
        'set int last level to: ' + event.nativeEvent.selectedSegmentIndex,
      );
      this.setState({
        lastIntervalLevel: event.nativeEvent.selectedSegmentIndex,

        selectedLevelIndex: event.nativeEvent.selectedSegmentIndex,
      });
    } else if (this.state.currentMode == 'Interval Training') {
      console.log(
        'set pitch last level to: ' + event.nativeEvent.selectedSegmentIndex,
      );

      this.setState({
        lastPitchLevel: event.nativeEvent.selectedSegmentIndex,

        selectedLevelIndex: event.nativeEvent.selectedSegmentIndex,
      });
    } else {
      console.log(
        'set triad last level to: ' + event.nativeEvent.selectedSegmentIndex,
      );

      this.setState({
        lastTriadsLevel: event.nativeEvent.selectedSegmentIndex,

        selectedLevelIndex: event.nativeEvent.selectedSegmentIndex,
      });
    }
  };

  componentDidUpdate(prevProps, nextState) {
    if (
      this.state.lastMode != nextState.lastMode ||
      this.state.lastIntervalLevel != nextState.lastIntervalLevel ||
      this.state.lastPitchLevel != nextState.lastPitchLevel ||
      this.state.lastTriadsLevel != nextState.lastTriadsLevel
    ) {
      console.log('get new data: ' + JSON.stringify(nextState));
      //console.log('index: ' + this.state.selectedLevelIndex);

      var level;

      if (this.state.lastIntervalLevel != nextState.lastIntervalLevel) {
        level = parseInt(this.state.lastIntervalLevel) + 1;
      } else if (this.state.lastPitchLevel != nextState.lastPitchLevel) {
        level = parseInt(this.state.lastPitchLevel) + 1;
      } else {
        level = parseInt(this.state.lastTriadsLevel) + 1;
      }
      var mode = parseInt(this.state.lastMode) + 1;

      console.log('mode: ' + mode);
      console.log('level: ' + level);

      //(level,mode)
      this.props.getLeaderData(level, mode);
    }
  }

  render() {
    //console.log('Support 2 props: ' + JSON.stringify(this.props));

    const listItem = (level) => {
      //console.log('level: ' + JSON.stringify(level.item));

      var minutes = Math.floor(level.item.duration / 60);
      var seconds = level.item.duration - minutes * 60;

      //var timeStr = minutes + ':' + seconds;

      var finalTime = minutes + ':' + this.str_pad_left(seconds, '0', 2);

      //console.log('ms: ' + minutes + ': ' + seconds);

      return (
        <View
          style={{
            backgroundColor: '#F6FA43',
            height: 65,
            marginBottom: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              padding: 20,
              flex: 2,
            }}>
            {level.item.username}
          </Text>
          <Text
            style={{
              fontSize: 20,
              padding: 20,
              //backgroundColor: 'red',
              textAlign: 'right',
              flex: 0.5,
            }}>
            {level.item.score}
          </Text>
          <Text
            style={{
              fontSize: 20,
              padding: 20,
            }}>
            {finalTime}
          </Text>
        </View>
      );
    };

    return (
      //console.log('user: ' + props.user);
      <>
        <SafeAreaView />
        <Header props={this.props} />
        <View style={styles.content}>
          <Text style={styles.txtHeader}>Leader Board</Text>
          {/* <Text style={styles.subHeader}>{this.state.currentMode}</Text>
          <Text style={styles.subHeader}>Level {this.state.currentLevel}</Text> */}

          <Text style={[styles.subHeader, [{marginTop: 20}]]}>Program</Text>

          <SegmentedControl
            style={{marginBottom: 10}}
            height={50}
            tintColor={'#3AB24A'}
            activeFontStyle={{color: 'white', fontSize: 14}}
            fontStyle={{color: 'black', fontSize: 14}}
            values={['Pitch', 'Intervals', 'Triads & 7ths']}
            selectedIndex={this.state.selectedIndex}
            onChange={(event) => {
              this.setOption(event);
            }}
          />

          <Text style={styles.subHeader}>Level</Text>

          <SegmentedControl
            values={this.state.currentLevelDisplayLevels}
            tintColor={'#3AB24A'}
            activeFontStyle={{color: 'white', fontSize: 14}}
            fontStyle={{color: 'black'}}
            selectedIndex={
              this.state.currentMode == 'Interval Training'
                ? this.state.lastIntervalLevel
                : this.state.lastPitchLevel
            }
            onChange={(event) => {
              this.setLevelOption(event);
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
              backgroundColor: '#3AB24A',
              height: 65,
              marginTop: 20,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}>
            <Text
              style={{
                fontSize: 20,
                flex: 1,
                fontWeight: 'bold',
                fontFamily: 'HelveticaNeue',
                color: 'white',
              }}>
              Username
            </Text>
            <Text
              style={{
                fontSize: 20,
                marginRight: 20,
                fontWeight: 'bold',
                color: 'white',
              }}>
              Score
            </Text>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
              Time
            </Text>
          </View>
          <FlatList
            style={styles.list}
            data={this.props.leaderData}
            renderItem={listItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    leaderData: state.leaderData,
    url: state.url,
  };
};

export default connect(mapStateToProps, {
  getLeaderData,
})(Leaderboard);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
    marginTop: 20,
  },
  subHeader: {
    marginTop: 10,
    fontSize: 17,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  txtHeader: {
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 20,
    color: '#3AB24A',
  },
});
