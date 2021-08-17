import React, { useState, useEffect } from 'react';
import { getStudentLayout } from '~/components/Layout';
import { getUpcomingLessons } from '~/api/studentAPI';
import Pagination from 'react-js-pagination';
import {
	convertDateFromTo as cvDate,
	getDifferentMinBetweenTime,
} from '~/utils';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './table.module.scss';
import PerfectScrollbar from 'react-perfect-scrollbar';
const fakeData = [
	{
		BookingID: 2,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '24/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessionMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
	{
		BookingID: 3,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '25/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessonMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
	{
		BookingID: 4,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '24/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessionMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
	{
		BookingID: 5,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '25/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessonMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
	{
		BookingID: 6,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '24/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessionMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
	{
		BookingID: 3,
		TeacherUID: 1,
		TeacherName: 'Trương Công Thức',
		StudentUID: 0,
		StudentName: null,
		ScheduleTimeVN: '25/06/2020 14:00 - 14:25',
		DocumentName: 'React JS in future',
		LessonName: 'Lession 3: Complete React Hook',
		LessonMaterial: '',
		SkypeID: 'live:123123',
		SpecialRequest: '',
		Status: 0,
		FinishType: 0,
	},
];

const checkCancelTime = (startDate) => {
	const oneMinutes = 1000 * 60 * 60;
	const startTime = startDate.getTime();
	const now = new Date().getTime();
	const diffTime = startTime - now;
	return Math.round(diffTime / oneMinutes) > 30 ? true : false;
};

const TableView = () => {
	const [schedules, setSchedules] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');

	const getUpcomingSchedule = async () => {
		setIsLoading(true);
		try {
			const res = await getUpcomingLessons({ Page: pageNumber });
			if (res.Code === 1) {
				// setSchedules(res.Data);
				setSchedules(fakeData);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			}
			res.Code === 0 && console.log('Lỗi API, Code 0');
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		getUpcomingSchedule();
	}, [pageNumber]);

	return (
		<>
			<h1 className="main-title-page">Booked schedule</h1>
			<div className="card">
				<div className="card-body">
					<div
						className="d-flex from-to-group mg-b-15 flex-wrap"
						id="filter-time"
					>
						<div className="d-flex flex-wrap-0">
							<div className="wd-sm-200 mg-sm-r-10 wd-100p mg-b-10 mg-sm-b-0">
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
								/>
							</div>
							<div className="wd-sm-200 mg-sm-r-10 wd-100p">
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
								/>
							</div>
						</div>
						<div className="flex-grow-0 tx-right flex-shrink-0 wd-100p wd-sm-auto tx-left mg-t-10 mg-sm-t-0">
							<button
								type="button"
								className="btn btn-primary wd-100p wd-sm-auto"
								onClick={getUpcomingSchedule}
							>
								<FontAwesomeIcon icon="search" className="fa fa-search" />{' '}
								Search
							</button>
						</div>
					</div>
					<div className="table-responsive">
						<table className="table table-borderless responsive-table">
							<thead>
								<tr>
									<th>Giáo viên</th>
									<th>Gói học</th>
									<th>Khóa học</th>
									<th>Giáo trình</th>
									<th>Thời lượng</th>
									<th>Ngày</th>
									<th>Giờ</th>
									<th>Lớp học</th>
									<th>Trạng thái</th>
								</tr>
							</thead>
							<PerfectScrollbar component="tbody">
								{isLoading ? (
									<tr>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
										<td>
											<Skeleton count={1} />
										</td>
									</tr>
								) : !!schedules && schedules.length > 0 ? (
									[...schedules].map((ls, index) => (
										<tr key={`${index}`}>
											<td>Jane Jurry</td>
											<td>Gói học plus</td>
											<td>Luyện phản xạ chuyên nghiệp</td>
											<td>Giáo trình 1</td>
											<td>50</td>
											<td>15/10/2020</td>
											<td>19:00 - 19:50 PM</td>
											<td>Lớp chính thức</td>
											<td>Sắp diễn ra</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={9}>
											<div className="empty-error tx-center mg-y-30 bg-white mg-x-auto">
												<img
													src="/static/img/no-data.svg"
													alt="no-booking"
													className="wd-200 mg-b-15"
												/>
												<p className=" tx-danger tx-medium">
													You don't have any booked lessons.
												</p>
											</div>
										</td>
									</tr>
								)}
							</PerfectScrollbar>
						</table>
					</div>
					{totalResult > pageSize && (
						<Pagination
							innerClass="pagination mg-t-15"
							activePage={pageNumber}
							itemsCountPerPage={pageSize}
							totalItemsCount={totalResult}
							pageRangeDisplayed={5}
							onChange={(page) => setPageNumber(page)}
							itemClass="page-item"
							linkClass="page-link"
							activeClass="active"
						/>
					)}
				</div>
			</div>
		</>
	);
};

TableView.getLayout = getStudentLayout;

export default TableView;
