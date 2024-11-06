import React from 'react';

import classes from './AdvertiserListItem.module.css';
import Image from './Image/Image';
import Button from '../../Button/Button';
import CheckBox from '../../CheckBox/CheckBox';

function AdvertiserListItem(props) {
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

  return (
    <div className={classes.AdvertiserListItem}>
      <div className={classes.Row}>
        <CheckBox
          customStyle={{ height: '50px', margin: 'auto 10px auto 10px' }}
          iconSize='2x'
          clickHandler={props.checkboxHandler}
          clicked={props.checkboxClicked} />
        <Button
          customStyle={{ width: '200px', margin: '10px' }}
          clickHandler={props.editHandler}>
          Edytuj ogłoszenie
        </Button>
        <div className={classes.Marker}>
          Info: ogłoszenie będzie wyszukiwane dla pozycji <b>{props.positionMarker}</b> w woj.: <b>{props.voivodeship}</b>
        </div>
      </div>

      <div className={classes.Row}
        style={{
          cursor: 'pointer', padding: '15px 0 10px 0',
          borderTop: '2px solid rgb(226, 226, 226)'
        }}
        onClick={props.clickHandler}>
        <div className={classes.ImageContainer}>
          <Image imgSrc={props.imgSrc} />
        </div>
        <div className={classes.Column}>
          <div className={classes.MainInfoCol}>
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
    </div>
  );
}

export default AdvertiserListItem;