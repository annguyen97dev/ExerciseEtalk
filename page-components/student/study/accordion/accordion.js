import React, { useState, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import './accordion.scss';
import Chevron from './Chevron';
import Link from 'next/link';
import { useCourse } from '~/pages/student/my-course/[courseid]';
import Checkbox from '@material-ui/core/Checkbox';

const AccordionBox = ({ lesson, activeLesson, getActiveLesson }) => {
	return (
		<div
			className={`accordion-box ${
				lesson?.LessonID === activeLesson?.LessonID ? 'active' : ''
			}`}
		>
			<Checkbox oinputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
			<div className="topic">
				<p className="topic-title">
					<a
						href="/#"
						onClick={(e) => (e.preventDefault(), getActiveLesson(lesson))}
					>
						{lesson.LessonName}
					</a>
				</p>
				<p className="topic-list"> {lesson.TypeName} </p>
			</div>
		</div>
	);
};

function Accordion(props) {
	const calHeight = () => {
		let height = 'auto';
		let scrWidth = window.screen.width;

		if (scrWidth > 992) {
			height = '200px';
		}

		return height;
	};

	const {
		title = '',
		info = '',
		content = '',
		activeLesson = [],
		section = '',
	} = props;
	const { getActiveLesson } = useCourse();
	const [setActive, setActiveState] = useState(
		section.DataLesson.length > 0 && 'active',
	);
	const [setHeight, setHeightState] = useState(
		section.DataLesson.length > 0 && 'auto',
	);

	const [setRotate, setRotateState] = useState(
		section.DataLesson.length > 0 ? 'accordion__ico rotate' : 'accordion_icon',
	);
	const [checked, setChecked] = React.useState(true);

	const handleChange = (event) => {
		setChecked(event.target.checked);
	};

	const contentTab = useRef(null);

	function toggleAccordion() {
		setActiveState(setActive === '' ? 'active' : '');
		setHeightState(
			setActive === 'active' ? '0px' : `${contentTab.current.scrollHeight}px`,
		);
		setRotateState(
			setActive === 'active' ? 'accordion__icon' : 'accordion__icon rotate',
		);
	}
	// const handleClick_changeLesson = (e) => {
	// 	e.preventDefault();
	// 	let lesson = e.target.getAttribute('lesson');
	// 	console.log('TEST GET LESSON ID: ', lesson);
	// };

	return (
		<div className="sidebar-section accordion__section">
			<button
				className={`sidebar-section__header accordion ${setActive}`}
				onClick={toggleAccordion}
			>
				{/* <span>
						<FontAwesomeIcon icon="angle-down" />
					</span> */}
				<div className="accordion-title">
					<p className="title accordion__title">{title}</p>
					<span className="info">{info}</span>
				</div>
				<Chevron className={`${setRotate}`} width={7} fill={'#777'} />
			</button>
			<div
				ref={contentTab}
				style={{ maxHeight: `${setHeight}` }}
				className="accordion__content"
			>
				<div className="accordion__text">
					{content.length > 0 &&
						content.map((lesson) => (
							<AccordionBox
								key={lesson.LessonID}
								lesson={lesson}
								activeLesson={activeLesson}
								getActiveLesson={getActiveLesson}
							/>
						))}
				</div>
			</div>
		</div>
	);
}

export default Accordion;
