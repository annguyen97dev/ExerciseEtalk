import React, { useEffect, useContext, useState } from 'react';

import Header from '~/components/Header';
import Footer from '~/components/Footer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n } from '~/i18n';
import { I18nContext } from 'next-i18next';
import Select, { components } from 'react-select';
import { appSettings } from '~/config';
import Menu from '~/components/Menu';
import { useRouter } from 'next/router';

const Layout = ({
	children,
	title = 'E-talk Elearning',
	isStudent = false,
}) => {
	useEffect(() => {
		isStudent ? (appSettings.UID = 1071) : (appSettings.UID = 20);
	}, [isStudent]);

	const router = useRouter();
	const [changePadding, setChangePadding] = React.useState(false);
	React.useLayoutEffect(() => {
		let scrWidth = window.screen.width;

		if (router.pathname === '/student/my-course/[courseid]') {
			setChangePadding(true);
		} else {
			setChangePadding(false);
		}

		return () => {};
	}, [router]);

	return (
		<>
			<Head>
				<title>{title}</title>
				<script src="/static/assets/js/dashforge.js"></script>
				<script src="/static/js/dashforge.aside.js"></script>
				<script src="/static/js/custom.js"></script>
			</Head>
			<Menu isStudent={isStudent} />
			<main className="content ht-100vh pd-0-f">
				<Header isStudent={isStudent} />
				<div
					className={`content-body ${changePadding && 'changeStyleContent'}`}
					id="body-content"
					// style={changePadding ? { padding: '0', overflow: 'hidden' } : {}}
				>
					{children}
				</div>
				<Footer />
			</main>
		</>
	);
};

export const getLayout = (page) => <Layout>{page}</Layout>;

export const getStudentLayout = (page) => (
	<Layout isStudent={true}>{page}</Layout>
);

export default Layout;
