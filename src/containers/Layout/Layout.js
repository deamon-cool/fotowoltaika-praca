import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import modifyFetchUrl from '../../functions/modifyFetchUrl';
import * as config from '../../config/config';
import * as text from '../../text/text';
import classes from './Layout.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Navside from '../../components/Navside/Navside';
import Button from '../../components/Button/Button';

function Layout(props) {
	const [showNavside, setShowNavside] = useState(false);
	const [cookies, setCookies] = useCookies(['agreeRuleAndPolicy']);
	const [publicInfo, setPublicInfo] = useState('');

	const componentMounted = useRef(false);

	useEffect(() => {
		componentMounted.current = true;

		const url = modifyFetchUrl(config.PUBLIC_INFORMATION_FETCH);
		const init = {
			method: 'GET',
			headers: { "Content-Type": "application/json" },
		};

		fetch(url, init)
			.then(res => res.json())
			.then(dataServer => {
				if (componentMounted.current) {

					if (dataServer.error) {
						return;
					}

					setPublicInfo(dataServer.publicInfo);
				}
			}).catch(e => { });

		return () => {
			componentMounted.current = false;
		};
	}, []);

	const clickHomeHandler = () => {
		sessionStorage.removeItem(config.PAGE_Y_OFFSET_SESSION_STORAGE);
		sessionStorage.removeItem(config.CLICKED_SEARCH_AFTER_SUCCESS_SELECT_SESSION_STORAGE);

		props.history.push('/');
	};

	const clickBarsHandler = (e) => {
		setShowNavside(true);
	};

	const clickToHideHandler = (e) => {
		setShowNavside(false);
	};

	const ruleHandler = () => {
		props.history.push(config.RULE_PATH_ROUTER);
	};

	const privacyHandler = () => {
		props.history.push(config.PRIVACY_PATH_ROUTER);
	};

	const acceptHandler = () => {
		setCookies('agreeRuleAndPolicy', 'yes', { path: '/' });
	};

	let footer = null;
	if (cookies.agreeRuleAndPolicy !== 'yes') {
		footer =
			<footer className={classes.Footer}>
				<div className={classes.FooterInfo}>{text.FOOTER_RULE_PRIVACY_INFO}</div>
				<Button
					customStyle={{ width: '150px', marginRight: '5px' }}
					clickHandler={ruleHandler}>
					{text.RULE_TEXT}
				</Button>
				<Button
					customStyle={{ width: '250px', marginRight: '20px' }}
					clickHandler={privacyHandler}>
					{text.PRIVACY_TEXT}
				</Button>
				<Button
					customStyle={{ width: '150px' }}
					clickHandler={acceptHandler}>
					{text.ACCEPT_TEXT}
				</Button>
			</footer>;
	}

	let publicInfoElement = null;
	if (publicInfo) {
		publicInfoElement = (
			<h2 className={classes.PublicInfo}>
				{publicInfo}
			</h2>
		);
	}

	return (
		<div className={classes.Layout}>
			<Navbar
				clickBarsHandler={clickBarsHandler}
				clickHomeHandler={clickHomeHandler}
				hideHomeButton={props.hideHomeButton} />
			<Navside
				show={showNavside}
				clickToHideHandler={clickToHideHandler} />
			<main className={classes.Main}>
				{publicInfoElement}
				{props.children}
			</main>
			{footer}
		</div>
	);
}

export default withRouter(Layout);