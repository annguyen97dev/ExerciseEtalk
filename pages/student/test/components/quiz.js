import React, { Component, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './styles.module.scss';

const Quiz = () => {
	const SetUpListAnswer = [
		{
			id: '1',
			text:
				'Every chapter of The Jewel House charts the activities of a particular community',
		},
		{
			id: '2',
			text: 'Harkness leads us through the streets of London,',
		},
		{
			id: '3',
			text: 'she provides not traditional, static accounts of their theories',
		},
		{
			id: '4',
			text: 'In one crucial respect, Harkness argues',
		},
	];

	const setUpGetAnswer = [
		{
			id: 'ques-1',
			idDrag: '5',
			text: '',
		},
		{
			id: 'ques-2',
			idDrag: '6',
			text: '',
		},
	];

	const getItemStyle = (isDragging) => ({
		minWidth: isDragging ? '200px' : '200px',
		width: 'auto',
	});

	const [listAnswer, updateListAnswer] = useState(SetUpListAnswer);
	const [getAnswer, updateGetAnswer] = useState(setUpGetAnswer);

	const [saveData, updateSaveData] = useState([]);
	console.log('get Answer', getAnswer);

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
					console.log('saveId: ', saveId);
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
					updateSaveData(pushToArray(source.index, reorderedItem, saveId));
					console.log('Save Data: ', saveData);
				}
			}
		}
	}

	return (
		<div className="quiz-section quiz-drop">
			<p className="quiz-section-title">Questions 1 – 3</p>
			<p>
				Complete each sentence with the correct ending. Choose the correct
				ending and move it into the gap.
			</p>

			<DragDropContext onDragEnd={handleOnDragEnd}>
				{getAnswer.map(({ id, text, idDrag }, index) => {
					return (
						<div className="wrap-text">
							<p>
								Harkness’s research method was different to that of other
								writers because
							</p>
							<Droppable droppableId={id}>
								{(provided, snapshot) => (
									<div
										className="box-include"
										{...provided.droppableProps}
										ref={provided.innerRef}
										style={getItemStyle(snapshot.isDraggingOver)}
									>
										<Draggable key={idDrag} draggableId={idDrag} index={index}>
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
				})}

				<Droppable droppableId="listAnswer">
					{(provided) => (
						<div
							className="wrap-answer"
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							<div className="listAnswer">
								{listAnswer.map(({ id, text }, index) => {
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

export default Quiz;
