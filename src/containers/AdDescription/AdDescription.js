import React, { useState, useEffect, useRef } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { EditorState, convertFromRaw } from 'draft-js';

import classes from './AdDescription.module.css';
import modifyFetchUrl from '../../functions/modifyFetchUrl';
import * as text from '../../text/text';
import * as config from '../../config/config';
import ToastBar from '../../components/ToastBar/ToastBar';
import Description from '../../components/Description/Description';
import BeatLoader from "react-spinners/BeatLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function AdDescription(props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [ad, setAd] = useState(null);
  const [warning, setWarning] = useState('');
  const [info, setInfo] = useState('');
  const [loader, setLoader] = useState(true);
  const [clickedApply, setClickedApply] = useState(false);

  const { idKeyParam } = useParams();

  const componentMounted = useRef(false);

  // fetch ad
  useEffect(() => {
    componentMounted.current = true;

    window.scrollTo(0, 0);

    const url = modifyFetchUrl(config.AD_FETCH + idKeyParam);
    const init = {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
    };

    fetch(url, init)
      .then(res => res.json())
      .then(dataServer => {
        if (componentMounted.current) {

          if (dataServer.error) {
            setWarning(dataServer.error);
            return;
          }

          setWarning('')
          const serverAd = dataServer.ad;

          if (serverAd === null) {
            setInfo(text.INFO_CANNOT_FETCH_AD);
          } else {
            setInfo('');

            const newAd = {
              ...serverAd,
              imgSrc: ''
            };

            setAd(newAd);
            fetchImage(newAd);
          }

        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.WARNING_CANNOT_FETCH_AD);
        }
      });

    return () => {
      componentMounted.current = false;
    };
  }, []);

  const fetchImage = async (ad) => {
    let newAd = {};

    if (ad.imageBlobName !== '') {
      const url = modifyFetchUrl(config.IMAGE_FETCH + ad.imageBlobName);
      const init = {
        method: 'GET',
      };

      await fetch(url, init)
        .then(res => {
          if (componentMounted.current) {

            if (res.status === 200) {
              newAd = {
                ...ad,
                imgSrc: res.url
              };
            } else {
              newAd = {
                ...ad,
                imgSrc: ''
              };
            }

          }
        })
        .catch(e => {
          // setInfo(text.INFO_CANNOT_FETCH_OFFER_IMAGE);
        });
    } else {
      newAd = {
        ...ad,
        imgSrc: ''
      };
    }

    if (componentMounted.current) {
      setAd(newAd)
      downloadDescription();
    }
  };

  // download description (editorContent)
  const downloadDescription = () => {
    const url = modifyFetchUrl(config.DESCRIPTION_FETCH + idKeyParam);
    const init = {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
    };

    fetch(url, init)
      .then(res => res.json())
      .then(dataServer => {
        if (componentMounted.current) {

          if (dataServer.error) {
            setWarning(dataServer.error);
            return;
          }

          if (dataServer.text) {
            setInfo(dataServer.text);
            return;
          }

          const contentFromStore = convertFromRaw(dataServer.editorContent);
          const initialEditorState = EditorState.createWithContent(contentFromStore);

          setEditorState(initialEditorState);

          setLoader(false);
        }
      }).catch(e => {
        console.log(e)
        if (componentMounted.current) {
          setWarning(text.WARNING_CANNOT_FETCH_DESCRIPTION);
        }
      });
  };


  // return to list from description
  const returnHandler = () => {
    props.history.goBack();
  };

  // click apply handler to show applying text
  const clickApplyHandler = () => {
    setClickedApply(true);
  };

  // loader
  let beatLoader = null;
  if (loader) {
    beatLoader = (
      <BeatLoader
        color='orange'
        css='position: fixed; 
           margin-top: 100px;left: 50%;
           transform: translateX(-50%);' />
    );
  }

  let description = null;
  if (ad) {
    description =
      <Description
        ad={ad}
        editorState={editorState}
        applyHandler={clickApplyHandler}
        clickedApply={clickedApply} />;
  }

  return (
    <div className={classes.AdDescription}>
      <ToastBar
        info={info}
        warning={warning}
        infoTimePassedHandler={() => setInfo('')}
        warningTimePassedHandler={() => setWarning('')} />
      <FontAwesomeIcon
        className={classes.Return}
        icon={faArrowLeft}
        color='gray'
        size='3x'
        onClick={returnHandler} />
      {beatLoader}
      {description}
    </div>
  );
}

export default withRouter(AdDescription);