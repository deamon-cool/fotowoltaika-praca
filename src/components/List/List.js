import React from 'react';

import getValidatedInputs from '../../functions/getValidatedInputs';
import { PROP_ERR } from '../../text/text';
import classes from './List.module.css';
import ListItem from './ListItem/ListItem';

function List(props) {
	let listItems = null;

	if (props.ads.length > 0) {
		listItems = props.ads.map(ad => {
			let imgSrc = '';
			if (ad.imgSrc !== '') {
				imgSrc = ad.imgSrc;
			}

			// validation
			const idKey = typeof ad.idKey === 'undefined' ? PROP_ERR : ad.idKey;
			const publicationDate = typeof ad.publicationDate === 'undefined' ? PROP_ERR : ad.publicationDate;
			const views = typeof ad.views === 'undefined' ? PROP_ERR : ad.views;

			const validatedInputs = getValidatedInputs(ad.inputs,
				['position', 'minSalary', 'maxSalary', 'city', 'companyName', 'workPlace', 'interviewPlace']);
			const position = validatedInputs.position.value;
			const minSalary = validatedInputs.minSalary.value;
			const maxSalary = validatedInputs.maxSalary.value;
			const city = validatedInputs.city.value;
			const workPlace = validatedInputs.workPlace.value;
			const interviewPlace = validatedInputs.interviewPlace.value;
			const companyName = validatedInputs.companyName.value;

			return <ListItem
				key={idKey}
				clickHandler={() => props.clickHandler(idKey)}
				imgSrc={imgSrc}
				publicationDate={publicationDate}
				views={views}
				position={position}
				minSalary={minSalary}
				maxSalary={maxSalary}
				city={city}
				workPlace={workPlace}
				interviewPlace={interviewPlace}
				companyName={companyName} />;
		});
	}

	return (
		<div className={classes.List}>
			{listItems}
		</div>
	);
}

export default List;