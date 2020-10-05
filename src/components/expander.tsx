import React, { useState } from 'react';

interface ExpanderState {
	isExpanded: boolean;
};

interface Props {
	headline: string;
};

const Expander: React.FunctionComponent<Props> = ({children, headline}) => {
	const defaultExpanderState = {
		isExpanded: false
	};

	const [expanderState, setExpanderState] = useState<ExpanderState>(defaultExpanderState);
	
	const toggleExpanded = () => {
		setExpanderState({isExpanded: !expanderState.isExpanded});
	};
 
	const getClasses = () => {
		return [
			'expander',
			expanderState.isExpanded ? 'expanded' : ''
		].join(' ');
	};

	const getIconClass = (): string => expanderState.isExpanded ? 'fa-chevron-up' : 'fa-chevron-down';

	return (
		<div className={getClasses()}>
			<div onClick={() => toggleExpanded()} className="text-large pointer flex space-between">
				<span>{headline}</span> <i className={`fa ${getIconClass()}`} />
				</div>
			<div className="content">
				{children}
			 </div>
		</div>
	);
};

export default Expander;