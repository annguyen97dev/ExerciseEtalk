import React, { useState, useEffect, useReducer, useRef } from 'react';
import { getListEventsOfWeek } from '~/api/teacherAPI';

// import FullCalendar from './FullCalendar';
import dayjs from 'dayjs';
import lottie from '~/node_modules/lottie-web/build/player/lottie.min.js';
import dynamic from 'next/dynamic';
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'STATE_CHANGE': {
			return {
				...prevState,
				[payload.key]: payload.value,
			};
			break;
		}
		default:
			return prevState;
			break;
	}
};

const NoSSRCalendar = dynamic(import('./FullCalendar'), { ssr: false });

//Add hourse Prototype
const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const hotTime = [5, 6, 7, 8, 9, 13, 14, 15, 16];

const BookingCalendar = () => {
	const [eventSource, setEventSource] = useState(null);
	const [activeDate, setActiveDate] = useState(new Date());
	const [isLoading, setIsLoading] = useState(true);

	let loadingRef = useRef(true);

	const getEventByWeek = async (date) => {
		setIsLoading(true);
		try {
			const res = await getListEventsOfWeek({
				Date: dayjs(date).format('DD/MM/YYYY'),
			}); // @string date dd/mm/yyyy
			if (res.Code === 1 && res.Data.length > 0) {
				const newEvents = res.Data.map((event) => {
					return {
						...event,
						id: event.BookingID,
						title: event.title || '',
						start: dayjs(event.Start, 'YYYY-MM-DDTHH:mm').toDate(),
						end: dayjs(event.End, 'YYYY-MM-DDTHH:mm').toDate(),
						eventType: event.eventType,
						bookStatus: event.bookStatus,
						bookInfo: event.bookInfo,
						available: event.available,
						isEmptySlot: event.isEmptySlot,
					};
				});
				setEventSource(newEvents);
			}
		} catch (error) {
			console.log('Goi API khong thanh cong');
		}
		setIsLoading(false);
	};

	const onSubmit = (e) => {
		e.preventDefault();
	};

	useEffect(() => {
		getEventByWeek();
		// console.log(activeDate);
	}, [activeDate]);

	const cleanUp = () => {
		loadingRef.current && (loadingRef.current = false);
	};

	useEffect(() => {
		lottie &&
			lottie.loadAnimation({
				container: loadingRef.current, // the dom element that will contain the animation
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: '/static/img/calendar-loading.json', // the path to the animation json
			});

		return cleanUp;
	}, []);

	return (
		<>
			<div className="user-slot-summary">
				<p className="mg-b-5">
					Your package total classes :{' '}
					<span className="tx-bold tx-primary">50</span>
				</p>
				<p>
					Classes were booked :{' '}
					<span className="tx-bold tx-primary">26 / 50</span>
				</p>
			</div>
			<div className="book__calendar" id="js-book-calendar">
				{isLoading ? (
					<div ref={loadingRef} className="loading-lottie"></div>
				) : (
					<>
						<NoSSRCalendar data={eventSource} isLoading={isLoading} />
					</>
				)}
			</div>
			<div className="notice pd-20 bg-secondary rounded-5 mg-t-20">
				<h5 className="mg-b-15">
					<i className="fas fa-file"></i> Notes:
				</h5>

				<ul className="mg-b-0">
					<li>Each slot is 25 minutes.</li>
					<li>
						To close a Slot, simple select the time Slot and click "Close"
						button
					</li>
					<li>
						To cancel a Booked Class, select the Booked Slot and click `Cancel
						the Class`.
					</li>
				</ul>
			</div>
		</>
	);
};

export default BookingCalendar;
