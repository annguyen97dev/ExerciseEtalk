import lottie from '~/node_modules/lottie-web/build/player/lottie.min.js';
import React, { useState, useEffect, useRef } from 'react';
import {
	getListEventsOfWeek,
	setEventAvailable,
	setEventClose,
	addScheduleLog,
} from '~/api/teacherAPI';
import { cancelLesson } from '~/api/optionAPI';
import { appSettings } from '~/config';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { getDifferentMinBetweenTime, convertDDMMYYYYtoMMDDYYYY } from '~/utils';
import { randomId } from '~/utils';
import dayjs from 'dayjs';
import './teacherBooking.module.scss';

// import '@fortawesome/fontawesome-free';
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const pad = (n) => (n >= 10 ? n : '0' + n);

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
//Add hourse Prototype
const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const hotTime = [5, 6, 7, 8, 9, 13, 14, 15, 16];

const date = new Date();
const d = date.getDate();
const m = date.getMonth() + 1;
const y = date.getFullYear();

const formatDateString = (dateStr) => {
	return dayjs(dateStr).format('DD/MM/YYYY');
};

const initEvents = [];

let calendar;
let idCurrentItem = null;
let status = null;

const FullCalendar = ({ data = [] }) => {
	const [modalShow, setModalShow] = React.useState(false);
	const [modalDelShow, setModalDelShow] = React.useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const loadingRef = useRef(true);
	const getText = useRef(null);
	const [eventCal, setEventCal] = useState([]);

	const onViewChange = (view, el) => {
		console.log({ view, el });
	};

	const afterEventAdded = async (eventInfo) => {
		let event = eventInfo.event;
		const res = await setEventAvailable({
			TeacherUID: 20,
			Start: event.start,
			End: event.end,
		});
		if (/*res.Code === 1*/ true) {
			event.setExtendedProp('loading', false);
		} else {
			//	eventApi.remove();
			eventInfo.revert();
			toast.error('Open slot failed', {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: 2000,
			});
			console.log('Loi  khi goi api');
		}
	};

	const afterEventRemoved = async (eventInfo) => {
		try {
			const res = await setEventClose({
				OpenDayID: data.OpenDayID,
			});
			if (/*res.Code !== 1*/ false) {
				eventInfo.revert();
				toast.error('Close slot failed', {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: 2000,
				});
			} else {
			}
		} catch (error) {
			console.log('Error openSlot !', error);
		}
	};

	const initCalendar = () => {
		//const createEventSlots
		const calendarEl = document.getElementById('js-book-calendar');

		const eventDidMount = (args) => {
			//    console.log("eventDidMount", args);
			const { event, el } = args;
			const data = {
				...event.extendedProps,
				id: event.id,
				start: event.start,
				end: event.end,
			};

			el.setAttribute('tabindex', -1);
			if (!args.isPast && ![...el.classList].includes('booked-slot')) {
				// $(el).tooltip({
				// 	html: true,
				// 	title: `
				//             <p class="mg-b-0 tx-nowrap">Your time: ${dayjs(
				// 							event.extendedProps?.TeacherStart ?? new Date(),
				// 						).format('DD/MM/YYYY hh:mm A')}</p>
				//               <p class="mg-b-0 tx-nowrap">VN time: ${dayjs(
				// 								event.start,
				// 							).format('DD/MM/YYYY hh:mm A')}</p>
				//         `,
				// 	animation: false,
				// 	template: `<div class="tooltip" role="tooltip">
				//             <div class="tooltip-arrow">
				//             </div>
				//             <div class="tooltip-inner">
				//             </div>
				//           </div>`,
				// 	trigger: 'hover',
				// });
			}
		};

		// Create Id
		function createId() {
			let number = Math.floor(Math.random() * 1000 + 1);
			let id = 'id-' + number;
			return id;
		}

		const selectTimeTeach = ({ start, end, date, view }) => {
			let id = createId();

			setEventCal([
				{
					id: id,
					start: start,
					end: end,
					rendering: 'background',
					block: true,
					title: null,
				},
			]);
			setModalShow(true);
			status = 'add-new';
		};

		const changeRange = (id, start, end) => {
			let getEvent = calendar.getEventSources();

			getEvent.forEach((item) => {
				if (item.internalEventSource.sourceId === id) {
					item.internalEventSource.meta[0].start = start;
					item.internalEventSource.meta[0].end = end;
				}
			});

			console.log('after change: ', getEvent);
		};

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
			height: 550,
			expandRows: true,
			slotMinTime: '06:00',
			slotMaxTime: '23:00',
			events: data,
			headerToolbar: {
				start: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek', // will normally be on the left. if RTL, will be on the right
				center: '',
				end: 'today,prev,title,next', // will normally be on the right. if RTL, will be on the left
			},
			titleFormat: { year: 'numeric', month: 'short' },
			navLinks: true, // can click day/week names to navigate views
			editable: true,
			stickyHeaderDates: 'auto',
			selectable: true,
			select: selectTimeTeach,
			nowIndicator: true,
			allDaySlot: false,
			dayMaxEvents: true, // allow "more" link when too many events
			eventOverlap: false,
			initialDate: new Date(),
			initialView: 'timeGridWeek',
			firstDay: 1,
			slotDuration: '00:30',
			slotLabelInterval: '00:30',
			slotEventOverlap: false,
			eventClick: function (calEvent, jsEvent, view) {
				let sourceId = calEvent.event._def.sourceId;
				idCurrentItem = sourceId;
				setModalDelShow(true);
			},
			eventDrop: function (info) {
				let sourceId = info.event._def.sourceId;
				let start = info.event.start;
				let end = info.event.end;
				changeRange(sourceId, start, end);
				console.log('info: ', info);
			},
			viewDidMount: onViewChange,
			eventAdd: afterEventAdded,
			eventRemove: afterEventRemoved,
			selectOverlap: function (event) {
				return event.rendering === 'background';
			},
			// select: emptyCellSelect,
			slotLabelContent: function (arg) {
				//  console.log('slotLabelContent', arg);
				const hour = arg.date.getHours();

				let templateEl = document.createElement('div');
				templateEl.setAttribute('class', 'slot-label');
				const html = `
			          ${dayjs(arg.date).format('hh:mm A')}
			          `;
				templateEl.innerHTML = html;
				return { html };
			},
			dayHeaderContent: function (args) {
				const days = args.date.getDay();
				const d = args.date.getDate();

				const html = `
                    <div class="header-container">
                        <div class="date-wrap">
                            <span class="hd-date">${d} </span><span class="hd-day">${dayNamesShort[days]}</span>
                        </div>
                       <div class="box-slot">
                            <span class="booked"></span> <span class="mg-x-2">/</span> <span class="total"></span>
                       </div>
                    </div>
                `;
				return { html };
			},
			dayCellDidMount: function (args) {
				// console.log('dayCellDidMount', args);
			},
			slotLabelDidMount: function (args) {
				// console.log('SlotLabelDidMount', args);
			},
			// selectAllow: function (selectInfo) {
			// 	if (dayjs(selectInfo.startStr).isBefore(dayjs(new Date())))
			// 		return false;
			// 	return true;
			// },
			eventClassNames: function (args) {
				const { event, isPast, isStart } = args;
				const {
					bookInfo,
					eventType,
					bookStatus,
					available,
					isEmptySlot,
					loading,
				} = event.extendedProps;
				let classLists = bookStatus ? 'booked-slot' : 'available-slot';
				classLists += eventType === 1 ? ' hot-slot ' : '';
				classLists += isEmptySlot ? ' empty-slot' : '';
				classLists += loading ? ' is-loading' : '';
				return classLists;
			},

			eventDidMount: eventDidMount,
			nowIndicatorDidMount: function (args) {},
		});

		calendar.render();
	};

	const handleGetNote = () => {
		let value = getText.current.value;
		if (status === 'add-new') {
			console.log('this is add-new');
			setEventCal((eventCal[0].title = value));
			calendar.addEventSource(eventCal);
		}
		if (status === 'fix-note') {
			console.log('this is fix note');
			let getEvent = calendar.getEventSources();

			getEvent.forEach((item) => {
				if (item.internalEventSource.sourceId === idCurrentItem) {
					item.internalEventSource.meta[0].title = value;

					item.refetch();
				}
			});
			// calendar.refetchEvents();
		}

		setModalShow(false);

		console.log('After save: ', calendar.getEventSources());
	};

	const handleCancelNote = () => {
		setEventCal([]);
		setModalShow(false);
	};

	const handleDelNote = () => {
		let getEvent = calendar.getEventSources();

		getEvent.forEach((item) => {
			if (item.internalEventSource.sourceId === idCurrentItem) {
				item.remove();
			}
		});

		setModalDelShow(false);
	};

	const handleFixNote = () => {
		setModalDelShow(false);
		setModalShow(true);
		status = 'fix-note';
	};

	const handleCancelDelNote = () => {
		setModalDelShow(false);
	};

	useEffect(() => {
		initCalendar();
		lottie &&
			lottie.loadAnimation({
				container: loadingRef.current, // the dom element that will contain the animation
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: '/static/img/loading.json', // the path to the animation json
			});

		return () => {
			loadingRef.current = false;
		};
	}, []);

	return (
		<>
			<div className="pos-relative">
				<>
					{isLoading && (
						<div className="loading-style">
							<div ref={loadingRef} className="lottie-loading"></div>
						</div>
					)}
				</>
				<div id="js-book-calendar" className="fc fc-unthemed fc-ltr"></div>

				<Modal
					show={modalShow}
					onHide={handleCancelNote}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
					className="modal-note"
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Ghi chú
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h6>Ghi chú về giờ học sẽ dạy</h6>
						<textarea
							ref={getText}
							row="3"
							type="text"
							className="getNote"
						></textarea>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={handleGetNote}>
							Lưu
						</Button>
						<Button variant="secondary" onClick={handleCancelNote}>
							Hủy
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					show={modalDelShow}
					onHide={handleCancelDelNote}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
					className="modal-note modal-remove"
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Xóa hoặc sửa
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Button variant="primary" onClick={handleDelNote}>
							Xóa
						</Button>
						<Button variant="secondary" onClick={handleFixNote}>
							Sửa
						</Button>
					</Modal.Body>
				</Modal>
			</div>
		</>
	);
};

export default FullCalendar;
