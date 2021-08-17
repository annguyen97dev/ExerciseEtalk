import React, { useEffect, useLayoutEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import './styles.module.scss';
let s = 17;

let saveData = [];
const TypeQuestion = ({
	dataQuestion,
	activeQuestion,
	getActiveTab,
	handleCheckedQuestion,
}) => {
	const questionList = dataQuestion.QuestionList;

	const dataParagraph = dataQuestion.QuestionParagraph;

	const [size, setSize] = useState(s);

	const [listAcitve, setListActive] = useState(
		(() => {
			let result = [];
			if (saveData.length > 0) {
				result = [...saveData];
			} else {
				try {
					questionList?.map((item) => {
						result.push({
							questionID: item.QuestionID,
							answerID: null,
							text: '',
							checked: null,
						});
					});
				} catch {}
			}
			return result;
		})(),
	);

	// console.log('Question List: ', questionList);
	// console.log('List Active: ', listAcitve);

	const handleChagne = (evt) => {
		console.log('this:', evt);
		if (evt.target.value.length >= s) {
			s += 2;
			// setSize(s);
			evt.target.size = s;
			console.log('s = ', s);
		}
		if (evt.target.value.length < 1) {
			// setSize(17);
			evt.target.size = 17;
			s = 17;
		}
	};

	useEffect(() => {
		let el = document.querySelectorAll('.quiz-input');

		el.forEach((item) => {
			item.addEventListener('keydown', (event) => {
				let lengthText = event.target.innerText.length;
				if (lengthText > 14) {
					item.classList.add('auto');
				} else {
					item.classList.remove('auto');
				}
			});
		});
	});

	console.log('SAVE DATA: ', saveData);

	useEffect(() => {
		let input = document.querySelectorAll('.quiz-input');

		function removeAllItems() {
			input.forEach((item) => {
				item.classList.remove('active-type-input');
			});
		}

		// Number là số mấy thì sẽ in đậm câu đó ra
		for (const [index, item] of input.entries()) {
			let questionID = parseInt(item.getAttribute('questionid'));

			if (questionID === activeQuestion.QuestionID) {
				removeAllItems();
				item.classList.add('active-type-input');
			}
		}

		input.forEach((item, index) => {
			let questionID = parseInt(item.getAttribute('questionid'));
			item.setAttribute('contenteditable', 'true');

			if (saveData.length > 0) {
				saveData.forEach((data) => {
					if (data.questionID === questionID) {
						if (data.text !== '') {
							item.innerText = data.text;
							item.style.width = 'auto';
						}
					}
				});
			}

			// ACTION CLICK
			item.addEventListener('click', function () {
				removeAllItems();
				item.classList.add('active-type-input');
				getActiveTab(questionID);
			});

			// ACTION TYPING
			item.addEventListener('keyup', function (event) {
				let arr = [...listAcitve];

				for (const [index, item] of arr.entries()) {
					if (item.questionID === questionID) {
						item.text = this.innerText;
						break;
					}
				}

				saveData = [...arr]; // Click sang trang khác quay lại vẫn còn
				setListActive(arr);
				handleCheckActive(questionID);
			});
		});

		const handleCheckActive = (questionID) => {
			let arr = [...listAcitve];
			arr.forEach((item) => {
				if (item.questionID === questionID) {
					item.checked = true;
				}
			});
			handleCheckedQuestion(arr);
			setListActive(arr);
		};
	}, [activeQuestion]);

	return (
		<div className="quiz-section">
			<p className="quiz-section-title">Questions 1 – 5</p>
			<div className="quiz-section-content">
				{/* <p>
					Complete the summary. Write NO MORE THAN TWO WORDS from the text in
					each gap. Consumers often complain that they experience a feeling of{' '}
					<div
						className="quiz-input"
						role="textbox"
						contenteditable="true"
						aria-labelledby="txtboxLabel"
						aria-multiline="true"
					></div>
				</p> */}
				{ReactHtmlParser(dataParagraph)}
			</div>
		</div>
	);
};

export default TypeQuestion;
