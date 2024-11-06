import React, { useEffect, useRef, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';

import modifyFetchUrl from '../../functions/modifyFetchUrl';
import * as text from '../../text/text';
import * as config from '../../config/config';
import classes from './Ads.module.css';
import List from '../../components/List/List';
import Information from '../../components/Information/Information';
import ToastBar from '../../components/ToastBar/ToastBar';
import ImageButton from '../../components/ImageButton/ImageButton';
import { faAngleRight, faAngleLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button/Button';
import BeatLoader from "react-spinners/BeatLoader";
import Select from '../../components/Select/Select';

function Ads(props) {
  const [warning, setWarning] = useState('');
  const [info, setInfo] = useState('');
  const [data, setData] = useState([]);
  const [adsLength, setAdsLength] = useState(0);
  const [adsPagesAmount, setAdsPagesAmount] = useState(0);
  const [loader, setLoader] = useState(true);
  const [panelStates, setPanelStates] = useState({
    positionMarker: {
      name: 'positionMarker',
      value: '',
      placeholder: '- (opcja) rodzaj pracy -'
    },
    voivodeship: {
      name: 'voivodeship',
      value: '',
      placeholder: '- (opcja) woj. -',
    }
  });

  const { pageParam, positionMarkerParam, voivodeshipParam } = useParams();

  const componentMounted = useRef(false);

  // fetch ads and ads length after refresh or first site load
  useEffect(() => {
    componentMounted.current = true;

    if (sessionStorage.getItem(config.CLICKED_SEARCH_AFTER_SUCCESS_SELECT_SESSION_STORAGE) === 'yes') {
      const updatedSelects = {
        positionMarker: {
          ...panelStates.positionMarker,
          value: positionMarkerParam
        },
        voivodeship: {
          ...panelStates.voivodeship,
          value: voivodeshipParam
        }
      };

      setPanelStates(updatedSelects);
    }

    getPublisehdAdsAmount();

    getAds(positionMarkerParam, voivodeshipParam,
      parseInt(pageParam) * config.LIMIT_DOWNLOADED_ADS, config.LIMIT_DOWNLOADED_ADS);

    return () => {
      componentMounted.current = false;
    };
  }, []);

  // get ads length from server
  const getPublisehdAdsAmount = async () => {
    const url = modifyFetchUrl(config.ADS_AMOUNT_FETCH + positionMarkerParam +
      '/' + voivodeshipParam);
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

          setWarning('');

          const adsPagesAmount = Math.ceil(dataServer.foundedAdsLength / config.LIMIT_DOWNLOADED_ADS);
          setAdsPagesAmount(adsPagesAmount);

          setAdsLength(dataServer.foundedAdsLength);
        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.WARNING_CANNOT_FETCH_ADS_AMOUNT);
        }
      });
  };

  // get ads from server
  const getAds = async (positionMarker, voivodeship, skippedDocs, limitDocs) => {
    const url = modifyFetchUrl(config.ADS_FETCH + positionMarker + '/' +
      voivodeship + '/' + skippedDocs + '/' + limitDocs);
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
          const serverAds = dataServer.ads;

          if (serverAds.length <= 0) {
            setInfo(text.EMPTY_ADS_ARRAY_TEXT);
            setLoader(false);
          } else {
            setInfo('');

            let newAds = [];
            for (let i = 0; i < serverAds.length; i++) {
              const ad = serverAds[i];

              newAds.push({
                ...ad,
                imgSrc: ''
              });
            }

            setData(newAds);

            window.scrollTo(0, sessionStorage.getItem(config.PAGE_Y_OFFSET_SESSION_STORAGE));

            sessionStorage.removeItem(config.PAGE_Y_OFFSET_SESSION_STORAGE);

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
    let newAds = [];

    for (let i = 0; i < ads.length; i++) {
      const ad = ads[i];

      if (ad.imageBlobName !== '') {
        const url = modifyFetchUrl(config.IMAGE_FETCH + ad.imageBlobName);
        const init = {
          method: 'GET',
        };

        await fetch(url, init)
          .then(res => {
            if (componentMounted.current) {

              if (res.status === 200) {
                newAds.push({
                  ...ad,
                  imgSrc: res.url
                });
              } else {
                newAds.push({
                  ...ad,
                  imgSrc: ''
                });
              }
            }
          })
          .catch(e => {
            // setInfo(text.INFO_CANNOT_FETCH_OFFER_IMAGE);
          });
      } else {
        newAds.push({
          ...ad,
          imgSrc: ''
        });
      }
    }

    if (componentMounted.current) {
      setData(newAds);
      setLoader(false);
    }
  };

  // search handler 
  const searchHandler = () => {
    if (panelStates.positionMarker.value === '' && panelStates.voivodeship.value === '') {
      setWarning(text.SELECT_SEARCH_WARNING);

      return;
    }

    let positionMarker = panelStates.positionMarker.value === '' ?
      'wszystkie' : panelStates.positionMarker.value;
    let voivodeship = panelStates.voivodeship.value === '' ?
      'wszystkie' : panelStates.voivodeship.value;

    sessionStorage.setItem(config.CLICKED_SEARCH_AFTER_SUCCESS_SELECT_SESSION_STORAGE, 'yes');

    props.history.push(config.ADS_PATH_PUSH + '0/' +
      positionMarker + '/' + voivodeship);

    window.location.reload();
  }

  // select handler
  const selectHandler = (e, selectName) => {
    const updatedSelects = {
      ...panelStates,
      [selectName]: {
        ...panelStates[selectName],
        value: e.target.value
      }
    };

    setPanelStates(updatedSelects);
  };

  // clicked Ad, get description container
  const clickHandler = (idKey) => {
    sessionStorage.setItem(config.PAGE_Y_OFFSET_SESSION_STORAGE, window.pageYOffset);
    props.history.push(config.AD_DESCRIPTION_PATH_PUSH + idKey);
  };

  // clicked next, download next ads
  const nextAdsHandler = () => {
    const l_page = parseInt(pageParam) + 1;
    if (l_page < adsPagesAmount) {
      sessionStorage.removeItem(config.PAGE_Y_OFFSET_SESSION_STORAGE);
      props.history.push(config.ADS_PATH_PUSH + l_page + '/' +
        positionMarkerParam + '/' + voivodeshipParam);

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
      props.history.push(config.ADS_PATH_PUSH + l_page + '/' +
        positionMarkerParam + '/' + voivodeshipParam);

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
    props.history.push(config.ADS_PATH_PUSH + pageButtonNum + '/' +
      positionMarkerParam + '/' + voivodeshipParam);

    window.location.reload();
  };

  // create buttons ads pages
  let listOfAdsButtonPages = null;
  if (adsPagesAmount > 0) {
    listOfAdsButtonPages = generateButtonsAdsPages(adsPagesAmount);
  }

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

  return (
    <div className={classes.Ads}>
      <ToastBar
        info={info}
        warning={warning}
        infoTimePassedHandler={() => setInfo('')}
        warningTimePassedHandler={() => setWarning('')} />
      {beatLoader}
      <Information
        customStyle={{ padding: '10px' }}
        title={'Znaleziono ofert pracy: ' + adsLength} />
      <div className={classes.Panel}>
        <Select
          customStyle={{ width: '300px', margin: '10px' }}
          options={text.WORK_POSITIONS_SEARCH_ARR}
          name={panelStates.positionMarker.name}
          selectChange={(e) => selectHandler(e, panelStates.positionMarker.name)}
          value={panelStates.positionMarker.value}
          placeholder={panelStates.positionMarker.placeholder} />
        <div className={classes.PanelRow}>
          <Select
            customStyle={{ width: '250px', margin: '10px' }}
            options={text.VOIVODESHIP_SEARCH_ARR}
            name={panelStates.voivodeship.name}
            selectChange={(e) => selectHandler(e, panelStates.voivodeship.name)}
            value={panelStates.voivodeship.value}
            placeholder={panelStates.voivodeship.placeholder} />
          <ImageButton
            customStyle={{ margin: '10px' }}
            clickHandler={searchHandler}
            icon={faSearch}
            iconSize='2x' />
        </div>
      </div>
      <List
        ads={data}
        clickHandler={(idKey) => clickHandler(idKey)} />
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
  );
}

export default withRouter(Ads);
