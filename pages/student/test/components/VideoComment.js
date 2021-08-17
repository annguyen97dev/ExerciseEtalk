import React, { useState, useEffect, createContext } from 'react';

// import './VideoComment.styles.scss';

import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VideoComment = () => {
	const [addTime, setAddTime] = useState(false);

	useEffect(() => {
		$(document).ready(function () {
			let videoStudy = document.getElementById('study-video');
			let lengthTimeVideo = 0;
			let minutesVideo = 0;

			setTimeout(() => {
				lengthTimeVideo = Math.round(videoStudy.duration);
				minutesVideo = lengthTimeVideo / 60;
				console.log('minutes: ', minutesVideo);
			}, 500);

			var data = [];

			//Show update time
			videoStudy.ontimeupdate = function () {
				showTime();
			};

			function formatTime(seconds) {
				let minutes = Math.floor(seconds / 60);
				minutes = minutes >= 10 ? minutes : '0' + minutes;
				seconds = Math.floor(seconds % 60);
				seconds = seconds >= 10 ? seconds : '0' + seconds;
				return minutes + ':' + seconds;
			}

			function showTime() {
				let seconds = Math.floor(videoStudy.currentTime);
				// let minutes = 0;

				// if (seconds > 59) {
				// 	minutes++;
				// }
				// if (seconds < 10) {
				// 	seconds = '0' + seconds;
				// }

				$('.show-time').html(formatTime(seconds));
			}

			// Create Id
			function createId() {
				let number = Math.floor(Math.random() * 1000 + 1);
				let id = 'id-' + number;
				return id;
			}

			// check id
			function checkId(id) {
				let check = false;
				data.forEach((item) => {
					if (item.id != id) {
						check = true;
					}
				});
				return check;
			}

			function getTime(id) {
				let time = null;
				data.forEach((item) => {
					if (item.id === id) {
						time = item.curTime;
					}
				});
				return time;
			}

			function createNote(time, id) {
				let widthVideo = $('.box-video').width();
				let position = (time * 100) / lengthTimeVideo;
				position = (position * widthVideo) / 100 + 16;

				console.log('position: ', position);
				position = position.toString() + 'px';
				$('.box-video').append(
					'<div class="marked" style="left:' +
						position +
						'" id-note="' +
						id +
						'"></div>',
				);

				$('.marked').on('click', function () {
					let id = $(this).attr('id-note');
					let time = getTime(id);

					videoStudy.currentTime = time;
				});
			}

			//Delete item in list
			function removeItem(id) {
				data.forEach((item, index, arr) => {
					if (item.id === id) {
						arr.splice(index, 1);
					}
				});
			}

			// Fix item in list
			function fixItem() {
				$('.comment-content').html(
					'	<div className="videoComment-note" id="videoComment-note">' +
						'<textarea id="get-text-note" rows="5" style="    width: 100%;' +
						'border: 1px solid #cccccc;' +
						'border-radius: 3px;' +
						'padding: 5px;">' +
						'</textarea>' +
						'<div className="list-button">' +
						'<button className="cmt-btn save" id="note-save">' +
						'Save' +
						'</button>' +
						'<button className="cmt-btn cancel" id="note-cancel">' +
						'Cancel' +
						'</button>' +
						'</div>' +
						'</div>',
				);
			}

			// Print Item note
			function printItemNote(time) {
				$('.comment-list').html('');
				data.forEach((obj) => {
					$('.comment-list').append(
						'<div class="comment-list__item" id-note="' +
							obj.id +
							'">' +
							'<div class="col-left">' +
							'<div  class="note-time">' +
							formatTime(obj.curTime) +
							'</div>' +
							'<span class="delete-item action-style">Xóa</span>' +
							'<span class="fix-item action-style">Sửa</span>' +
							'</div>' +
							'<div class="col-right">' +
							'<h4 class="title-topic">	<FontAwesomeIcon icon="book-open" /> 2. Module 1 - Converting HTML/CSS to React</h4>' +
							'<h5 class="sub-title-topic">3.Sub-title</h5>' +
							'<div class="comment-content">' +
							'<p class="print-note">' +
							obj.note +
							'</p>' +
							'</div>' +
							'</div>' +
							'</div>',
					);
				});

				// ---------------------- ACTION CLICK -----------------------//

				// --- Click to go ---
				$('.note-time').on('click', function (e) {
					let time = $(this).html();
					videoStudy.currentTime = time;
				});

				//  Delete item
				$('.delete-item').on('click', function () {
					let id = $(this).parent().parent().attr('id-note');
					removeItem(id);
					$(this).parent().parent().remove();
					console.log('Data after deleted: ', data);
				});

				//Fix item
				$('.fix-item').on('click', function () {
					let id = $(this).parent().parent().attr('id-note');
					let note = $('#get-text-note').val();
					fixItem(id, note);
				});
			}

			// --- Click to show textarea ---
			$('#btn-note').on('click', function () {
				$('#get-text-note').val('');
				$(this).hide();
				$('.videoComment-note').show();
			});

			// --- Click to save not at any time ---
			$('#note-save').on('click', function () {
				let getCurTime = Math.floor(videoStudy.currentTime);
				let id = createId();
				let note = $('#get-text-note').val();

				$('.comment-list').show();

				data.push({
					id: id,
					curTime: getCurTime,
					note: note,
				});

				printItemNote(getCurTime);
				createNote(getCurTime, id);

				console.log('Data after save: ', data);
				$('#get-text-note').val('');
				$('.videoComment-note').hide();
				$('.createNote').show();
			});

			//Click to cancel
			$('#note-cancel').click(function () {
				$('.videoComment-note').hide();
				$('.createNote').show();
			});
		});
	});

	return (
		<div>
			<div className="row">
				<div className="box-video">
					<video id="study-video" className="video-js vjs-theme-city" controls>
						<track default kind="captions" type="video/mp4" />
						<source src="/static/video/video.mp4" type="video/mp4" />
					</video>
				</div>
				<div className="videoComment">
					<div className="createNote" id="btn-note">
						<p>
							Create new note at <span className="show-time"></span>
						</p>
						<FontAwesomeIcon icon="plus-circle" />
					</div>
					{/* <Button variant="primary">Primary</Button> */}
					<div className="videoComment-note" id="videoComment-note">
						<textarea id="get-text-note" rows="5"></textarea>
						<div className="list-button">
							<button className="cmt-btn save" id="note-save">
								Save
							</button>
							<button className="cmt-btn cancel" id="note-cancel">
								Cancel
							</button>
						</div>
					</div>

					<div className="comment-list"></div>
				</div>
			</div>
		</div>
	);
};

export default VideoComment;
