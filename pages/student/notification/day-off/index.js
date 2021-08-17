import React from 'react';
import { getStudentLayout } from '~/components/Layout';

const DayOff = () => {
	return (
		<>
			<h1 className="main-title-page">Ngày nghỉ</h1>
			<div className="card">
				<div className="card-body">
					<div className="table-responsive">
						<table className="table">
							<thead>
								<tr>
									<th>Tiêu đề</th>
									<th>Ngày bắt đầu</th>
									<th>Ngày kết thúc</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Tet holidays</td>
									<td>13/02/2020</td>
									<td>20/02/2020</td>
								</tr>
								<tr>
									<td>Tet holidays</td>
									<td>13/02/2020</td>
									<td>20/02/2020</td>
								</tr>
								<tr>
									<td>Tet holidays</td>
									<td>13/02/2020</td>
									<td>20/02/2020</td>
								</tr>
								<tr>
									<td>Tet holidays</td>
									<td>13/02/2020</td>
									<td>20/02/2020</td>
								</tr>
								<tr>
									<td>Tet holidays</td>
									<td>13/02/2020</td>
									<td>20/02/2020</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

DayOff.getLayout = getStudentLayout;

export default DayOff;
