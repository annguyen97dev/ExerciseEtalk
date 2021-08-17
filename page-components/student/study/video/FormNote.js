import React, { useState } from 'react';

const FormNote = ({ cancelForm, showForm, getDataFixed }) => {
	const [value, setValue] = useState();

	const handleChange = (e) => {
		setValue(e.target.value);
	};

	const handleClick = (e) => {
		e.preventDefault();
		getDataFixed(value);
	};

	const handleCancel = (e) => {
		e.preventDefault();
		cancelForm();
	};

	return (
		<form
			className="videoComment-note"
			style={showForm ? { display: 'block' } : { display: 'none' }}
			id="videoComment-note"
		>
			<textarea onChange={handleChange} id="get-text-note" rows="5"></textarea>
			<div className="list-button">
				<button
					onClick={handleClick}
					type="submit"
					className="cmt-btn save"
					id="note-save"
				>
					Save
				</button>
				<button
					className="cmt-btn cancel"
					id="note-cancel"
					onClick={handleCancel}
				>
					Cancel
				</button>
			</div>
		</form>
	);
};

export default FormNote;
