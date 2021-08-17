import React, {
	useReducer,
	useState,
	useRef,
	useEffect,
	forwardRef,
	createRef,
	memo,
} from 'react';
import {
	addEvaluation,
	getEvaluation,
	updateEvaluation,
} from '~/api/teacherAPI';
import { getFinishedOptions } from '~/api/optionAPI';
import { randomId, decodeHTML } from '~/utils';
import { appSettings } from '~/config';
import './[eid].module.scss';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import TextareaAutosize from 'react-autosize-textarea';
import { getLayout } from '~/components/Layout';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const initialState = {
	isLoading: true,
	lessonInfo: null,
	note: '',
	grammar: '',
	pronounce: '',
	memorize: '',
	summary: '',
	vocabulary: '',
	finishedType: 0,
	finishedOptions: null,
	submitLoading: false,
	teacherRating: 0,
	editMode: false,
};

const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'UPDATE_STATE':
			return {
				...prevState,
				[payload.key]: payload.value,
			};
			break;
		case 'SET_STATE': {
			return {
				...prevState,
				...payload,
			};
			break;
		}
		case 'EDIT_MODE': {
			return {
				...prevState,
				editMode: payload,
			};
			break;
		}
		default:
			break;
	}
};
const StatelessTextarea = memo((props) => {
	const [state, setState] = useState(props?.defaultValue ?? '');
	return (
		<TextareaAutosize
			{...props}
			onChange={(e) => setState(e.target.value)}
			value={state}
			onBlur={props.handleChangeValue}
		/>
	);
});

