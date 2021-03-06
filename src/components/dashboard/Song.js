import React from 'react';
import { connect } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import { getTrackInfo, getSeveralTracks } from '../../Redux/Spotify/spotify.actions';
import '../../App.css';
import axios from 'axios';

class Song extends React.Component {
  constructor(props) { 
    super(props);
  }

  msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    if (secs === 0) {
      return mins + ':' + '00'
    } else if (secs < 10) {
      return mins + ':' + '0' + secs;
    } else { 
      return mins + ':' + secs;
    }
  }


  render() {

    const trackUris = this.props.tracks.map(track => track.uri)
    trackUris.unshift(this.props.song.uri)
    const changeSong = () => {
      axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${this.props.deviceId}`,
        {
          "uris": trackUris,
        },
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
      )
    }

    return (
      <div>
        <Grid style={{borderRadius: "5px"}}
          container
          direction='row'
          alignItems='center'
          wrap='wrap'
          className='song'>
          <Grid item>
          <button className="playflex"
            style={{
            background: "none",
            border: "none",
            outline: "none",
            }}
        >
            {"playing" ? (
                <a onClick={changeSong} className="playicon2" />
            ) : (
            <a className="playicon" style={{ maxHeight: 35 }} />
            )}
            </button>
            </Grid>
          <Grid item style={{ padding: 5 }}>
            <img style={{ borderRadius: '5px', marginRight: '20px'}}
              src={this.props.song.album.images[2].url}
              alt='album art'
              width='64px'
            />
          </Grid>
          <Grid item style={{ padding: 5, width: '200px'}}>
            <Typography
              className="songName"
              style={{ fontSize: 13, fontWeight: 'bold', marginBottom: '3px' }}
              direction='row'>
              {this.props.song.name}
            </Typography>
            <Typography className="songArtistName" style={{ fontSize: 13 }}>
              {this.props.song.artists[0].name}
            </Typography>
            <Typography style={{ fontSize: 13 }}>
            </Typography>
            {/* <p>Audio Features: {loadingTf ? 'loading....' : tf.data.tempo}</p> */}
          </Grid>
          <Grid className="songAlbumName" item style={{ padding: 5, fontSize: 13, width: '200px', marginRight: '10px'}}>
            {this.props.song.album.name}
          </Grid>
          <Grid className="songDuration" item style={{ padding: 5, fontSize: 13, width: '50px', marginLeft: 25 }}>
            {this.msToTime(this.props.song.duration_ms)}
          </Grid>
          <Grid className="songReleaseDate" item style={{ padding: 5, fontSize: 13, width: '100px', marginLeft: 65 }}>
            {this.props.song.album.release_date}
          </Grid>

        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tracksInfo: state.getTrackInfoReducer,
  several_tracks: state.queueReducer.several_tracks,
});

export default connect(
  mapStateToProps,
  { getTrackInfo, getSeveralTracks },
)(Song);
