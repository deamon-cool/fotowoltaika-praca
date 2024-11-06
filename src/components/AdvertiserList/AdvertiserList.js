import React from 'react';

import getValidatedInputs from '../../functions/getValidatedInputs';
import { PROP_ERR } from '../../text/text';
import classes from './AdvertiserList.module.css';
import AdvertiserListItem from './AdvertiserListItem/AdvertiserListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function AdvertiserList(props) {
  let advertiserListItems = null;

  if (props.ads.length > 0) {
    advertiserListItems = props.ads.map(ad => {
      let imgSrc = '';
      if (ad.imgSrc !== '') {
        imgSrc = ad.imgSrc;
      }

      // validation
      const idKey = typeof ad.idKey === 'undefined' ? PROP_ERR : ad.idKey;

      const validatedInputs = getValidatedInputs(ad.inputs,
        ['position', 'positionMarker', 'minSalary', 'maxSalary', 'city', 'voivodeship',
          'companyName', 'workPlace', 'interviewPlace']);
      const position = validatedInputs.position.value;
      const minSalary = validatedInputs.minSalary.value;
      const maxSalary = validatedInputs.maxSalary.value;
      const city = validatedInputs.city.value;
      const workPlace = validatedInputs.workPlace.value;
      const interviewPlace = validatedInputs.interviewPlace.value;
      const companyName = validatedInputs.companyName.value;
      const positionMarker = validatedInputs.positionMarker.value;
      const voivodeship = validatedInputs.voivodeship.value;

      // setting clickedCheckbox
      let checkboxClicked = false;
      for (let j = 0; j < props.uiStates.length; j++) {
        const uiItemStates = props.uiStates[j];

        if (uiItemStates.idKey === ad.idKey) {
          checkboxClicked = uiItemStates.checkboxClicked;
        }
      }

      return <AdvertiserListItem
        key={idKey}
        idKey={idKey}
        clickHandler={() => props.clickHandler(idKey)}
        imgSrc={imgSrc}
        position={position}
        minSalary={minSalary}
        maxSalary={maxSalary}
        city={city}
        workPlace={workPlace}
        interviewPlace={interviewPlace}
        companyName={companyName}
        positionMarker={positionMarker}
        voivodeship={voivodeship}
        checkboxClicked={checkboxClicked}
        checkboxHandler={() => props.checkboxHandler(idKey)}
        editHandler={() => props.editHandler(idKey)} />;
    });
  }

  return (
    <div className={classes.AdvertiserList}>
      <div className={classes.CreateNewAd}
        onClick={props.createNewAdHandler} >
        <FontAwesomeIcon
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
          icon={faPlus}
          color='gray'
          size='7x' />
      </div>
      {advertiserListItems}
    </div>
  );
}

export default AdvertiserList;
