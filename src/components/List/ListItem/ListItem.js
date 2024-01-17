import React from 'react';

import classes from './ListItem.module.css';
import Image from './Image/Image';

function ListItem(props) {
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
    <div className={classes.ListItem}
      onClick={props.clickHandler}>
      <div className={classes.Row}>
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
    </div>
  );
}

export default ListItem;
