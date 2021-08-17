import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import './styleSelect.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Selection = () => {
	useEffect(() => {
		var currentID = null;
		var currentContent = '';

		function openNote() {
			$('.wrap-popup-note').show();
		}

		$('#getNote').on('change paste keyup', function () {
			let text = $(this).val();
			console.log('TEXT: ', text);
			currentContent = text;
		});

		$('.close-popup').click(function () {
			let content = currentContent;
			let id = currentID;
			$('.wrap-popup-note').hide();
			saveNote.map((obj) => {
				if (obj.id === id) {
					obj.note = content;
				}
			});

			console.log('THE LAST SAVENOTE: ', saveNote);
		});

		var saveNote = [];

		// Create Button
		var NoteButton = function (context) {
			var ui = $.summernote.ui;

			// button
			var button = ui.button({
				contents: '<i class="fas fa-sticky-note"></i> Note',
				click: function (e) {
					// invoke insertText method with 'hello' on editor module.
					openNote();
					context.invoke('editor.color', {
						backColor: ('data-backColor', '#FFFF00'),
					});

					const rng = $('#summernote').summernote('editor.getLastRange');
					console.log('RANGE: ', rng);

					let number = Math.floor(Math.random() * 1000 + 1);
					let id = 'id-' + number;
					saveNote.push({
						id: id,
						range: '',
						note: '',
					});
					currentID = id;
					console.log('save Note: ', saveNote);
				},
			});

			return button.render(); // return button as jquery object
		};

		// Summernote
		$('#summernote').summernote({
			airMode: true,
			popover: {
				air: [
					['color', ['color']],
					['mybutton', ['hello']],
				],
			},
			buttons: {
				hello: NoteButton,
			},
			disableDragAndDrop: false,
		});
	}, []);

	return (
		<div className="content">
			<div id="summernote">
				<p>
					Lorem Ipsum is simply dummy text of the printing and typesetting
					industry. Lorem Ipsum has been the industry's standard dummy text ever
					since the 1500s, when an unknown printer took a galley of type and
					scrambled it to make a type specimen book. It has survived not only
					five centuries, but also the leap into electronic typesetting,
					remaining essentially unchanged.
					<br></br>
					<br></br>
					It was popularised in the 1960s with the release of Letraset sheets
					containing Lorem Ipsum passages, and more recently with desktop
					publishing software like Aldus PageMaker including versions of Lorem
					Ipsum.
				</p>
			</div>

			<div className="wrap-popup-note">
				<div className="popup-note">
					<div className="popup-note-header">
						<span className="close-popup">
							<FontAwesomeIcon icon="times" />
						</span>
					</div>
					<div className="popup-note-content">
						<textarea id="getNote"></textarea>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Selection;
