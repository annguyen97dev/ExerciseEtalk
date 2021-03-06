import React, { useEffect, useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n, withTranslation } from '~/i18n';
import { I18nContext } from 'next-i18next';
import Select, { components } from 'react-select';
import { appSettings } from '~/config';

const LangOptions = [
	{
		label: 'Vietnamese',
		value: 'vi',
		flag: 'vn',
	},
	{
		label: 'English',
		value: 'en',
		flag: 'us',
	},
];

const FlatOption = (props) => {
	const { data } = props;
	return (
		<components.Option {...props}>
			<div className="d-flex align-items-center">
				<span className={`flag-icon flag-icon-${data.flag}`}></span>
				<span className="mg-l-10">{data.label}</span>
			</div>
		</components.Option>
	);
};

const Header = ({ t, isStudent }) => {
	const { i18n } = useContext(I18nContext);
	const [lang, setLang] = useState(LangOptions[0]);

	const _handleChangeSelect = (selected) => {
		setLang(selected);
		i18n.changeLanguage(selected.value === 'en' ? 'en' : 'vi');
		window.localStorage.setItem('language', JSON.stringify(selected.value));
	};

	const setSelectLanguage = (key) => {
		setLang(LangOptions.find((item) => item.value === key));
	};

	const checkDefaultLanguage = () => {
		if (typeof window === 'undefined') return;
		try {
			const language = window.localStorage.getItem('language');
			console.log({ language });
			language !== null && setSelectLanguage(JSON.parse(language));
			language === null &&
				window.localStorage.setItem(
					'language',
					JSON.stringify(i18n?.language ?? 'en'),
				);
		} catch (error) {}
	};
	useEffect(() => {
		isStudent ? (appSettings.UID = 1071) : (appSettings.UID = 20);
	}, [isStudent]);

	useEffect(() => {
		checkDefaultLanguage();
	}, []);
	return (
		<>
			<div className="content-header">
				<div className="navbar-left">
					<span
						className="d-inline-flex align-items-center tx-dark"
						style={{ backgroundColor: '#efefef', padding: '8px 10px' }}
					>
						<FontAwesomeIcon
							icon="globe-europe"
							className="fas fa-globe-europe mg-r-5"
						/>
						Timezone:
						<span className="tx-medium mg-l-10 tx-primary">GTM +7</span>
					</span>
				</div>
				<div className="navbar-right">
					<Select
						isSearchable={false}
						options={LangOptions}
						formatOptionLabel={(context) => (
							<div className="d-flex align-items-center">
								<span className={`flag-icon flag-icon-${context.flag}`}></span>
								<span className="mg-l-10">{context.label}</span>
							</div>
						)}
						components={{
							Option: FlatOption,
							IndicatorSeparator: () => null,
						}}
						value={lang}
						onChange={_handleChangeSelect}
						className="wd-150 mg-r-15"
						styles={{
							control: (oldStyle, state) => {
								return {
									...oldStyle,
									border: 0,
									outline: 0,
									boxShadow: 'none',
									borderRadius: 0,
									backgroundColor: '#efefef',
								};
							},
						}}
					/>

					<div className="dropdown dropdown-notification">
						<a
							href
							className="dropdown-link new-indicator"
							data-toggle="dropdown"
						>
							<i data-feather="bell" /> <span>2</span>
						</a>
						<div className="dropdown-menu dropdown-menu-right">
							<div className="dropdown-header">Th??ng b??o</div>
							<a href className="dropdown-item">
								<div className="media">
									<div className="avatar avatar-sm avatar-online">
										<img
											src="/static/img/avatar.jpg"
											className="rounded-circle"
											alt=""
										/>
									</div>
									<div className="media-body mg-l-15">
										<p>
											Nguy???n Ho??ng ???? nh???p 30{' '}
											<strong>M??y khoan Muraz si??u vi???t GS-2000</strong>v??o Kho
											H?? N???i
										</p>
										<span>Mar 15 12:32pm</span>
									</div>
								</div>
							</a>
							<a href className="dropdown-item">
								<div className="media">
									<div className="avatar avatar-sm avatar-online">
										<img
											src="/static/img/avatar.jpg"
											className="rounded-circle"
											alt=""
										/>
									</div>
									<div className="media-body mg-l-15">
										<p>
											Nguy???n Ho??ng ???? nh???p{' '}
											<strong>30 M??y khoan Muraz si??u vi???t GS-2000</strong> v??o{' '}
											<strong>Kho H?? N???i</strong>
										</p>
										<span>Mar 15 12:32pm</span>
									</div>
								</div>
							</a>
							<a href className="dropdown-item">
								<div className="media">
									<div className="avatar avatar-sm avatar-online">
										<img
											src="/static/img/avatar.jpg"
											className="rounded-circle"
											alt=""
										/>
									</div>
									<div className="media-body mg-l-15">
										<p>
											Tr????ng Th???c ???? xu???t kho 30 s???n ph???m{' '}
											<strong>M??y khoan Muraz si??u vi???t GS-2000</strong> t??? kho
											HCM
										</p>
										<span>Mar 13 02:56am</span>
									</div>
								</div>
							</a>
							<a href className="dropdown-item">
								<div className="media">
									<div className="avatar avatar-sm avatar-online">
										<img
											src="/static/img/avatar.jpg"
											className="rounded-circle"
											alt=""
										/>
									</div>
									<div className="media-body mg-l-15">
										<p>
											Nguy???n Th???o Ly v???a xu???t ho?? ????n b??n l???{' '}
											<strong>#HD332212</strong> s??? ti???n 3.000.000 t???i kho HCM
										</p>
										<span>Mar 12 10:40pm</span>
									</div>
								</div>
							</a>
							<div className="dropdown-footer">
								<a href>Xem t???t c??? th??ng b??o</a>
							</div>
						</div>
					</div>
					<div className="dropdown dropdown-profile">
						<a
							href
							className="dropdown-link d-flex align-items-center tx-black"
							data-toggle="dropdown"
							data-display="static"
						>
							<div className="avatar avatar-sm mg-r-5">
								<img
									src="/static/img/avatar.jpg"
									className="rounded-circle"
									alt=""
								/>
							</div>
							<div className="d-flex align-items-center">
								<span className="name">Hu???nh Th??? Ph????ng Loan</span>{' '}
								<FontAwesomeIcon
									icon="angle-down"
									className="fa fa-angle-down mg-l-5"
								/>
							</div>
						</a>
						<div className="dropdown-menu dropdown-menu-right tx-13">
							<div className="avatar avatar-lg mg-b-15">
								<img
									src="/static/img/avatar.jpg"
									className="rounded-circle"
									alt=""
								/>
							</div>
							<h6 className="tx-semibold mg-b-5">Mona Media</h6>
							<p className="mg-b-25 tx-12 tx-color-03">Administrator</p>
							<Link href={isStudent ? '/student/profile' : '/teacher/profile'}>
								<a href={true} className="dropdown-item">
									<i data-feather="user" /> View Profile
								</a>
							</Link>
							<div className="dropdown-divider" />
							<a href={true} className="dropdown-item">
								<i data-feather="log-out" />
								Sign Out
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

Header.getInitialProps = async () => ({
	namespacesRequired: ['menu'],
});

export default withTranslation('menu')(Header);
