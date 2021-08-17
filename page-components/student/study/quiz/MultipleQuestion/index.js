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
	const QuestionList = dataQuestion.QuestionList;
	const classes = useStyles();
	const [expanded, setExpanded] = React.useState(activeQuestion.Stt);

	if (activeQuestion.Stt !== saveActiveQuestion) {
		saveActiveQuestion = activeQuestion.Stt;
		setExpanded(activeQuestion.Stt);
	}

	const handleChange_Accordion = (panel, questionID) => (
		event,
		newExpanded,
	) => {
		setExpanded(newExpanded ? panel : false);
		getActiveTab(questionID);
	};

	const [listActive, setListActive] = useState(
		(() => {
			let result = [];
			try {
				QuestionList.map((question, index) => {
					result.push({
						questionID: question.QuestionID,
						answerID: [],
						checked: null,
					});
				});
			} catch (error) {
				console.log('error: ', error);
			}
			return result;
		})(),
	);

	const handleChange_Label = (event) => {
		// If question is checked, number of pagination will change color
		let cloneArr = null;
		let questionID = parseInt(
			event.target.parentElement.parentElement.parentElement.getAttribute(
				'questionid',
			),
		);
		let answerID = parseInt(event.target.value);

		if (listChecked.length < 1) {
			cloneArr = [...listActive];
		} else {
			cloneArr = [...listChecked];
		}

		if (event.target.checked === true) {
			cloneArr.forEach((item) => {
				if (item.questionID === questionID) {
					item.checked = true;
					item.answerID.push(answerID);
				}
			});
		} else {
			cloneArr.forEach((item) => {
				if (item.questionID === questionID) {
					for (const [index, obj] of item.answerID.entries()) {
						if (obj === answerID) {
							item.answerID.splice(index, 1);
							break;
						}
					}
					if (item.answerID.length < 1) {
						item.checked = false;
					}
				}
			});
		}

		listChecked = [...cloneArr];
		setListActive(cloneArr);
		handleCheckedQuestion(cloneArr);
	};

	console.log('list check: ', listChecked);

	// Checked is true or false? Save checked answer after click another question
	const handleSaveChecked = (questionID, answerID) => {
		let status = false;
		if (listChecked.length > 0) {
			for (const [index, item] of listChecked.entries()) {
				if (item.questionID === questionID) {
					for (const [ind, obj] of item.answerID.entries()) {
						if (obj === parseInt(answerID)) {
							status = true;
							break;
						} else {
							status = false;
						}
					}
				}
			}
		}
		return status;
	};

	return (
		<div className="quiz-section">
			<p className="quiz-section-title">
				Questions{' '}
				{QuestionList[0].Stt === QuestionList[QuestionList.length - 1].Stt
					? QuestionList[0].Stt
					: `${QuestionList[0].Stt} - ${
							QuestionList[QuestionList.length - 1].Stt
					  }`}
			</p>
			<p className="quiz-section-title-sub">
				{dataQuestion.QuestionTypeDetail}
			</p>
			{dataQuestion.QuestionList.map((question, index) => {
				return (
					<Accordion
						key={question.QuestionID}
						expanded={expanded === question.Stt}
						onChange={handleChange_Accordion(question.Stt, question.QuestionID)}
						className={classes.accordionBox}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
							className="heading-accordion"
						>
							<Typography>
								<b className="number-question">{question.Stt}/</b>
								{question.QuestionText}
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<FormControl component="fieldset">
								<FormGroup
									aria-label="position"
									className={classes.groupAnswer}
								>
									{question.QuestionAnswer.map((ans) => (
										<FormControlLabel
											key={ans.AnswerID}
											checked={handleSaveChecked(
												question.QuestionID,
												ans.AnswerID,
											)}
											value={ans.AnswerID}
											control={<Checkbox />}
											label={ans.AnswerText}
											className={classes.answer}
											onChange={handleChange_Label}
											questionid={question.QuestionID}
										/>
									))}
								</FormGroup>
							</FormControl>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);
};

export default GroupQuestion;
