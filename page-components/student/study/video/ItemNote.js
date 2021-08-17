import React, { useState } from 'react';
import FormNote from './FormNote';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ItemNote = ({ id, curTime, formatTime, note, remove, handleFixed }) => {
	const [show, setShow] = useState(false);

	const handleShow = () => {
		setShow(true);
	};

	const getDataFixed = (note) => {
		handleFixed(id, note);
		setShow(false);
	};

	return (
		<div>
			<div
				className="comment-list__item"
				data-id={id}
				style={!show ? { display: 'flex' } : { display: 'none' }}
			>
				<div className="col-left">
					<div className="note-time">{formatTime}</div>
				</div>
				<div className="col-right">
					<h4 className="title-topic">
						<FontAwesomeIcon icon="book-open" />
						What is a CSS Sprite
					</h4>
					<div className="row-action">
						<h5 className="sub-title-topic">3.Sub-title</h5>
						<div className="actions">
							<button
								className="fix-item action-style"
								data-id={id}
								onClick={handleShow}
							>
								<FontAwesomeIcon icon="edit" />
							</button>
							<button
								className=" delete-item action-style"
								data-id={id}
								onClick={remove}
							>
								<FontAwesomeIcon icon="trash-alt" />
							</button>
						</div>
					</div>
					<div className="comment-content">
						<p className="print-note">{note}</p>
					</div>
				</div>
			</div>
			<FormNote
				showForm={show}
				getDataFixed={getDataFixed}
				cancelForm={() => setShow(false)}
			/>
		</div>
	);
};

export default ItemNote;
