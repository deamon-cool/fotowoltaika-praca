import React, { useEffect } from 'react';

import * as config from '../../config/config';
import Info from './Info/Info';
import Warning from './Warning/Warning';
import classes from './ToastBar.module.css';

function ToastBar(props) {
	const info = props.info;
	const warning = props.warning;
	const infoTimePassed = props.infoTimePassedHandler;
	const warningTimePassed = props.warningTimePassedHandler;

	// shows main info
	let informationElement = null;
	if (info !== '') {
		informationElement = (
			<Info customStyle={props.customInfoStyle}>{info}</Info>
		);
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			infoTimePassed();
		}, config.INFO_TIME_SEK * 1000);

		return () => clearTimeout(timer);
	}, [info]);


	// shows main warning
	let warningElement = null;
	if (warning !== '') {
		warningElement = (
			<Warning customStyle={props.customWarningStyle}>{warning}</Warning>
		);
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			warningTimePassed();
		}, config.WARNING_TIME_SEK * 1000);

		return () => clearTimeout(timer)
	}, [warning]);

	return (
		<div className={classes.ToastBar}>
			{informationElement}
			{warningElement}
		</div>
	);
}

export default ToastBar;