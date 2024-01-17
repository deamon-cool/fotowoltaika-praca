import React from 'react';

import getValidatedInputs from '../../functions/getValidatedInputs';
import { PROP_ERR } from '../../text/text';
import classes from './AdminList.module.css';
import AdminListItem from './AdminListItem/AdminListItem';

function AdminList(props) {
  let adminListItems = null;

  if (props.ads.length > 0) {
    adminListItems = props.ads.map(ad => {
      let imgSrc = '';
      if (ad.imgSrc !== '') {
        imgSrc = ad.imgSrc;
      }

      // validation
      const idKey = typeof ad.idKey === 'undefined' ? PROP_ERR : ad.idKey;
      const publicationDate = typeof ad.publicationDate === 'undefined' ? PROP_ERR : ad.publicationDate;
      const views = typeof ad.views === 'undefined' ? PROP_ERR : ad.views;
      const date = typeof ad.date === 'undefined' ? PROP_ERR : ad.date;
      
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

      // setting publish and clickedCheckbox
      let publish = false;
      let checkboxClicked = false;
      for (let j = 0; j < props.uiStates.length; j++) {
        const uiItemStates = props.uiStates[j];

        if (uiItemStates.idKey === ad.idKey) {
          publish = uiItemStates.publish;
          checkboxClicked = uiItemStates.checkboxClicked;
        }
      }

      // get date and customize to display for admin
      const adDate = new Date(date);

      const hours = adDate.getHours().toString();
      const minutes = adDate.getMinutes().toString();
      const day = adDate.getDate().toString();
      const month = (adDate.getMonth() + 1).toString();
      const year = adDate.getFullYear().toString();

      let dateArray = [hours, minutes, day, month];
      let newDateArray = [];
      for (let i = 0; i < dateArray.length; i++) {
        let element = dateArray[i];
        element = element.length < 2 ? '0' + element : element;
        newDateArray.push(element);
      }

      const precisedDateString = newDateArray[0] + ':' + newDateArray[1] + ' / ' +
        newDateArray[2] + '.' + newDateArray[3] + '.' + year;

      return <AdminListItem
        key={idKey}
        idKey={idKey}
        clickHandler={() => props.clickHandler(idKey)}
        imgSrc={imgSrc}
        precizedDate={precisedDateString}
        publicationDate={publicationDate}
        views={views}
        position={position}
        minSalary={minSalary}
        maxSalary={maxSalary}
        city={city}
        workPlace={workPlace}
        interviewPlace={interviewPlace}
        companyName={companyName}
        positionMarker={positionMarker}
        voivodeship={voivodeship}
        publish={publish}
        checkboxClicked={checkboxClicked}
        checkboxHandler={() => props.checkboxHandler(idKey)}
        publishHandler={() => props.publishHandler(idKey)}
        editHandler={() => props.editHandler(idKey)} />;
    });
  }

  return (
    <div className={classes.AdminList}>
      {adminListItems}
    </div>
  );
}

export default AdminList;
