import React, { useState, useEffect, useReducer } from 'react';

import styled from 'styled-components';

import { BookOpen } from '@styled-icons/boxicons-regular/BookOpen';
import { OpenBook } from '@styled-icons/entypo/OpenBook';
import { CancelCircle } from '@styled-icons/icomoon/CancelCircle';
import { TextDocument } from '@styled-icons/entypo/TextDocument';

import LessonHistoryCard from '~/page-components/student/home/LessonHistoryCard';
import LessonUpcomingCard from '~/page-components/student/home/LessonUpcomingCard';

import RatingLessonModal from '~/components/common/Modal/RatingLessonModal';
import RequireLessonModal from '~/components/common/Modal/RequireLessonModal';
import CancelBookingLessonModal from '~/components/common/Modal/CancelBookingLessonModal';
import PopUpCancelLesson from '~/components/common/Modal/PopUpCancelLesson';
import SkeletonLessonCard from '~/page-components/student/home/SkeletonLessonCard';
import { NOT_DATA_FOUND } from '~/components/common/Constant/message';

import { convertDateFromTo, checkCancelTime } from '~/utils.js';
import { getLessons, getCoursesInfoAPI } from '~/api/studentAPI';
import { ToastContainer } from 'react-toastify';

import { toast } from 'react-toastify';
// import 'react-toastify/scss/main.scss';
import { toastInit } from '~/utils';
import {
	CANCEL_BOOKING_SUCCESS,
	FETCH_ERROR,
} from '~components/common/Constant/toast';
import { getStudentLayout } from '~/components/Layout';
import { appSettings } from '~/config';
// import './index.module.scss';
import dayjs from 'dayjs';
import Link from 'next/link';
const styledIcon = `
  color: ${appSettings.colors.primary};
  width: 30px;
  height: 30px;
`;
const BookOpenIcon = styled(BookOpen)`
	${styledIcon}
`;
const OpenBookIcon = styled(OpenBook)`
	${styledIcon}
`;
const CancelCircleIcon = styled(CancelCircle)`
	${styledIcon}
`;
const TextDocumentIcon = styled(TextDocument)`
	${styledIcon}
`;

