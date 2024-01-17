import React, { useState, useRef, useEffect } from 'react';

import classes from './PostsGenerator.module.css';
import modifyFetchUrl from '../../functions/modifyFetchUrl';
import getValidatedInputs from '../../functions/getValidatedInputs';
import * as text from '../../text/text';
import * as config from '../../config/config';
import ToastBar from '../../components/ToastBar/ToastBar';
import Select from '../../components/Select/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import TextGenerator from '../../components/TextGenerator/TextGenerator';
import Input from '../../components/Input/Input';

function PostsGenerator(props) {
  const [warning, setWarning] = useState('');
  const [info, setInfo] = useState('');
  const [panelStates, setPanelStates] = useState({
    positionMarker: {
      name: 'positionMarker',
      value: '',
      placeholder: '- rodzaj pracy -'
    },
    voivodeship: {
      name: 'voivodeship',
      value: '',
      placeholder: '- woj. -',
    }
  });
  const [facebookText, setFacebookText] = useState('');
  const [input, setInput] = useState({
    companyName: {
      inputConfig: {
        type: 'text',
        name: 'companyName',
        placeholder: 'Nazwa firmy'
      },
      value: ''
    }
  });
  const [publish, setPublish] = useState('');
  const [emailText, setEmailText] = useState('');
  const [searchedCompanies, setSearchedCompanies] = useState('');

  const componentMounted = useRef(false);

  useEffect(() => {
    componentMounted.current = true;

    return () => {
      componentMounted.current = false;
    };
  }, []);


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

  // generate facebook text handler
  const generateFacebookTextHandler = () => {
    if (panelStates.positionMarker.value === '' && panelStates.voivodeship.value === '') {
      setWarning(text.SELECT_SEARCH_WARNING);

      return;
    }

    const url = modifyFetchUrl(config.ADS_FETCH + panelStates.positionMarker.value + '/' +
      panelStates.voivodeship.value + '/0' + '/9999');
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
          const serverAds = dataServer.ads;

          if (serverAds.length <= 0) {
            setInfo('Brak ogłoszeń.');
          } else {
            setInfo('');

            let l_text = ``;
            for (let i = 0; i < text.VOIVODESHIP_SEARCH_ARR.length; i++) {
              const voivodeshipItem = text.VOIVODESHIP_SEARCH_ARR[i];

              let addedVoivodeship = false;
              for (let j = 0; j < serverAds.length; j++) {
                const ad = serverAds[j];

                // validation
                const idKey = typeof ad.idKey === 'undefined' ? text.PROP_ERR : ad.idKey;
                const validatedInputs = getValidatedInputs(ad.inputs,
                  ['position', 'minSalary', 'maxSalary', 'city', 'voivodeship']);
                const position = validatedInputs.position.value;
                const minSalary = validatedInputs.minSalary.value;
                const maxSalary = validatedInputs.maxSalary.value;
                const city = validatedInputs.city.value;
                const voivodeship = validatedInputs.voivodeship.value;

                let salaryText = ``;
                if (voivodeship === voivodeshipItem) {
                  if (addedVoivodeship) {
                    // avoid repetition
                  } else {
                    l_text = l_text + `🌞🌞🌞 ${voivodeshipItem}: \n`;
                    addedVoivodeship = true;
                  }

                  // defines salary
                  salaryText = ` -> ${minSalary} - ${maxSalary} zł:`;
                  if (maxSalary === minSalary) {
                    salaryText = ` -> ${maxSalary} zł:`;
                  }
                  if (maxSalary === '') {
                    salaryText = ` -> od ${minSalary} zł:`;
                  }
                  if (minSalary === '') {
                    salaryText = ` -> do ${maxSalary} zł:`;
                  }
                  if (maxSalary === '' && minSalary === '') {
                    salaryText = ' :';
                  }

                  l_text = l_text + `🌞 ${city}: ${position}${salaryText}\n` +
                    `${config.MY_SITE}praca/opis/${idKey}\n`;
                }

                if (j === serverAds.length - 1) {
                  addedVoivodeship = false;
                }
              }
            }

            const mainText = `Oferty pracy na dziś:\n${l_text}\n` +
              `Na bieżąco będziesz na naszej stronie fb 🌞:\n${config.FACEBOOK_SITE}\n` +
              `Więcej ofert pracy możesz zobaczyć na 🙂:\n${config.MY_SITE}`;

            setFacebookText(mainText);
          }
        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.WARNING_CANNOT_FETCH_ADS);
        }
      });
  };

  // change publish handler in select
  const selectPublishHandler = (e) => {
    setPublish(e.target.value);
  };

  // input handler
  const inputHandler = (e, inputName) => {
    const updatedInput = {
      ...input,
      [inputName]: {
        ...input[inputName],
        value: e.target.value
      }
    };

    setInput(updatedInput);
  };

  // generate email text
  const generateEmailTextHandler = () => {
    if (publish !== text.SELECT_PUBLISH_OPTIONS.find(text => text === publish)
      || input.companyName.value === '') {
      setWarning(text.SELECT_SEARCH_WARNING);

      return;
    }

    const url = modifyFetchUrl(config.MY_SEARCHED_ADS_FETCH +
      '?publishQuery=' + publish + '&companyNameQuery=' + input.companyName.value);
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

          setWarning('');

          const ads = dataServer.searchedAds;

          if (ads.length <= 0) {
            setInfo('Brak ogłoszeń.');
          } else {
            setInfo('');

            let l_searchedCompanies = [ads[0].inputs.companyName.value];
            let mainText = `Dzień Dobry,\n\nOgłoszenia wysłane przez Państwa to:\n`;
            for (let i = 0; i < ads.length; i++) {
              const ad = ads[i];
              const companyName = ad.inputs.companyName.value;

              const compareResult = l_searchedCompanies.find(name => name === companyName);
              if (compareResult !== companyName) {
                l_searchedCompanies.push(companyName);
              }

              // validation
              const idKey = typeof ad.idKey === 'undefined' ? text.PROP_ERR : ad.idKey;

              mainText = mainText + `${config.MY_SITE}praca/opis/${idKey}\n`;
            }

            setSearchedCompanies(l_searchedCompanies.join(', '));

            mainText = mainText + 'Proszę o zatwierdzenie ogłoszeń do publikacji jeżeli wszystko się zgadza. ' +
              'Jeżeli nie otrzymamy potwierdzenia to ogłoszenia niestety nie będą publikowane. ' +
              'Jeżeli będą potrzebne poprawki w ogłoszeniach kontakt do mnie znajdą Państwo poniżej. ' +
              'Jeżeli niektóre ogłoszenia mają zostać usunięte to proszę w mailu zwrotnym przesłać mi: \n' +
              '"Do usunięcia: + linki do wybranych ogłoszeń z listy powyżej".\n' +
              'Jeżeli będą mieli Państwo pytania lub ewentualne poprawki do ogłoszeń służę pomocą:\n' +
              'e-mail: ogloszenia.praca.pomoc@gmail.com\n' +
              'tel.: 733 299 563\n\n' +
              'Pozdrawiam,\n' +
              'Damian Ciesielski\n' +
              'Fotowoltaika Praca';

            setEmailText(mainText);
          }

        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.WARNING_CANNOT_FETCH_ADS);
        }
      });

  };

  // return to list from description
  const returnHandler = () => {
    props.history.goBack();
  };

  return (
    <div className={classes.PostsGenerator}>
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
      <div className={classes.PaddingTop}>
        <h1 className={classes.Title}>Generator Postów</h1>
        <div className={classes.PanelRow}>
          <Select
            customStyle={{ width: '300px', margin: '10px' }}
            options={text.WORK_POSITIONS_SEARCH_ARR}
            name={panelStates.positionMarker.name}
            selectChange={(e) => selectHandler(e, panelStates.positionMarker.name)}
            value={panelStates.positionMarker.value}
            placeholder={panelStates.positionMarker.placeholder} />
          <Select
            customStyle={{ width: '250px', margin: '10px' }}
            options={text.VOIVODESHIP_SEARCH_ARR}
            name={panelStates.voivodeship.name}
            selectChange={(e) => selectHandler(e, panelStates.voivodeship.name)}
            value={panelStates.voivodeship.value}
            placeholder={panelStates.voivodeship.placeholder} />
        </div>
        <TextGenerator
          title='Generator Postów: Facebook'
          text={facebookText}
          generateButtonText='Generuj post facebook'
          generateTextHandler={generateFacebookTextHandler} />
        <div className={classes.PanelRow}>
          <Select
            customStyle={{ width: '300px', margin: '10px' }}
            options={text.SELECT_PUBLISH_OPTIONS}
            selectChange={(e) => selectPublishHandler(e)}
            value={publish}
            placeholder='- wybierz typ publikowania -' />
          <Input
            width='300px'
            inputConfig={input.companyName.inputConfig}
            inputChange={(e) => inputHandler(e, input.companyName.inputConfig.name)}
            inputVal={input.companyName.value} />
        </div>
        <div className={classes.Info}>Wyszukane firmy to: {searchedCompanies}</div>
        <TextGenerator
          title='Generator Postów: Email'
          text={emailText}
          generateButtonText='Generuj post email'
          generateTextHandler={generateEmailTextHandler} />
      </div>
    </div>
  );
}

export default PostsGenerator;