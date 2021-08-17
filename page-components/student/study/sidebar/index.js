import React, { useState, useLayoutEffect, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Accordion from '~/page-components/student/study/accordion/accordion';
import './styles.module.scss';
import { useCourse } from '~/pages/student/my-course/[courseid]';

const SideBar = (props) => {
	const { dataSection, status } = props;

	const { getActiveLesson, activeLesson } = useCourse();
	// const [activeLesson, setActiveLesson] = useState();

	// Caculator width and then do something when resize window
	function useWindowSize() {
		const [size, setSize] = useState([0, 0]);
		const [heightSidebar, setHeightSidebar] = useState('auto');

		useLayoutEffect(() => {
			let scrWidth = window.screen.width;

			if (scrWidth > 992) {
				function updateSize() {
					setSize([window.innerWidth, window.innerHeight]);
					setHeightSidebar(window.innerHeight - 120);
				}
				window.addEventListener('resize', updateSize);
				updateSize();
				return () => window.removeEventListener('resize', updateSize);
			}
		}, []);
		return heightSidebar;
	}

	// get Height from function
	const getHeight = useWindowSize();

	// Close and open siderbar
	const [btnToggle, setBtnToggle] = useState(true);

	function handleClick() {
		setBtnToggle(true);
		props.getStatus && props.getStatus();
	}

	// useEffect(() => {
	// 	let check = false;
	// 	dataSection.forEach((section) => {
	// 		if (!check) {
	// 			if (section.DataLesson.length > 0) {
	// 				setActiveLesson(section.DataLesson[0]);
	// 				getActiveLesson(section.DataLesson[0]);
	// 				check = true;
	// 			}
	// 		}
	// 	});
	// }, []);

	return (
		<div
			className={`study__sidebar ${status ? 'active-open' : 'active-close'}`}
			style={{ height: getHeight + 'px' }}
		>
			<div className="titleCourse">
				<h5 className="title">
					<FontAwesomeIcon icon="graduation-cap" /> This is a course that we
					will learn
				</h5>
			</div>
			<div className="study__sidebar--header">
				{status && (
					<>
						<button className="btn-toggle" onClick={handleClick}>
							<FontAwesomeIcon icon="long-arrow-alt-right" />
						</button>
						<div className="status">
							<span>Đã hoàn thành:</span>
							<div className="status-info">
								<p>24/25</p>
							</div>
						</div>
					</>
				)}
			</div>
			{status && (
				<>
					<div className="sidebar-content">
						{dataSection &&
							dataSection.map((section) => (
								<Accordion
									key={section.SectionID}
									title={section.SectionName}
									info={section.TotalTime}
									content={section.DataLesson}
									activeLesson={activeLesson}
									section={section}
								/>
							))}
					</div>
				</>
			)}
		</div>
	);
};

export default SideBar;
