import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './tabs.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Tab extends Component {
	static propTypes = {
		activeTab: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired,
	};

	onClick = () => {
		const { label, onClick } = this.props;
		onClick(label);
	};

	render() {
		const {
			onClick,
			props: { activeTab, label },
		} = this;

		let className = 'tabs-list__item';

		if (activeTab === label) {
			className += ' active';
		}

		return (
			<button className={className} onClick={onClick} onKeyDown={onClick}>
				<p>
					{label?.toLowerCase() === 'trắc nghiệm' ? (
						<FontAwesomeIcon icon="edit" />
					) : (
						<FontAwesomeIcon icon="book-open" />
					)}
					{label}
				</p>
			</button>
		);
	}
}

export default Tab;
