import React from 'react';
import { withRouter } from 'react-router-dom';

import classes from './Image.module.css';
import defaultImgSrc from '../../../../images/praca-img-text.jpg';

function Image(props) {
  let imgSrc = props.imgSrc;
  if (imgSrc === '') {
    imgSrc = defaultImgSrc;
  }

  return (
    <img
      className={classes.Image}
      src={imgSrc}
      alt='Obraz uszkodzony' >
    </img>
  );
}

export default withRouter(Image);
