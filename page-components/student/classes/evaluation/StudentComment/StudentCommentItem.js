import React from 'react';
import './StudentCommentItem.module.scss';
import { decodeHTML } from '~/utils';
import dayjs from 'dayjs';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const StudentCommentItem = ({
	ScheduleTimeVN,
	TeacherName,
	TeacherIMG,
	TeacherUID,
	Note,
	Rate,
	LinkDetail,
	DocumentName,

	CreatedDate,
	Evaluation,
	StudentIMG,
	StudentName,
}) => {
	return (
		<div className="fb-item">
			<div className="fb-avatar">
				<img
					src={
						!!TeacherIMG
							? TeacherIMG
							: !!StudentIMG
							? StudentIMG
							: '../assets/img/default-avatar.png'
					}
					alt="avatar"
					className="avatar"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = '../assets/img/default-avatar.png';
					}}
				/>
			</div>
			<div className="fb-info">
				<div className="name-rating">
					{!!TeacherName ? (
						<a
							className="no-hl"
							href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}
						>
							<p className="name">{TeacherName}</p>
						</a>
					) : !!StudentName ? (
						<p className="name">{StudentName}</p>
					) : (
						''
					)}
					<div className="rating-wrap">
						<div className="rating-stars">
							<span className="empty-stars">
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
							</span>
							<span className="filled-stars" style={{ width: `${Rate * 20}%` }}>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
							</span>
						</div>
					</div>
				</div>
				<div className="metas">
					{ScheduleTimeVN ? (
						<div className="meta">
							Time: <span>{ScheduleTimeVN} </span>{' '}
						</div>
					) : CreatedDate ? (
						<div className="meta">
							Time: <span>{dayjs(CreatedDate).format('LLLL')}</span>{' '}
						</div>
					) : (
						''
					)}
					{DocumentName && <div className="meta">{DocumentName}</div>}
				</div>
				<div className="feedback-comment mg-b-15-f">
					<p
						className="word-break"
						dangerouslySetInnerHTML={{
							__html: decodeHTML(
								!!Note ? Note : !!Evaluation ? Evaluation : '',
							),
						}}
					></p>
				</div>
				<div className="actions">
					{LinkDetail && (
						<Link
							href="/student/classes/evaluation/detail/[eid]"
							as={LinkDetail}
						>
							<a href={true} className="btn btn-sm btn-success mg-r-10">
								<FontAwesomeIcon
									icon="vote-yea"
									className="fas fa-vote-yea mg-r-5"
								/>{' '}
								Xem đánh giá
							</a>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default StudentCommentItem;
