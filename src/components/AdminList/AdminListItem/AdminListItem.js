import React, { useRef } from 'react';

import classes from './AdminListItem.module.css';
import Image from './Image/Image';
import Button from '../../Button/Button';
import ToggleButton from '../../ToggleButton/ToggleButton';
import CheckBox from '../../CheckBox/CheckBox';

function AdminListItem(props) {
  const textAreaRef = useRef(null);

  // copy handler
  const copyHandler = () => {
    navigator.clipboard.writeText(textAreaRef.current.value);
  }

  // defines salary
  let salary = `${props.minSalary} - ${props.maxSalary} zł`;

  if (props.maxSalary === props.minSalary) {
    salary = `${props.maxSalary} zł`;
  }
  if (props.maxSalary === '') {
    salary = `od ${props.minSalary} zł`;
  }
  if (props.minSalary === '') {
    salary = `do ${props.maxSalary} zł`;
  }
  if (props.maxSalary === '' && props.minSalary === '') {
    salary = '';
  }

  // changing publish elements style
  let buttonText = 'Publikuj';
  if (props.publish) {
    buttonText = 'Nie publikuj';
  }

  return (
    <div className={classes.AdminListItem}>
      <div className={classes.Row}>
        <CheckBox
          customStyle={{ height: '50px', marginLeft: '10px' }}
          iconSize='2x'
          clickHandler={props.checkboxHandler}
          clicked={props.checkboxClicked} />
        <textarea style={{ marginLeft: '20px' }} ref={textAreaRef} value={props.idKey} readOnly />
        <Button
          customStyle={{ width: '150px', marginLeft: '5px' }}
          clickHandler={copyHandler}>
          Kopiuj idKey
        </Button>
      </div>

      <div className={classes.Row}
        style={{
          cursor: 'pointer', padding: '5px 0 10px 0',
          margin: '15px 0 10px 0', borderTop: '2px solid rgb(226, 226, 226)',
          borderBottom: '2px solid rgb(226, 226, 226)'
        }}
        onClick={props.clickHandler}>
        <div className={classes.ImageContainer}>
          <Image imgSrc={props.imgSrc} />
        </div>
        <div className={classes.Column}>
          <div className={classes.MainInfoCol}>
            <div className={classes.AdInfo}>
              Data publikacji: {props.publicationDate}
            </div>
            <div className={classes.AdInfo}>
              {props.views} wyświetleń
            </div>
            <h3 className={classes.Position}>
              {props.position}
            </h3>
            <h3 className={classes.Salary}>{salary}</h3>
          </div>
          <div className={classes.InfoRow}>
            <div className={classes.Company}>
              {props.city}
            </div>
            <div className={classes.Place}>
              {props.workPlace}
            </div>
          </div>
          <div className={classes.MoreInfoRow}>
            <div className={classes.Company}>
              {props.companyName}
            </div>
            <div className={classes.Place}>
              {props.interviewPlace}
            </div>
          </div>
        </div>
      </div>

      <div className={classes.Column}>
        <div className={classes.Marker}>
          Ogłoszenie będzie wyszukiwane dla pozycji <b>{props.positionMarker}</b> w woj.: <b>{props.voivodeship}</b>
        </div>
        <div className={classes.Marker}>
          Utworzono/publikowano: {props.precizedDate}
        </div>
        <div className={classes.Row}>
          <ToggleButton
            customStyle={{ width: '150px', margin: '10px' }}
            clickHandler={props.publishHandler}
            clicked={props.publish}>
            {buttonText}
          </ToggleButton>
          <Button
            customStyle={{ width: '100px', margin: '10px' }}
            clickHandler={props.editHandler}>
            Edytuj
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminListItem;