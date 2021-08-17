import React from 'react';
import ReactDOM from 'react-dom';
import Head from 'next/head';
import App from 'next/app';
import Router from 'next/router';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faSkype, faYoutube } from '@fortawesome/free-brands-svg-icons';
// import 'react-toastify/scss/main.scss';
import '~/components/Header/header.scss';
import '~/styles/dashforge.scss';
import '~/styles/styles.scss';
import '~/components/Layout/layout.scss';
import '~/styles/responsive.scss';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css';
import dynamic from 'next/dynamic';
import { getLayout } from '~/components/Layout';
import { appWithTranslation } from '~/i18n';
config.autoAddCss = false;
config.autoReplaceSvg = false;
library.add(fas, far, faSkype, faYoutube);
//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class MyApp extends App {
	static async getInitialProps({ Component, ctx }) {
		return {
			pageProps: {
				// Call page-level getInitialProps
				...(Component.getInitialProps
					? await Component.getInitialProps(ctx)
					: {}),
			},
		};
	}

	cacheURL = [];
	handleLoadStyle = (url) => {
		if (this.cacheURL.includes(url)) return;
		const els = document.querySelectorAll(
			'link[href*="/_next/static/css/styles.chunk.css"]',
		);
		const timestamp = new Date().valueOf();
		for (let i = 0; i < els.length; i++) {
			if (els[i].rel === 'stylesheet') {
				els[i].href = '/_next/static/css/styles.chunk.css?v=' + timestamp;
				console.log('Style loaded');
				this.cacheURL.push(url);
				break;
			}
		}
	};

	componentDidMount() {
		if (process.env.NODE_ENV !== 'production') {
			const axe = require('react-axe');
			axe(React, ReactDOM, 1000);
			Router.events.on('routeChangeComplete', this.handleLoadStyle);
		}
	}

	componentWillUnmount() {
		if (process.env.NODE_ENV !== 'production') {
			Router.events.off('routeChangeComplete', this.handleLoadStyle);
		}
	}

	render() {
		const { Component, pageProps } = this.props;
		const getLayout = Component.getLayout || ((page) => page);

		return (
			<>
				<Head>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
				</Head>
				{getLayout(
					typeof window !== 'undefined' ? <Component {...pageProps} /> : <></>,
				)}
			</>
		);
	}
}

MyApp.getInitialProps = async (appContext) => ({
	...(await App.getInitialProps(appContext)),
});

export default dynamic(() => Promise.resolve(appWithTranslation(MyApp)), {
	ssr: false,
});
