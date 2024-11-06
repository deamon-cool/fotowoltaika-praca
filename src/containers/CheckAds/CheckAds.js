import React, { useEffect, useRef, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';

import modifyFetchUrl from '../../functions/modifyFetchUrl';
import * as text from '../../text/text';
import * as config from '../../config/config';
import computeSessionTimeLeft from '../../functions/computeSessionTimeLeft';
import classes from './CheckAds.module.css';
import AdminList from '../../components/AdminList/AdminList';
import ToastBar from '../../components/ToastBar/ToastBar';
import PopUpWindow from '../../components/PopUpWindow/PopUpWindow';
import Button from '../../components/Button/Button';
import ImageButton from '../../components/ImageButton/ImageButton';
import BeatLoader from "react-spinners/BeatLoader";
import Information from '../../components/Information/Information';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faAngleLeft, faAngleRight, faSearch, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';

function CheckAds(props) {
  const [warning, setWarning] = useState('');
  const [info, setInfo] = useState('');
  const [data, setData] = useState([]);
  const [adsLength, setAdsLength] = useState(0);
  const [adsPagesAmount, setAdsPagesAmount] = useState(0);
  const [uiStates, setUiStates] = useState([]);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(computeSessionTimeLeft());
  const [showPopUpDeleteAsk, setShowPopUpDeleteAsk] = useState(false);
  const [loader, setLoader] = useState(true);
  const [searchedIdKey, setSearchedIdKey] = useState('');

  const componentMounted = useRef(false);

  const { pageParam, publishParam } = useParams();

  // run before container load
  useEffect(() => {
    componentMounted.current = true;

    getAdsAmount();
    getAds(parseInt(pageParam) * config.LIMIT_DOWNLOADED_ADS, config.LIMIT_DOWNLOADED_ADS);

    return () => {
      componentMounted.current = false;
    }
  }, []);

  // get ads length from server
  const getAdsAmount = async () => {
    const url = modifyFetchUrl(config.MY_ADS_AMOUNT_FETCH + publishParam);
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

  // fetch ads
  const getAds = (skippedDocs, limitDocs) => {
    const url = modifyFetchUrl(config.MY_CHECKADS_FETCH + publishParam + '/' +
      skippedDocs + '/' + limitDocs);
    const init = {
      method: 'GET',
      credentials: 'include',
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

          if (dataServer.allAds.length <= 0) {
            setInfo(text.EMPTY_ADS_ARRAY_TEXT);
          } else {
            setInfo('');

            let newAds = [...dataServer.allAds];
            let newUiStates = [];

            for (let i = 0; i < newAds.length; i++) {
              const newAd = newAds[i];
              newAd.imgSrc = '';

              newUiStates.push({
                idKey: newAd.idKey,
                publish: newAd.publish,
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
          method: 'GET',
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

  // show description if exist
  const clickHandler = (idKey) => {
    sessionStorage.setItem(config.CHECK_ADS_PAGE_Y_OFFSET_SESSION_STORAGE, window.pageYOffset);
    props.history.push(config.AD_DESCRIPTION_PATH_PUSH + idKey);
  };

  // set publish button handler
  const clickPublishHandler = (idKey) => {
    let dataForServer = {};

    for (let i = 0; i < uiStates.length; i++) {
      const uiItemStates = uiStates[i];

      if (uiItemStates.idKey === idKey) {
        dataForServer = {
          idKey: idKey,
          publish: !uiItemStates.publish
        };
      }
    }

    const url = modifyFetchUrl(config.MY_CHECKADS_PUBLISH_FETCH);

    const init = {
      method: 'POST',
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataForServer)
    };

    fetch(url, init)
      .then(res => res.json())
      .then(dataServer => {
        if (componentMounted.current) {
          if (dataServer.error) {
            setWarning(dataServer.error);

            return;
          }

          // update date in data
          let newAds = [...data]
          for (let i = 0; i < newAds.length; i++) {
            const newAd = newAds[i];

            if (newAd.idKey === idKey) {
              newAd.date = dataServer.date;
            }
          }

          setData(newAds);

          // update publish in uiStates
          let newUiStates = [...uiStates]
          for (let j = 0; j < newUiStates.length; j++) {
            let newUiState = newUiStates[j]; // copy reference to the same object

            if (newUiState.idKey === idKey) {
              newUiState.publish = dataServer.publish;
            }
          }

          setUiStates(newUiStates);

          setWarning('');
          setInfo(dataServer.text);
        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.CATCH_ERROR_FETCH)
        }
      });
  };

  // edit handler
  const clickEditHandler = (idKey) => {
    sessionStorage.setItem(config.CHECK_ADS_PAGE_Y_OFFSET_SESSION_STORAGE, window.pageYOffset);

    for (let i = 0; i < data.length; i++) {
      const ad = data[i];
      if (ad.idKey === idKey) {
        props.history.push(config.EDITAD_PATH_PUSH + idKey);

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
    const url = modifyFetchUrl(config.MY_EDITAD_DELETE_AD_FETCH);

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
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
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

          setInfo(dataServer.text);
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
    props.history.push(config.MY_NAVIGATION_PATH_ROUTER);
  };

  // select search handler
  const selectHandler = (e) => {
    const l_publishParam = e.target.value;
    props.history.push(config.MY_CHECKADS_PATH_PUSH + '0/' + l_publishParam);
    window.location.reload();
  };

  // idkey search
  const inputIdKeyHandler = (e) => {
    setSearchedIdKey(e.target.value)
  };

  // search idKey handler
  const searchHandler = () => {
    const url = modifyFetchUrl(config.AD_FETCH + searchedIdKey);
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
          const serverAd = dataServer.ad;

          if (serverAd === null) {
            setInfo(text.INFO_CANNOT_FETCH_AD);
          } else {
            setInfo('');

            serverAd.imgSrc = '';
            let newAds = [serverAd];
            let newUiStates = [
              {
                idKey: serverAd.idKey,
                publish: serverAd.publish,
                checkboxClicked: false
              }
            ];

            setData(newAds);
            setUiStates(newUiStates);

            sessionStorage.removeItem(config.CHECK_ADS_PAGE_Y_OFFSET_SESSION_STORAGE);

            fetchImages(newAds);
          }
        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.WARNING_CANNOT_FETCH_ADS)
        }
      });
  }

  // clicked next, download next ads
  const nextAdsHandler = () => {
    const l_page = parseInt(pageParam) + 1;
    if (l_page < adsPagesAmount) {
      sessionStorage.removeItem(config.PAGE_Y_OFFSET_SESSION_STORAGE);
      props.history.push(config.MY_CHECKADS_PATH_PUSH + l_page + '/' + publishParam);

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
      props.history.push(config.MY_CHECKADS_PATH_PUSH + l_page + '/' + publishParam);

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
    props.history.push(config.MY_CHECKADS_PATH_PUSH + pageButtonNum + '/' + publishParam);

    window.location.reload();
  };

  // create buttons ads pages
  let listOfAdsButtonPages = null;
  if (adsPagesAmount > 0) {
    listOfAdsButtonPages = generateButtonsAdsPages(adsPagesAmount);
  }


  // viewing time session
  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = computeSessionTimeLeft();

      setSessionTimeLeft(timeLeft);
    }, 60000);

    return () => clearInterval(interval);
  });

  // session time left
  let sessionInfo = null;
  sessionInfo = <div
    style={{ position: 'fixed', fontSize: '12px', top: '60px', zIndex: '1' }}>
    Sesja skończy się za: {sessionTimeLeft} min
  </div>;

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
        margin-top: 100px;left: 50%;
        transform: translateX(-50%);' />
    );
  }

  return (
    <div>
      {sessionInfo}
      <div className={classes.CheckAds}>
        <ToastBar
          customInfoStyle={{ top: '141px' }}
          customWarningStyle={{ top: '179px' }}
          info={info}
          warning={warning}
          infoTimePassedHandler={() => setInfo('')}
          warningTimePassedHandler={() => setWarning('')} />
        <div className={classes.Panel}>
          <Input
            width='250px'
            inputConfig={{ type: 'text', placeholder: 'Wyszukaj po idKey' }}
            inputChange={(e) => inputIdKeyHandler(e)}
            inputVal={searchedIdKey} />
          <ImageButton
            customStyle={{ marginRight: '10px' }}
            clickHandler={searchHandler}
            icon={faSearch}
            iconSize='2x' />
          <Select
            customStyle={{ width: '250px', margin: '10px' }}
            options={text.SELECT_PUBLISH_OPTIONS}
            selectChange={(e) => selectHandler(e)}
            value={publishParam} />
          <ImageButton
            customStyle={{ margin: 'auto 5px auto 50px' }}
            clickHandler={selectAllHandler}
            icon={faCheckSquare}
            iconSize='2x' />
          <ImageButton
            customStyle={{ marginRight: '50px' }}
            clickHandler={cancelSelectAll}
            icon={faSquare}
            iconSize='2x' />
          <ImageButton
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
          title={'Wszystkich ofert pracy: ' + adsLength} />
        {beatLoader}
        <AdminList
          ads={data}
          uiStates={uiStates}
          clickHandler={(idKey) => clickHandler(idKey)}
          checkboxHandler={(idKey) => clickCheckboxHandler(idKey)}
          publishHandler={(idKey) => clickPublishHandler(idKey)}
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

export default withRouter(CheckAds);
