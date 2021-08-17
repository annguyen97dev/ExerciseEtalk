import React, { useState, useEffect, useReducer } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { getProfile, updateProfileAPI } from '~/api/studentAPI';
import {
	uploadImageToServer,
	getListTargetAPI,
	getListLanguageAPI,
	getTimeZoneAPI,
	updatePassAPI,
} from '~/api/optionAPI';
import { appSettings } from '~/config';

import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

import { toast } from 'react-toastify';
// import 'react-toastify/scss/main.scss';
import { toastInit, convertDDMMYYYYtoMMDDYYYY } from '~/utils';

import {
	FETCH_ERROR,
	CHANGE_PASSWORD_SUCCESS,
	FILL_PASSWORD,
	INCORRECT_PASSWORD,
	DIFFERENT_PASSWORD,
	CONFIRM_PASSWORD,
	UPDATE_PROFILE_SUCCESS,
} from '~/components/common/Constant/toast';

import { getStudentLayout } from '~/components/Layout';
import './index.module.scss';
import dayjs from 'dayjs';

const schema = Yup.object().shape({
	FullName: Yup.string().required('Họ tên không được để trống'),
	Phone: Yup.number()
		.required('Số điện thoại không được để trống')
		.typeError('Số điện thoại không hợp lệ')
		.integer('Số điện thoại không hợp lệ'),
	Email: Yup.string()
		.required('Email không được để trống')
		.email('Email không hợp lệ'),
	Address: Yup.string(),
	BirthDay: Yup.date().required('Ngày sinh không được để trống'),
	SelectTarget: Yup.string()
		.nullable()
		.required('Mục tiêu không được để trống'),
	// Address: Yup.string().required('Địa chỉ không được để trống'),
	PersonalPreference: Yup.string().required('Sở thích không được để trống'),
	RequestWithTeacher: Yup.string().required(
		'Yêu cầu với giáo viên không được để trống',
	),
	Language: Yup.string().matches(/[^0]+/g, 'Ngôn ngữ không được để trống'),
	TimeZoneID: Yup.string().matches(/[^0]+/g, 'Múi giờ không được để trống'),
	SkypeID: Yup.string().required('SkypeID không được để trống'),
});
const RenderListTimeZone = ({ list }) => {
	return (
		!!list &&
		list.length > 0 &&
		list.map((item, index) => (
			<option key={index} value={item.ID}>
				{item.TimeZoneName}
			</option>
		))
	);
};
const RenderListLanguage = ({ list }) => {
	return (
		!!list &&
		list.length > 0 &&
		list.map((item, index) => (
			<option key={index} value={item.ID}>
				{item.LanguageName}
			</option>
		))
	);
};
const convertTargetNumToString = (listNum, map) => {
	let z = [];
	if (listNum.length > 0) {
		for (let i = 0; i < listNum.length; i++) {
			for (let j = 0; j < map.length; j++) {
				if (map[j].ID == listNum[i]) {
					z.push(map[j].TargetName);
					break;
				}
			}
		}
	}
	return z;
};
const convertTargetStringToNum = (listString, map) => {
	let z = [];
	for (let i = 0; i < listString.length; i++) {
		for (let j = 0; j < map.length; j++) {
			if (listString[i] === map[j].TargetName) {
				z.push(map[j].ID);
				break;
			}
		}
	}
	return z;
};

