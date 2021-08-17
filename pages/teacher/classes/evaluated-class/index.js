import React, { useState, useEffect, useRef } from 'react';
import StudentInformationModal from '~components/common/Modal/StudentInformationModal';
import { getScheduleLog } from '~/api/teacherAPI';
import Pagination from 'react-js-pagination';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import { getAllClass, addScheduleLog } from '~/api/teacherAPI';
import { Popover, OverlayTrigger, Overlay } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const FinishedRow = ({ data, showStudentModal }) => {
	const {
		BookingID,
		ScheduleTimeVN,
		ScheduleTimeUTC,
		StudentName,
		StudentUID,
		DocumentName,
		LessionName,
		SkypeID,
		StatusString,
		Status,
		LessionMaterial,
		GenderID,
		SpecialRequest,
	} = data;
	const handleEnterClass = async (e) => {
		e.preventDefault();
		try {
			addScheduleLog({ BookingID });
		} catch (error) {
			console.log(error?.message ?? `Can't add schedule log !!`);
		}
		window.location.href = `skype:${SkypeID}?chat`;
	};

	return (
		<tr>
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
					className="clrm-studentname tx-info"
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

			<td className="clr-status tx-center">
				<span className={`badge badge-secondary pd-5 tx-12`}>
					{StatusString && StatusString.toString().toUpperCase()}
				</span>
				{/* {status === 1 && <span className="badge badge-warning pd-5">BOOKED</span>}
                {status === 2 && <span className="badge badge-success pd-5">FINISHED</span>} */}
			</td>
			<td className="clr-actions tx-center">
				<Link
					href={`/teacher/evaluation/detail/[eid]`}
					as={`/teacher/evaluation/detail/${BookingID}`}
				>
					<a href={true} className="btn btn-sm btn-success rounded-5">
						<FontAwesomeIcon
							icon="vote-yea"
							className="fas fa-vote-yea mg-r-5"
						/>{' '}
						Detail
					</a>
				</Link>
			</td>
		</tr>
	);
};

const EvaluatedClasses = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
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

	const loadFinishedClass = async () => {
		try {
			const res = await getAllClass({ Page: pageNumber, Status: 2 });
			if (res?.Code && res.Code === 1) {
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
			setIsLoading(false);
			return;
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
		setData([]);
	};

	useEffect(() => {
		loadFinishedClass();
	}, [pageNumber]);

	return (
		<>
			<h1 className="main-title-page">Evaluated classes</h1>
			<div className="card">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-classrooms table-borderless responsive-table table-hover">
							<thead className="">
								<tr className="">
									<th className="clr-time">Schedule</th>
									<th className="clr-lesson">Lesson</th>
									<th className="clr-student">Student</th>
									<th className="clr-status tx-center">Finished Type</th>
									<th className="clr-action tx-center">Actions</th>
								</tr>
							</thead>
							{/*1 item*/}
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
										</tr>
									</>
								) : !!data && !!data.length > 0 ? (
									data.map((item) => (
										<FinishedRow
											key={`${item.BookingID}`}
											data={item}
											showStudentModal={showStudentModal}
										/>
									))
								) : (
									<tr className="bg-white-f">
										<td colSpan={5}>
											<div className="empty-error tx-center mg-t-30 bg-white mg-x-auto">
												<img
													src="/static/img/no-data.svg"
													alt="no-booking"
													className="wd-200 mg-b-15"
												/>
												<p className=" tx-danger tx-medium">
													You don't have any finished classes.
												</p>
											</div>
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

EvaluatedClasses.getLayout = getLayout;

export default EvaluatedClasses;
