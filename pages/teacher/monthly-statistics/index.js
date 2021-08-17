import React from 'react';
import { getLayout } from '~/components/Layout';
import './index.module.scss';
import { getMonthReport } from '~/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import Select from 'react-select';
import { appSettings } from '~/config';
import { i18n, Link, withTranslation } from '~/i18n';
const timeOptions = [
	{
		value: 4,
		label: 'This month',
	},
	{
		value: 1,
		label: '30 days ago',
	},
	{
		value: 2,
		label: 'Last month',
	},
	{
		value: 3,
		label: 'Last 3 month',
	},
];

const MonthlyStatistics = ({ t }) => {
	const [isLoading, setIsloading] = React.useState(true);
	const [state, setState] = React.useState(null);
	const [select, setSelect] = React.useState(timeOptions[0]);
	const getMonthReportData = async () => {
		setIsloading(true);
		const res = await getMonthReport({
			Type: select.value,
		});
		if (res.Code === 1 && !!res.Data) setState(res.Data);
		setIsloading(false);
	};

	React.useEffect(() => {
		getMonthReportData();
	}, [select]);
	return (
		<>
			<div
				className="d-md-flex align-items-center justify-content-between pos-relative"
				style={{ zIndex: 11 }}
			>
				<h1 className="main-title-page">{t('title')}</h1>
				<div className="select-wrap mg-t-15 mg-md-t-0 wd-md-150">
					<Select
						options={timeOptions}
						onChange={setSelect}
						defaultValue={select}
						styles={appSettings.selectStyle}
					/>
				</div>
			</div>
			<div className="report__container pos-relative z-index-10">
				<div className="mx-auto">
					<div className="row price-table-wrapper pd-b-40-f">
						<div className="col-12 col-xs-6 col-md-6 col-lg-4 col-xl-4">
							<div className="table-card bg-1">
								<div className="card">
									<div className="card-body">
										<p className="name bg-1">Time slots</p>
										<ul className="feather">
											<li className="rp-info">
												<span className="label">Opened Slots</span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.OpenedSlots ? (
														state.OpenedSlots
													) : (
														0
													)}
												</span>
											</li>
											<li className="rp-info">
												<span className="label">Finished Classes</span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.FinishedSlots ? (
														state.FinishedSlots
													) : (
														0
													)}
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 col-xs-6 col-md-6 col-lg-4 col-xl-4">
							<div className="table-card bg-2">
								<div className="card ">
									<div className="card-body">
										<p className="name bg-2">Participation</p>
										<ul className="feather">
											<li className="rp-info">
												<span className="label">
													Teacher cancellation slots{' '}
												</span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.TeacherCancellationSlots ? (
														state.TeacherCancellationSlots
													) : (
														0
													)}
												</span>
											</li>
											<li className="rp-info">
												<span className="label">Teacher no show slots </span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.TeacherNoshowSlots ? (
														state.TeacherNoshowSlots
													) : (
														0
													)}
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 col-xs-6 col-md-6 col-lg-4 col-xl-4">
							<div className="table-card bg-3">
								<div className="card">
									<div className="card-body">
										<p className="name bg-3">Feedback</p>
										<ul className="feather">
											<li className="rp-info">
												<span className="label">5 stars feedback rate </span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.FiveStartFeedbackRate ? (
														state.FiveStartFeedbackRate
													) : (
														0
													)}
												</span>
											</li>
											<li className="rp-info">
												<span className="label">Feedback submission rate </span>
												<span className="value">
													{isLoading ? (
														<Skeleton width={25} />
													) : !!state && state.FeedbackSubmissionRate ? (
														state.FeedbackSubmissionRate
													) : (
														0
													)}{' '}
													%
												</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-body">
						<div className="table-responsive">
							<table
								className="table table-bordered table-vcenter table-explane table-hover"
								style={{ borderCollapse: 'separate' }}
							>
								<tbody>
									<tr>
										<td rowSpan={2} className="valign-middle tx-center">
											<h5 className="tx-bold">TIME SLOTS</h5>
										</td>
										<td>
											<h5>Opened Slots</h5>
											<p className="tx-gray-500 mg-b-0">
												Number of slots you opened that expired or finished
												within the selected period
											</p>
										</td>
									</tr>
									<tr>
										<td>
											<h5>Finished Classes</h5>
											<p className="tx-gray-500 mg-b-0">
												Number of classes that you completed with the Finish
												Type “As Schedule” or “Student No Show”{' '}
											</p>
										</td>
									</tr>
								</tbody>
								<tbody>
									<tr>
										<td rowSpan={2} className="valign-middle tx-center">
											<h5 className="tx-bold">PARTICIPATION</h5>
										</td>
										<td>
											<h5>Class Finished Rate</h5>
											<p className="tx-gray-500 mg-b-0">
												The percentage of classes that you completed with the
												Finish Type “As Schedule” or “Student No Show” and were
												not “Teacher Cancellations” or “Teacher No Show”.
											</p>
										</td>
									</tr>
									<tr>
										<td>
											<h5>Teacher Cancellations</h5>
											<p className="tx-gray-500 mg-b-0">
												Number of classes you canceled that expired or finished
												within the selected period
											</p>
										</td>
									</tr>
								</tbody>
								<tbody>
									<tr>
										<td rowSpan={2} className="valign-middle tx-center">
											<h5 className="tx-bold">STUDENT FEEDBACK</h5>
										</td>
										<td>
											<h5>5 Stars Student Feedback Rate</h5>
											<p className="tx-gray-500 mg-b-0">
												The percentage of 5 stars feedback from students given
												within the selected period
											</p>
										</td>
									</tr>
									<tr>
										<td>
											<h5>Teacher Feedback Timely Submission Rate</h5>
											<p className="tx-gray-500 mg-b-0">
												The percentage of teacher feedback submission that you
												submit within 12 hours of every class.
											</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

MonthlyStatistics.getLayout = getLayout;
MonthlyStatistics.getInitialProps = async () => ({
	namespacesRequired: ['monthly-statistics'],
});
export default withTranslation('monthly-statistics')(MonthlyStatistics);
