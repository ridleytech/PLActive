/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

class App extends Component {
  state = {isPlaying: false, isPaused: false, playIndex: 0};

  render() {
    // Enable playback in silence mode
    //Sound.setCategory('Playback');

    const play = () => {
      if (this.state.isPaused) {
        console.log('resume playing');
        this.setState({isPaused: false});

        currentNote.play();
      } else if (!this.state.isPlaying) {
        //Play the sound with an onEnd callback

        this.setState({isPaused: false});

        console.log('start playing');
        //note1.play()

        currentNote.play((success) => {
          if (success) {
            console.log('successfully finished playing');
            //this.setState({isPlaying: false});

            currentNote = note2;

            currentNote.play((success) => {
              if (success) {
                console.log(' 2 successfully finished playing');
                this.setState({isPlaying: false});
              } else {
                console.log('playback failed due to audio decoding errors');
              }
            });
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });

        this.setState({isPlaying: true});
      } else {
        console.log('pause');
        currentNote.pause();

        this.setState({isPaused: true});

        // note1.stop(() => {
        //   // Note: If you want to play a sound after stopping and rewinding it,
        //   // it is important to call play() in a callback.
        //   //note1.play();
        // });
      }
    };

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <TouchableOpacity onPress={play}>
                  <Text>Play</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
