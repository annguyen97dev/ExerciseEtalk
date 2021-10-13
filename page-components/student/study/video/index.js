import React, { useState, useRef } from 'react';
import './styles.modules.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ItemNote from './ItemNote';
import FormNote from './FormNote';

const data = [];
const VideoStudy = () => {
	const [CmtNote, setCmtNote] = useState(false);
	const [submit, setSubmit] = useState(false);

	const [valueNote, setValueNote] = useState('');
	const [dataNote, setDataNote] = useState([]);
	const [status, setStatus] = useState(false);

	const videoStudy = useRef(null);
	const textarea = useRef(null);
	const boxVideo = useRef(null);

	const formatTime = (seconds) => {
		let minutes = Math.floor(seconds / 60);
		minutes = minutes >= 10 ? minutes : '0' + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = seconds >= 10 ? seconds : '0' + seconds;
		return minutes + ':' + seconds;
	};

	const openCommentNote = (e) => {
		e.preventDefault();
		textarea.current.value = '';
		setValueNote('');
		setCmtNote(true);
	};

	// --- Create ID ---
	const createId = () => {
		let number = Math.floor(Math.random() * 1000 + 1);
		let id = 'id-' + number;
		return id;
	};

	// --- Calculator position of line note  inside video ---
	const calPosition = (curTime) => {
		let widthVideo = boxVideo.current.offsetWidth;
		let lengthTimeVideo = Math.round(videoStudy.current.duration);

		let position = (curTime * 100) / lengthTimeVideo;
		// position = (position * widthVideo) / 100 + 16;

		return position;
	};

	// --- Move to current time
	const moveToCurTime = (e) => {
		let curTime = e.target.getAttribute('data-time');
		console.log('cur Time: ', curTime);
		videoStudy.current.currentTime = curTime;
		e.preventDefault();
	};

	// --- Remove item ---
	const removeItem = (id) => {
		data.forEach((item, index, arr) => {
			if (item.id === id) {
				arr.splice(index, 1);
			}
		});
		let dataTest = dataNote.filter((item) => {
			return item.id != id;
		});

		setDataNote(dataTest);
		// setStatus(true);
		console.log('Data after remove: ', dataTest);
	};

	// --- HANDLE FIXED ---
	const handleFixed = (id, note) => {
		data.forEach((item, index, arr) => {
			if (item.id === id) {
				item.note = note;
			}
		});
		let dataTest = dataNote.map((item) => {
			if (item.id === id) {
				item.note = note;
			}
			return item;
		});

		setDataNote(dataTest);
		// setShowForm(false);
		console.log('DATA after fixed: ', dataTest);
	};

	// --- Handle Change ---
	const handleChange = (event) => {
		setValueNote(event.target.value);
	};

	// --- Handle Submit ---
	const handleSubmit = (event) => {
		event.preventDefault();
		setCmtNote(false);
		let curTime = videoStudy.current.currentTime;
		let forTime = formatTime(videoStudy.current.currentTime);
		let id = createId();

		let position = calPosition(curTime);

		data.push({
			id: id,
			curTime: curTime,
			formatTime: forTime,
			note: valueNote,
			position: position,
		});

		setSubmit(true);
		setDataNote(data);
		console.log('data: ', data);
	};

	const unSubmit = (event) => {
		event.preventDefault();
		setCmtNote(false);
	};

	return (
		<div className="row">
			<div className="box-video" ref={boxVideo}>
				<video id="study-video" ref={videoStudy} controls>
					<track default kind="captions" type="video/mp4" />
					<source src="/static/video/video.mp4" type="video/mp4" />
				</video>
				{dataNote.length > 0
					? dataNote.map((item) => (
							<a
								href="/#"
								key={item.id}
								style={{ left: item.position + '%' }}
								className="marked"
								onClick={moveToCurTime}
							>
								<div data-time={item.curTime}></div>
							</a>
					  ))
					: ''}
			</div>
			<div className="videoComment">
				<a
					href="/#"
					onClick={openCommentNote}
					style={CmtNote ? { display: 'none' } : { display: 'block' }}
				>
					<div className="createNote" id="btn-note">
						<p>
							Create new note at <span className="show-time"></span>
						</p>
						<FontAwesomeIcon icon="plus-circle" />
					</div>
				</a>
				{/* <Button variant="primary">Primary</Button> */}
				<form
					// onSubmit={handleSubmit}
					className="videoComment-note"
					id="videoComment-note"
					style={CmtNote ? { display: 'block' } : {}}
				>
					<textarea
						id="get-text-note"
						onChange={handleChange}
						rows="5"
						ref={textarea}
					></textarea>
					<div className="list-button">
						<button
							onClick={handleSubmit}
							type="submit"
							className="cmt-btn save"
							id="note-save"
						>
							Save
						</button>
						<button
							onClick={unSubmit}
							className="cmt-btn cancel"
							id="note-cancel"
						>
							Cancel
						</button>
					</div>
				</form>

				<div
					className="comment-list"
					style={submit ? { display: 'block' } : { display: 'none' }}
				>
					{submit
						? dataNote.map(({ id, ...otherSectionProps }) => (
								<ItemNote
									key={id}
									id={id}
									{...otherSectionProps}
									remove={() => removeItem(id)}
									handleFixed={handleFixed}
								/>
						  ))
						: ''}
				</div>
			</div>
		</div>
	);
};

export default VideoStudy;
