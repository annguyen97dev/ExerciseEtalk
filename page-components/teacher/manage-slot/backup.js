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

const FullCalendar = ({ data = [] }) => {
	// const [activeDate, setActiveDate] = useState(new Date());
	// const [eventSource, setEventSource] = useState([]);
	// const [showErrorBook, setShowErrorBook] = useState(false);
	// const [activeModal, setActiveModal] = useState({
	// 	id: '',
	// 	studentName: '',
	// 	start: '',
	// 	end: '',
	// 	date: '',
	// });

	const [modalShow, setModalShow] = React.useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const loadingRef = useRef(true);

	// const fetchEventByDate = async (date) => {
	// 	setIsLoading(true);
	// 	try {
	// 		const res = await getListEventsOfWeek({
	// 			Date: dayjs(date).format('DD/MM/YYYY'),
	// 		}); // @string date dd/mm/yyyy
	// 		if (res.Code === 1 && res.Data.length > 0) {
	// 			const newEvents = res.Data.filter(
	// 				(item) => item.isEmptySlot === false,
	// 			).map((event) => {
	// 				return {
	// 					...event,
	// 					id: event.BookingID,
	// 					title: event.title || '',
	// 					start: dayjs(event.Start, 'YYYY-MM-DDTHH:mm').toDate(),
	// 					end: dayjs(event.End, 'YYYY-MM-DDTHH:mm').toDate(),
	// 					eventType: event.eventType,
	// 					bookStatus: event.bookStatus,
	// 					bookInfo: event.bookInfo,
	// 					available: event.available,
	// 					isEmptySlot: event.isEmptySlot,
	// 					loading: false,
	// 				};
	// 			});
	// 			const sources = calendar.getEventSources();
	// 			if (sources.length > 0) {
	// 				sources[0].remove();
	// 				calendar.addEventSource(newEvents);
	// 			}
	// 		}
	// 	} catch (error) {
	// 		console.log('Goi API khong thanh cong');
	// 	}
	// 	setIsLoading(false);
	// };

	// const triggerNextCalendar = () => {
	// 	//setIsLoading(true);
	// 	//setTimeout(() => setIsLoading(false), 3000);
	// 	if (!calendar) return;
	// 	try {
	// 		const currentDate = calendar.getDate();
	// 		console.log(currentDate);
	// 		fetchEventByDate(currentDate);
	// 	} catch (error) {}
	// };

	// const triggerPrevCalendar = () => {
	// 	if (!calendar) return;
	// 	try {
	// 		const currentDate = calendar.getDate();
	// 		console.log(currentDate);
	// 		fetchEventByDate(currentDate);
	// 	} catch (error) {}
	// };

	// const triggerTodayCalendar = () => {
	// 	if (!calendar) return;
	// 	try {
	// 		const currentDate = calendar.getDate();
	// 		console.log(currentDate);
	// 		fetchEventByDate(currentDate);
	// 	} catch (error) {}
	// };

	// const closeAvailableEvent = (newProps, eventsArray) => {
	// 	const newSources = [...eventsArray].map((event) =>
	// 		event.StudyTimeID === newProps.StudyTimeID &&
	// 		event.Start === newProps.Start
	// 			? {
	// 					...event,
	// 					available: false,
	// 					bookStatus: false,
	// 					isEmptySlot: true,
	// 			  }
	// 			: event,
	// 	);
	// 	setEventSource(newSources);
	// };

	// const cancelBookedEvent = (newProps) => {
	// 	const { StudyTimeID, Start } = newProps;
	// 	const newSources = [...eventSource].map((event) =>
	// 		event.StudyTimeID === StudyTimeID && event.Start === Start
	// 			? {
	// 					...event,
	// 					available: false,
	// 					bookStatus: false,
	// 					isEmptySlot: true,
	// 					bookInfo: null,
	// 			  }
	// 			: event,
	// 	);
	// 	setEventSource(newSources);
	// };

	const onViewChange = (view, el) => {
		console.log({ view, el });
	};

	// const _openSlot = async (event) => {
	// 	try {
	// 		calendar.addEvent(
	// 			{
	// 				id: randomId(),
	// 				BookingID: 0,
	// 				End: event.end,
	// 				OpenDayID: 0,
	// 				Start: event.start,
	// 				StudyTimeID: 1,
	// 				TeacherEnd: event.start,
	// 				TeacherStart: event.end,
	// 				TeacherUID: 20,
	// 				available: true,
	// 				bookInfo: null,
	// 				bookStatus: false,
	// 				eventType: 0,
	// 				isEmptySlot: false,
	// 				title: null,
	// 				start: event.start,
	// 				end: event.end,
	// 				loading: true,
	// 			},
	// 			true,
	// 		);
	// 	} catch (error) {
	// 		console.log('Error openSlot !', error);
	// 		alert('Open slot failed !!');
	// 	}
	// 	// setIsLoading(false);
	// };

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

	// const _closeSlot = async (event) => {
	// 	let eventInstance = calendar.getEventById(event.id);
	// 	if (eventInstance) eventInstance.remove();
	// 	//eventInstance.remove();
	// };

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

	// const _cancelSlot = async (data) => {
	// 	setIsLoading(true);
	// 	$('#md-cancel-slot').modal('hide');
	// 	try {
	// 		const res = await cancelLesson({
	// 			BookingID: data.BookingID,
	// 			ReasonCancleOfTeacher: data.reason,
	// 		});
	// 		if (res.Code === 1) {
	// 			cancelBookedEvent(data);
	// 			toast.success('You have canceled a lesson successfully', {
	// 				position: toast.POSITION.TOP_CENTER,
	// 				autoClose: 2000,
	// 			});
	// 		} else {
	// 			toast.error(res?.Message ?? 'Cancel slot failed', {
	// 				position: toast.POSITION.TOP_CENTER,
	// 				autoClose: 2000,
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.log('Error openSlot !', error);
	// 	}
	// 	setIsLoading(false);
	// };

	// const onSubmit = (e) => {
	// 	e.preventDefault();
	// };

	let $toggleCheckbox;
	const initCalendar = () => {
		//const createEventSlots
		const calendarEl = document.getElementById('js-book-calendar');

		const $closeModal = $('#md-close-slot');
		const $cancelModal = $('#md-cancel-slot');

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

			// let diff = getDifferentMinBetweenTime(new Date(), new Date(event.start));
			// let cancelable = diff > 60 ? true : false;
			// !!el &&
			// 	[...el.classList].includes('booked-slot') &&
			// 	$(el)
			// 		.popover({
			// 			html: true,
			// 			container: 'body',
			// 			trigger: 'focus',
			// 			title: 'Booked information',
			// 			content: `
			//           <p class="mg-b-5"><span class="mg-r-5">Course:</span><span class="tx-medium">${
			// 						event.extendedProps.bookInfo?.DocumentName ?? ''
			// 					}</span></p>
			//           <p class="mg-b-5"><span class="mg-r-5">Lesson:</span><span class="tx-medium">${
			// 						event.extendedProps.bookInfo?.LessonName ?? ''
			// 					}</span></p>
			//           <p class="mg-b-5"><span class="mg-r-5">Student:</span><span class="tx-medium">${
			// 						event.extendedProps.bookInfo?.name ?? ''
			// 					}</span></p>
			//           <p class="mg-b-5"><span class="mg-r-5">Your time:</span><span class="tx-medium">${dayjs(
			// 						event.extendedProps?.TeacherStart ?? new Date(),
			// 					).format('DD/MM/YYYY hh:mm A')}</span></p>
			//           <p class="mg-b-0"><span class="mg-r-5">VN time:</span><span class="tx-medium">${dayjs(
			// 						event.start,
			// 					).format('DD/MM/YYYY hh:mm A')}</span></p>
			//           <div class="action mg-t-15">
			//               <a href="#" data-schedule='${JSON.stringify(
			// 								data,
			// 							)}' class="btn btn-sm btn-info btn-block tx-white-f mg-b-10 join-class-skype" target="_blank" rel="noopener">Go to Classroom</a>
			//               ${
			// 								cancelable
			// 									? `<a href="#" class="btn btn-sm btn-danger btn-block cancel-schedule" data-schedule='${JSON.stringify(
			// 											data,
			// 									  )}'>Cancel lesson</a>`
			// 									: `<a href="#" class="btn btn-sm btn-block btn-disabled">Cancel lesson</a>`
			// 							}
			//               ${
			// 								cancelable
			// 									? ''
			// 									: '<p class="mg-b-0 tx-danger mg-t-10">Sorry, you cannot cancel the class</p>'
			// 							}
			//           </div>
			//           `,
			// 		})
			// 		.on('click', function () {
			// 			$(this).popover('show');
			// 		});

			// $(document).on('click', function (event) {
			// 	let $el = $(el);
			// 	if (
			// 		!$(event.target).closest($el).length &&
			// 		!$(event.target).closest('.popover').length
			// 	) {
			// 		$el.popover('hide');
			// 	}
			// });

			// !!$toggleCheckbox && showStudentToggle();
			// const events = calendar.getEvents();
			// const dayHeaders = document.querySelectorAll('.fc-col-header-cell');
			// // console.log({dayHeaders});
			// if (dayHeaders.length > 0)
			// 	for (let i = 0; i < dayHeaders.length; i++) {
			// 		//  console.log(dayHeaders[i]);
			// 		if ('data-date' in dayHeaders[i].dataset) continue;
			// 		const date = dayHeaders[i].getAttribute('data-date');
			// 		const dateHD = new Date(date);
			// 		let bookedSlot = 0;
			// 		let totalSlot = 0;
			// 		events.map((event) => {
			// 			const eventDate = new Date(event.extendedProps.Start.split('T')[0]);
			// 			if (eventDate.getTime() === dateHD.getTime()) {
			// 				(event.extendedProps.available === true ||
			// 					event.extendedProps.bookStatus === true) &&
			// 					totalSlot++;
			// 				event.extendedProps.bookStatus === true && bookedSlot++;
			// 			}
			// 		});
			// 		// console.log(dayHeaders[i]);
			// 		// console.log({bookedSlot, totalSlot});
			// 		dayHeaders[i].querySelector('.booked').textContent = bookedSlot;
			// 		dayHeaders[i].querySelector('.total').textContent = totalSlot;
			// 	}
		};

		// const emptyCellSelect = (selection) => {
		// 	_openSlot({
		// 		start: selection.startStr,
		// 		end: selection.endStr,
		// 	});
		// };

		const selectTimeTeach = () => {
			setModalShow(true);
		};

		// const eventClick = (args) => {
		// 	const element = args.el;
		// 	const { start, end, id, extendedProps } = args.event;
		// 	if (
		// 		extendedProps.available ||
		// 		[...element.classList].includes('fc-event-past') ||
		// 		![...element.classList].includes('empty-slot')
		// 	)
		// 		return;
		// 	const diff = getDifferentMinBetweenTime(new Date(), start);
		// 	if (diff < 60) {
		// 		setShowErrorBook(true);
		// 		return;
		// 	}

		// 	setActiveModal({
		//             ...activeModal,
		//             ...args.event.extendedProps,
		//             date: dayjs(start).format("DD/MM/YYYY"),
		//             start: dayjs(start).format("HH:mm A"),
		//             end: dayjs(end).format("HH:mm A")
		//         });
		//         $("#md-active-slot").appendTo('body').modal("show");

		// };

		calendar = new Calendar(calendarEl, {
			plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
			height: 550,
			expandRows: true,
			slotMinTime: '06:00',
			slotMaxTime: '23:00',
			events: data,
			headerToolbar: {
				start: 'timeGridWeek,dayGridMonth,listWeek', // will normally be on the left. if RTL, will be on the right
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
			// eventContent: function (args) {
			// 	let templateEl = document.createElement('div');
			// 	const { event, isPast, isStart } = args;
			// 	const {
			// 		bookInfo,
			// 		eventType,
			// 		bookStatus,
			// 		available,
			// 		isEmptySlot,
			// 		loading,
			// 	} = event.extendedProps;
			// 	const data = {
			// 		...event.extendedProps,
			// 		id: event.id,
			// 		start: event.start,
			// 		end: event.end,
			// 	};
			// 	const html = `
			//               ${
			// 								!isEmptySlot
			// 									? `
			//               <div class="inner-book-wrap ">
			// 									<div class="inner-content">
			// 									${
			// 										loading
			// 											? `Creating event...`
			// 											: `${
			// 													bookStatus
			// 														? `
			// 															<span class="label-book booked"><i class="fas ${
			// 																isPast ? 'fa-check' : 'fa-user-graduate'
			// 															}"></i> ${
			// 																isPast ? 'FINISHED' : 'BOOKED'
			// 														  }</span>
			// 															`
			// 														: `<span class="label-book"><i class="fas fa-copyright"></i>AVAILABLE</span>`
			// 											  }
			// 											${
			// 												available
			// 													? `<a href="javascript:;" class="fix-btn close-schedule" data-schedule='${JSON.stringify(
			// 															data,
			// 													  )}' data-events='${
			// 															calendar.getEventSources().length > 0
			// 																? calendar.getEventSources()[0]
			// 																		.internalEventSource.meta
			// 																: {}
			// 													  }'>Close</a>`
			// 													: ''
			// 											}`
			// 									}

			//                   </div>
			//               </div>`
			// 									: ''
			// 							}
			//           `;
			// 	templateEl.innerHTML = html;
			// 	return { domNodes: [templateEl] };
			// },
			eventClick: function () {
				console.log('clickkk');
			},
			eventDidMount: eventDidMount,
			nowIndicatorDidMount: function (args) {},
		});

		calendar.render();

		// $('body').on('click', '.cancel-schedule', function (e) {
		// 	e.preventDefault();
		// 	const eventData = JSON.parse(this.getAttribute('data-schedule'));
		// 	console.log(eventData);
		// 	setActiveModal({
		// 		...activeModal,
		// 		...eventData,
		// 		studentName: eventData.bookInfo?.name ?? '',
		// 		courseName: eventData.bookInfo?.DocumentName ?? '',
		// 		lessonName: eventData.bookInfo?.LessonName ?? '',
		// 		teacherTime: dayjs(eventData?.TeacherStart ?? new Date()).format(
		// 			'DD/MM/YYYY hh:mm A',
		// 		),
		// 		vnTime: dayjs(eventData.start).format('DD/MM/YYYY hh:mm A'),
		// 	});

		// 	$cancelModal.appendTo('body').modal('show');
		// 	// alert("Cancel schedule ID : " + eventData);
		// });

		// $('body').on('click', '.close-schedule', function (e) {
		// 	e.preventDefault();
		// 	const eventData = JSON.parse(this.getAttribute('data-schedule'));
		// 	_closeSlot(eventData);
		// });

		// $('body').on('click', '.join-class-skype', async function (e) {
		// 	e.preventDefault();
		// 	const eventData = JSON.parse(this.getAttribute('data-schedule'));
		// 	try {
		// 		addScheduleLog({ BookingID: eventData.BookingID });
		// 	} catch (error) {
		// 		console.log(error?.message ?? `Can't add schedule log !!`);
		// 	}
		// 	window.location.href = `skype:${eventData?.bookInfo?.SkypeID ?? ''}?chat`;
		// });

		// $('body').on(
		// 	'click',
		// 	'#js-book-calendar .fc-next-button',
		// 	triggerNextCalendar,
		// );
		// $('body').on(
		// 	'click',
		// 	'#js-book-calendar .fc-prev-button',
		// 	triggerPrevCalendar,
		// );
		// $('body').on(
		// 	'click',
		// 	'#js-book-calendar .fc-today-button',
		// 	triggerTodayCalendar,
		// );
		// $toggleCheckbox = $('#student-toggle-checkbox');

		// $('body').on('change', $toggleCheckbox, showStudentToggle);

		// function showStudentToggle() {
		// 	const value = $toggleCheckbox.prop('checked');
		// 	const nonBookedEvents = $('.fc-event:not(.booked-slot)');
		// 	value
		// 		? nonBookedEvents.addClass('hide-event')
		// 		: nonBookedEvents.removeClass('hide-event');
		// }
	};

	const closeModal = () => {
		setModalShow(false);
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
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Modal heading
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>Centered Modal</h4>
						<p>
							Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
							dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
							ac consectetur ac, vestibulum at eros.
						</p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={closeModal}>Close</Button>
					</Modal.Footer>
				</Modal>

				{/* <ActiveSlotModal data={activeModal} handleOpenSlot={_openSlot} />
				<CloseSlotModal data={activeModal} handleCloseSlot={_closeSlot} />
				<CancelSlotModal data={activeModal} handleCancelSlot={_cancelSlot} />

				<Modal
					show={showErrorBook}
					onHide={() => setShowErrorBook(false)}
					size="sm"
					centered
					bsPrefix="modal"
				>
					<Modal.Header bsPrefix="modal-header bg-danger tx-white pd-10">
						<Modal.Title bsPrefix="modal-title tx-white">
							Open slot failed !
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className="mg-b-0">
							Sorry, you cannot open this class. It is less than 60 mins to
							starting time.
						</p>
						<div className="tx-right mg-t-15">
							<Button
								size="sm"
								variant="light"
								onClick={() => setShowErrorBook(false)}
							>
								Close
							</Button>
						</div>
					</Modal.Body>
				</Modal> */}
			</div>
		</>
	);
};

export default FullCalendar;
