import React, { useRef } from 'react';
import { Editor } from 'draft-js';

import getValidatedInputs from '../../functions/getValidatedInputs';
import classes from './Description.module.css';
import Image from '../List/ListItem/Image/Image';
import Button from '../Button/Button';
import LinkButton from '../LinkButton/LinkButton';

function Description(props) {
	const textAreaRef = useRef(null);

	// copy handler
	const copyHandler = () => {
		navigator.clipboard.writeText(textAreaRef.current.value);
	}

	// validation
	const validatedInputs = getValidatedInputs(props.ad.inputs,
		['position', 'minSalary', 'maxSalary', 'city', 'street',
			'companyName', 'agreementType', 'workPlace', 'interviewPlace', 'contact']);

	const position = validatedInputs.position.value;
	const minSalary = validatedInputs.minSalary.value;
	const maxSalary = validatedInputs.maxSalary.value;
	const city = validatedInputs.city.value;
	const workPlace = validatedInputs.workPlace.value;
	const interviewPlace = validatedInputs.interviewPlace.value;
	const companyName = validatedInputs.companyName.value;
	const street = validatedInputs.street.value;
	const agreementType = validatedInputs.agreementType.value;
	const contact = validatedInputs.contact.value;

	// defines salary
	let salary = `${minSalary} - ${maxSalary} zł`;
	if (maxSalary === '') {
		salary = `od ${minSalary} zł`;
	}
	if (minSalary === '') {
		salary = `do ${maxSalary} zł`;
	}
	if (maxSalary === '' && minSalary === '') {
		salary = '';
	}

	let applyButton = (
		<Button
			customStyle={{ width: '200px', margin: '20px auto' }}
			clickHandler={props.applyHandler}>
			Aplikuj
		</Button>
	);

	// check if it is a link
	let isLink = false;
	if (contact.includes('http') && contact.includes('://') && contact.includes('.')) {
		isLink = true;
		applyButton = (
			<LinkButton
				customStyle={{ width: '150px', margin: '20px auto' }}
				link={contact}>
				Aplikuj
			</LinkButton>
		);
	}

	const emailExample =
		`Dzień dobry,
Piszę w sprawie ogłoszenia o pracę znalezionego na stronie www.fotowoltaikapraca.pl
odnośnie stanowiska ${position} w lokalizacji ${city + ', ' + street}.
W załączniku przesyłam moje CV. Proszę o pozytywne rozpatrzenie mojej aplikacji.
Wyrażam zgodę na przetwarzanie moich danych osobowych w celach rekrutacyjnych.
Pozdrawiam,
Imię Nazwisko`;

	const emailDiv = (
		<div className={classes.EmailExample}>
			<h3>Chcesz aplikować ? Możesz posłużyć się przykładową treścią:</h3>
			<textarea ref={textAreaRef} value={emailExample} readOnly />
			<Button
				customStyle={{ width: '150px' }}
				clickHandler={copyHandler}>
				Kopiuj treść
			</Button>
		</div>
	);

	let emailDivWithLink = null;
	if (isLink) {
		emailDivWithLink = emailDiv;
	}

	let applyContainer = null;
	if (props.clickedApply) {
		applyButton = null;
		applyContainer = (
			<div className={classes.ApplyContainer}>
				<h3>Dane kontaktowe: {contact}</h3>
				{emailDiv}
			</div>
		);
	}

	return (
		<div className={classes.Description}>
			<div className={classes.DescriptionColumn}>
				<div className={classes.Row}>
					<div className={classes.ImageContainer}>
						<Image imgSrc={props.ad.imgSrc} />
					</div>
					<div className={classes.Column}>
						<div className={classes.MainInfoCol}>
							<h3 className={classes.Position}>
								{position}
							</h3>
							<h3 className={classes.Salary}>
								{salary}
							</h3>
							<div className={classes.Agreement}>
								{agreementType}
							</div>
						</div>
						<div className={classes.InfoRow}>
							<div className={classes.Company}>
								{companyName}
							</div>
							<div className={classes.Place}>
								{city + ', ' + street}
							</div>
						</div>
						<div className={classes.MoreInfoRow}>
							<div className={classes.Company}>
								{workPlace}
							</div>
							<div className={classes.Place}>
								{interviewPlace}
							</div>
						</div>
					</div>
				</div>
				<div className={classes.EditorContainer}>
					<Editor
						editorState={props.editorState}
						readOnly={true} />
				</div>
				{applyButton}
				{applyContainer}
				{emailDivWithLink}
			</div>
		</div>
	);
}

export default Description;