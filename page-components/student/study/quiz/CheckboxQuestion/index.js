import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import './styles.module.scss';

const useStyles = makeStyles((theme) => ({
	answer: {
		marginBottom: '0px',
	},
	groupAnswer: {
		flexDirection: 'column',
	},
}));

const CheckboxQuestion = () => {
	const classes = useStyles();

	return (
		<div className="quiz-section">
			<p className="quiz-section-title">
				Câu 1: Checkbox can be provided with a label thanks to the
				FormControlLabel component. (Single checkbox question);
			</p>
			<FormControl component="fieldset">
				<FormGroup aria-label="position" className={classes.groupAnswer}>
					<FormControlLabel
						value="Answer 1"
						control={<Checkbox />}
						label="Answer 1"
						labelPlacement="Answer 1"
						className={classes.answer}
					/>
					<FormControlLabel
						value="Answer 2"
						control={<Checkbox />}
						label="Answer 2"
						labelPlacement="Answer 2"
						className={classes.answer}
					/>
					<FormControlLabel
						value="Answer 3"
						control={<Checkbox />}
						label="Answer 3"
						labelPlacement="Answer 3"
						className={classes.answer}
					/>
					<FormControlLabel
						value="Answer 4"
						control={<Checkbox />}
						label="Answer 4"
						labelPlacement="Answer 4"
						className={classes.answer}
					/>
				</FormGroup>
			</FormControl>
		</div>
	);
};

export default CheckboxQuestion;
