import React from 'react';
import { connect } from 'react-redux';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Joyride from 'react-joyride';

import {
  getlikedSongs,
  getUsers,
  getSpotifyAccountDetails,
  persistUser,
  postDSSong,
  getSeveralTracks,
  createPlaylist,
  getCurrentUser,
} from '../actions';

import LikedSongs from '../components/dashboard/LikedSongs';
import MusicPlayer from '../components/dashboard/MusicPlayer';

// Styling
import '../App.css';

// Images
import JoyExample from '../assets/dislike.PNG';

class Dashboard extends React.Component {
  state = {
    collapse: false,
    steps: [
      {
        target: '.joyride-logo-1',
        content:
          'Welcome to Music Meteorologist! Here you will be able to rate songs based on characteristics and recieve song recommendations',
      },
      {
        target: '.joyride-player-2',
        content:
          'Here you can view what song you will be rating and the characteristics for that song',
        placement: 'center',
      },
      {
        target: '.joyride-3',
        content: 'Tap here to view more details on each of the characteristics',
        placement: 'right',
      },
      {
        target: '.joyride-prediction-7',
        content: (
          <div>
            <div>
              After you review the chart, click YES or NO. When you decide the
              music will start playing
            </div>
          </div>
        ),
      },

      {
        target: '.joyride-prediction-7',
        content: (
          <div>
            <img src={JoyExample} alt='Click here' />
            <div>
              Click DISLIKE, and we will take this song out of your queue, and
              go to the next song
            </div>
          </div>
        ),
        placement: 'right',
      },
      {
        target: '.joyride-prediction-7',
        content: (
          <div>
            <img src={JoyExample} alt='Click here' />
            <div>
              The prediction score is our level of confidence that you will like
              this song based on your rating
            </div>
          </div>
        ),
        placement: 'right',
      },
      {
        target: '.joyride-prediction-7',
        content: (
          <div>
            <img src={JoyExample} alt='Click here' />
            <div>
              Click LIKE, to add the current songt to your liked songs on
              Spotify, and move on to the next song
            </div>
          </div>
        ),
        placement: 'right',
      },
    ],
    popout: false,
    playlistCreated: false,
    userDataFetching: false,
  };

  componentDidMount() {
    this.props.getSpotifyAccountDetails();
  }

  componentDidUpdate(prevProps) {
    // this.props.spotifyUser.id &&

    // console.log('Previous Props', prevProps);
    // console.log('Current Props', this.props);

    // Check to see if a MM playlist has been saved to BE user
    // -- in order to do this pull in user data from BE specifically playlist.id

    // If not - Create a playlist and save to BE user table
    // If it has - do nothing

    if (this.state.userDataFetching === false && this.props.spotifyUser.id) {
      this.props.getCurrentUser(this.props.spotifyUser.id);
      this.setState({
        userDataFetching: true,
      });
    }

    if (
      !this.props.currentUser.spotify_playlist_id &&
      this.state.playlistCreated === false &&
      this.props.spotifyUser.id
    ) {
      console.log('INSIDE BIG BRAIN FUNCTION', this.props);
      this.props.persistUser(this.props.spotifyUser);
      this.props.createPlaylist(this.props.spotifyUser.id);
      this.props.persistUser(this.props.spotifyUser, 'whatever');
      this.setState({
        playlistCreated: true,
      });
    }
  }

  openPlaylist() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  openAudioDetails() {
    this.setState({
      popout: !this.state.popout,
    });
  }

  logout = e => {
    e.preventDefault();
    localStorage.removeItem('token');
    this.props.history.push('/logout');
  };

  checkPremiumUser = () => {
    return this.props.spotifyUser.product &&
      this.props.fetchingSpotifyUser === false &&
      this.props.spotifyUser.product !== 'premium'
      ? true
      : false;
  };

  checkNoIOS = () => {
    return window.navigator.platform === 'iPhone' ||
      window.navigator.platform === 'iPad' ||
      window.navigator.platform === 'iPod'
      ? true
      : false;
  };
  render() {
    if (this.checkPremiumUser() || this.checkNoIOS()) {
      this.props.history.push('/info');
    }

    // console.log('getSpotifyAccountDetails ! _ 0', this.props);

    console.log('What is this', this.props);
    console.log('current USER OBJ ______', this.props.currentUser);

    return (
      <div className='dashboard'>
        <Joyride
          steps={this.state.steps}
          continuous={true}
          scrollToFirstStep={true}
          styles={{
            beaconInner: {
              backgroundColor: '#5ce1e6',
            },
            beaconOuter: {
              border: '2px solid #5ce1e6',
            },
            options: {
              primaryColor: '#5ce1e6',
            },
          }}
        />
        <div>
          <Button
            className='burger'
            style={{ color: 'white' }}
            onClick={() => this.openPlaylist()}>
            <Grid container direction='column'>
              <div
                className={
                  this.state.collapse
                    ? 'line-one mobile-only toggle-line-one'
                    : 'line-one mobile-only'
                }
              />
              <div
                className={
                  this.state.collapse
                    ? 'line-two mobile-only toggle-line-two'
                    : 'line-two mobile-only'
                }
              />
              <div
                className={
                  this.state.collapse
                    ? 'line-three mobile-only toggle-line-three'
                    : 'line-three mobile-only'
                }
              />
            </Grid>
            Playlist
          </Button>
          <Button
            variant='contained'
            onClick={e => this.logout(e)}
            style={{
              color: 'white',
              backgroundColor: `rgba(${56}, ${182}, ${255}, ${0.6})`,
              fontWeight: '600',
              letterSpacing: '1.5px',
              position: 'absolute',
              right: '0px',
              marginRight: '5%',
              marginTop: '0.8%',
            }}>
            Logout
          </Button>
          <List>
            <Paper
              className={
                this.state.collapse ? 'side-menu-open' : 'side-menu-closed'
              }
              style={{
                maxHeight: 450,
                width: 280,
                overflow: 'auto',
                backgroundColor: `rgba(${20}, ${20}, ${20}, ${0.9})`,
                color: 'white',
              }}>
              <LikedSongs props={this.props} />
            </Paper>
          </List>
        </div>

        <Grid item>
          <MusicPlayer spotifyId={this.props.spotifyUser} />
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  spotifyUser: state.getUsersReducer.spotifyUser,
  currentUser: state.getCurrentUserReducer.currentUser,
  fetchingSpotifyUser: state.getUsersReducer.fetchingSpotifyUser,
  ds_songs: state.queueReducer.ds_songs,
  several_tracks: state.queueReducer.several_tracks,
  playlistId: state.createPlaylistReducer.playlistId,
});

export default connect(
  mapStateToProps,
  {
    getlikedSongs,
    getUsers,
    getSpotifyAccountDetails,
    persistUser,
    postDSSong,
    getSeveralTracks,
    createPlaylist,
    getCurrentUser,
  },
)(Dashboard);
