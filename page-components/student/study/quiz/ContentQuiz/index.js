import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';

const ContentQuiz = ({ open, contentQuiz }) => {
	return <div className="wrapper-text">{ReactHtmlParser(contentQuiz)}</div>;
};

export default ContentQuiz;
