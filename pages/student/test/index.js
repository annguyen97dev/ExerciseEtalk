import dynamic from 'next/dynamic';
import React from 'react';
import { getLayout, getStudentLayout } from '~/components/Layout';
// import VideoComment from './components/VideoComment';

// import Quiz from './components/quiz';
// import Selection from './components/selection3';

// const Selection = dynamic(() => import('./components/selection3'), {
// 	loading: () => <p>...</p>,
// 	ssr: false,
// });

const VideoComment = dynamic(() => import('./components/selection3'), {
	loading: () => <p>...</p>,
	ssr: false,
});

const App = () => {
	return (
		<div>
			{/* <DynamicJqueryDiamonds />
			<Selection />
			<Quiz /> */}
			<VideoComment />
		</div>
	);
};

App.getLayout = getStudentLayout;
export default App;
