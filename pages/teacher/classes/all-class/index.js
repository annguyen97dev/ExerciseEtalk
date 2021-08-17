import React, { useState, useEffect, useRef } from 'react';
import { getAllClass, addScheduleLog } from '~/api/teacherAPI';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import Pagination from 'react-js-pagination';
import Select from 'react-select';
import { appSettings } from '~/config';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import './index.module.scss';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimeFormat = new Intl.DateTimeFormat('vi-VN', {
	month: '2-digit',
	day: '2-digit',
	year: 'numeric',
});

const statusOptions = [
	{
		value: 0,
		label: 'All status',
	},
	{
		value: 1,
		label: 'Booked',
	},
	{
		value: 2,
		label: 'Finished',
	},
	{
		value: 3,
		label: 'Teacher no show',
	},
	{
		value: 4,
		label: 'Student no show',
	},
	{
		value: 5,
		label: 'IT problem',
	},
];

const AllClassRow = ({ data, showStudentModal }) => {
	const {
		Status,
		StatusString,
		FinishTypeString,
		ScheduleTimeVN = '',
		ScheduleTimeUTC = '',
		LessionMaterial = '',
		StudentName = '',
		BookingID = '',
		LessionName = '',
		SkypeID,
		StudentUID,
		DocumentName = '',
		GenderID,
	} = data;

	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			const res = addScheduleLog({ BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	return (
		<tr>
			<td className="clr-id">
				<span className="">{BookingID}</span>
			</td>
			<td className="clr-lesson">
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-medium">Course:</span>
					<span className="">{DocumentName}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-medium">Lesson:</span>
					<span className="">{LessionName}</span>
				</div>
			</td>
			<td className="clr-student">
				<a
					href={true}
					onClick={(e) => {
						e.preventDefault();
						showStudentModal(StudentUID);
					}}
					className="clrm-studentname "
				>
					{StudentName}
					<FontAwesomeIcon
						icon={
							GenderID === 1 ? 'mars' : GenderID === 2 ? 'venus' : 'genderless'
						}
						className={`fa fa-${
							GenderID === 1 ? 'mars' : GenderID === 2 ? 'venus' : 'genderless'
						} mg-l-10 clrm-icon-male`}
					/>
				</a>
			</td>
			<td className="clr-time">
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap wd-80 d-inline-block">
						<FontAwesomeIcon icon="clock" className="fa fa-clock tx-primary" />{' '}
						<span className="tx-medium">VN time</span>:
					</span>
					<span className="">{ScheduleTimeVN}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-nowrap wd-80 d-inline-block">
						<FontAwesomeIcon icon="clock" className="fa fa-clock tx-primary" />{' '}
						<span className="tx-medium">Your time</span>:
					</span>
					<span className="">{ScheduleTimeUTC}</span>
				</div>
			</td>
			<td className="clr-status">
				<span
					className={`badge badge-${
						Status === 1
							? 'primary tx-white'
							: Status === 2
							? 'success'
							: 'danger'
					} pd-5`}
				>
					{Status === 1
						? 'BOOKED'
						: Status === 2
						? 'FINISHED'
						: Status === 3
						? 'TEACHER OFF'
						: Status === 4
						? 'STUDENT OFF'
						: 'IT PROBLEM'}
				</span>
				{/* {Status === 1 && <span className="badge badge-warning pd-5">BOOKED</span>}
                {Status === 2 && <span className="badge badge-success pd-5">FINISHED</span>} */}
			</td>
			{/* <td className="clr-finishType">
				{Status === 2 && <span className="">{FinishTypeString}</span>}

			</td> */}
			<td className="clr-actions">
				{
					<a
						href={LessionMaterial}
						className="btn btn-sm btn-warning rounded-5 mg-5"
						target="_blank"
						rel="noreferrer"
					>
						<FontAwesomeIcon
							icon="book-open"
							className="fa fa-book-open clrm-icon mg-r-5"
						/>{' '}
						Material
					</a>
				}
				{Status === 1 && (
					<a
						href={`skype:${SkypeID}?chat`}
						className=" btn btn-sm btn-info rounded-5 mg-5"
						onClick={handleEnterClass}
					>
						<FontAwesomeIcon
							icon={['fab', 'skype']}
							className="fab fa-skype clrm-icon mg-r-5"
						/>{' '}
						Join class
					</a>
				)}
				{Status === 2 && (
					<Link href={`/teacher/evaluation/detail/${BookingID}`}>
						<a
							href={true}
							// target="_blank"
							// rel="noreferrer"
							className=" btn btn-sm btn-success btn-detail rounded-5 mg-5"
						>
							<FontAwesomeIcon
								icon="vote-yea"
								className="fas fa-vote-yea mg-r-5"
							/>{' '}
							Detail
						</a>
					</Link>
				)}
			</td>
		</tr>
	);
};

const AllClasses = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [filterStatusAllClass, setFilterStatusAllClass] = useState(
		statusOptions[0],
	);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState([]);
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [studentId, setStudentId] = useState(null);
	const mdStudentInfo = useRef(true);

	const showStudentModal = (studentId) => {
		setStudentId(studentId);
		$(mdStudentInfo.current).modal('show');
	};

	const unMountComponents = () => {
		mdStudentInfo.current = false;
	};

	useEffect(() => {
		return unMountComponents;
	}, []);

	const _onFilterDate = (e) => {
		e.preventDefault();
		loadAllClassesData();
	};

	const _changeFilterStatusAllClass = (event) => {
		setFilterStatusAllClass(event.target.value);
	};

	const loadAllClassesData = async () => {
		setIsLoading(true);
		console.log(fromDate);
		try {
			const res = await getAllClass({
				Page: parseInt(pageNumber),
				Status: parseInt(filterStatusAllClass.value),
				fromDate: fromDate ? DateTimeFormat.format(new Date(fromDate)) : '',
				toDate: toDate ? DateTimeFormat.format(new Date(toDate)) : '',
			});
			if (res?.Code && res.Code === 1) {
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};
	useEffect(() => {
		console.log(filterStatusAllClass);
	}, [filterStatusAllClass]);

	useEffect(() => {
		loadAllClassesData();
	}, [pageNumber, filterStatusAllClass]);

	return (
		<>
			<h1 className="main-title-page">All classes</h1>
			<div className="d-flex align-items-center justify-content-between mg-b-15 flex-wrap">
				<div className="wd-150 order-1 mg-t-15 mg-md-t-0">
					<Select
						options={statusOptions}
						defaultValue={filterStatusAllClass}
						onChange={(values) => setFilterStatusAllClass(values)}
						styles={appSettings.selectStyle}
					/>
					{/* <select name="language" id=""
                        value={filterStatusAllClass}
                        className="form-control" onChange={_changeFilterStatusAllClass}>
                        <option value="0">All status</option>
                        <option value="1">Booked</option>
                        <option value="2">Finished</option>
                    </select> */}
				</div>
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
					<div className="flex-grow-0 tx-right flex-shrink-0 mg-t-30 mg-sm-t-0">
						<button
							type="button"
							className="btn btn-primary "
							onClick={_onFilterDate}
						>
							<FontAwesomeIcon icon="filter" className="fa fa-filter" /> Filter
						</button>
					</div>
				</div>
			</div>

			<div className="card mg-b-30">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-borderless responsive-table table-hover">
							<thead>
								<tr>
									<th className="clr-id">ID</th>
									<th className="clr-lesson">Lesson</th>
									<th className="clr-student">Student </th>
									<th className="clr-time">Schedule </th>
									<th className="clr-status">Status</th>
									{/* <th className="clr-finishType">Finish Type</th> */}
									<th className="clr-actions">Actions</th>
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
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
										</tr>
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
										</tr>
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
										</tr>
									</>
								) : !!data && !!data.length > 0 ? (
									data.map((item) => (
										<AllClassRow
											key={`${item.BookingID}`}
											data={item}
											showStudentModal={showStudentModal}
										/>
									))
								) : (
									<tr>
										<td colSpan={7}>
											<span className="tx-danger d-block tx-center tx-medium tx-16">
												No classes.
											</span>
										</td>
									</tr>
								)}
							</tbody>
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

			<StudentInformationModal ref={mdStudentInfo} studentId={studentId} />
		</>
	);
};

AllClasses.getLayout = getLayout;

export default AllClasses;
