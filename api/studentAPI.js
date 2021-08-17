import instance, { getAccessToken } from './instanceAPI';
import { appSettings } from '~/config';
const path = '/ElearnStudentApi';

export const getLessons = async () => {
	let result;
	try {
		let res = await instance.get(path + '/Dashboard', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getUpcomingLessons = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetUpcomingLessions', {
			params: {
				UID: appSettings.UID,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getLessonHistory = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetLessionHistory', {
			params: {
				UID: appSettings.UID,
				FromDate: params.FromDate,
				ToDate: params.ToDate,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getEvaluation = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetEvaluation', {
			params: {
				UID: appSettings.UID,
				ElearnBookingID: params.ElearnBookingID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getProfile = async () => {
	let result;
	try {
		let res = await instance.get(path + '/GetProfile', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTeacherInfo = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetTeacherInfo', {
			params: {
				UID: appSettings.UID,
				TeacherUID: params.TeacherUID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getAllNotification = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetAllNotification', {
			params: {
				UID: appSettings.UID,
				page: params.page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getNotificationDetailAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetNotificationDetail', {
			params: {
				UID: appSettings.UID,
				NotificationID: params.NotificationID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

/* Lịch dạy của giáo viên theo tuần (teacherDetail) */
export const getScheduleByTeacherUID = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/BookingScheduleByTeacherUID', {
			params: {
				UID: appSettings.UID,
				TeacherUID: params.TeacherUID,
				Date: params.Date,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

/* Lịch dạy của giáo viên theo ngày (bookingLesson) */
export const GetScheduleTeacherAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetScheduleTeacher', {
			params: {
				UID: appSettings.UID,
				TeacherUID: params.TeacherUID,
				Date: params.Date,
				Start: params.Start,
				End: params.End,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getListTeacher = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetListTeacher', {
			params: {
				UID: appSettings.UID,
				Nation: params.Nation,
				LevelPurpose: params.LevelPurpose,
				Gender: params.Gender,
				Date: params.Date,
				Start: params.Start,
				End: params.End,
				Search: params.Search,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const ratingLessonAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/RatingLession', {
			params: {
				UID: appSettings.UID,
				BookingID: params.BookingID,
				TeacherUID: params.TeacherUID,
				Rate: params.Rate,
				Evaluation: params.Evaluation,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const requestLessonAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateSpecialRequest', {
			params: {
				UID: appSettings.UID,
				BookingID: params.BookingID,
				SpecialRequest: params.SpecialRequest,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const bookingLessonAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/Booking', {
			params: {
				UID: appSettings.UID,
				TeacherUID: params.TeacherUID,
				Date: params.Date,
				StudyTimeID: params.StudyTimeID,
				SpecialRequest: params.SpecialRequest,
				DocumentID: params.DocumentID,
				DocumentDetailID: params.DocumentDetailID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getLessonBookAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/GetLessonBook', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const cancelLessonAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/StudentCancelBooking', {
			params: {
				UID: appSettings.UID,
				BookingID: params.BookingID,
				ReasonCancel: params.ReasonCancel,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getFaqAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/GetAllFaq', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateProfileAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateProfile', {
			params: {
				UID: appSettings.UID,
				FullName: params.FullName,
				Phone: params.Phone,
				Email: params.Email,
				BirthDay: params.BirthDay,
				Gender: params.Gender,
				Language: params.Language,
				Address: params.Address,
				Target: params.Target,
				SkypeID: params.SkypeID,
				TimezoneID: params.TimeZoneID,
				PersonalPreference: params.PersonalPreference,
				RequestWithTeacher: params.RequestWithTeacher,
				Avatar: params.Avatar,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getAllStudentReviewAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetAllStudentReview', {
			params: {
				UID: appSettings.UID,
				TeacherUID: params.TeacherUID,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getFeedbackOverviewAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/FeedbackOverview', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getListEvaluationAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetListEvaluation', {
			params: {
				UID: appSettings.UID,
				Rate: params.Rate,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getPaymentHistoryAPI = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetAllPaymentHistory', {
			params: {
				UID: appSettings.UID,
				Page: params.Page,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getCoursesInfoAPI = async () => {
	let result;
	try {
		let res = await instance.get(path + '/GetCoursesInfo', {
			params: {
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
