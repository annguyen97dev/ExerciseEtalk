import React, { useState } from 'react';
import './styleSelect.scss';
import TextSelector from './text-selection-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const data = [];

const Selection = () => {
	const [modal, setModal] = useState({
		status: false,
		text: '',
		id: '',
	});

	const [saveData, updateSaveData] = useState();
	const [valueInput, updateValueInput] = useState();

	// For Highlight Text
	const handler = (html, text, id) => {
		// console.log('selected text: ', text);
		// console.log('html ----: ', html);
		// console.log('ID----: ', id);
	};

	// HANDLE CHANGE - For Textarea
	const handleChange = (e) => {
		const value = e.target.value;
		data.map((obj) => {
			if (modal.text === obj.text && modal.id === obj.id) {
				obj.note = value;
			}
		});
		updateSaveData(data);
		updateValueInput(value);
		// console.log('Save data when handle change: ', saveData);
	};

	// CLOSE MODAL
	const closeModal = () => {
		setModal({
			status: false,
		});

		// console.log('Save Data After Close Modal: ', saveData);
		// console.log('Data: ', data);
	};

	function checkData(id) {
		let check = false;
		data.map((obj) => {
			if (obj.id === id) {
				updateValueInput(obj.note);
				check = true;
			}
		});
		return check;
	}

	// HANDLE CLICK
	function handleClickText(e) {
		if (e.target.className == 'extracted-simple-text') {
			let text = e.target.textContent;
			let getID = e.target.id;

			setModal({
				status: true,
				text: text,
				id: getID,
			});

			if (!checkData(getID)) {
				data.push({
					id: getID,
					text: text,
					note: '',
				});
				updateValueInput('');
			}

			updateSaveData(data);
			console.log('SaveData: ', saveData);
		}
	}

	// ACTION CLICK NOTE
	function noted(html, text, idSpan) {
		let id = 'id-' + idSpan;

		setModal({
			status: true,
			text: text,
			id: id,
		});

		data.push({
			id: id,
			text: text,
			note: '',
		});

		updateSaveData(data);
		updateValueInput('');
	}

	return (
		<div className="content">
			<TextSelector
				unmark={true}
				unmarkText="Remove"
				events={[
					{
						text: 'Highlight',
						handler: handler,
					},
					{
						text: 'Note',
						handler: (html, text, idSpan) => {
							noted(html, text, idSpan);
						},
					},
				]}
				color={'yellow'}
				colorText={true}
			/>

			<p onClick={handleClickText}>
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry's standard dummy text ever
				since the 1500s, when an unknown printer took a galley of type and
				scrambled it to make a type specimen book.
				<br></br>
				<br></br>
				It has survived not only five centuries, but also the leap into
				electronic typesetting, remaining essentially unchanged. It was
				popularised in the 1960s with the release of Letraset sheets containing
				Lorem Ipsum passages, and more recently with desktop publishing software
				like Aldus PageMaker including versions of Lorem Ipsum.
			</p>
			<div
				className="wrap-popup-note"
				style={modal.status ? { display: 'block' } : {}}
			>
				<div className="popup-note">
					<div className="popup-note-header">
						<button className="close-popup" onClick={closeModal}>
							<FontAwesomeIcon icon="times" />
						</button>
					</div>
					<div className="popup-note-content">
						<textarea
							onChange={handleChange}
							value={valueInput}
							placeholder="You can note in here..."
						></textarea>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Selection;
