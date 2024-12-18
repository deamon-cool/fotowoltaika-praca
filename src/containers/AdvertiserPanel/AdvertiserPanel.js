import React, { useEffect, useRef, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  setIdKeys,

  selectAdvertiserID, selectEntryKey, selectIdKeys
} from '../../store/reducers/advertiserSessionSlice';
import modifyFetchUrl from '../../functions/modifyFetchUrl';
import * as text from '../../text/text';
import * as config from '../../config/config';
import classes from './AdvertiserPanel.module.css';
import AdvertiserList from '../../components/AdvertiserList/AdvertiserList';
import ToastBar from '../../components/ToastBar/ToastBar';
import PopUpWindow from '../../components/PopUpWindow/PopUpWindow';
import Button from '../../components/Button/Button';
import ImageButton from '../../components/ImageButton/ImageButton';
import BeatLoader from "react-spinners/BeatLoader";
import Information from '../../components/Information/Information';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faAngleLeft, faAngleRight, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';

function AdvertiserPanel(props) {
  const [warning, setWarning] = useState('');
  const [info, setInfo] = useState('');
  const [data, setData] = useState([]);
  const [adsPagesAmount, setAdsPagesAmount] = useState(0);
  const [uiStates, setUiStates] = useState([]);
  const [showPopUpDeleteAsk, setShowPopUpDeleteAsk] = useState(false);
  const [loader, setLoader] = useState(true);

  const componentMounted = useRef(false);

  const { pageParam } = useParams();

  // session
  const advertiserID = useSelector(selectAdvertiserID);
  const entryKey = useSelector(selectEntryKey);
  const idKeys = useSelector(selectIdKeys);
  //-----------

  const dispatch = useDispatch();

  // run before container load
  useEffect(() => {
    componentMounted.current = true;

    const adsPagesAmount = Math.ceil(idKeys.length / config.LIMIT_DOWNLOADED_ADS);
    setAdsPagesAmount(adsPagesAmount);

    getAds(parseInt(pageParam) * config.LIMIT_DOWNLOADED_ADS, config.LIMIT_DOWNLOADED_ADS);

    return () => {
      componentMounted.current = false;
    }
  }, []);

  // fetch ads
  const getAds = (skippedDocs, limitDocs) => {
    const url = modifyFetchUrl(config.ADVERTISER_PANEL_FETCH + skippedDocs + '/' + limitDocs);

    const init = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        advertiserID: advertiserID,
        entryKey: entryKey
      }
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
          dispatch(setIdKeys(dataServer.idKeys));

          if (dataServer.ads.length <= 0) {
            setLoader(false);
            setInfo(text.EMPTY_ADS_ARRAY_TEXT);
          } else {
            setInfo('');

            let newAds = [...dataServer.ads];
            let newUiStates = [];

            for (let i = 0; i < newAds.length; i++) {
              const newAd = newAds[i];
              newAd.imgSrc = '';

              newUiStates.push({
                idKey: newAd.idKey,
                checkboxClicked: false
              });
            }

            setData(newAds);
            setUiStates(newUiStates);

            window.scrollTo(0, sessionStorage.getItem(config.CHECK_ADS_PAGE_Y_OFFSET_SESSION_STORAGE));
            sessionStorage.removeItem(config.CHECK_ADS_PAGE_Y_OFFSET_SESSION_STORAGE);

            fetchImages(newAds);
          }

        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.WARNING_CANNOT_FETCH_ADS);
        }
      });
  };

  // fetch images
  const fetchImages = async (ads) => {
    let newAds = [...ads];
    for (let i = 0; i < newAds.length; i++) {
      const newAd = newAds[i];

      if (newAd.imageBlobName !== '') {
        const url = modifyFetchUrl(config.IMAGE_FETCH + newAd.imageBlobName);
        const init = {
          method: 'GET'
        };

        await fetch(url, init)
          .then(res => {
            if (componentMounted.current) {
              if (res.status === 200) {
                newAd.imgSrc = res.url;
              } else {
                newAd.imgSrc = '';
              }
            }
          })
          .catch(e => {
            // setInfo(text.INFO_CANNOT_FETCH_OFFER_IMAGE);
          });
      } else {
        newAd.imgSrc = '';
      }
    }

    if (componentMounted.current) {
      setData(newAds);
      setLoader(false);
    }
  };

  const goToNewAdHandler = () => {
    props.history.push(config.NEWAD_PATH_ROUTER);
  };

  // show description if exist
  const clickHandler = (idKey) => {
    sessionStorage.setItem(config.CHECK_ADS_PAGE_Y_OFFSET_SESSION_STORAGE, window.pageYOffset);
    props.history.push(config.AD_DESCRIPTION_PATH_PUSH + idKey);
  };

  // edit handler
  const clickEditHandler = (idKey) => {
    sessionStorage.setItem(config.CHECK_ADS_PAGE_Y_OFFSET_SESSION_STORAGE, window.pageYOffset);

    for (let i = 0; i < data.length; i++) {
      const ad = data[i];
      if (ad.idKey === idKey) {
        props.history.push(config.EDITADVERTISERAD_PATH_PUSH + idKey);

        break;
      }
    }
  };

  // checkbox handler
  const clickCheckboxHandler = (idKey) => {
    let newUiStates = [...uiStates];

    for (let i = 0; i < newUiStates.length; i++) {
      let newUiState = newUiStates[i];  // copy reference to the same object

      if (newUiState.idKey === idKey) {
        newUiState.checkboxClicked = !newUiState.checkboxClicked;
      }
    }

    setUiStates(newUiStates);
  };

  // select all ads handler
  const selectAllHandler = () => {
    let newUiStates = [...uiStates];

    for (let i = 0; i < newUiStates.length; i++) {
      let newUiState = newUiStates[i];

      newUiState.checkboxClicked = true;
    }

    setUiStates(newUiStates);
  };

  // cancel select all
  const cancelSelectAll = () => {
    let newUiStates = [...uiStates];

    for (let i = 0; i < newUiStates.length; i++) {
      let newUiState = newUiStates[i];

      newUiState.checkboxClicked = false;
    }

    setUiStates(newUiStates);
  }

  // show delete ad pop up
  const clickDeleteAllSelected = () => {
    setInfo('');
    setWarning('');

    setShowPopUpDeleteAsk(true);
  };

  // hide delete ad pop up acknowledge window
  const hideDeletePopUp = () => {
    setShowPopUpDeleteAsk(false);
  };

  // delete ad on server
  const yesDeleteSelectedAdsHandler = () => {
    const url = modifyFetchUrl(config.ADVERTISER_DELETE_ADS_FETCH);

    let selectedIdKeys = [];
    for (let i = 0; i < uiStates.length; i++) {
      const uiItemStates = uiStates[i];

      if (uiItemStates.checkboxClicked) {
        selectedIdKeys.push(uiItemStates.idKey);
      }
    }

    if (selectedIdKeys.length === 0) {
      setShowPopUpDeleteAsk(false);
      setWarning('Nie zaznaczono żadnych ogłoszeń do usunięcia.');
      return;
    }

    const data = {
      idKeys: selectedIdKeys
    };

    const init = {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        advertiserID: advertiserID,
        entryKey: entryKey
      },
      body: JSON.stringify(data)
    };

    fetch(url, init)
      .then(res => res.json())
      .then(dataServer => {
        if (componentMounted.current) {
          if (dataServer.error) {
            setWarning(dataServer.error);

            return;
          }

          dispatch(setIdKeys(dataServer.idKeys));
          setInfo(dataServer.text);
          window.location.reload();
        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.CATCH_ERROR_FETCH);
        }
      });

    setShowPopUpDeleteAsk(false);
  };

  // return to list from description
  const returnHandler = () => {
    props.history.push(config.NEWAD_PATH_ROUTER);
  };

  // clicked next, download next ads
  const nextAdsHandler = () => {
    const l_page = parseInt(pageParam) + 1;
    if (l_page < adsPagesAmount) {
      sessionStorage.removeItem(config.PAGE_Y_OFFSET_SESSION_STORAGE);
      props.history.push(config.ADVERTISER_PANEL_PUSH + l_page);

      window.location.reload();

      return;
    }

    setInfo(text.NEXT_ADS_HANDLER_INFO_TEXT);
  };

  // clicked previous, download previous ads
  const previousAdsHandler = () => {
    const l_page = parseInt(pageParam) - 1;
    if (l_page >= 0) {
      sessionStorage.removeItem(config.PAGE_Y_OFFSET_SESSION_STORAGE);
      props.history.push(config.ADVERTISER_PANEL_PUSH + l_page);

      window.location.reload();

      return;
    }

    setInfo(text.PREVIOUS_ADS_HANDLER_INFO_TEXT);
  };

  // generate buttons pages
  const generateButtonsAdsPages = (pages) => {
    let arrayPages = [];
    for (let i = 0; i < pages; i++) {
      arrayPages.push(i);
    }

    const pagesButtons = arrayPages.map(page => {
      return <Button
        key={page}
        clickHandler={() => clickButtonPageHandler(page)}>{page}</Button>
    });

    return pagesButtons;
  };

  // handle button page handler
  const clickButtonPageHandler = (pageButtonNum) => {
    if (pageButtonNum === parseInt(pageParam)) {
      return;
    }

    sessionStorage.removeItem(config.PAGE_Y_OFFSET_SESSION_STORAGE);
    props.history.push(config.ADVERTISER_PANEL_PUSH + pageButtonNum);

    window.location.reload();
  };

  // create buttons ads pages
  let listOfAdsButtonPages = null;
  if (adsPagesAmount > 0) {
    listOfAdsButtonPages = generateButtonsAdsPages(adsPagesAmount);
  }

  // show pop up window: 'are u sure u want delete ad'
  let popUpDeleteAcknowledge = null;
  if (showPopUpDeleteAsk) {
    popUpDeleteAcknowledge =
      <PopUpWindow
        show={true}
        clickToHideHandler={hideDeletePopUp}
        noHandler={hideDeletePopUp}
        yesHandler={yesDeleteSelectedAdsHandler}>
        {text.DELETE_AD_POPUP_ACK}
      </PopUpWindow>;
  }

  // loader
  let beatLoader = null;
  if (loader) {
    beatLoader = (
      <BeatLoader
        color='orange'
        css='position: fixed; 
        margin-top: 150px;left: 50%;
        transform: translateX(-50%);' />
    );
  }

  return (
    <div>
      <div className={classes.AdvertiserPanel}>
        <ToastBar
          customInfoStyle={{ top: '129px' }}
          customWarningStyle={{ top: '167px' }}
          info={info}
          warning={warning}
          infoTimePassedHandler={() => setInfo('')}
          warningTimePassedHandler={() => setWarning('')} />
        <div className={classes.Panel}>
          <ImageButton
            customStyle={{ margin: 'auto 5px auto auto' }}
            clickHandler={selectAllHandler}
            icon={faCheckSquare}
            iconSize='2x' />
          <ImageButton
            customStyle={{ marginRight: '50px' }}
            clickHandler={cancelSelectAll}
            icon={faSquare}
            iconSize='2x' />
          <ImageButton
            customStyle={{ marginRight: 'auto' }}
            clickHandler={clickDeleteAllSelected}
            icon={faTrashAlt}
            iconSize='2x' />
        </div>
        <FontAwesomeIcon
          className={classes.Return}
          icon={faArrowLeft}
          color='gray'
          size='3x'
          onClick={returnHandler} />
        <Information
          customStyle={{ padding: '10px', marginTop: '100px' }}
          title={'Wszystkich ogłoszeń: ' + idKeys.length} />
        {beatLoader}
        <AdvertiserList
          ads={data}
          uiStates={uiStates}
          createNewAdHandler={goToNewAdHandler}
          clickHandler={(idKey) => clickHandler(idKey)}
          checkboxHandler={(idKey) => clickCheckboxHandler(idKey)}
          editHandler={(idKey) => clickEditHandler(idKey)} />
        {popUpDeleteAcknowledge}
        <div className={classes.Row}>
          <ImageButton
            clickHandler={previousAdsHandler}
            icon={faAngleLeft}
            iconSize='3x'
            hide={false} />
          <div className={classes.PageNumber}>
            <h3>{pageParam}</h3>
          </div>
          <ImageButton
            clickHandler={nextAdsHandler}
            icon={faAngleRight}
            iconSize='3x'
            hide={false} />
        </div>
        <div className={classes.Pages}>
          {listOfAdsButtonPages}
        </div>
      </div>
    </div>
  );
}

export default withRouter(AdvertiserPanel);
