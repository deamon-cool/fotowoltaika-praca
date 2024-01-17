import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import modifyFetchUrl from '../../functions/modifyFetchUrl';
import classes from './Navigation.module.css';
import * as text from '../../text/text';
import * as config from '../../config/config';
import Button from '../../components/Button/Button';

function Navigation(props) {
	const [warning, setWarning] = useState('');

	const navigateHandler = (path) => {
		props.history.push(path);
	};

	// remove cookie handler
	const loginOutHandler = () => {
		const url = modifyFetchUrl(config.MY_PATH_L_OUT_FETCH);
		const init = {
			method: 'GET'
		};

		fetch(url, init)
			.then(res => res.json())
			.then(dataServer => {
				if (dataServer.logout) {
					props.history.push(config.MY_PATH_ROUTER);
				}
				console.log(dataServer)
			}).catch(e => {
				setWarning(text.CATCH_ERROR_FETCH);
			});
	};

	let warningDiv = null;
	if (warning) {
		warningDiv = (
			<div className={classes.Warning}>{warning} Odśwież stronę</div>
		);
	}

	return (
		<div className={classes.Navigation}>
			<h1>Panel</h1>
			{warningDiv}
			<Button
				customStyle={{ width: '200px', margin: '5px' }}
				clickHandler={() => navigateHandler(config.MY_GENERATE_POSTS_ROUTER)}>
				Generuj posty
			</Button>
			<Button
				customStyle={{ width: '250px', margin: '5px' }}
				clickHandler={() => navigateHandler(config.MY_CHECKADS_PATH_PUSH + '0/niepublikowane')}>
				Sprawdź ogłoszenia
			</Button>
			<Button
				customStyle={{ width: '250px', margin: '5px' }}
				clickHandler={() => navigateHandler(config.MY_PUBLIC_INFO_ROUTER)}>
				Edytuj publiczny post
			</Button>
			<Button
				customStyle={{ width: '150px', margin: '5px' }}
				clickHandler={loginOutHandler}>
				Wyloguj się
			</Button>
		</div>
	);
}

export default withRouter(Navigation);