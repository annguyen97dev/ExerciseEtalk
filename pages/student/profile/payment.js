import React, { useState, useEffect, useReducer } from 'react';
import Pagination from 'react-js-pagination';
import Skeleton from 'react-loading-skeleton';
import { getPaymentHistoryAPI } from '~/api/studentAPI';
import { getStudentLayout } from '~/components/Layout';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const fakeData = [
	{
		package: 'Gói học regular',
		course: 'Luyện phản xạ nghe chuyên nghiệp',
		totalClasses: 80,
		payer: 'Trương Văn Lam',
		phone: '0784378011',
		date: '30/10/2020 10:30 AM',
		amount: 6200000,
		paymentMethod: 'Bank',
		status: 'Approved',
		reason: '',
		approver: 'Hùng Mon',
	},
	{
		package: 'Gói học beginner',
		course: 'Luyện phản xạ nghe chuyên nghiệp',
		totalClasses: 80,
		payer: 'Trương Văn Lam',
		phone: '0784378011',
		date: '30/10/2020 10:30 AM',
		amount: 6200000,
		paymentMethod: 'Bank',
		status: 'Approved',
		reason: '',
		approver: 'Hùng Mon',
	},
	{
		package: 'Gói học professional',
		course: 'Luyện phản xạ nghe chuyên nghiệp',
		totalClasses: 80,
		payer: 'Trương Văn Lam',
		phone: '0784378011',
		date: '30/10/2020 10:30 AM',
		amount: 6200000,
		paymentMethod: 'Bank',
		status: 'Approved',
		reason: '',
		approver: 'Hùng Mon',
	},
	{
		package: 'Gói học master',
		course: 'Luyện phản xạ nghe chuyên nghiệp',
		totalClasses: 80,
		payer: 'Trương Văn Lam',
		phone: '0784378011',
		date: '30/10/2020 10:30 AM',
		amount: 6200000,
		paymentMethod: 'Bank',
		status: 'Approved',
		reason: '',
		approver: 'Hùng Mon',
	},
];

const PaymentHistory = () => {
	const [state, setState] = useState([]);
	const [loading, setLoading] = useState(false);

	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				Page: pageNumber,
			});
		}
	};

	const getAPI = async (params) => {
		setLoading(true);
		const res = await getPaymentHistoryAPI(params);
		if (res.Code === 1) {
			//setState(res.Data);
			setState(fakeData); //Fake data for example
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		} else setState(null);
		setLoading(false);
	};

	const _onFilterDate = () => {};
	const renderRow = () => {
		return (
			<>
				{state && state.length > 0 ? (
					state.map((item, index) => (
						<tr key={index}>
							<td>{item.package}</td>
							<td>{item.course}</td>
							<td>{item.totalClasses}</td>
							<td>{item.payer}</td>
							<td>{item.phone}</td>
							<td>{item.date}</td>
							<td>{item.amount}</td>
							<td>{item.paymentMethod}</td>
							<td>{item.status}</td>
							<td>{item.approver}</td>
							<td>{item.reason}</td>
						</tr>
					))
				) : !state ? (
					<tr className="bg-transparent">
						<td colSpan="11">
							<span className="d-block tx-danger tx-medium">
								Đã có lỗi xảy ra, xin vui lòng thử lại
							</span>
							<img
								src="/static/assets/img/error.svg"
								alt="error"
								className="wd-200 mg-b-15"
							/>
						</td>
					</tr>
				) : (
					<tr className="bg-transparent">
						<td colSpan="11">
							<img
								src="/static/img/no-data.svg"
								alt="error"
								className="wd-200 mg-b-15"
							/>
							<span className="d-block tx-danger tx-medium">
								Bạn chưa mua khóa học nào
							</span>
						</td>
					</tr>
				)}
			</>
		);
	};
	useEffect(() => {
		getAPI({
			Page: 1,
		});
	}, []);

	return (
		<>
			<h1 className="main-title-page">Payment history</h1>
			<div className="card">
				<div className="card-body">
					<div
						className="d-flex from-to-group wd-100p flex-md-nowrap flex-wrap wd-md-500"
						id="filter-time"
					>
						<div className="form-row flex-grow-1 mg-sm-r-5">
							<div className="col">
								<DatePicker
									dateFormat="dd/MM/yyyy"
									className="form-control"
									placeholderText={`From date`}
									selected={fromDate}
									onChange={(date) => setFromDate(date)}
									selectsStart
									isClearable={!!fromDate ? true : false}
									startDate={fromDate}
									endDate={toDate}
									showMonthDropdown
									showYearDropdown
									dropdownMode="select"
								/>
								{/* <input type="text" name="start-day " onChange={(value) =>  setFromDate(value)} className="form-control datetimepicker from-date" placeholder="From date" /> */}
							</div>
							<div className="col">
								<DatePicker
									dateFormat="dd/MM/yyyy"
									className="form-control"
									placeholderText={`To date`}
									selected={toDate}
									onChange={(date) => setToDate(date)}
									selectsEnd
									isClearable={!!toDate ? true : false}
									startDate={fromDate}
									endDate={toDate}
									minDate={fromDate}
									showMonthDropdown
									showYearDropdown
									dropdownMode="select"
								/>
							</div>
						</div>
						<div className="flex-grow-0 tx-right flex-shrink-0 mg-t-30 mg-xs-t-0">
							<button
								type="button"
								className="btn btn-primary "
								onClick={_onFilterDate}
							>
								<FontAwesomeIcon icon="search" className="fa fa-search" />{' '}
								Search
							</button>
						</div>
					</div>
					<div className="table-tiket mg-t-30">
						<div className="table-responsive">
							<table className="table tx-center">
								<thead className="">
									<tr>
										<th className="">Package</th>
										<th className="mw-200">Course</th>
										<th>Total number of class</th>
										<th>Payer</th>
										<th>Registered phone number</th>
										<th>Payment date</th>
										<th>Amount (thousand dongs)</th>
										<th>Transaction type</th>
										<th>Status</th>
										<th>Approver</th>
										<th>Reason (cancellation)</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<>
											<tr>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
											</tr>
										</>
									) : (
										renderRow()
									)}
								</tbody>
							</table>
						</div>
						{pageSize < totalResult && (
							<Pagination
								innerClass="pagination justify-content-center mt-3"
								activePage={page}
								itemsCountPerPage={pageSize}
								totalItemsCount={totalResult}
								pageRangeDisplayed={3}
								itemClass="page-item"
								linkClass="page-link"
								onChange={handlePageChange.bind(this)}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

PaymentHistory.getLayout = getStudentLayout;

export default PaymentHistory;
