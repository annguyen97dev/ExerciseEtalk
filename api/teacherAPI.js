import instance, { getAccessToken } from './instanceAPI';
import { appSettings } from '~/config';
const path = '/ElearnTeacherApi';

export const getTeacherDashboard = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/DashboardTeacher', {
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

export const getListCategoryLibrary = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetLibrary', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getListLibraryNew = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetLibraryNew', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getLibraryByCategoryID = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetLibraryDetail', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getAllClass = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetAllClass', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getUpcomingClass = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetUpcomingClass', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getMissingFeedback = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetListEvaluation', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getFeedback = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetListFeedback', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const cancelSchedule = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/CancelSchedule', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getScheduleLog = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetScheduleLog', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getBookingRequest = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetBookingRequest', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// Param: int StudentUID, int UID ? 0, string Token ? null
export const getStudentByUID = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetByStudentUID', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// Params: string Date ? null, int UID ? 0, string Token ? null
export const getPaymentInfo = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetPayment', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// Params: string Date ? null, int UID ? 0, string Token ? null
export const getPaymentHistory = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetHistoryPayment', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

// Params:  int ElearnBookingID, string Pronunciation, string Vacabulary, string Grammar, string SentenceDevelopmentAndSpeak, string Note, int UID ? 0, string Token ? null
export const addEvaluation = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/AddEvaluation', {
			params: {
				...params,
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
		let res = await instance.get(path + '/GetTeacherProfile', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const setEventAvailable = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/ScheduleAvailable', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const setEventClose = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/CancelAvailable', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getListEventsOfWeek = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/BookingSchedule', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getMonthReport = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/GetStatistics', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getOverviewFeedback = async (params) => {
	let result;
	try {
		let res = await instance.get(path + '/EvaluationOverview', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTeacherInfoProfile = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/LoadProfileTeacher', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateTeacherInfoProfile = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateInfo', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTeacherIntroduce = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/LoadSummary', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateTeacherIntroduce = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateSummary', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTeacherExperience = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/LoadCurriculum', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateTeacherExperience = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateTeachingExperience', {
			params: {
				...params,
				UID: appSettings.UID,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getListSupport = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetListSupport', {
			params: {
				...params,
				UID: appSettings.UID,
				//Param: int UID ? 0, string Token ? null, int Status ? 0,
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getOverviewSupport = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/SupportOverview', {
			params: {
				...params,
				UID: appSettings.UID,
				//Param: int UID ? 0, string Token ? null
			},
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getTicketDetail = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetSupportDetail', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param:int ID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const addSupportTicket = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/AddSupport', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param:string SupportTitle, string SupportContent, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getEvaluation = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetEvaluation', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param:string SupportTitle, string SupportContent, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const cancelTicketSupport = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/CancelTicketSupport', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param:string SupportTitle, string SupportContent, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getBookingInfo = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetBookingInfo', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const addScheduleLog = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/AddScheduleLog', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const getBankInfo = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/GetBankInfo', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateBankInfo = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateBank', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};

export const updateEvaluation = async (params = {}) => {
	let result;
	try {
		let res = await instance.get(path + '/UpdateEvaluation', {
			params: {
				...params,
				UID: appSettings.UID,
			},
			//Param: int BookingID, int UID ? 0, string Token ? null
		});
		result = res.data;
	} catch (error) {
		return error.message ? error.message : (result = '');
	}
	return result;
};
