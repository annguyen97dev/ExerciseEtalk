import React, { useState, useEffect, useReducer } from 'react';
import Skeleton from 'react-loading-skeleton';

import './styles.module.scss';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Box from '@material-ui/core/Box';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ReactPlayer from 'react-player';

import { getLayout, getStudentLayout } from '~/components/Layout';
import shadows from '@material-ui/core/styles/shadows';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';

const drawerWidth = 385;
const drawerWidthAfter = drawerWidth - 17;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},

	appBar: {
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		background: '#ffffff',
		borderTop: '1px solid #e0e0e0',
		boxShadow: 'none',
		zIndex: '99',
	},
	fixTool: {
		minHeight: '45px',
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidthAfter}px)`,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: drawerWidthAfter,
	},
	title: {
		flexGrow: 1,
		display: 'flex',
		alignItems: 'center',
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		displau: 'block',
	},
	drawerPaper: {
		width: drawerWidth,
		zIndex: '0',
		marginTop: '60px',
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		background: '#ffffff',
		borderTop: '1px solid #e0e0e0',
		boxShadow: 'none',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-start',
		[theme.breakpoints.up('sm')]: {
			minHeight: '30px',
		},
		'& > .MuiIconButton-root': {
			padding: '10px',
		},
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginRight: -drawerWidth,
		padding: '0',
		paddingTop: '65px',
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginRight: 0,
	},
	HeaderTabs: {
		position: 'absolute',
		top: '45px',
		left: '0',
		background: '#ffffff',
		borderTop: '1px solid #e0e0e0',
		boxShadow: '1px 10px 10px #00000014',
		zIndex: '99',
	},
	tabStyle: {
		color: '#e71b64',
		width: '50%',
		maxWidth: '50%',
		fontSize: '15px',
		'&:active': {
			border: 'none',
			outline: '0',
		},
		'&:focus': {
			border: 'none',
			outline: '0',
		},
	},
	HeightContentTab: {
		height: 'calc(100vh - 190px)',
		position: 'absolute',
		left: '0',
		top: '94px',
		overflow: 'auto',
	},
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const Study = () => {
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = React.useState(true);
	const [value, setValue] = React.useState(0);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position="absolute"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open,
				})}
			>
				<Toolbar className={classes.fixTool}>
					<Typography variant="h6" noWrap className={classes.title}>
						<div className="box-topic">
							<ImportContactsIcon />
							Khóa học
						</div>
						<b>TOPIC:</b> IN THE KITCHEN
					</Typography>
					<IconButton
						color="black"
						aria-label="open drawer"
						edge="end"
						onClick={handleDrawerOpen}
						className={clsx(open && classes.hide)}
					>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<main
				className={clsx(classes.content, {
					[classes.contentShift]: true,
				})}
			>
				<AppBar
					className={clsx(classes.appBar, classes.HeaderTabs, {
						[classes.appBarShift]: open,
					})}
					transitionDuration={100}
				>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="simple tabs example"
					>
						<Tab
							className={classes.tabStyle}
							label="Bài học"
							{...a11yProps(0)}
						/>
						<Tab
							className={classes.tabStyle}
							label="Trắc nhiệm"
							{...a11yProps(1)}
						/>
					</Tabs>
				</AppBar>
				<TabPanel
					value={value}
					index={0}
					className={clsx(
						'fixContentTab',
						classes.appBar,
						classes.HeightContentTab,
						{
							[classes.appBarShift]: open,
						},
					)}
				>
					<h3>A, an, and the: how to use articles in English</h3>
					<p>
						Many learners of English have problems with articles (the words a,
						an and the), especially when they don’t exist in their own language.
						This blog looks at some of the basic rules. The number one rule is
						this: if a word is countable (e.g. one book, two books), you must
						always use an article (or my, his, etc.):
					</p>
					<div className="box-video">
						<ReactPlayer
							width="100%"
							height="500px"
							url="https://www.youtube.com/watch?v=3aQJ_OtIEFc"
						/>
					</div>
					<p>
						Note that we use a in front of words that start with a consonant
						sound (a horse, a carrot) and an in front of words with a vowel
						sound (an apple, an elephant).
					</p>
					<p>
						The next most important thing to understand is the difference
						between a/an and the. Basically, we use a/an when we don’t need to
						say which thing we are talking about. We use the to talk about a
						specific thing:
					</p>
					<p>
						Note that we use a in front of words that start with a consonant
						sound (a horse, a carrot) and an in front of words with a vowel
						sound (an apple, an elephant).
					</p>
					<p>
						Note that we use a in front of words that start with a consonant
						sound (a horse, a carrot) and an in front of words with a vowel
						sound (an apple, an elephant).
					</p>
					<p>
						Note that we use a in front of words that start with a consonant
						sound (a horse, a carrot) and an in front of words with a vowel
						sound (an apple, an elephant).
					</p>

					<p>
						Note that we use a in front of words that start with a consonant
						sound (a horse, a carrot) and an in front of words with a vowel
						sound (an apple, an elephant).
					</p>
					<p>
						Note that we use a in front of words that start with a consonant
						sound (a horse, a carrot) and an in front of words with a vowel
						sound (an apple, an elephant).
					</p>
				</TabPanel>
				<TabPanel
					value={value}
					index={1}
					className={clsx(classes.appBar, classes.HeightContentTab, {
						[classes.appBarShift]: open,
					})}
				>
					<Typography paragraph>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
						dolor purus non enim praesent elementum facilisis leo vel. Risus at
						ultrices mi tempus imperdiet. Semper risus in hendrerit gravida
						rutrum quisque non tellus. Convallis convallis tellus id interdum
						velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean
						sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
						integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
						eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
						quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
						vivamus at augue. At augue eget arcu dictum varius duis at
						consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
						donec massa sapien faucibus et molestie ac.
					</Typography>
				</TabPanel>
			</main>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="right"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? (
							<ChevronLeftIcon />
						) : (
							<ChevronRightIcon />
						)}
					</IconButton>
				</div>
				<Divider />
				<List>
					{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
						<ListItem button key={text}>
							<ListItemIcon>
								{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					{['All mail', 'Trash', 'Spam'].map((text, index) => (
						<ListItem button key={text}>
							<ListItemIcon>
								{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
			</Drawer>
		</div>
	);
};

Study.getLayout = getStudentLayout;

export default Study;
