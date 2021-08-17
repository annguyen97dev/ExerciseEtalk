import React, { useState, useEffect, useContext, createContext } from 'react';

// import './styles.module.scss';

import { getLayout, getStudentLayout } from '~/components/Layout';

import Main from '~/page-components/student/study/main/main';
import SideBar from '~/page-components/student/study/sidebar';

const CourseContext = createContext({});

const sectionCourse = [
	{
		SectionID: 1,
		SectionName: 'This is title 1',
		TotalTime: 40,
		DataLesson: [
			{
				LessonID: 11,
				LessonName: 'Title of Lesson 1',
				Type: 1,
				TypeName: 'Bài học | Bài quiz',
				Point: 9,
				Deadline: null,
				IsDone: true,
			},
			{
				LessonID: 12,
				LessonName: 'Title of Lesson 2',
				Type: 1,
				TypeName: 'Bài học | Bài quiz',
				Point: 9,
				Deadline: null,
				IsDone: true,
			},
		],
	},
	{
		SectionID: 2,
		SectionName: 'This is title 2',
		TotalTime: 40,
		DataLesson: [
			{
				LessonID: 13,
				LessonName: 'Title of Lesson 3',
				Type: 1,
				TypeName: 'Bài học | Bài quiz',
				Point: 9,
				Deadline: null,
				IsDone: true,
			},
			{
				LessonID: 14,
				LessonName: 'Title of Lesson 4',
				Type: 2,
				TypeName: 'Bài thi',
				Point: 9,
				Deadline: null,
				IsDone: true,
			},
		],
	},
	{
		SectionID: 3,
		SectionName: 'This is title 3',
		TotalTime: 40,
		DataLesson: [
			{
				LessonID: 15,
				LessonName: 'Title of Lesson 5',
				Type: 1,
				TypeName: 'Bài học | Bài quiz',
				Point: 9,
				Deadline: null,
				IsDone: true,
			},
			{
				LessonID: 17,
				LessonName: 'Title of Lesson 6',
				Type: 1,
				TypeName: 'Bài học | Bài quiz',
				Point: 9,
				Deadline: null,
				IsDone: true,
			},
			{
				LessonID: 18,
				LessonName: 'Title of Lesson 6',
				Type: 1,
				TypeName: 'Bài học | Bài quiz',
				Point: 9,
				Deadline: null,
				IsDone: true,
			},
			{
				LessonID: 19,
				LessonName: 'Title of Lesson 6',
				Type: 1,
				TypeName: 'Bài học | Bài quiz',
				Point: 9,
				Deadline: null,
				IsDone: true,
			},
		],
	},
];

const Study = ({ children }) => {
	const [status, setStatus] = useState(true);
	const [activeLesson, setActiveLesson] = useState();

	const getActiveLesson = (DataLesson) => {
		setActiveLesson(DataLesson);
	};

	useEffect(() => {
		let check = false;
		sectionCourse.forEach((section) => {
			if (!check) {
				if (section.DataLesson.length > 0) {
					setActiveLesson(section.DataLesson[0]);
					check = true;
				}
			}
		});
	}, []);

	return (
		<CourseContext.Provider
			value={{
				getActiveLesson,
				activeLesson: activeLesson,
			}}
		>
			<div className="study">
				<Main
					status={status}
					dataSection={sectionCourse}
					activeLesson={activeLesson}
					changeStatus={() => setStatus(true)}
				></Main>
				<SideBar
					getStatus={() => setStatus(false)}
					status={status}
					dataSection={sectionCourse}
				></SideBar>
			</div>
			{children}
		</CourseContext.Provider>
	);
};

Study.getLayout = getStudentLayout;

export const useCourse = () => useContext(CourseContext);
export default Study;
