import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import imageCompression from 'browser-image-compression';

import {
  setImage, setRawContentState, setInputs,

  selectImage, selectRawContentState, selectInputs
} from '../../store/reducers/newAdSlice';
import {
  setAdvertiserID, setEntryKey, setIdKeys,

  selectAdvertiserID, selectEntryKey, selectIdKeys
} from '../../store/reducers/advertiserSessionSlice';
import modifyFetchUrl from '../../functions/modifyFetchUrl';
import * as config from '../../config/config';
import * as text from '../../text/text';
import Ad from '../../components/Ad/Ad';
import classes from './NewAd.module.css';
import ToastBar from '../../components/ToastBar/ToastBar';
import Button from '../../components/Button/Button';
import ReCAPTCHA from 'react-google-recaptcha';

function NewAd(props) {
  const [clikedImageUploader, setClikedImageUploader] = useState(false);
  const [imageWarning, setImageWarning] = useState('');
  const [warning, setWarning] = useState('');
  const [info, setInfo] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [showReCaptcha, setShowReCaptcha] = useState(true);

  const componentMounted = useRef(false);

  //----------- variables from redux store
  // newAd date
  const image = useSelector(selectImage);
  const rawContentState = useSelector(selectRawContentState);
  const inputs = useSelector(selectInputs);

  // session
  const advertiserID = useSelector(selectAdvertiserID);
  const entryKey = useSelector(selectEntryKey);
  const idKeys = useSelector(selectIdKeys);
  //-----------

  const dispatch = useDispatch();


  const clickUploadImageHandler = (e) => {
    setClikedImageUploader(true);
  };

  useEffect(() => {
    componentMounted.current = true;

    window.scrollTo(0, 0);

    // set init editorState content
    const contentFromStore = convertFromRaw(rawContentState);
    const l_editorState = EditorState.createWithContent(contentFromStore);
    setEditorState(l_editorState);

    return () => {
      componentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setClikedImageUploader(false);
  }, [clikedImageUploader]);

  const uploadImageHandler = (e) => {
    const imageFile = e.target.files[0];

    if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/png') {
      const options = {
        maxSizeMB: config.MAX_SIZE_MB_COMPRESS,
        maxWidthOrHeight: config.MAX_WIDTH_OR_HEIGHT_COMPRESS,
      }

      imageCompression(imageFile, options)
        .then(async function (compressedImageFile) {
          if (componentMounted.current) {
            const imageBase64 = await convertFileToBase64(compressedImageFile);

            dispatch(setImage(imageBase64));

            setImageWarning('');
          }
        })
        .catch(error => {
          if (componentMounted.current) {
            setImageWarning(error.message);
          }
        });

      return;
    }

    setImageWarning(text.WARNING_IMAGE);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const clickCloseImageViewHandler = () => {
    dispatch(setImage(''));
  };

  const inputHandler = (e, inputName) => {
    dispatch(setInputs({ name: inputName, value: e.target.value }));
  };

  const editorStateHandler = (state) => {
    // save ContentState to store by converting editorState => ContentState => to raw js
    const l_currentContent = editorState.getCurrentContent();
    const l_rawContentState = convertToRaw(l_currentContent);
    dispatch(setRawContentState(l_rawContentState));

    setEditorState(state);
  }

  const sendAdHandler = (e) => {
    e.preventDefault();

    let inputsData = {};
    for (let key in inputs) {
      if (key === 'minSalary' || key === 'maxSalary') {
        // avoid checking value minSalary and maxSalary
      } else {
        if (inputs[key].value === '') {
          setWarning(text.WARNING_FILL_ALL_INPUTS);
          return;
        }
      }

      inputsData[key] = {
        value: inputs[key].value
      };
    }

    setWarning('');

    const content = convertToRaw(editorState.getCurrentContent());

    const data = {
      inputs: inputsData,
      editorContent: content,
      recaptchaToken: recaptchaToken,
      advertiserID: advertiserID,
      entryKey: entryKey
    };

    const url = modifyFetchUrl(config.NEWAD_PATH_FETCH);
    const init = {
      method: 'PUT',
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };

    fetch(url, init)
      .then(res => res.json())
      .then(dataServer => {
        if (componentMounted.current) {
          window.scrollTo(0, 0);

          if (dataServer.error) {
            if (dataServer.showReCaptcha) {
              setShowReCaptcha(dataServer.showReCaptcha);
            }

            setWarning(dataServer.error);
            return;
          }

          setWarning('');
          setInfo(dataServer.text);

          setShowReCaptcha(false);

          if (advertiserID !== dataServer.advertiserID || entryKey !== dataServer.entryKey) {
            dispatch(setAdvertiserID(dataServer.advertiserID));
            dispatch(setEntryKey(dataServer.entryKey));
          }

          dispatch(setIdKeys(dataServer.idKeys));

          if (image.length !== 0) {
            sendImageData(dataServer.idKey, dataServer.advertiserID, dataServer.entryKey);
          }
        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.WARNING_FETCH_INPUTS)
        }
      });
  };

  // send ad image
  const sendImageData = async (idKey, advID, entKey) => {
    // get blob obj from internal memory
    const imageBlob = await fetch(image).then(data => data.blob());

    let formData = new FormData();
    formData.append(config.IMAGE_NAME_SENT, imageBlob);

    const url = modifyFetchUrl(config.NEW_IMAGE_AD_FETCH + idKey);
    const init = {
      method: 'PUT',
      headers: {
        advertiserID: advID,
        entryKey: entKey
      },
      body: formData
    };

    fetch(url, init)
      .then(res => res.json())
      .then(dataServer => {
        if (componentMounted.current) {
          if (dataServer.error) {
            setWarning(dataServer.error);
            return;
          }

          setWarning('');
          setInfo(dataServer.text);
        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.WARNING_FETCH_IMAGE)
        }
      });
  }

  // advertiser info route
  const goToAdvertiserInfo = () => {
    props.history.push(config.EMPLOYER_HELP_PATH_ROUTER);
  };

  // advertiser panel route
  const goToAdvertiserPanelHandler = () => {
    props.history.push(config.ADVERTISER_PANEL_PUSH + '0');
  };

  // set token from recaptcha
  const recaptchaOnChange = (value) => {
    setRecaptchaToken(value);
  };

  // show reCAPTCHA
  let recaptcha = null;
  if (showReCaptcha) {
    recaptcha =
      <ReCAPTCHA
        style={{ margin: '30px auto 20px auto' }}
        sitekey={config.RECAPTCHA_CLIENT_SITE_KEY}
        onChange={recaptchaOnChange}
        hl='pl' />
  }

  // show advertiser panel button
  let advertiserPanelButton = null;
  if (idKeys.length > 0) {
    advertiserPanelButton = (
      <>
        <h1 className={classes.AdvertiserPanelTitle}>Dodane ogłoszenia({idKeys.length}):</h1>
        <div className={classes.AdsPanelInfo}>
          *Uwaga! Jeżeli zamkniesz stronę lub upłynie czas sesji (jednego dnia)
          to utracisz możliwość przeglądania/usuwania/edycji dodanych ogłoszeń.
        </div>
        <Button
          customStyle={{ width: '250px', margin: '0px auto 0 auto' }}
          clickHandler={goToAdvertiserPanelHandler}>
          Panel Ogłoszeń
        </Button>
      </>
    )
  }

  return (
    <div className={classes.NewAdContainer}>
      <ToastBar
        info={info}
        warning={warning}
        infoTimePassedHandler={() => setInfo('')}
        warningTimePassedHandler={() => setWarning('')} />
      {advertiserPanelButton}
      <Button
        customStyle={{ width: '250px', margin: '20px auto 0 auto' }}
        clickHandler={goToAdvertiserInfo}>
        Często zadawane pytania
      </Button>
      <Ad
        showImageView={image.length > 0 ? true : false}
        clickUploadImageHandler={clickUploadImageHandler}
        uploadImageHandler={uploadImageHandler}
        clikedImageUploader={clikedImageUploader}
        imageWarning={imageWarning}
        clickCloseImageViewHandler={clickCloseImageViewHandler}
        image={image}
        title={text.NEW_AD_TITLE}
        inputs={inputs}
        inputHandler={(e, name) => inputHandler(e, name)}
        editorStateHandler={(state) => editorStateHandler(state)}
        editorState={editorState} />
      {recaptcha}
      <div className={classes.Submit}>
        <Button
          customStyle={{ width: '200px' }}
          buttonType='submit'
          clickHandler={sendAdHandler}>
          Wyślij ogłoszenie
        </Button>
      </div>
    </div >
  );
}

export default withRouter(NewAd);