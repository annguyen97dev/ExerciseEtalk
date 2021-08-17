import React from 'react';
import videojs from 'video.js';
import './VideoPlayer.scss';

export default class VideoPlayer extends React.Component {
	componentDidMount() {
		// instantiate Video.js
		this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
			console.log('onPlayerReady', this);
		});
		this.player.load();
	}

	componentWillUnmount() {
		if (this.player) {
			this.player.dispose();
		}
	}

	render() {
		return (
			<div>
				<div data-vjs-player>
					<video
						controls
						ref={(node) => (this.videoNode = node)}
						className="video-js"
					>
						<source type="video/mp4"></source>
						<track default kind="captions" srclang="en" type="video/mp4" />
					</video>
				</div>
			</div>
		);
	}
}