const initialCancelLesson = {
	BookingID: '',
	LessionName: '',
	date: '',
	start: '',
	end: '',
	reason: '',
};
const initialRatingLesson = {
	BookingID: '',
	TeacherUID: '',
	TeacherName: '',
};
const initialRequireLesson = {
	BookingID: '',
	avatar: '',
	TeacherUID: '',
	TeacherName: '',
	LessionName: '',
	LessionMaterial: '',
	SpecialRequest: '',
	date: '',
	start: '',
	end: '',
	DocumentName: '',
	SkypeID: '',
};
const Home = () => {
	const [state, setState] = useState({});
	const [lock, setLock] = useState({
		id: '',
		lock: false,
	});
	const [stateCancelLesson, setStateCancelLesson] = useState(
		initialCancelLesson,
	);
	const [stateRatingLesson, setStateRatingLesson] = useState(
		initialRatingLesson,
	);
	const [stateRequireLesson, setStateRequireLesson] = useState(
		initialRequireLesson,
	);
	const [loading, setLoading] = useState(false);

	const [courseInfo, setCourseInfo] = useState(null);
	const [loadingCourseInfo, setLoadingCourseInfo] = useState(false);

	const cancelToastFail = () => toast.error(FETCH_ERROR, toastInit);

	const handleRatingLesson = (BookingID, TeacherUID, TeacherName) => {
		setStateRatingLesson({
			...stateRatingLesson,
			BookingID,
			TeacherUID,
			TeacherName,
		});
	};

	const handleRequireLesson = (
		BookingID,
		avatar,
		TeacherUID,
		TeacherName,
		LessionMaterial,
		LessionName,
		SpecialRequest,
		date,
		start,
		end,
		DocumentName,
		SkypeID,
	) => {
		setStateRequireLesson({
			...stateRequireLesson,
			BookingID,
			avatar,
			TeacherUID,
			TeacherName,
			LessionMaterial,
			LessionName,
			SpecialRequest,
			date,
			start,
			end,
			DocumentName,
			SkypeID,
		});
	};

	const handleCancelBooking = (BookingID, LessionName, date, start, end) => {
		setStateCancelLesson({
			...stateCancelLesson,
			BookingID,
			LessionName,
			date,
			start,
			end,
		});
	};

	const cbCancelBooking = (
		id,
		result,
		LessionName,
		date,
		start,
		end,
		reason,
	) => {
		if (result === -1) {
			//Start Call API, lock the card
			setLock({
				id,
				lock: true,
			});
		} else {
			//After call API, unlock the card
			setLock({
				id,
				lock: false,
			});
			if (result === 1) {
				//If cancel lesson success
				let newUpcomingLessions = [...state.UpcomingLessions].filter(
					(item) => item.BookingID !== id,
				);
				setState({
					...state,
					UpcomingLessions: newUpcomingLessions,
				});
				setStateCancelLesson({
					...stateCancelLesson,
					reason,
				});
				$('#md-cancel-schedule-popup').modal('show');
			} else cancelToastFail(); //Cancel Lesson Fail
		}
	};

	const cbRatingLesson = (result, message, rating, BookingID, TeacherUID) => {
		if (result === 1) {
			//Rating Success
			let newState = { ...state };
			const index = newState.LessionHistory.findIndex(
				(item) =>
					item.BookingID === BookingID && item.TeacherUID === TeacherUID,
			);
			newState.LessionHistory[index].Rate = rating;
			setState(newState);
		}
	};

	const cbRequireLesson = (SpecialRequest, BookingID, TeacherUID) => {
		let newState = { ...state };
		const index = newState.UpcomingLessions.findIndex(
			(item) => item.BookingID === BookingID && item.TeacherUID === TeacherUID,
		);
		newState.UpcomingLessions[index].SpecialRequest = SpecialRequest;
		setState(newState);
	};

	const getAPI = async () => {
		setLoading(true);
		const res = await getLessons();
		if (res.Code === 1) {
			setState(res.Data);
		}
		setLoading(false);
	};

	const _getCoursesInfoAPI = async () => {
		setLoadingCourseInfo(true);
		const res = await getCoursesInfoAPI();
		if (res.Code === 1) {
			setCourseInfo({
				...res.Data,
				Message: '',
			});
		} else {
			setCourseInfo({
				Message: res.Message,
			});
		}
		setLoadingCourseInfo(false);
	};

	useEffect(() => {
		$(function () {
			$('[data-toggle="tooltip"]').tooltip();
		});
		getAPI();
		_getCoursesInfoAPI();
	}, []);

	return (
		<>
			<h1 className="main-title-page">Dashboard</h1>
			<div className="overall__summary pd-15">
				{!!courseInfo && !courseInfo.Message ? (
					<>
						{courseInfo.Message !== undefined ? (
							<>
								<div className="overall__summary-info d-flex flex-wrap">
									<div className="course-info">
										<div className="d-flex align-items-center mg-b-30">
											<div className={`course-image mg-r-15`}>
												<img
													src={`/static/assets/img/course.svg`}
													className={`wd-60 ht-60 round-circle`}
													alt={`course`}
												/>
											</div>
											<div className={`flex-grow-1`}>
												<a
													href={true}
													className="tx-bold d-block mg-b-5 tx-primary"
												>
													<span className="course-name">
														{courseInfo.CoursesName}
													</span>
												</a>

												<div className="level d-flex flex-wrap  tx-14">
													<div className="start-level my-10 mg-r-30">
														<span className={`mg-r-5 tx-light`}>
															Trình độ hiện tại:{' '}
														</span>
														<span className={`tx-medium`}>
															{!!courseInfo.LevelEnglishPresent
																? courseInfo.LevelEnglishPresent
																: 'Chưa rõ'}
														</span>
													</div>
													<div className="end-level my-10">
														<span className={`mg-r-5 tx-light`}>
															Trình độ mục tiêu:{' '}
														</span>
														<span className={`tx-medium`}>
															{!!courseInfo.LevelEnglishDesire
																? courseInfo.LevelEnglishDesire
																: 'Chưa rõ'}
														</span>
													</div>
												</div>
											</div>
										</div>

										<div className="course-progress">
											<div className="progress-wrap">
												<div className="progress-course-bar position-relative">
													<div className="date d-flex flex-wrap justify-content-between">
														<div className="start-date">
															<span>
																{!!courseInfo.StartDate
																	? dayjs(courseInfo.StartDate).format(
																			'DD/MM/YYYY',
																	  )
																	: 'Chưa bắt đầu'}
															</span>
														</div>
														<div className="end-date">
															<span>
																{!!courseInfo.EndDate
																	? dayjs(courseInfo.EndDate).format(
																			'DD/MM/YYYY',
																	  )
																	: 'Chưa kết thúc'}
															</span>
														</div>
													</div>
													<div className="progress-bar-wrap">
														<div
															className="progress-bar-wrap-fill"
															data-toggle="tooltip"
															data-placement="top"
															title={`${parseInt(40)}%`}
															style={{
																width: `${parseInt(40)}%`,
															}}
														></div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>{' '}
								<div className="overall__summary-summary pd-t-15 d-flex flex-wrap justify-content-between">
									<div className="left d-flex flex-wrap flex-grow-1">
										<div className="summary-item student-summary-item">
											<BookOpenIcon />
											<div className="mg-l-10 title">
												<label className="d-block label">
													Số buổi học đã hoàn thành
												</label>
												<label className="d-block bold count">
													{!!state &&
														!!state.StudyProcess &&
														state.StudyProcess.CompleteLessions}
												</label>
											</div>
										</div>
										<div className="summary-item student-summary-item">
											<OpenBookIcon />
											<div className="mg-l-10 title">
												<label className="d-block label">
													Số buổi học đã hủy
												</label>
												<label className="d-block bold count">
													{!!state &&
														!!state.StudyProcess &&
														state.StudyProcess.CancelLessions}
												</label>
											</div>
										</div>
										<div className="summary-item student-summary-item">
											<CancelCircleIcon />
											<div className="mg-l-10 title">
												<label className="d-block label">
													Số buổi học vắng mặt
												</label>
												<label className="d-block bold count">
													{!!state &&
														!!state.StudyProcess &&
														state.StudyProcess.NumberOfAbsences}
												</label>
											</div>
										</div>
										<div className="summary-item student-summary-item">
											<TextDocumentIcon />
											<div className="mg-l-10 title">
												<label className="d-block label">
													Số buổi học còn lại
												</label>
												<label className="d-block bold count">
													{!!state &&
														!!state.StudyProcess &&
														state.StudyProcess.NumberOfLessionsLeft}
												</label>
											</div>
										</div>
									</div>
									{/*  <div className="right">
                  <div className="summary-item">
                    <div>
                      <img src="https://images.unsplash.com/photo-1595534005229-688989c4bf82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                      <img src="https://images.unsplash.com/photo-1595534005229-688989c4bf82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                      <img src="https://images.unsplash.com/photo-1595534005229-688989c4bf82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                      <img src="https://images.unsplash.com/photo-1595534005229-688989c4bf82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                      <img src="https://images.unsplash.com/photo-1595534005229-688989c4bf82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" />
                      <span className="other-person bold">5+</span>
                    </div>
                  </div>
                </div> */}
								</div>
							</>
						) : (
							''
						)}
					</>
				) : (
					<div className="tx-center pd-y-30">
						<img
							src={`/static/assets/img/course.svg`}
							className={`wd-200 mg-b-15 round-circle`}
							alt={`course`}
						/>
						<span className="d-block tx-center tx-danger tx-medium">
							{courseInfo && courseInfo.Message}
						</span>
					</div>
				)}
			</div>
			{!state ? (
				<NOT_DATA_FOUND />
			) : (
				<>
					<div className="lesson mg-t-45 animated fadeInUp am-animation-delay-1">
						<div className="d-xl-flex align-items-center justify-content-between ">
							<h4 className="title-section">Buổi học sắp diễn ra</h4>
							<Link href={'/student/upcoming-classes'}>
								<a
									href={true}
									className="link d-flex align-items-center tx-info"
								>
									Xem tất cả
									<i className="fas fa-chevron-right mg-l-5"></i>
								</a>
							</Link>
						</div>
						{!!state.UpcomingLessions &&
						!!state.UpcomingLessions &&
						state.UpcomingLessions.length + state.UpcomingLessions.length ===
							0 ? (
							<div className="empty-error tx-center mg-y-15 cr-item bg-white rounded-5 pd-15 shadow">
								<img
									src="/static/img/no-data.svg"
									alt="no-data"
									className="wd-200 mg-b-15"
								/>
								<p className=" tx-danger tx-medium">
									Bạn không có buổi học nào sắp tới
								</p>
								<a href="/student/booking-schedule" className="btn btn-primary">
									Đặt lịch học
								</a>
							</div>
						) : (
							''
						)}
						<div className="course-horizental mg-t-15">
							<ul className="list-wrap">
								{loading ? (
									<SkeletonLessonCard />
								) : (
									!!state.UpcomingLessions &&
									state.UpcomingLessions.length > 0 &&
									state.UpcomingLessions.map((item) => (
										<LessonUpcomingCard
											key={item.BookingID}
											BookingID={item.BookingID}
											TeacherUID={item.TeacherUID}
											avatar={item.TeacherIMG}
											TeacherName={item.TeacherName}
											LessionName={item.LessionName}
											LessionMaterial={item.LessionMaterial}
											SpecialRequest={item.SpecialRequest}
											start={convertDateFromTo(item.ScheduleTimeVN).fromTime}
											end={convertDateFromTo(item.ScheduleTimeVN).endTime}
											date={convertDateFromTo(item.ScheduleTimeVN).date}
											DocumentName={item.DocumentName}
											SkypeID={item.SkypeID}
											onHandleCancelBooking={handleCancelBooking}
											onHandleRequireLesson={handleRequireLesson}
											lock={lock}
											cancelable={checkCancelTime(
												convertDateFromTo(item.ScheduleTimeVN).dateObject,
											)}
										/>
									))
								)}
							</ul>
						</div>
					</div>
					<div className="lesson mg-t-45 animated fadeInUp am-animation-delay-2">
						<div className="d-xl-flex align-items-center justify-content-between ">
							<h4 className="title-section">Buổi học đã hoàn thành</h4>
							<Link href={'/student/class-history'}>
								<a
									href={true}
									className="link d-flex align-items-center tx-info"
								>
									Xem tất cả
									<i className="fas fa-chevron-right mg-l-5"></i>
								</a>
							</Link>
						</div>
						<div className="course-horizental mg-t-15">
							<ul className="list-wrap">
								{loading ? (
									<SkeletonLessonCard />
								) : (
									!!state.LessionHistory &&
									(state.LessionHistory.length > 0 ? (
										state.LessionHistory.map((item) => (
											<LessonHistoryCard
												key={item.BookingID}
												BookingID={item.BookingID}
												TeacherUID={item.TeacherUID}
												avatar={item.TeacherIMG}
												TeacherName={item.TeacherName}
												LessionName={item.LessionName}
												Status={item.Status}
												start={convertDateFromTo(item.Schedule).fromTime}
												end={convertDateFromTo(item.Schedule).endTime}
												date={convertDateFromTo(item.Schedule).date}
												Rate={item.Rate}
												onHandleRatingLesson={handleRatingLesson}
											/>
										))
									) : (
										<div className="empty-error tx-center mg-y-15 cr-item bg-white rounded-5 pd-15 shadow">
											<img
												src="/static/img/no-data.svg"
												alt="no-data"
												className="wd-200 mg-b-15"
											/>
											<p className=" tx-danger tx-medium">
												Chưa có buổi học nào.
											</p>
										</div>
									))
								)}
							</ul>
						</div>
					</div>
				</>
			)}
			<RatingLessonModal
				BookingID={stateRatingLesson.BookingID}
				TeacherUID={stateRatingLesson.TeacherUID}
				TeacherName={stateRatingLesson.TeacherName}
				callback={cbRatingLesson}
			/>

			<RequireLessonModal
				BookingID={stateRequireLesson.BookingID}
				avatar={stateRequireLesson.avatar}
				TeacherUID={stateRequireLesson.TeacherUID}
				TeacherName={stateRequireLesson.TeacherName}
				LessionName={stateRequireLesson.LessionName}
				LessionMaterial={stateRequireLesson.LessionMaterial}
				SpecialRequest={stateRequireLesson.SpecialRequest}
				date={stateRequireLesson.date}
				start={stateRequireLesson.start}
				end={stateRequireLesson.end}
				DocumentName={stateRequireLesson.DocumentName}
				SkypeID={stateRequireLesson.SkypeID}
				callback={cbRequireLesson}
			/>

			<CancelBookingLessonModal
				BookingID={stateCancelLesson.BookingID}
				LessionName={stateCancelLesson.LessionName}
				date={stateCancelLesson.date}
				start={stateCancelLesson.start}
				end={stateCancelLesson.end}
				callback={cbCancelBooking}
			/>

			<PopUpCancelLesson
				LessionName={stateCancelLesson.LessionName}
				date={stateCancelLesson.date}
				start={stateCancelLesson.start}
				end={stateCancelLesson.end}
				reason={stateCancelLesson.reason}
			/>
			<ToastContainer />
		</>
	);
};

Home.getLayout = getStudentLayout;

export default Home;
