import React from 'react';
import { getLayout } from '~/components/Layout';
import Home from '~/pages/teacher/home';
import Link from 'next/link';
const Index = () => (
	<div
		className="d-flex flex-column align-items-center justify-content-center"
		style={{
			height: 'var(--app-height)',
			background:
				'url(https://ahitcorp.net/wp-content/uploads/2019/12/BACKGROUND-3.png) no-repeat center center ',
			backgroundSize: 'cover',
		}}
	>
		<div className="box">
			<h1 className="tx-white tx-center tx-32 mg-b-0">Choose one role</h1>
			<div className="d-flex mg-t-15 flex-wrap">
				<Link href="/student">
					<a
						href={true}
						className="btn btn-info btn-lg tx-16 pd-x-20 pd-y-10 mg-20"
					>
						Student layout
					</a>
				</Link>
				<Link href="/teacher">
					<a
						href={true}
						className="btn btn-warning btn-lg tx-16 pd-x-20 pd-y-10 mg-20"
					>
						Teacher layout
					</a>
				</Link>
			</div>
		</div>
	</div>
);

export default Index;
