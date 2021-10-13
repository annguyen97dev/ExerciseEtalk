import React, { useState, useEffect, useLayoutEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import RadioQuestion from '~/page-components/student/study/quiz/RadioQuestion';
import CheckboxQuestion from '~/page-components/student/study/quiz/CheckboxQuestion';
import GroupQuestion from '~/page-components/student/study/quiz/GroupQuestion';
import MapQuestion from '~/page-components/student/study/quiz/MapQuestion';
import TypeQuestion from '~/page-components/student/study/quiz/TypeQuestion';
import DropQuestion from '~/page-components/student/study/quiz/DropQuestion';
import CountDown from '~/page-components/student/study/quiz/CountDown';
import MultipleQuestion from '~/page-components/student/study/quiz/MultipleQuestion';
import ContentQuiz from '~/page-components/student/study/quiz/ContentQuiz';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
// import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@material-ui/icons/CheckBox';
// import CreateIcon from '@material-ui/icons/Create';

// import './styles.modules.scss';

const useStyles = makeStyles((theme) => ({
	styleButton: {
		marginRight: '10px',
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	popup: {
		border: '2px solid #fff',
		borderRadius: '7px',
		boxShadow: '1px 2px 10px #04040440',
		background: 'white',
		width: '25%',
		padding: '20px',
		textAlign: 'center',
	},
	preview: {
		marginBottom: '0',
		fontSize: '14px',
		[theme.breakpoints.down('sm')]: {
			marginRight: '0',
			marginTop: '15px',
			order: 2,
		},
	},
}));

// const data = [];

let saveDataRange = [];
var dataNote = [];
var data = [];
var saveID = null;

var saveParagraph = [];
var loadData = null;
var clonePrevew = [];

const Quiz = ({ dataLesson }) => {
	const QuizDetail = dataLesson.DataQuiz.QuizDetail;
	const QuizContent = dataLesson.DataQuiz.QuizDetail[0].QuizContent;
	const QuizQuestion = dataLesson.DataQuiz.QuizDetail[0].QuizQuestion;

	const addData = () => {
		if (saveParagraph < 1) {
			QuizDetail.forEach((item, index) => {
				saveParagraph.push({
					indexDetail: index,
					isHighlight: false,
					QuizContent: item.QuizContent,
					QuizQuestion: item.QuizQuestion.map((obj) => {
						return {
							...obj,
							isHighlight: false,
						};
					}),
				});
			});
		}
	};

	console.log('Data Lesson: ', dataLesson);
	console.log('saveParagraph: ', saveParagraph);

	const classes = useStyles();
	const [handleClick, setHandleclick] = useState(false);

	const [IsShowQuiz, setIsShowQuiz] = useState(false);
	const [addMinutes, setAddMinutes] = useState();
	const [showPopup, setShowPopup] = useState(false);
	const [showNote, setShowNote] = useState(false);
	const [showPagi, setShowPagi] = useState(false);

	const [open, setOpen] = React.useState(false);
	const [activeQuestion, setActiveQuestion] = useState({
		indexDetail: 0,
		indexQuestion: 0,
		questionType: 1,
		questionPresent: QuizQuestion[0].QuestionList[0],
	});

	const [checkedQuestion, setCheckedQuestion] = useState(null);
	const [activeTab, setActiveTab] = useState(null);

	console.log('Active question: ', activeQuestion);

	const getActiveTab = (questionID) => {
		setActiveTab(questionID);
	};

	const checkExist = (arr) => {
		let cloneArr = [...checkedQuestion];
		let status = false;

		// cloneArr.forEach((item) => {
		// 	arr.forEach(obj => {
		// 		if(item.questionID === obj.questionID) {
		// 			count++;
		// 		}
		// 	});
		// });

		for (const [index, item] of cloneArr.entries()) {
			for (const [ind, obj] of arr.entries()) {
				if (obj.questionID === item.questionID) {
					status = true;
					break;
				}
			}
		}

		return status;
	};

	const handleCheckedQuestion = (arr) => {
		if (checkedQuestion !== null) {
			let cloneArr = [...checkedQuestion];

			if (!checkExist(arr)) {
				arr.forEach((item) => {
					cloneArr.push(item);
				});
			} else {
				cloneArr.forEach((item) => {
					arr.forEach((obj) => {
						if (item.questionID === obj.questionID) {
							item.checked = obj.checked;
						}
					});
				});
			}
			setCheckedQuestion(cloneArr);
		} else {
			setCheckedQuestion(arr);
		}
	};

	const handleCheckNumber = (questionID) => {
		let classOfNumber = '';

		preview.activeQuestion.forEach((item) => {
			if (item === questionID) {
				classOfNumber = 'checked_preview';
			}
		});

		checkedQuestion?.forEach((item) => {
			if (item.questionID === questionID) {
				if (item.checked) {
					classOfNumber = 'checked';
				}
			}
		});

		return classOfNumber;
	};

	const [preview, setPreview] = useState({
		activeQuestion: clonePrevew,
		status: false,
	});

	const handleChange = (event) => {
		let getClass = changePreview(activeQuestion.questionPresent.QuestionID);
		let arr = [...preview.activeQuestion];

		if (getClass === 'checked_preview') {
			removePreview(activeQuestion.questionPresent.QuestionID);
		} else {
			arr.push(activeQuestion.questionPresent.QuestionID);
			clonePrevew = [...arr];
		}

		setPreview({
			status: event.target.checked,
			activeQuestion: clonePrevew,
		});
	};

	const removePreview = (questionID) => {
		let index = clonePrevew
			.map((x) => {
				return x;
			})
			.indexOf(questionID);

		clonePrevew.splice(index, 1);
	};

	const changePreview = (questionID) => {
		let itemQuestion = document.querySelectorAll('.list-answer .item');
		let className = '';

		for (const [index, item] of itemQuestion.entries()) {
			let itemID = parseInt(item.getAttribute('questionid'));
			if (itemID === questionID) {
				className = item.firstElementChild.className;
				console.log('Class name: ', className);
				break;
			}
		}

		return className;
	};

	const showQuiz = () => {
		setHandleclick(true);
		const add_minutes = (function (dt, minutes) {
			return new Date(dt.getTime() + minutes * 60000);
		})(new Date(), 10);
		setAddMinutes(add_minutes);
	};

	const timeUp = () => {
		setHandleclick(false);
		setShowPopup(true);
	};

	const makeAgain = () => {
		setShowPopup(false);
		showQuiz();
	};

	const handleOpen = () => {
		setOpen(true);
		showQuiz();
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleClick_openPagi = () => {
		if (showPagi == false) {
			setShowPagi(true);
		} else {
			setShowPagi(false);
		}
	};

	const handleClick_ClosePagination = () => {
		if (showPagi == true) {
			setShowPagi(false);
		} else {
			setShowPagi(true);
		}
	};

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				$(document).ready(function () {
					function addToOldArray(id, range, note) {
						data.push({
							id: id,
							range: range,
							note: note,
						});
					}

					function addToArray(id, range, note, nodesArr) {
						dataNote.push({
							id: id,
							range: range,
							note: note,
							nodesArr: nodesArr,
						});
					}

					function getTextWithID(id, range) {
						let rs = '';
						range.commonAncestorContainer.children.forEach((item) => {
							if (item.id === id) {
								rs = item.innerText;
							}
						});
						return rs;
					}

					function removeInArray(id) {
						dataNote.forEach((item, index, arr) => {
							if (item.id === id) {
								arr.splice(index, 1);
							}
						});
					}

					function checkArray(id) {
						var check = false;
						dataNote.forEach((obj) => {
							if (obj.id === id) {
								check = true;
							}
						});
						return check;
					}

					function getRangeInArray(id) {
						let range = null;
						data.forEach((obj) => {
							if (obj.id === id) {
								range = obj.range;
							}
						});
						return range;
					}

					function getSelection() {
						let sel = window.getSelection();
						return sel;
					}

					function checkRange(range) {
						let nodeNameStart = range.startContainer.parentNode.nodeName;
						let nodeNameEnd = range.endContainer.parentNode.nodeName;

						if (nodeNameStart != 'SPAN' && nodeNameEnd != 'SPAN') {
							return true;
						} else {
							return false;
						}
					}

					function arrayPosition(p) {
						let position = [];
						position.push({
							top: p.top,
							bottom: p.bottom,
							left: p.left,
							right: p.right,
							width: p.width,
						});
						return position;
					}

					function remove_all(nodesArr) {
						console.log('--- Run Remove All ---');
						console.log('Node Arrs: ', nodesArr);
						// Delete node element and replace by text
						dataNote.forEach((item, index, arr) => {
							nodesArr.forEach((node, ind) => {
								if (item.id === node.id) {
									document.getElementById(item.id).outerHTML =
										document.getElementById(item.id).innerHTML;
								}
							});
						});

						nodesArr.forEach((item, index) => {
							dataNote.forEach((data, ind, arr) => {
								if (item.id === data.id) {
									arr.splice(ind, 1);
								}
							});
						});
					}

					var getNextNode = function (node, skipChildren, endNode) {
						//if there are child nodes and we didn't come from a child node
						if (endNode == node) {
							return null;
						}
						if (node.firstChild && !skipChildren) {
							return node.firstChild;
						}
						if (!node.parentNode) {
							return null;
						}
						return (
							node.nextSibling || getNextNode(node.parentNode, true, endNode)
						);
					};

					var getNodesInRange = function (range) {
						var startNode =
							range.startContainer.childNodes[range.startOffset] ||
							range.startContainer; //it's a text node
						var endNode =
							range.endContainer.childNodes[range.endOffset] ||
							range.endContainer;

						if (startNode == endNode && startNode.childNodes.length === 0) {
							return [startNode];
						}

						var nodes = [];
						do {
							nodes.push(startNode);
						} while ((startNode = getNextNode(startNode, false, endNode)));
						return nodes;
					};

					const checkNode = (nodesArr) => {
						let count = 0;
						nodesArr.forEach((item) => {
							if (item.nodeName === 'P') {
								count++;
							}
						});
						return count;
					};

					const findIdSpan = (arr) => {
						let listID = [];
						arr.forEach((item) => {
							if (item.constructor.name !== 'Text') {
								listID.push(item.id);
							}
						});

						return listID;
					};

					const calEndOffset = (arr) => {
						let length = 0;

						console.log('ARR in Cal: ', arr);

						for (const [index, item] of arr.entries()) {
							if (index === arr.length - 1) {
								break;
							} else {
								if (item.nodeName === 'SPAN') {
									length = length + item.childNodes[0].length;
								} else {
									length = length + item.length;
								}
							}
						}

						return length;
					};

					const checkAmountParagraph = (nodesArr, range, dataId) => {
						let startOffset = range.startOffset;
						let endOffset = range.endOffset;

						// -----------
						let saveLength =
							nodesArr[nodesArr.length - 1].parentNode.childNodes.length;
						let saveLastItem = nodesArr[nodesArr.length - 1];
						if (saveLength > 1) {
							endOffset =
								calEndOffset(saveLastItem.parentNode.childNodes) + endOffset;
						}
						// -----------

						console.log('save Last Item: ', saveLength);
						remove_all(nodesArr);
						let amountNode = checkNode(nodesArr);

						let cloneNodes = [];

						nodesArr.forEach((item) => {
							if (item.constructor.name === 'Text') {
								if (item.parentNode !== null) {
									if (item.parentNode.nodeName === 'P') {
										cloneNodes.push(item);
									}
								}
							}
						});

						// saveNodesArr.forEach((node, index) => {
						// 	if
						// });

						console.log('Clone Nodes: ', cloneNodes);

						cloneNodes.forEach((item, index) => {
							if (index === 0) {
								let node = item.parentNode.childNodes[0];

								//Highlight text
								let span = document.createElement('span');
								span.setAttribute('id', dataId);
								span.classList.add('highlight-text');

								const range = document.createRange();

								range.setStart(node, startOffset);
								range.setEnd(node, item.length);
								range.surroundContents(span);
							} else if (index === cloneNodes.length - 1) {
								console.log('endOffset under: ', endOffset);

								let node = item.parentNode.childNodes[0];

								//Highlight text
								let span = document.createElement('span');
								span.setAttribute('id', dataId);
								span.classList.add('highlight-text');

								const range = document.createRange();

								range.setStart(node, 0);
								range.setEnd(node, endOffset);
								range.surroundContents(span);
							} else {
								if (item.parentNode !== null) {
									let node = item.parentNode.childNodes[0];

									//Highlight text
									let span = document.createElement('span');
									span.setAttribute('id', dataId);
									span.classList.add('highlight-text');

									const range = document.createRange();

									range.setStart(node, 0);
									range.setEnd(node, item.length);
									range.surroundContents(span);
								}
							}
						});
					};

					// ------------ SAVE DATA HIGHTLIGHT AND NOTE AND CREATE NEW RANGE IN ARE ------------------//

					if (saveParagraph.length > 0) {
						// saveParagraph.forEach((item) => {
						// 	if (item.indexDetail === activeQuestion.indexDetail) {
						// 		document.querySelector('.wrapper-text').outerHTML =
						// 			item.textWrapper;
						// 	}

						// 	if (item.questionType === activeQuestion.questionType) {
						// 		document.querySelector('.quiz-section-title-sub').outerHTML =
						// 			item.textQuestionType;
						// 	}
						// });

						saveParagraph.forEach((item) => {
							if (item.indexDetail === activeQuestion.indexDetail) {
								if (item.isHighlight) {
									document.querySelector('.wrapper-text').outerHTML =
										item.QuizContent;
								}
								for (const [index, obj] of item.QuizQuestion.entries()) {
									if (obj.QuestionType === activeQuestion.questionType) {
										if (obj.isHighlight) {
											document.querySelector(
												'.quiz-section-title-sub',
											).outerHTML = obj.QuestionTypeDetail;
										}
									}
								}
							}
						});
					}

					// Create range if area when click pagination
					// if (dataNote.length > 0) {
					// 	dataNote.forEach((item) => {
					// 		// Get ID, area, textNode
					// 		let getAreaID = item.areaID;
					// 		let nodesArr = item.nodesArr;

					// 		let getArea = document.getElementById(getAreaID);
					// 		console.log('node Arr: ', nodesArr);

					// 		if (getArea !== null) {
					// 			getArea.childNodes.forEach((node) => {
					// 				console.log('Node: ', node);
					// 				if (node.textContent !== null) {
					// 					let n = node.textContent.indexOf(item.areaText);

					// 					if (n > -1) {
					// 						if (node.nodeName !== 'SPAN') {
					// 							console.log('Node is: ', node);

					// 							let dataId = item.id;

					// 							// Get start offset and end offset
					// 							let startOffset = item.rangeFirst.startOffset;
					// 							let endOffset = item.rangeFirst.endOffset;

					// 							//Check nodesArr => to change the endOffset
					// 							if (nodesArr.length > 1) {
					// 								endOffset = calEndOffset(nodesArr) + endOffset;
					// 								console.log('End offset: ', endOffset);
					// 							}

					// 							//Highlight text
					// 							let span = document.createElement('span');
					// 							span.setAttribute('id', dataId);
					// 							span.classList.add('highlight-text');

					// 							const range = document.createRange();

					// 							range.setStart(node, startOffset);
					// 							range.setEnd(node, endOffset);
					// 							range.surroundContents(span);
					// 						}
					// 					}
					// 				}
					// 			});
					// 		}
					// 	});
					// }

					// -------------------------------------------------------------------------------------------

					// ----------- MOUSEUP ----------- //
					$('.highlight')
						.off('mouseup')
						.mouseup(function (event) {
							let nodeName = event.target.nodeName;
							let range = null;

							if (nodeName !== 'INPUT') {
								// CREATE ID
								let number = Math.floor(Math.random() * 1000 + 1);
								let id = 'id-' + number;

								// GET RANGE

								let sel = getSelection();

								if (sel && sel.rangeCount > 0) {
									range = sel.getRangeAt(0);
									let areaID = null;

									let nodesArr = getNodesInRange(range);

									// ---------- GET AREA ID -----------
									// if (
									// 	range.commonAncestorContainer.constructor.name !== 'Text'
									// ) {
									// 	areaID = range.commonAncestorContainer.id;
									// } else {
									// 	areaID = range.commonAncestorContainer.parentElement.id;
									// }

									// ---------- -----------------------

									if (range.toString().length > 0) {
										// GET POSITION
										let p = range.getBoundingClientRect();
										let position = arrayPosition(p);

										// PUSH TO DATA
										data.push({
											id: id,
											rangeFirst: {
												startOffset: range.startOffset,
												endOffset: range.endOffset,
											},
											range: range,
											// areaID: areaID,
											note: '',
											position: position,
											nodesArr: nodesArr,
										});

										// SHOW POPOVER

										let specialTop = p.top - 40;
										let specialLeft = p.left + p.width - 40;
										specialTop = specialTop.toString() + 'px';
										specialLeft = specialLeft.toString() + 'px';

										var x = event.clientX; // Get the horizontal coordinate
										var y = event.clientY; // Get the vertical coordinate

										if (event.target.nodeName === 'SPAN') {
											if (nodesArr.length > 1) {
												$('.popover-an')
													.css({
														// top: specialTop,
														// left: position[0].left,
														// display: 'block',
														top: y - 48,
														left: x - 100,
														display: 'block',
													})
													.attr('data-id', id);

												$('.wrap-popup-note').attr('data-id', id);
												saveID = id;
											}
										} else {
											$('.popover-an')
												.css({
													// top: specialTop,
													// left: position[0].left,
													// display: 'block',
													top: y - 48,
													left: x - 100,
													display: 'block',
												})
												.attr('data-id', id);

											$('.wrap-popup-note').attr('data-id', id);
											saveID = id;
										}
									} else {
										$('.popover-an').hide();
									}
								}
							}
						});

					function checkAllCondition(dataId, range, nodesArr) {
						// Check how many element "P" in area

						let amountNode = checkNode(nodesArr);

						//Get id and element
						let beforeElementId = range.startContainer.parentElement.id;
						let beforeElement = range.startContainer.parentNode;

						let afterElementId = range.endContainer.parentElement.id;
						let afterElement = range.endContainer.parentNode;

						let nodeNameStart = range.startContainer.parentNode.nodeName;
						let nodeNameEnd = range.endContainer.parentNode.nodeName;

						// Check the element is overlay or not? (Check coi có đang bị chồng hay không?)

						if (amountNode > 0) {
							checkAmountParagraph(nodesArr, range, dataId);
							addToArray(dataId, range, '', nodesArr);
							saveID = dataId;
						} else {
							if (nodeNameStart != 'SPAN' && nodeNameEnd != 'SPAN') {
								var between_span_previous = null;
								var between_span_next = null;

								let checkRange = range.commonAncestorContainer.constructor.name;

								if (
									range.startContainer.nextSibling != null &&
									range.endContainer.previousSibling != null
								) {
									if (
										range.startContainer.nextSibling.nodeName === 'SPAN' &&
										range.endContainer.previousSibling.nodeName === 'SPAN'
									) {
										between_span_previous = range.endContainer.previousSibling;
										between_span_next = range.startContainer.nextElementSibling;

										var between_span1 =
											range.startContainer.parentNode.nodeName;
										var between_span2 = range.endContainer.parentNode.nodeName;
									}
								}

								let span = document.createElement('span');
								span.setAttribute('id', dataId);
								span.classList.add('highlight-text');
								range.surroundContents(span);
								let p = range.getBoundingClientRect();
								let position = arrayPosition(p);

								// Check
								// Trạng thái  --- text ---
								if (
									between_span_next !== null &&
									between_span_previous !== null
								) {
									if (
										between_span_next.nodeName === 'SPAN' ||
										between_span_previous.nodeName === 'SPAN'
									) {
										if (checkRange === 'HTMLParagraphElement') {
											console.log('run this');
											remove_all(nodesArr);
										}
									}
								}

								$('.popover-an').hide();

								addToArray(dataId, range, '', nodesArr);
								saveID = dataId;
							} else {
								// Create, id, span tag
								let number = Math.floor(Math.random() * 1000 + 1);
								let id = 'id-' + number;
								let span = document.createElement('span');
								saveID = id;
								//  ===> add id & class for span
								span.setAttribute('id', id);
								span.classList.add('highlight-text');

								if (nodeNameStart === 'SPAN' && nodeNameEnd === 'SPAN') {
									// Set positon for new range
									let newRange = document.createRange();
									newRange.setStartBefore(beforeElement);

									newRange.setEndAfter(afterElement);
									newRange.surroundContents(span);
									let p = newRange.getBoundingClientRect();
									let position = arrayPosition(p);

									// Add to new array and old array  //
									addToArray(
										id,
										newRange,
										'',

										nodesArr,
									);
									addToOldArray(id, newRange, '');

									beforeElement.outerHTML = beforeElement.innerHTML;
									afterElement.outerHTML = afterElement.innerHTML;
									removeInArray(beforeElementId);
									removeInArray(afterElementId);
								}
								if (nodeNameStart === 'SPAN' && nodeNameEnd === 'P') {
									// Set positon for new range
									let newRange = document.createRange();
									newRange.setStartBefore(beforeElement);

									newRange.setEnd(range.endContainer, range.endOffset);
									newRange.surroundContents(span);
									let p = newRange.getBoundingClientRect();
									let position = arrayPosition(p);

									// Add to new array and old array  //
									addToArray(id, newRange, '', nodesArr);
									addToOldArray(id, newRange, '');

									beforeElement.outerHTML = beforeElement.innerHTML;
									removeInArray(beforeElementId);
								}
								if (nodeNameEnd === 'SPAN' && nodeNameStart === 'P') {
									// Set positon for new range
									let newRange = document.createRange();
									newRange.setStart(range.startContainer, range.startOffset);

									newRange.setEndAfter(afterElement);
									newRange.surroundContents(span);
									let p = newRange.getBoundingClientRect();
									let position = arrayPosition(p);

									// Add to new array and old array  //
									addToArray(id, newRange, '', nodesArr);
									addToOldArray(id, newRange, '');

									afterElement.outerHTML = afterElement.innerHTML;
									removeInArray(afterElementId);
								}
							}
						}
					}

					const convertToString = (areaID) => {
						let nodeTextWrapper = document.querySelector('.wrapper-text');
						let nodeQuestionType = document.querySelector(
							'.quiz-section-title-sub',
						);

						let textQuestionType = nodeQuestionType.outerHTML;
						let textWrapper = nodeTextWrapper.outerHTML;

						// let element = document.getElementById(areaID);
						// let textArea = element.outerHTML;
						let count = {
							countDetail: 0,
							countType: 0,
						};

						// const checkIndexDetail = (indexDtail) => {
						// 	let rs = false;
						// 	for (const [index, item] of saveParagraph.entries()) {
						// 		if (item.detail.indexDtail === indexDetail) {
						// 			item.detail.textWrapper = textWrapper;
						// 			rs = true;
						// 		}
						// 	}
						// 	return rs;
						// };

						// const checkQuestionType = (questionType) => {
						// 	let rs = false;
						// 	for (const [index, item] of saveParagraph.entries()) {
						// 		if (item.type.questionType === questionType) {
						// 			item.type.textQuestionType = textQuestionType;
						// 			rs = true;
						// 		}
						// 	}
						// 	return rs;
						// };

						if (saveParagraph.length > 0) {
							// saveParagraph.forEach((item) => {
							// 	if (item.indexDetail === activeQuestion.indexDetail) {
							// 		item.textWrapper = textWrapper;
							// 		count.countDetail++;
							// 	}
							// 	if (item.questionType === activeQuestion.questionType) {
							// 		item.textQuestionType = textQuestionType;
							// 		count.countType++;
							// 	}
							// });
							saveParagraph.forEach((item) => {
								if (item.indexDetail === activeQuestion.indexDetail) {
									item.QuizContent = textWrapper;
									item.isHighlight = true;
									for (const [index, obj] of item.QuizQuestion.entries()) {
										if (obj.QuestionType === activeQuestion.questionType) {
											obj.QuestionTypeDetail = textQuestionType;
											obj.isHighlight = true;
										}
									}
								}
							});
						}

						// if (count.countDetail === 0) {
						// 	saveParagraph.push({
						// 		questionType: activeQuestion.questionType,
						// 		indexDetail: activeQuestion.indexDetail,
						// 		textWrapper: textWrapper,
						// 		textQuestionType: textQuestionType,
						// 	});
						// }
						// if (count.countType === 0) {
						// 	saveParagraph.push({
						// 		questionType: activeQuestion.questionType,
						// 		indexDetail: activeQuestion.indexDetail,
						// 		textWrapper: textWrapper,
						// 		textQuestionType: textQuestionType,
						// 	});
						// }

						console.log('Save Paragraph: ', saveParagraph);

						// console.log('Element: ', element);
						// console.log('Element outer html: ', element.outerHTML);
					};

					// ------------ CLICK HIGHLIGHT -------------
					$('.popover-an .btn-highlight')
						.off('click')
						.on('click', function () {
							let dataId = $('.wrap-popup-note').attr('data-id');

							let range = null;
							let rangeFirst = null;
							let areaID = null;
							let nodesArr = null;

							data.forEach((obj) => {
								if (obj.id === dataId) {
									range = obj.range;
									nodesArr = obj.nodesArr;
									// areaID = obj.areaID;
									// rangeFirst = obj.rangeFirst;
								}
							});

							checkAllCondition(dataId, range, nodesArr);
							addData();
							convertToString();
							window.getSelection().empty();
							// saveDataRange = [...dataNote];

							$('.popover-an').hide();
							$(this).parent().parent().hide();
							console.log('data sau khi bấm highlight: ', dataNote);
						});

					// --------------- CLICK to OPEN and CLOSE TO SAVE NOTE -----------------
					$('.btn-note').on('click', function () {
						let id = $('.wrap-popup-note').attr('data-id');
						let getId = saveID;

						let nodesArr = null;
						let areaID = null;

						data.forEach((obj) => {
							if (obj.id === id) {
								nodesArr = obj.nodesArr;
								// areaID = obj.areaID;
							}
						});

						// ----- //
						let range = getRangeInArray(id);
						let note = '';

						if (!checkArray(id)) {
							checkAllCondition(id, range, nodesArr);
							convertToString();
							getId = saveID;
							$('#getNote').val('');
						} else {
							dataNote.forEach((obj) => {
								if (obj.id === getId) {
									note = obj.note;
								}
							});
							$('#getNote').val(note);
						}
						// ----- //
						$('.wrap-popup-note').attr('data-id', getId);
						$('.wrap-popup-note').show();
						$('.popover-an').hide();
						$(this).parent().parent().hide();
					});

					//  --- Close ---
					$('.wrap-popup-note .close-popup').on('click', function () {
						let note = $('#getNote').val();
						// let id = $('.wrap-popup-note').attr('data-id');
						let id = $('.wrap-popup-note').attr('data-id');

						let range = getRangeInArray(id);

						// Check id exit in array before or not ?
						if (checkArray(id)) {
							dataNote.forEach((obj) => {
								if (obj.id === id) {
									obj.note = note;
								}
							});
						}

						$('.wrap-popup-note').hide();

						// let arr = [];
						// dataNote.forEach((item) => {
						// 	arr.push(item.range);
						// 	item.range = arr;
						// });
					});

					//Typing and save
					$('#getNote').on('change paste keyup', function () {
						let getId = $('.wrap-popup-note').attr('data-id');

						let text = $(this).val();
						if (getId) {
							dataNote.forEach((obj) => {
								if (obj.id === getId) {
									obj.note = text;
								}
							});
						}
					});

					//  --------- ACTION HOVER POPOVER ------------ //
					$('.highlight').on('contextmenu', function (e) {
						let id = e.target.id;
						$('.wrap-popup-note').attr('data-id', id);

						let position = [];
						let note = null;

						if (checkArray(id)) {
							saveID = id;
							// console.log('save id lúc hover: ', id);
							// get position to show popover
							dataNote.forEach((obj) => {
								if (obj.id === id) {
									position = position.concat(obj.position);
									note = obj.note;
								}
							});
							// let specialTop = position[0].top - 35;
							// specialTop = specialTop.toString() + 'px';

							var x = e.clientX; // Get the horizontal coordinate
							var y = e.clientY; // Get the vertical coordinate

							$('.popover-hover')
								.css({
									// top: specialTop,
									// left: position[0].left,
									// display: 'block',
									top: y - 45,
									left: x - 50,
									display: 'block',
								})
								.attr('data-id', id);
						} else {
							$('.popover-hover').css('display', 'none');
						}

						return false;
					});

					// --------- CLICK TO *REMOVE* NOTE AND HIGHLIGHT ---------- //
					$('.btn-remove').on('click', function () {
						let id = $('.popover-hover').attr('data-id');

						dataNote.forEach((obj, index, arr) => {
							if (obj.id === id) {
								arr.splice(index, 1);
							}
						});

						document.getElementById(id).outerHTML =
							document.getElementById(id).innerHTML;
						$(this).parent().parent().hide();
					});

					// --------- CLICK TO *REMOVE ALL* -------------//
					$('.btn-remove-all').on('click', function () {
						dataNote = [];

						let allSpan = document.querySelectorAll('.highlight-text');
						allSpan.forEach((item) => {
							item.outerHTML = item.innerHTML;
						});

						$(this).parent().parent().hide();
					});

					// Calculator Top of Highligh text when scroll
					var savePageY = 0;

					// $('.highlight').scroll(function () {
					// 	let pageY = $(this).scrollTop();

					// 	dataNote.forEach((obj) => {
					// 		obj.position[0].top = obj.position[0].top + savePageY - pageY;
					// 	});
					// 	savePageY = pageY;
					// });
				});
			}, 500);
		}
	}, [open, activeQuestion]);
	// -------------------- THE END OF HIGHTLIGHT TEXT --------------------- //

	useEffect(() => {
		setTimeout(() => {
			open &&
				// Make the DIV element draggable:
				dragElement(document.getElementById('mydiv'));

			function dragElement(elmnt) {
				var pos1 = 0,
					pos2 = 0,
					pos3 = 0,
					pos4 = 0;
				if (document.getElementById(elmnt.id + 'header')) {
					// if present, the header is where you move the DIV from:
					document.getElementById(elmnt.id + 'header').onmousedown =
						dragMouseDown;
				} else {
					// otherwise, move the DIV from anywhere inside the DIV:
					elmnt.onmousedown = dragMouseDown;
				}

				function dragMouseDown(e) {
					e = e || window.event;
					e.preventDefault();
					// get the mouse cursor position at startup:
					pos3 = e.clientX;
					pos4 = e.clientY;
					document.onmouseup = closeDragElement;
					// call a function whenever the cursor moves:
					document.onmousemove = elementDrag;
				}

				function elementDrag(e) {
					e = e || window.event;
					e.preventDefault();
					// calculate the new cursor position:
					pos1 = pos3 - e.clientX;
					pos2 = pos4 - e.clientY;
					pos3 = e.clientX;
					pos4 = e.clientY;
					// set the element's new position:
					elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
					elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
				}

				function closeDragElement() {
					// stop moving when mouse button is released:
					document.onmouseup = null;
					document.onmousemove = null;
				}
			}
		}, 500);
	}, [open]);

	const findActiveQuestion = (value, check) => {
		for (const [indexDetail, detail] of QuizDetail.entries()) {
			if (check === true) {
				break;
			} else {
				for (const [indexQuestionType, item] of detail.QuizQuestion.entries()) {
					if (check === true) {
						break;
					} else {
						for (const [
							indexQuestion,
							question,
						] of item.QuestionList.entries()) {
							if (question.Stt === value) {
								setActiveQuestion({
									indexDetail: indexDetail,
									indexQuestion: indexQuestionType,
									questionType: item.QuestionType,
									questionPresent: question,
								});
								check = true;
								break;
							}
						}
					}
				}
			}
		}
	};

	const checkPreviewQuestion = (item) => {
		let rs = false;
		for (const [index, obj] of clonePrevew.entries()) {
			if (obj === item) {
				rs = true;
				break;
			}
		}
		return rs;
	};

	useEffect(() => {
		open &&
			setTimeout(() => {
				// --- Action with list answer --- //
				let rowPagination = document.querySelector('.row-pagination');
				let itemAns = document.querySelectorAll('.list-answer .item');
				let btnPrevious = document.querySelectorAll('.pagi-btn.previous');
				let btnNext = document.querySelectorAll('.pagi-btn.next');

				console.log('btn Previous: ', btnPrevious);
				console.log('btn Next: ', btnNext);

				function removeAllItems() {
					itemAns.forEach((item) => {
						item.classList.remove('activeDoing');
						item.classList.remove('activeDoingFirst');
					});
				}

				btnNext.forEach((item) => {
					item.addEventListener('click', () => {
						console.log('Check Click');
						for (const [index, item] of itemAns.entries()) {
							console.log('Check Break');
							if (
								item.classList.contains('activeDoing') ||
								item.classList.contains('activeDoingFirst')
							) {
								if (index == itemAns.length - 1) {
									let classItem = itemAns[0].childNodes[0].className;

									removeAllItems();
									if (classItem === 'checked') {
										itemAns[0].classList.add('activeDoingFirst');
									} else {
										console.log('hahahaha');
										itemAns[0].classList.add('activeDoing');
									}
									let value = parseInt(itemAns[0].firstChild.innerText);
									findActiveQuestion(value);
									break;
								} else {
									let classItem =
										item.nextElementSibling.childNodes[0].className;

									removeAllItems();
									if (classItem === 'checked') {
										itemAns[index + 1].classList.add('activeDoingFirst');
									} else {
										itemAns[index + 1].classList.add('activeDoing');
									}
									// itemAns[index + 1].classList.add('activeDoing');
									let value = parseInt(itemAns[index + 1].firstChild.innerText);
									findActiveQuestion(value);
									break;
								}
							}
						}
					});
				});

				btnPrevious.forEach((item) => {
					item.addEventListener('click', () => {
						console.log('Check Click');
						for (const [index, item] of itemAns.entries()) {
							console.log('ITEM: ', item);
							if (
								item.classList.contains('activeDoing') ||
								item.classList.contains('activeDoingFirst')
							) {
								if (index == 0) {
									let classItem =
										itemAns[itemAns.length - 1].childNodes[0].className;

									removeAllItems();

									if (classItem === 'checked') {
										itemAns[itemAns.length - 1].classList.add(
											'activeDoingFirst',
										);
									} else {
										itemAns[itemAns.length - 1].classList.add('activeDoing');
									}

									// itemAns[itemAns.length - 1].classList.add('activeDoing');
									let value = parseInt(
										itemAns[itemAns.length - 1].firstChild.innerText,
									);
									findActiveQuestion(value);
									break;
								} else {
									let classItem =
										item.previousElementSibling.childNodes[0].className;

									removeAllItems();

									if (classItem === 'checked') {
										itemAns[index - 1].classList.add('activeDoingFirst');
									} else {
										itemAns[index - 1].classList.add('activeDoing');
									}

									// itemAns[index - 1].classList.add('activeDoing');
									let value = parseInt(itemAns[index - 1].firstChild.innerText);
									findActiveQuestion(value);
									break;
								}
							}
						}
					});
				});

				itemAns.forEach((item) => {
					item.addEventListener('click', (e) => {
						// Check Preview Question //

						let checkPreview = checkPreviewQuestion(
							parseInt(e.target.innerText),
						);
						let newArr = [...clonePrevew];
						if (checkPreview) {
							console.log('check preview: ', checkPreview);
							setPreview({
								activeQuestion: newArr,
								status: true,
							});
						} else {
							setPreview({
								activeQuestion: newArr,
								status: false,
							});
						}

						// --- //

						let value = parseInt(e.target.innerText);
						let classItem = e.target.className;

						let check = false;
						findActiveQuestion(value, check);

						// setActiveQuestion(value - 1);

						if (classItem === 'checked') {
							removeAllItems();
							item.classList.add('activeDoingFirst');
						} else {
							removeAllItems();
							item.classList.add('activeDoing');
						}
					});
				});
			}, 100);
	}, [open]);

	useEffect(() => {
		let itemAns = document.querySelectorAll('.list-answer .item');

		function removeAllItems() {
			itemAns.forEach((item) => {
				item.classList.remove('activeDoing');
				item.classList.remove('activeDoingFirst');
			});
		}

		if (activeTab !== null) {
			itemAns.forEach((item) => {
				let questionID = parseInt(item.getAttribute('questionid'));
				let classItem = item.childNodes[0].className;

				if (questionID === activeTab) {
					if (classItem === 'checked') {
						removeAllItems();
						item.classList.add('activeDoingFirst');
					} else {
						removeAllItems();
						item.classList.add('activeDoing');
					}
				}
			});
		}
	}, [activeTab]);

	// ------------------------------------------------- //

	return (
		<div className="wrap-quiz">
			<div className="quiz-review">
				<ul className="quiz-review__list">
					<li>
						Số lượng câu hỏi: <b>30 câu</b>
					</li>
					<li>
						Thời gian: <b>30 phút</b>
					</li>
				</ul>
				<div className="quiz-btn">
					<Button variant="contained" color="secondary" onClick={handleOpen}>
						Bắt đầu
					</Button>
				</div>
			</div>

			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={open}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className="modal-quiz">
						<div className="modal-quiz-header">
							<p className="modal-quiz-title">
								<b>Topic:</b> What is a CSS Sprite?
							</p>
							<button onClick={handleClose} className="btn-close">
								{' '}
								<FontAwesomeIcon icon="times" />
							</button>
						</div>

						<div className="quiz ">
							<div className="quiz-header">
								<div className="left">
									<p className="quiz-title">Bài trắc nghiệm</p>
									{/* <div className="quiz-info">
										<p className="quiz-info-minutes">
											Say something about this quiz
										</p>
									</div> */}
								</div>
								<div className="right">
									{handleClick ? (
										<CountDown
											addMinutes={addMinutes}
											onFinish={() => !showPopup && timeUp()}
										/>
									) : (
										''
									)}
								</div>
							</div>
							<div className="quiz-inner highlight">
								<div className="quiz-inner__container">
									{QuizDetail.map((detail, indexDetail) => {
										if (indexDetail === activeQuestion.indexDetail) {
											return (
												<>
													<div className="quiz-col quiz-inner__content ">
														<ContentQuiz
															open={open}
															contentQuiz={detail.QuizContent}
														/>
													</div>
													<div className="quiz-col quiz-inner__question ">
														{detail.QuizQuestion.map((question, index) => {
															if (index === activeQuestion.indexQuestion) {
																switch (question.QuestionType) {
																	case 1:
																		return (
																			<RadioQuestion
																				key={question.QuestionType}
																				dataQuestion={question}
																				activeQuestion={
																					activeQuestion.questionPresent
																				}
																				handleCheckedQuestion={
																					handleCheckedQuestion
																				}
																				getActiveTab={getActiveTab}
																			/>
																		);
																		break;
																	case 2:
																		return (
																			<GroupQuestion
																				key={question.QuestionType}
																				dataQuestion={question}
																				activeQuestion={
																					activeQuestion.questionPresent
																				}
																				handleCheckedQuestion={
																					handleCheckedQuestion
																				}
																				getActiveTab={getActiveTab}
																			/>
																		);
																		break;
																	case 3:
																		return (
																			<MultipleQuestion
																				key={question.QuestionType}
																				dataQuestion={question}
																				activeQuestion={
																					activeQuestion.questionPresent
																				}
																				getActiveTab={getActiveTab}
																				handleCheckedQuestion={
																					handleCheckedQuestion
																				}
																			/>
																		);
																		break;
																	case 4:
																		return (
																			<MapQuestion
																				key={question.QuestionType}
																				dataQuestion={question}
																				activeQuestion={
																					activeQuestion.questionPresent
																				}
																				getActiveTab={getActiveTab}
																				handleCheckedQuestion={
																					handleCheckedQuestion
																				}
																				findActiveQuestion={findActiveQuestion}
																			/>
																		);
																		break;
																	case 5:
																		return (
																			<DropQuestion
																				key={question.QuestionType}
																				dataQuestion={question}
																				activeQuestion={
																					activeQuestion.questionPresent
																				}
																				getActiveTab={getActiveTab}
																				handleCheckedQuestion={
																					handleCheckedQuestion
																				}
																			/>
																		);
																		break;
																	case 6:
																		return (
																			<TypeQuestion
																				key={question.QuestionType}
																				dataQuestion={question}
																				activeQuestion={
																					activeQuestion.questionPresent
																				}
																				getActiveTab={getActiveTab}
																				handleCheckedQuestion={
																					handleCheckedQuestion
																				}
																			/>
																		);
																		break;
																	default:
																		<RadioQuestion />;
																}
															}
														})}

														{/* <GroupQuestion />
										<MapQuestion />
										<TypeQuestion />
										<DropQuestion />
										<MultipleQuestion /> */}
													</div>
												</>
											);
										}
									})}
								</div>
							</div>
						</div>
						<div className="modal-quiz-footer">
							<div className="pagination-mobile">
								<button className="listQuestion" onClick={handleClick_openPagi}>
									<FontAwesomeIcon icon="list-alt" />
								</button>
								<span className="pagi-btn previous">
									<ChevronLeftIcon />
								</span>
								<span className="pagi-btn next">
									<ChevronRightIcon />
								</span>
							</div>
							<div className={`row-pagination ${showPagi && 'active-mobile'}`}>
								<button
									className="close-icon"
									onClick={handleClick_ClosePagination}
								>
									<CloseIcon />
								</button>
								<p className="pagi-name">Danh sách câu hỏi</p>
								<FormControlLabel
									className={`${classes.preview} preview`}
									control={
										<Checkbox
											checked={preview.status}
											onChange={handleChange}
											name="checkedA"
										/>
									}
									label="Preview"
								/>
								<span className="pagi-btn previous">
									<ChevronLeftIcon />
								</span>
								<ul className="list-answer">
									{QuizDetail.map((detail, indexDetail) =>
										detail.QuizQuestion.map((questionType, indexQuestionType) =>
											questionType.QuestionList.map(
												(question, indexQuestion) => (
													<li
														questionid={question.QuestionID}
														className={`item ${
															indexDetail === 0 &&
															indexQuestionType === 0 &&
															indexQuestion === 0 &&
															`activeDoing`
														}`}
														value={question.Stt}
													>
														<span
															className={handleCheckNumber(question.QuestionID)}
														>
															{question.Stt}
														</span>
													</li>
												),
											),
										),
									)}
								</ul>
								<span className="pagi-btn next">
									<ChevronRightIcon />
								</span>
							</div>
							<div className="row-button">
								<Button
									variant="contained"
									color="secondary"
									className={classes.styleButton}
								>
									Nộp bài
								</Button>
								<Button variant="contained" onClick={handleClose}>
									Hủy bỏ
								</Button>
							</div>
						</div>
						<div className="popover-an popover-style">
							<div className="popover-style__button">
								<button className="btn-highlight">Highlight</button>
								<button className="btn-note">Note</button>
							</div>
						</div>

						<div className="popover-style popover-hover">
							<div className="popover-style__button">
								<button className="btn-note">Note</button>
								<button className="btn-remove">Remove</button>
								<button className="btn-remove-all">Remove All</button>
							</div>
						</div>

						<div className="wrap-popup-note">
							<div className="popup-note" id="mydiv">
								<div className="popup-note-header" id="mydivheader">
									<span className="close-popup">
										<FontAwesomeIcon icon="times" />
									</span>
								</div>
								<div className="popup-note-content">
									<textarea id="getNote"></textarea>
								</div>
							</div>
						</div>
					</div>
				</Fade>
			</Modal>

			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={showPopup}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={showPopup} className={classes.popup}>
					<div className={classes.paper}>
						<img
							src="/static/img/notification.png"
							className="popup-img"
							alt="notification"
						/>
						<h3 id="transition-modal-title" className="popup-title">
							Time's up !!!
						</h3>
						<p id="transition-modal-description" className="popup-des">
							Bạn đã hết giờ làm quiz
						</p>
						<div className="popup-box-btn">
							<Button variant="contained" color="secondary">
								Nộp bài
							</Button>
							<Button variant="contained" onClick={makeAgain}>
								Làm lại
							</Button>
						</div>
					</div>
				</Fade>
			</Modal>
		</div>
	);
};

export default Quiz;