const StudentProfile = () => {
	const [profile, setProfile] = useState({});
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);
	const [listLanguage, setListLanguage] = useState([]);
	const [listTimeZone, setListTimeZone] = useState([]);
	const [listTarget, setListTarget] = useState([]);
	const [selectedTarget, setSelectedTarget] = useState(null);
	const [avatar, setAvatar] = useState('');
	const [loadingAvatar, setLoadingAvatar] = useState(false);

	const updateProfileToastSuccess = () =>
		toast.success(UPDATE_PROFILE_SUCCESS, toastInit);
	const updateProfileToastFail = () => toast.error(FETCH_ERROR, toastInit);

	const {
		register,
		handleSubmit,
		errors,
		getValues,
		setValue,
		control,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data) => {
		console.log(data);
		const array = data.SelectTarget.split(',');
		let z = convertTargetStringToNum(array, listTarget);

		const newProfile = {
			...data,
			Avatar: avatar,
			BirthDay: dayjs(data.BirthDay).format('DD/MM/YYYY'),
			Target: z.join(','),
		};
		onUpdateProfileAPI(newProfile);
	};

	const onErrors = (err) => {
		console.log(err);
	};

	const getAPI = async () => {
		try {
			setLoadingProfile(true);
			const resProfile = await getProfile();
			if (resProfile.Code === 1) {
				setProfile({
					...resProfile.Data,
					BirthDay: new Date(resProfile.Data.BirthDay),
				});
				reset({
					...resProfile.Data,
					BirthDay: new Date(resProfile.Data.BirthDay),
				});
			}
			setLoadingProfile(false);

			const resTarget = await getListTargetAPI();
			if (resTarget.Code === 1 && resTarget.Data.length > 0) {
				setListTarget(resTarget.Data);
			}

			let arrayProfile = [];

			if (resProfile.Data && resProfile.Data.Target) {
				arrayProfile = resProfile.Data.Target.split(',');
			}

			let z = convertTargetNumToString(arrayProfile, resTarget.Data);
			setSelectedTarget(z);
		} catch {}
	};
	const getTimeZone = async () => {
		const res = await getTimeZoneAPI();
		if (res.Code === 1 && res.Data.length > 0) {
			setListTimeZone(res.Data);
		}
	};
	const getLanguage = async () => {
		const res = await getListLanguageAPI();
		if (res.Code === 1 && res.Data.length > 0) {
			setListLanguage(res.Data);
		}
	};
	const onUpdateProfileAPI = async (params) => {
		setLoadingUpdateProfile(true);
		const res = await updateProfileAPI(params);
		if (res.Code === 1) {
			updateProfileToastSuccess();
		} else {
			updateProfileToastFail();
		}
		setLoadingUpdateProfile(false);
	};
	const renderTarget = (options) => {
		return options.map((item) => item.TargetName);
	};
	const handleUploadImage = async (e) => {
		setLoadingAvatar(true);
		let files = e.target.files;
		if (!files) {
			setLoadingAvatar(false);
			return;
		} else {
			const res = await uploadImageToServer(files);
			if (res.Code === 1) {
				//Upload Avatar success
				const avatar = res.Data[0].UrlIMG;
				setAvatar(avatar);
				let output = document.getElementById('avatar');
				output.src = URL.createObjectURL(files[0]);
				output.onload = function () {
					URL.revokeObjectURL(output.src);
				};
			}
			setLoadingAvatar(false);
		}
	};
	useEffect(() => {
		getAPI();
		getTimeZone();
		getLanguage();
	}, []);

	return (
		<>
			<h1 className="main-title-page">Profile</h1>
			<div className="card">
				<div className="card-body">
					<form
						id="form-account-profile"
						className="metronic-form"
						onSubmit={handleSubmit(onSubmit, onErrors)}
					>
						<div className="form-account">
							<div className="row">
								<div className="col-12">
									<div className="form-row align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium ">Ảnh đại diện: </p>
										</div>
										<div className="form-group col-sm-9">
											<div className="student-avatar">
												<div className="upload-container">
													<div
														className={`${
															loadingAvatar ? '' : 'd-none'
														} overlay`}
													>
														<div className="lds-ellipsis">
															<div></div>
															<div></div>
															<div></div>
															<div></div>
														</div>
													</div>
													<label className="upload-avatar">
														<input
															type="file"
															accept="image/*"
															className="upload-box hidden d-none upload-file"
															onChange={handleUploadImage}
														/>
														<img
															id="avatar"
															alt="Avatar"
															src={
																profile.Avatar
																	? profile.Avatar
																	: '/static/assets/img/default-avatar.png'
															}
															onError={(e) => {
																e.target.onerror = null;
																e.target.src =
																	'/static/assets/img/default-avatar.png';
															}}
														/>
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Mã học viên:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder=""
												disabled={true}
												name="UID"
												required
												defaultValue={profile.UID}
												ref={register}
											/>
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Điện thoại:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="0123456789"
												name="Phone"
												ref={register}
												defaultValue={profile.Phone}
												disabled
											/>
											{errors.Phone && (
												<span className="text-danger d-block mt-2">
													{errors.Phone.message}
												</span>
											)}
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Ngày sinh:</p>
										</div>
										<div className="form-group col-sm-9">
											<Controller
												control={control}
												defaultValue={profile.BirthDay}
												name="BirthDay"
												render={({ onChange, value, name }) => (
													<DatePicker
														dateFormat="dd/MM/yyyy"
														className="form-control"
														placeholderText={`Birthday`}
														isClearable={false}
														onChangeRaw={(e) => e.preventDefault()}
														// selected={profile.BirthDay}
														name={name}
														showMonthDropdown
														showYearDropdown
														dropdownMode="select"
														onChange={(value) => {
															onChange(value);
															setProfile({
																...profile,
																BirthDay: value,
															});
														}}
														selected={value}
													/>
												)}
											/>
											{errors.BirthDay && (
												<span className="text-danger d-block mt-2">
													{errors.BirthDay.message}
												</span>
											)}
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Ngôn ngữ:</p>
										</div>
										<div className="form-group col-sm-9">
											{!!listLanguage && listLanguage.length > 0 && (
												<select
													name="Language"
													ref={register}
													defaultValue={
														profile.Language ? profile.Language : '0'
													}
													className="form-control"
												>
													<option value="0">Chọn Ngôn Ngữ</option>
													<RenderListLanguage list={listLanguage} />
												</select>
											)}
											{errors.Language && (
												<span className="text-danger d-block mt-2">
													{errors.Language.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Họ và tên:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="Họ và tên"
												ref={register}
												defaultValue={profile.FullName}
												name="FullName"
												disabled
											/>
											{errors.FullName && (
												<span className="text-danger d-block mt-2">
													{errors.FullName.message}
												</span>
											)}
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Email:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="email"
												className="form-control"
												name="Email"
												ref={register}
												defaultValue={profile.Email}
												placeholder="Ex:example@domain.com"
												disabled
											/>
											{errors.Email && (
												<span className="text-danger d-block mt-2">
													{errors.Email.message}
												</span>
											)}
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Giới tính:</p>
										</div>
										<div className="form-group col-sm-9">
											<select
												className="form-control"
												name="Gender"
												ref={register}
												defaultValue={profile.Gender}
											>
												<option value="1">Nam</option>
												<option value="2">Nữ</option>
												<option value="3">Khác</option>
											</select>
										</div>
									</div>
									<div className="form-row align-items-center">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium">Múi giờ:</p>
										</div>
										<div className="form-group col-sm-9">
											{!!listTimeZone && listTimeZone.length > 0 && (
												<select
													name="TimeZoneID"
													ref={register}
													defaultValue={
														profile.TimeZoneID ? profile.TimeZoneID : '0'
													}
													className="form-control"
												>
													<option value="0">Chọn Múi Giờ</option>
													<RenderListTimeZone list={listTimeZone} />
												</select>
											)}
											{errors.TimeZoneID && (
												<span className="text-danger d-block mt-2">
													{errors.TimeZoneID.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row  align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium ">Địa chỉ:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												className="form-control"
												placeholder="Your address"
												name="Address"
												ref={register}
												defaultValue={profile.Address}
											/>
											{errors.Address && (
												<span className="text-danger d-block mt-2">
													{errors.Address.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row  align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium ">
												Mục tiêu học Tiếng Anh:
											</p>
										</div>
										<div className="form-group col-sm-9 select-checkbox">
											{Array.isArray(selectedTarget) && (
												<>
													<Controller
														as={
															<Select
																isMulti
																options={renderTarget(listTarget)}
																getOptionLabel={(label) => label}
																getOptionValue={(value) => value}
																styles={appSettings.selectStyle}
																className="basic-multi-select"
																placeholder="Chọn Mục Tiêu"
																classNamePrefix="select"
																onChange={(val) =>
																	setValue('SelectTarget', val)
																}
															/>
														}
														control={control}
														defaultValue={selectedTarget}
														name="SelectTarget"
													/>
													{errors.SelectTarget && (
														<span className="text-danger d-block mt-2">
															{errors.SelectTarget.message}
														</span>
													)}
												</>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row  align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium ">SkypeID:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												placeholder="SkypeID"
												className="form-control"
												name="SkypeID"
												ref={register}
												defaultValue={profile.SkypeID}
												disabled
											/>
											{errors.SkypeID && (
												<span className="text-danger d-block mt-2">
													{errors.SkypeID.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row  align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium ">Sở thích:</p>
										</div>
										<div className="form-group col-sm-9">
											<input
												type="text"
												placeholder="Sở thích"
												className="form-control"
												name="PersonalPreference"
												ref={register}
												defaultValue={profile.PersonalPreference}
											/>
											{errors.PersonalPreference && (
												<span className="text-danger d-block mt-2">
													{errors.PersonalPreference.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row  align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed">
											<p className="mg-b-0 tx-medium ">
												Yêu cầu với giáo viên:
											</p>
										</div>
										<div className="form-group col-sm-9">
											<textarea
												id=""
												rows="3"
												className="form-control"
												placeholder="Yêu cầu với giáo viên"
												name="RequestWithTeacher"
												ref={register}
												defaultValue={profile.RequestWithTeacher}
											></textarea>
											{errors.RequestWithTeacher && (
												<span className="text-danger d-block mt-2">
													{errors.RequestWithTeacher.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row  align-items-center ">
										<div className="form-group col-sm-3 col-label-fixed"></div>
										<div className="form-group col-sm-9 mg-b-0-f">
											<button
												type="submit"
												disabled={loadingUpdateProfile ? true : ''}
												className="btn btn-primary rounded"
												style={{
													width: loadingUpdateProfile ? '120px' : 'auto',
													color: '#fff',
												}}
											>
												{loadingUpdateProfile ? (
													<i className="fa fa-spinner fa-spin"></i>
												) : (
													'Lưu Thông Tin'
												)}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

StudentProfile.getLayout = getStudentLayout;

export default StudentProfile;
