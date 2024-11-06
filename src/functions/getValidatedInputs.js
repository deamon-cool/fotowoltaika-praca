import * as text from '../text/text';

const getValidatedInputs = (notValidatedInputs, keysCheckArr) => {
  let validatedInputs = {};

  if (typeof notValidatedInputs === 'undefined') {

    for (let i = 0; i < keysCheckArr.length; i++) {
      const keyCheck = keysCheckArr[i];

      validatedInputs = {
        ...validatedInputs,
        [keyCheck]: {
          value: text.PROP_ERR
        }
      };
    }

    return validatedInputs;
  }

  keysCheckArr.forEach(keyCheck => {
    let valExist = false;
    for (let key in notValidatedInputs) {
      if (keyCheck === key) {
        valExist = true;
        break;
      }
    }

    let checkedValue = text.PROP_ERR;
    if (valExist) {
      if (typeof notValidatedInputs[keyCheck] !== 'undefined' &&
        typeof notValidatedInputs[keyCheck].value !== 'undefined') {
        checkedValue = notValidatedInputs[keyCheck].value;
      }
    }

    validatedInputs = {
      ...validatedInputs,
      [keyCheck]: {
        value: checkedValue
      }
    };
  });

  return validatedInputs;
};

export default getValidatedInputs;