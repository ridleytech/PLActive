import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
  },
  detailsContainer: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    width: '80%',
    justifyContent: 'flex-start',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
    display: 'flex',
  },
  albumImage: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    borderRadius: 40,
  },
  progressBar: {
    height: 20,
    padding: 15,
    backgroundColor: '#222222',
    overflow: 'hidden',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
  },
});

export default styles;
