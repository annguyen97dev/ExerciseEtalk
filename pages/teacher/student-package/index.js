import React, { useState, useEffect, useRef } from 'react';
import Pagination from 'react-js-pagination';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import { getMissingFeedback } from '~/api/teacherAPI';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const MissingFeedbackRow = ({ data }) => {
	const {
		BookingID,
		ScheduleTimeVN,
		ScheduleTimeUTC,
		DocumentName,
		LessionName,
		EvaluationStatus,
	} = data;
	return (
		<tr>
			<td>#00954895</td>
			<td>Trương Văn Lam</td>
			<td>32 classes</td>
			<td>15 classes</td>
			<td>I dont know what it mean...</td>
			<td>25/10/2020</td>
		</tr>
	);
};

const StudentPackage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);

	const loadMissingFeedback = async () => {
		try {
			const res = await getMissingFeedback({ Page: pageNumber });
			if (res?.Code && res.Code === 1) {
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadMissingFeedback();
	}, [pageNumber]);

	return (
		<>
			<h1 className="main-title-page">End of student's package</h1>
			<div className="card">
				<div className="card-body">
					<>
						<div className="table-responsive ">
							<table className="table table-classrooms table-borderless responsive-table table-hover">
								<thead className="">
									<tr className="">
										<th className="">Student code</th>
										<th className="">Student name</th>
										<th className="">Total number of class </th>
										<th className="">Classes were booked</th>
										<th className="">Furthest class</th>
										<th className="">End date of package</th>
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
											</tr>
										</>
									) : !!data && !!data.length > 0 ? (
										data.map((item) => (
											<MissingFeedbackRow
												key={`${item.BookingID}`}
												data={item}
											/>
										))
									) : (
										<tr className="bg-white-f">
											<td colSpan={4}>
												<div className="empty-error tx-center mg-t-30 bg-white mg-x-auto">
													<img
														src="/static/img/no-data.svg"
														alt="no-booking"
														className="wd-200 mg-b-15"
													/>
													<p className=" tx-danger tx-medium">
														Greate, all courses are evaluated.
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
					</>
				</div>
			</div>
		</>
	);
};

StudentPackage.getLayout = getLayout;

export default StudentPackage;
