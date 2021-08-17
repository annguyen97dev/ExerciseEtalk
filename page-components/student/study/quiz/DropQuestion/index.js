import React, { Component, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './styles.module.scss';

let listChecked = [];
let listSaveAnswer = [];
let cloneSaveData = [];

const DropQuestion = ({
	dataQuestion,
	activeQuestion,
	handleCheckedQuestion,
	getActiveTab,
}) => {
	const questionList = dataQuestion.QuestionList;
	const setUpListAnswer = dataQuestion.QuestionAnswer;
	const setUpGetAnswer = dataQuestion.QuestionList;
	// const SetUpListAnswer = [
	// 	{
	// 		id: '1',
	// 		text:
	// 			'Every chapter of The Jewel House charts the activities of a particular community',
	// 	},
	// 	{
	// 		id: '2',
	// 		text: 'Harkness leads us through the streets of London,',
	// 	},
	// 	{
	// 		id: '3',
	// 		text: 'she provides not traditional, static accounts of their theories',
	// 	},
	// 	{
	// 		id: '4',
	// 		text: 'In one crucial respect, Harkness argues',
	// 	},
	// ];

	// const setUpGetAnswer = [
	// 	{
	// 		id: 'ques-1',
	// 		idDrag: '5',
	// 		text: '',
	// 	},
	// 	{
	// 		id: 'ques-2',
	// 		idDrag: '6',
	// 		text: '',
	// 	},
	// ];

	const [listActive, setListActive] = useState(
		(() => {
			let result = [];
			try {
				questionList.map((question, index) => {
					result.push({
						questionID: question.QuestionID,
						answerID: null,
						checked: null,
					});
				});
			} catch (error) {
				console.log('error: ', error);
			}
			return result;
		})(),
	);

	console.log('List checked: ', listChecked);

	const getItemStyle = (isDragging) => ({
		minWidth: isDragging ? '200px' : '200px',
		width: 'auto',
	});

	const [listAnswer, updateListAnswer] = useState(
		(() => {
			let result = null;
			listSaveAnswer.length > 0
				? (result = [...listSaveAnswer])
				: (result = [...setUpListAnswer]);
			return result;
		})(),
	);
	const [getAnswer, updateGetAnswer] = useState(
		(() => {
			let result = null;
			listChecked.length > 0
				? (result = [...listChecked])
				: (result = [...setUpGetAnswer]);
			return result;
		})(),
	);

	const [saveData, updateSaveData] = useState(cloneSaveData);

	if (listChecked.length < 1 && listSaveAnswer.length < 1) {
		listChecked = [...getAnswer];
		listSaveAnswer = [...listAnswer];
	}

	// console.log('get Answer', getAnswer);
	// console.log('List save Answer: ', listSaveAnswer);
	// console.log('list Answer: ', listAnswer);

	// Sort list answer (Sắp sếp lại list câu trả lời )
	function sortArray(items) {
		items.sort(function (a, b) {
			return parseFloat(a.id) - parseFloat(b.id);
		});
	}

	//Update array list answer
	function pushToArray(index, data, area) {
		saveData.push({
			index: index,
			data: data,
			area: area,
		});
		return saveData;
	}

	//Update value in empty box  (Update lại value trong ô trống)
	function updateAnswer(data, saveId) {
		const newGetAnswer = [...getAnswer];
		newGetAnswer.map((obj) => {
			if (obj.id === saveId) {
				obj.text = data;
			}
		});
		return newGetAnswer;
	}

	//check
	function checkArea(area) {
		let result;
		getAnswer.map((obj) => {
			if (obj.id === area) {
				result = true;
			}
		});
		return result;
	}

	//Actions when drop and drag  (Các action sẽ xảy ra khi kéo thả)
	function handleOnDragEnd(result) {
		const { source, destination } = result;

		const items = Array.from(listAnswer);
		let saveId = '';
		let saveQuestionID = '';

		if (!destination) {
			if (checkArea(source.droppableId)) {
				updateGetAnswer(updateAnswer('', source.droppableId));

				// Tìm object có vùng chứa == saveId
				let [arrayHasSaveId] = saveData.filter(
					(value) => value.area == source.droppableId,
				);

				console.log('arrayHasSaveid', arrayHasSaveId);

				// Thao tác spilce and sort
				items.splice(arrayHasSaveId.index, 0, arrayHasSaveId.data);
				sortArray(items);

				// Xóa phần tử trong saveData
				saveData.map((obj, index) => {
					if (obj.area == source.droppableId) {
						saveData.splice(index, 1);
						updateSaveData(saveData);
					}
				});
				console.log('save-data-drop:', saveData);
				updateListAnswer(items);
			}
		} else {
			getAnswer.map((object) => {
				if (destination.droppableId === object.id) {
					saveId = object.id;
				}
			});
			if (source.droppableId !== destination.droppableId) {
				if (checkArea(source.droppableId)) {
					updateGetAnswer(updateAnswer('', source.droppableId));

					// Tìm object có vùng chứa == saveId
					let [arrayHasSaveId] = saveData.filter(
						(value) => value.area == source.droppableId,
					);

					console.log('arrayHasSaveid', arrayHasSaveId);

					// Thao tác spilce and sort
					items.splice(arrayHasSaveId.index, 0, arrayHasSaveId.data);
					sortArray(items);

					// Xóa phần tử trong saveData
					saveData.map((obj, index) => {
						if (obj.area == source.droppableId) {
							saveData.splice(index, 1);
							updateSaveData(saveData);
						}
					});
					console.log('save-data-drop:', saveData);
					updateListAnswer(items);
				} else {
					const [reorderedItem] = items.splice(source.index, 1);
					// Check getAnswer
					getAnswer.map((obj) => {
						if (obj.id == saveId) {
							if (obj.text != '') {
								// Tìm object có vùng chứa == saveId
								let [arrayHasSaveId] = saveData.filter(
									(value) => value.area == saveId,
								);

								console.log('ArrayHasSaveID: ', arrayHasSaveId);

								// Thao tác spilce and sort
								items.splice(arrayHasSaveId.index, 0, arrayHasSaveId.data);
								sortArray(items);

								// Xóa phần tử trong saveData
								saveData.map((obj, index) => {
									if (obj.area == saveId) {
										saveData.splice(index, 1);
										updateSaveData(saveData);
									}
								});
							}
						}
					});

					// Update

					updateListAnswer(items);
					updateGetAnswer(updateAnswer(reorderedItem.text, saveId));
					checkAnswerActive(getAnswer);
					listSaveAnswer = [...items];
					listChecked = [...getAnswer];
					updateSaveData(pushToArray(source.index, reorderedItem, saveId));
					cloneSaveData = [...saveData];
				}
			}
		}
	}

	const checkAnswerActive = (arrAnswer) => {
		let cloneListActive = [...listActive];
		cloneListActive.forEach((item, index) => {
			if (item.questionID === arrAnswer[index].QuestionID) {
				if (arrAnswer[index].text !== '') {
					item.checked = true;
				}
			}
		});
		handleCheckedQuestion(cloneListActive);
		setListActive(cloneListActive);
	};

	// useEffect(() => {
	// 	console.log('Active Question: ', activeQuestion);

	// 	let boxInclude = document.querySelectorAll('.box-include');

	// 	function removeActive() {
	// 		boxInclude.forEach((item) => {
	// 			item.classList.remove('active-question');
	// 		});
	// 	}

	// 	boxInclude.forEach((item) => {
	// 		let questionID = parseInt(item.getAttribute('questionid'));

	// 		if (questionID === activeQuestion.QuestionID) {
	// 			removeActive();
	// 			item.classList.add('active-question');
	// 		}
	// 	});
	// }, [activeQuestion]);

	// useEffect(() => {
	// 	handleCheckedQuestion(getAnswer)
	// }, [getAnswer]);

	useEffect(() => {
		let boxInclude = document.querySelectorAll('.box-include');
		let textInclude = document.querySelectorAll('.box-include div');

		textInclude.forEach((item, index) => {
			if (item.innerText !== '') {
				console.log('index: ', index);
				item.parentElement.classList.add('active-text');
				item.parentElement.classList.add('active-box');
			} else {
				item.classList.remove('active-text');
				item.parentElement.classList.remove('active-text');
				item.parentElement.classList.remove('active-box');
			}
		});
	}, [getAnswer]);

	return (
		<div className="quiz-section quiz-drop">
			<p className="quiz-section-title">
				Questions{' '}
				{questionList[0].Stt === questionList[questionList.length - 1].Stt
					? questionList[0].Stt
					: `${questionList[0].Stt} - ${
							questionList[questionList.length - 1].Stt
					  }`}
			</p>
			<p className="quiz-section-title-sub">
				{dataQuestion.QuestionTypeDetail}
			</p>

			<DragDropContext onDragEnd={handleOnDragEnd}>
				{listChecked.map(
					({ QuestionID, id, text, QuestionText, idDrag }, index) => {
						return (
							<div className="wrap-text ">
								<p>{QuestionText}</p>
								<Droppable droppableId={id}>
									{(provided, snapshot) => (
										<div
											className={`box-include ${
												activeQuestion.QuestionID === QuestionID &&
												`active-question`
											}`}
											{...provided.droppableProps}
											ref={provided.innerRef}
											style={getItemStyle(snapshot.isDraggingOver)}
											questionid={QuestionID}
										>
											<Draggable
												key={idDrag}
												draggableId={idDrag}
												index={index}
											>
												{(provided) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														{text}
													</div>
												)}
											</Draggable>
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						);
					},
				)}

				<Droppable droppableId="listAnswer">
					{(provided) => (
						<div
							className="wrap-answer"
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							<div className="listAnswer">
								{listSaveAnswer.map(({ id, text }, index) => {
									return (
										<Draggable key={id} draggableId={id} index={index}>
											{(provided) => (
												<p
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
													{text}
												</p>
											)}
										</Draggable>
									);
								})}
								{provided.placeholder}
							</div>
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	);
};

export default DropQuestion;
