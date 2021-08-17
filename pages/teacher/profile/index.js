import React, { useState } from 'react';
import TeacherInformation from '~/page-components/teacher/profile/TeacherInformation';
import TeacherIntroduce from '~/page-components/teacher/profile/TeacherIntroduce';
import TeacherExperience from '~/page-components/teacher/profile/TeacherExperience';
import { Tab } from 'react-bootstrap';
import './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLayout } from '~/components/Layout';
import { Provider as ProfileProvider } from '~/context/ProfileContext';
import { ToastContainer } from 'react-toastify';
const ProfileInfor = () => {
	const [activePage, setActivePage] = useState('profile');

	return (
		<>
			<h1 className="main-title-page">My profile</h1>
			<ProfileProvider>
				<div className="card">
					<div className="card-body">
						<div className="tab-navigation">
							<ul className="list-tab" id="js-list-tab">
								<li className="tab-item">
									<a
										href={true}
										className={`tab-link ${
											activePage === 'profile' && 'active'
										}`}
										onClick={() => setActivePage('profile')}
									>
										<FontAwesomeIcon
											icon={['far', 'id-card']}
											className="far fa-id-card"
										/>{' '}
										Basic Information
									</a>
								</li>
								<li className="tab-item">
									<a
										href={true}
										className={`tab-link ${
											activePage === 'introduce' && 'active'
										}`}
										onClick={() => setActivePage('introduce')}
									>
										<FontAwesomeIcon
											icon={['fab', 'youtube']}
											className="fab fa-youtube"
										/>{' '}
										Introduce video
									</a>
								</li>
								<li className="tab-item">
									<a
										href={true}
										className={`tab-link ${
											activePage === 'experience' && 'active'
										}`}
										onClick={() => setActivePage('experience')}
									>
										<FontAwesomeIcon
											icon="certificate"
											className="fas fa-certificate"
										/>{' '}
										Experience & Certificate
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="card-body">
						<div className="teacher__info-wrap">
							<Tab.Container
								activeKey={activePage}
								defaultActiveKey={activePage}
							>
								<Tab.Content>
									<Tab.Pane eventKey="profile">
										<TeacherInformation />
									</Tab.Pane>
									<Tab.Pane eventKey="introduce">
										<TeacherIntroduce />
									</Tab.Pane>
									<Tab.Pane eventKey="experience">
										<TeacherExperience />
									</Tab.Pane>
								</Tab.Content>
								{/* <TeacherInformation />
                                <TeacherIntroduce />
                                <TeacherExperience /> */}
							</Tab.Container>
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
			</ProfileProvider>
		</>
	);
};

ProfileInfor.getLayout = getLayout;

export default ProfileInfor;
