import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';

import { withStyles } from '@material-ui/core/styles';

import './styles.module.scss';

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
	colHeader: {
		paddingRight: '32px',
	},
	wrapTable: {
		width: '100%',
		'@media (max-width: 1600px)': {
			width: '100%',
		},
	},
	styleCol: {
		padding: '7px 16px',
		fontSize: '16px',
	},
	activeQuestion: {
		background: ' #c1c1c11c',
	},
});

function createData(name, calories, fat, carbs, protein) {
	return { name, calories, fat, carbs, protein };
}

let listChecked = [];
const MapQuestion = ({
	dataQuestion,
	activeQuestion,
	handleCheckedQuestion,
	getActiveTab,
	findActiveQuestion,
}) => {
	const questionList = dataQuestion.QuestionList;

	const classes = useStyles();
	const [selectedValue, setSelectedValue] = useState();
	const [check, setCheck] = useState(
		(() => {
			let result = [];
			try {
				questionList?.map((item) => {
					result.push({
						questionID: item.QuestionID,
						listAnswer: [],
						checked: null,
					});
				});
			} catch {}
			return result;
		})(),
	);

	// const handleChange = (event) => {
	// 	setSelectedValue(event.target.value);
	// };

	console.log('Check: ', check);

	const handleChecked = (answerID, questionID) => {
		let checked = null;

		if (listChecked.length > 0) {
			for (const [index, item] of listChecked.entries()) {
				if (item.questionID === questionID) {
					for (const [i, ans] of item.listAnswer.entries()) {
						if (ans === answerID) {
							checked = true;
							break;
						} else {
							checked = false;
						}
					}
				}
			}
		}

		return checked;
	};

	const handleChange_Checkbox = (event) => {
		let value = event.target.getAttribute('value');
		let questionID = parseInt(
			event.target.parentElement.parentElement.getAttribute('questionid'),
		);

		let arr = [...check];
		for (const [index, item] of arr.entries()) {
			if (item.questionID === questionID) {
				item.listAnswer = [];
				item.listAnswer.push(value);
				item.checked = true;
			}
		}
		listChecked = [...arr];
		findActiveQuestion(questionID);
		// getActiveTab(questionID);
		setCheck(arr);
		handleCheckedQuestion(arr);
	};

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
			<div className="quiz-section-content">
				<img
					className="map-question-img"
					src={`/static/assets/img/map.jpg`}
					alt="map-question-img"
				></img>
				<TableContainer component={Paper} className={classes.wrapTable}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell></TableCell>
								<TableCell
									align="right"
									className={classes.styleCol}
									className={classes.colHeader}
								>
									A
								</TableCell>
								<TableCell
									align="right"
									className={classes.styleCol}
									className={classes.colHeader}
								>
									B
								</TableCell>
								<TableCell
									align="right"
									className={classes.styleCol}
									className={classes.colHeader}
								>
									C
								</TableCell>
								<TableCell
									align="right"
									className={classes.styleCol}
									className={classes.colHeader}
								>
									D
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{questionList?.length > 0 &&
								questionList.map((question) => (
									<TableRow
										key={question.QuestionID}
										className={
											question.QuestionID === activeQuestion.QuestionID &&
											classes.activeQuestion
										}
									>
										<TableCell>
											<b>{question.Stt}/</b> {question.QuestionText}
										</TableCell>
										{question.QuestionAnswer?.length > 0 ? (
											question.QuestionAnswer.map((item) => (
												<TableCell
													key={item.AnswerID}
													align="right"
													className={classes.styleCol}
												>
													<Checkbox
														value={item.AnswerID}
														questionid={question.QuestionID}
														checked={handleChecked(
															item.AnswerID,
															question.QuestionID,
														)}
														onChange={handleChange_Checkbox}
													/>
												</TableCell>
											))
										) : (
											<p>Chưa có dữ liệu</p>
										)}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default MapQuestion;
