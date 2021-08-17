import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	answer: {
		marginBottom: '0px',
	},
	groupAnswer: {
		flexDirection: 'column',
	},
}));

let listChecked = [];
let saveActiveQuestion = 0;

const GroupQuestion = ({
	dataQuestion,
	activeQuestion,
	handleCheckedQuestion,
	getActiveTab,
}) => {
	const questionList = dataQuestion.QuestionList;
	const classes = useStyles();
	const [expanded, setExpanded] = useState(activeQuestion.ParentID);

	console.log('Active question ID: ', activeQuestion.ParentID);

	const [checked, setChecked] = useState(
		(() => {
			let result = [];
			try {
				questionList.map((question, index) => {
					question.isParent &&
						result.push({
							parentID: question.ParentID,
							arr: (() => {
								let subArr = [];
								for (const [ind, item] of questionList.entries()) {
									// trả về mảng chưa số lượng câu dc check

									if (ind < question.LimitAnswer) {
										subArr.push('');
									} else {
										break;
									}
								}
								return subArr;
							})(),
						});
				});
				// result = questionList.map(
				// 	(question, index) => question.isParent === true && question.ParentID,
				// );
			} catch (error) {
				console.log('error: ', error);
			}
			return result;
		})(),
	);

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

	//Thao tác checkbox, nếu check bằng đủ số lượng thì disable mấy thằng kia lại
	const handleChange_CheckBox = (event, checkBox) => {
		let cloneArr = null;
		let parentID = parseInt(
			event.currentTarget.parentElement.parentElement.parentElement.getAttribute(
				'parentid',
			),
		);

		let value = event.currentTarget.getAttribute('value');
		console.log('VALUE INPUT: ', value);

		if (listChecked.length < 1) {
			cloneArr = [...checked];
		} else {
			cloneArr = [...listChecked];
		}

		if (event.target.checked === true) {
			cloneArr.forEach((item) => {
				if (item.parentID === parentID) {
					for (const [index, obj] of item.arr.entries()) {
						if (obj === '') {
							item.arr[index] = value;
							break;
						}
					}
				}
			});

			listChecked = [...cloneArr];
			setChecked(cloneArr);
			funcCheckedQuestion(cloneArr);
		} else {
			cloneArr.forEach((item) => {
				if (item.parentID === parentID) {
					let index = item.arr.indexOf(value);
					item.arr[index] = '';
				}
			});

			listChecked = [...cloneArr];
			setChecked(cloneArr);
			funcCheckedQuestion(cloneArr);
		}
	};

	// Nếu số lượng câu dc check > LimitAnswer => trả về true
	const isDisabled = (id, limitAns, parentID) => {
		let value = null;

		const checkLengthArr = (arr) => {
			let count = 0;
			for (const [ind, obj] of arr.entries()) {
				if (obj !== '') {
					count++;
				}
			}
			return count;
		};

		for (const [index, item] of checked.entries()) {
			if (item.parentID === parentID) {
				let lengthArr = checkLengthArr(item.arr);

				if (lengthArr > limitAns - 1) {
					value = item.arr.indexOf(id) === -1;

					break;
				}
				// if (item.arr.length > limitAns - 1) {
				// 	value = item.arr.indexOf(id) === -1;
				// 	console.log("True or False: ", value);
				// 	break;
				// }
			}
		}

		return value;
		// return checked.length > limitAns - 1 && checked.indexOf(id) === -1;
	};

	// Tổng hợp các câu được check đưa vào một mảng
	const funcCheckedQuestion = (arr) => {
		let totalArr = [];
		arr.forEach((item) => {
			item.arr.forEach((obj) => {
				totalArr.push(obj);
			});
		});

		let arrActive = [...listActive];

		arrActive.forEach((item, index) => {
			if (totalArr[index] !== '') {
				item.checked = true;
			} else {
				item.checked = false;
			}
		});

		setListActive(arrActive);
		handleCheckedQuestion(arrActive);
	};

	const handleChecked = (parentID, answerID) => {
		answerID = parseInt(answerID);
		let status = false;
		if (listChecked.length > 0) {
			for (const [index, item] of listChecked.entries()) {
				if (item.parentID === parentID) {
					for (const [ind, obj] of item.arr.entries()) {
						obj = parseInt(obj);
						if (obj === answerID) {
							status = true;
							break;
						}
					}
				}
				if (status) {
					break;
				}
			}
		}
		return status;
	};

	const handleChange_Accordion = (panel, questionID) => (
		event,
		newExpanded,
	) => {
		console.log('question ID: ', questionID);
		setExpanded(newExpanded ? panel : false);
		getActiveTab(questionID);
	};

	if (activeQuestion?.ParentID !== saveActiveQuestion) {
		if (activeQuestion?.ParentID) {
			saveActiveQuestion = activeQuestion?.ParentID;
			setExpanded(activeQuestion?.ParentID);
		}
	}

	return (
		<div className="quiz-section">
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
			{dataQuestion?.QuestionList?.map((question, index) => {
				if (question.isRender) {
					return (
						<Accordion
							key={question.QuestionID}
							expanded={expanded === question.ParentID}
							onChange={handleChange_Accordion(
								question.Stt,
								question.QuestionID,
							)}
							className={classes.accordionBox}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
								className="heading-accordion"
							>
								<Typography>
									<b className="number-question">{question.QuestionTitle}/</b>
									{question.QuestionText}
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<FormControl component="fieldset">
									<FormGroup
										aria-label="position"
										className={classes.groupAnswer}
									>
										{question?.QuestionAnswer?.map((ans) => (
											<FormControlLabel
												checked={handleChecked(question.ParentID, ans.AnswerID)}
												key={ans.AnswerID}
												disabled={isDisabled(
													ans.AnswerID,
													question.LimitAnswer,
													question.ParentID,
												)}
												parentid={question.ParentID}
												// parent={question.isParent.toString()}
												value={ans.AnswerID}
												control={<Checkbox onChange={handleChange_CheckBox} />}
												label={ans.AnswerText}
												className={classes.answer}
											/>
										))}
									</FormGroup>
								</FormControl>
							</AccordionDetails>
						</Accordion>
					);
				}
			})}
		</div>
	);
};

export default GroupQuestion;
