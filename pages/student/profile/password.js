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

const PasswordForm = () => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [displayPassword, setDisplayPassword] = useState(false);
	const [error, setError] = useState(null);
	const [loadingPassword, setLoadingPassword] = useState(false);

	const updatePassToastSuccess = () =>
		toast.success(CHANGE_PASSWORD_SUCCESS, toastInit);
	const updatePassToastFail = () => toast.error(FETCH_ERROR, toastInit);

	const _onSubmit = (e) => {
		e.preventDefault();

		if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
			setError(FILL_PASSWORD);
			return;
		}

		if (oldPassword === newPassword) {
			setError(DIFFERENT_PASSWORD);
			return;
		}
		if (newPassword !== confirmPassword) {
			setError(CONFIRM_PASSWORD);
			return;
		}
		setError(null);
		_handleSubmitPassword();
	};

	const _handleSubmitPassword = async () => {
		setLoadingPassword(true);
		const res = await updatePassAPI({
			OldPass: oldPassword,
			NewPass: newPassword,
		});
		setLoadingPassword(false);
		if (res.Code === 0) {
			setError(INCORRECT_PASSWORD);
			return;
		} else if (res.Code === 1) {
			setError(null);
			updatePassToastSuccess();
			setOldPassword('');
			setNewPassword('');
			setConfirmPassword('');
		} else updatePassToastFail();
	};

	return (
		<>
			<h1 className="main-title-page">Change password</h1>
			<div className="card">
				<div className="card-body">
					<form
						className="metronic-form change-password-form"
						onSubmit={_onSubmit}
					>
						{error && error !== '' && (
							<div className="alert alert-danger mg-b-10" role="alert">
								{error}
							</div>
						)}
						<div className="form-account">
							<div className="row">
								<div className="col-12">
									<div className="form-row align-items-center ">
										<div className="form-group col-sm-3">
											<p className="mg-b-0 tx-medium">M???t kh???u hi???n t???i</p>
										</div>
										<div className="form-group col-sm-9 col-password">
											<input
												type={displayPassword ? 'text' : 'password'}
												autoComplete="off"
												className="form-control"
												name="OldPass"
												onChange={(e) => setOldPassword(e.target.value)}
												value={oldPassword}
											/>
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row align-items-center ">
										<div className="form-group col-sm-3">
											<p className="mg-b-0 tx-medium">M???t kh???u m???i</p>
										</div>
										<div className="form-group col-sm-9 col-password">
											<input
												type={displayPassword ? 'text' : 'password'}
												autoComplete="off"
												className="form-control"
												name="NewPass"
												onChange={(e) => setNewPassword(e.target.value)}
												value={newPassword}
											/>
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row align-items-center ">
										<div className="form-group col-sm-3">
											<p className="mg-b-0 tx-medium">X??c nh???n m???t kh???u</p>
										</div>
										<div className="form-group col-sm-9 col-password">
											<input
												type={displayPassword ? 'text' : 'password'}
												autoComplete="off"
												className="form-control"
												name="OldPass"
												onChange={(e) => setConfirmPassword(e.target.value)}
												value={confirmPassword}
											/>
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row">
										<div className="form-group pd-l-2 col-sm-9 offset-sm-3">
											<div className="custom-control custom-checkbox">
												<input
													type="checkbox"
													className="custom-control-input"
													id="displaypassword"
													onChange={() => setDisplayPassword(!displayPassword)}
												/>
												<label
													className="custom-control-label"
													htmlFor="displaypassword"
												>
													Hi???n th??? m???t kh???u
												</label>
											</div>
										</div>
									</div>
								</div>
								<div className="col-12">
									<div className="form-row align-items-center ">
										<div className="form-group col-sm-3"></div>
										<div className="form-group col-sm-9 mg-b-0-f">
											<button
												type="submit"
												disabled={loadingPassword ? true : ''}
												className="btn btn-primary rounded"
												style={{
													width: loadingPassword ? '115px' : 'auto',
													color: '#fff',
												}}
											>
												{loadingPassword ? (
													<i className="fa fa-spinner fa-spin"></i>
												) : (
													'?????i M???t Kh???u'
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

PasswordForm.getLayout = getStudentLayout;

export default PasswordForm;
