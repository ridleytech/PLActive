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

class Leaderboard extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    //console.log('leaderboard did mount');

    this.props.getLeaderData();
  }

  str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };

  //componentDidUpdate(prevProps, nextState) {}

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

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
              backgroundColor: '#3AB24A',
              height: 65,
              marginTop: 40,
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
  txtHeader: {
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 20,
    color: '#3AB24A',
  },
});
