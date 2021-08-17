import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';

import './tabs.module.scss';

function calHeight() {
	let height = null;
	let scrWidth = window.screen.width;

	if (scrWidth > 992) {
		height = window.innerHeight - 200;
	}

	return height;
}

class Tabs extends Component {
	static propTypes = {
		children: PropTypes.instanceOf(Array).isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			activeTab: this.props.children[0].props.label,

			heightContentTab: calHeight(),
		};
	}

	updateHeight = () => {
		let scrWidth = window.screen.width;

		if (scrWidth > 992) {
			this.setState({
				heightContentTab: window.innerHeight - 200,
			});
		}
	};

	componentDidMount() {
		window.addEventListener('resize', this.updateHeight);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateHeight);
	}

	onClickTabItem = (tab) => {
		this.setState({ activeTab: tab });
		console.log('check là gì: ', this.state.check);
	};

	render() {
		const {
			onClickTabItem,
			props: { children },
			state: { activeTab, heightContentTab },
		} = this;

		return (
			<div className="tabs study__main--content">
				<div className="tabs-list">
					{children.map((child) => {
						const { label } = child.props;

						return (
							<Tab
								activeTab={activeTab}
								key={label}
								label={label}
								onClick={onClickTabItem}
							/>
						);
					})}
				</div>
				<div
					className="tab-content"
					style={{ height: heightContentTab + 'px' }}
				>
					{children.map((child) => {
						if (child.props.label !== activeTab) return undefined;

						return child.props.children;
					})}
				</div>
			</div>
		);
	}
}

export default Tabs;