const EvaluationDetail = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const router = useRouter();
	const { eid: BookingID } = router?.query ?? 0;
	const updateState = (key, value) => {
		dispatch({ type: 'UPDATE_STATE', payload: { key, value } });
	};

	const setEditMode = (value) => {
		dispatch({ type: 'EDIT_MODE', payload: value });
	};

	const getFeedbackDetail = async () => {
		updateState('isLoading', true);
		try {
			// const params = getParamsUrl();
			// if (!BookingID) return;
			const res = await getEvaluation({
				BookingID: parseInt(BookingID, 10),
			});
			res.Code === 1 &&
				dispatch({
					type: 'SET_STATE',
					payload: {
						...res.Data,
						note: decodeURI(res.Data?.Note ?? ''),
						grammar: decodeURI(res.Data?.Grammar ?? ''),
						pronounce: decodeURI(res.Data?.Pronunciation ?? ''),
						memorize: decodeURI(res.Data?.SentenceDevelopmentAndSpeak ?? ''),
						vocabulary: decodeURI(res.Data?.Vocabulary ?? ''),
						finishedType: res.Data?.FinishedTypeString ?? '',
						teacherRating: res.Data?.TeacherRating ?? 0,
					},
				});
		} catch (error) {
			console.log(
				error?.message ?? 'Lỗi gọi api getEvaluation, vui lòng xem lại tham số',
			);
		}
		updateState('isLoading', false);
	};

	const updateFeedback = async () => {
		updateState('submitLoading', true);
		try {
			const res = await updateEvaluation({
				BookingID: parseInt(BookingID, 10),
				Rate: state?.teacherRating ?? 0,
				Note: state?.note ?? '',
				Pronunciation: state?.pronounce ?? '',
				Vocabulary: state?.vocabulary ?? '',
				Grammar: state?.grammar ?? '',
				SentenceDevelopmentAndSpeak: state?.memorize ?? '',
			});
			res.Code === 1 && setEditMode(false);
			res.Code === 0 && window.location.reload();
		} catch (e) {
			console.log(e);
			alert(
				JSON.stringify(
					res?.Message ??
						'Lỗi khi gọi API update feedback, vui lòng kiểm tra lại !',
				),
			);
		}
		updateState('submitLoading', false);
	};

	// const getParamsUrl = () => {
	// 	if (typeof window == undefined) return;
	// 	const params = new URLSearchParams(window.location.search);
	// 	return params;
	// };

	useEffect(() => {
		getFeedbackDetail();
	}, []);

	return (
		<>
			<h1 className="main-title-page">Evaluation detail</h1>
			<div className="row">
				<div className="col-xl-4 col-lg-5 mg-b-30">
					<div className="card lesson-sidebar">
						<div className="card-body">
							<div className="row">
								<div className="col-sm-12 mg-b-15">
									{/* <!--thông tin buổi học--> */}
									<div className="">
										<h5 className="mg-b-15">Lesson information</h5>
										<div className="infomation__wrap">
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="">
														<FontAwesomeIcon
															icon="book-open"
															className="fa fa-book-open tx-primary st-icon wd-20 mg-r-5"
														/>
														Course:{' '}
													</span>
													<span className="">
														{!!state && !!state.DocumentName
															? state.DocumentName
															: ''}
													</span>
												</p>
											</div>
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="">
														<FontAwesomeIcon
															icon="book-reader"
															className="fa fa-book-reader tx-primary graduate st-icon wd-20 mg-r-5"
														/>
														Lesson:
													</span>
													<span className="st-tengv">
														{!!state && !!state.Material ? state.Material : ''}
													</span>
												</p>
											</div>
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="tx-black tx-normal">
														<FontAwesomeIcon
															icon="clock"
															className="fa fa-clock tx-primary clock st-icon wd-20 mg-r-5"
														/>
														Time:
													</span>
													<span className="">
														{!!state && !!state.ScheduleDate
															? state.ScheduleDate
															: ''}
													</span>
												</p>
											</div>
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="">
														<FontAwesomeIcon
															icon="book"
															className="fa fa-book tx-primary open st-icon wd-20 mg-r-5"
														/>
														Material:
													</span>
													<span>
														<a
															href={
																!!state && !!state.MaterialLink
																	? state.MaterialLink
																	: ''
															}
															target="_blank"
															rel="noreferrer"
														>
															{!!state && !!state.Material
																? state.Material
																: ''}
														</a>
													</span>
												</p>
											</div>
											<div className="st-time">
												<div className="st-teacher-text d-flex justify-content-between align-items-center">
													<span className="">
														<FontAwesomeIcon
															icon="lightbulb"
															className="fas fa-lightbulb tx-primary open st-icon wd-20 mg-r-5"
														/>
														Finished type:
													</span>
													<span className="">
														{!!state && !!state.finishedType
															? state.finishedType
															: ''}
													</span>
												</div>
											</div>
										</div>
									</div>
									{/* <!--/thông tin buổi học--> */}
								</div>
								<div className="col-sm-12 mg-b-15">
									{/* <!--thang danh gia--> */}
									<div className="infomation__wrap">
										<h5 className="mg-b-15 mg-md-t-15 mg-t-15 mg-md-t-0-f">
											Student Information
										</h5>
										<div className="st-time">
											<p className="st-teacher-text d-flex justify-content-between">
												<span className="">
													<FontAwesomeIcon
														icon="user-graduate"
														className="fa fa-user-graduate  tx-primary st-icon wd-20 mg-r-5"
													/>
													Name:{' '}
												</span>
												<span className="">
													{!!state && !!state.StudentName
														? state.StudentName
														: ''}
												</span>
											</p>
										</div>
										<div className="st-time">
											<p className="st-teacher-text d-flex justify-content-between">
												<span className="">
													<FontAwesomeIcon
														icon="thumbs-up"
														className="fa fa-thumbs-up tx-primary st-icon wd-20 mg-r-5"
													/>
													Feedback:{' '}
												</span>
												<span className="rating-style">
													{(!!state && !!state.StudentRating
														? state.StudentRating
														: 0) === 0 ? (
														<span className="tx-black">No rating</span>
													) : (
														[...Array(5)].map((el, index) =>
															5 - index <= state.StudentRating ? (
																<FontAwesomeIcon
																	icon={['fas', 'star']}
																	key={`${index}`}
																	className="fas fa-star"
																/>
															) : (
																<FontAwesomeIcon
																	icon={['far', 'star']}
																	key={`${index}`}
																	className="far fa-star"
																/>
															),
														)
													)}
												</span>
											</p>
										</div>
									</div>
								</div>
								<div className="col-sm-12">
									<div>
										<h5 className="mg-b-15 mg-md-t-15 mg-t-15 mg-md-t-0-f">
											Student Feedback
										</h5>
										<span className="word-break">
											{!!state && !!state.StudentNote ? (
												state.StudentNote
											) : (
												<span className="tx-danger">
													Student haven't feedback yet.
												</span>
											)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-8 col-lg-7">
					<div className="row">
						<div className="col-12">
							<div className="card mg-b-30">
								<div className="card-header">
									<h5 className="mg-b-0">General Feedback to Student</h5>
								</div>
								<div className="card-body">
									{state.editMode ? (
										<>
											<div className="rating justify-content-end">
												{[...Array(5)].map((el, index) => (
													<>
														<input
															type="radio"
															name="rating"
															id={`rating-${5 - index}`}
															checked={5 - index === state.teacherRating}
														/>
														<label
															name="rating"
															htmlFor={`rating-${5 - index}"`}
															value={5 - index}
															onClick={(e) =>
																updateState(
																	'teacherRating',
																	parseInt(e.target.getAttribute('value')),
																)
															}
														></label>
													</>
												))}

												<span>Rating:</span>
											</div>

											<StatelessTextarea
												rows={5}
												className="form-control"
												placeholder="General feedback......"
												defaultValue={state?.note ?? ''}
											></StatelessTextarea>
										</>
									) : (
										<>
											<div className="d-flex align-items-center">
												<span
													className="valign-center tx-medium"
													style={{ lineHeight: 1 }}
												>
													Rating:
												</span>
												<span className="mg-l-10 rating-style">
													{!!state && !!state.teacherRating ? (
														<>
															{[...Array(5)].map((el, index) =>
																5 - index <= state.teacherRating ? (
																	<FontAwesomeIcon
																		key={`${index}`}
																		icon={['fas', 'star']}
																		className="star-color"
																	/>
																) : (
																	<FontAwesomeIcon
																		key={`${index}`}
																		icon={['far', 'star']}
																		className="star-color"
																	/>
																),
															)}
														</>
													) : (
														<>
															{/* <i className="far fa-star" />
															<i className="far fa-star" />
															<i className="far fa-star" />
															<i className="far fa-star" />
															<i className="far fa-star" /> */}
															<FontAwesomeIcon
																icon={['far', 'fa-star']}
																className="star-color"
															/>
														</>
													)}
												</span>
											</div>
											<div
												className="mg-t-15"
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.Note ? state.Note : '',
													),
												}}
											></div>
										</>
									)}
								</div>
							</div>
						</div>{' '}
						<div className="col-12">
							<div className="card  mg-b-30">
								<div className="card-header">
									<h5 className="mg-b-0">Grammar</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													rows={5}
													className="form-control"
													placeholder="Grammar feedback......"
													defaultValue={state?.grammar ?? ''}
												></StatelessTextarea>
											</>
										) : (
											<div
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.grammar ? state.grammar : '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card  mg-b-30">
								<div className="card-header">
									<h5 className="mg-b-0">Vocabulary</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													rows={5}
													className="form-control"
													placeholder="Vocabulary feedback......"
													defaultValue={state?.vocabulary ?? ''}
												></StatelessTextarea>
											</>
										) : (
											<div
												className=""
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.vocabulary
															? state.vocabulary
															: '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card  mg-b-30">
								<div className="card-header">
									<h5 className="mg-b-0">Pronounce</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													rows={5}
													className="form-control"
													placeholder="Pronounce feedback......"
													defaultValue={state?.pronounce ?? ''}
												></StatelessTextarea>
											</>
										) : (
											<div
												className=""
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.pronounce ? state.pronounce : '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card  mg-b-30">
								<div className="card-header">
									<h5 className="mg-b-0">Sentence Development And Speak</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													rows={5}
													className="form-control"
													placeholder="Memorize feedback......"
													defaultValue={state?.memorize ?? ''}
												></StatelessTextarea>
											</>
										) : (
											<div
												className=""
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.memorize ? state.memorize : '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="d-flex">
						{state.editMode ? (
							<>
								<button
									type="button"
									className="btn btn-primary d-inline-flex align-items-center mg-r-15"
									disabled={state.submitLoading}
									onClick={updateFeedback}
								>
									{state.submitLoading ? (
										<div
											className="spinner-border wd-20 ht-20 mg-r-5"
											role="status"
										>
											<span className="sr-only">Updating...</span>
										</div>
									) : (
										<FontAwesomeIcon
											icon="save"
											className="fa fa-save mg-r-5"
										/>
									)}
									<span>
										{state.submitLoading ? 'Updating...' : 'Update feedback'}
									</span>
								</button>
								{/* <button className="btn btn-primary mg-r-15" onClick={_submitFeedback}><i className="fa fa-save mg-r-5"></i> Submit feedback</button> */}
								<button
									className="btn btn-icon btn-light mg-r-15"
									onClick={() => setEditMode(false)}
								>
									<FontAwesomeIcon
										icon="times"
										className="fas fa-times mg-r-5"
									/>{' '}
									Cancel
								</button>
							</>
						) : (
							<button
								className="btn btn-icon btn-warning mg-r-15"
								onClick={() => setEditMode(true)}
							>
								<FontAwesomeIcon icon="edit" className="fas fa-edit mg-r-5" />{' '}
								Edit feedback
							</button>
						)}
					</div>
				</div>
			</div>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</>
	);
};

EvaluationDetail.getLayout = getLayout;

export default EvaluationDetail;
