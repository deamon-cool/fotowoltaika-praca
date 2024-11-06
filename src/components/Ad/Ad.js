import React from 'react';

import * as text from '../../text/text';
import { faFileImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import ImageUploader from '../ImageUploader/ImageUploader';
import ImageViewer from '../ImageViewer/ImageViewer';
import Input from '../Input/Input';
import RichTextEditor from '../RichTextEditor/RichTextEditor';

import classes from './Ad.module.css';
import Select from '../Select/Select';

function Ad(props) {
  const inputsConfigs = {
    position: {
      inputConfig: {
        type: 'text',
        name: 'position',
        placeholder: 'Stanowisko',
      }
    },
    positionMarker: {
      inputConfig: {
        name: 'positionMarker',
        placeholder: '---- wybierz rodzaj pracy ----'
      }
    },
    minSalary: {
      inputConfig: {
        type: 'number',
        name: 'minSalary',
        placeholder: 'Min.'
      }
    },
    maxSalary: {
      inputConfig: {
        type: 'number',
        name: 'maxSalary',
        placeholder: 'Max.'
      }
    },
    city: {
      inputConfig: {
        type: 'text',
        name: 'city',
        placeholder: 'Lokalizacja pracy'
      }
    },
    street: {
      inputConfig: {
        type: 'text',
        name: 'street',
        placeholder: 'Ulica i numer'
      }
    },
    voivodeship: {
      inputConfig: {
        name: 'voivodeship',
        placeholder: '---- województwo, w którym będzie wykonywana praca ----'
      }
    },
    companyName: {
      inputConfig: {
        type: 'text',
        name: 'companyName',
        placeholder: 'Nazwa firmy'
      }
    },
    agreementType: {
      inputConfig: {
        type: 'text',
        name: 'agreementType',
        placeholder: 'Typ umowy'
      }
    },
    workPlace: {
      inputConfig: {
        name: 'workPlace',
        placeholder: '---- praca: na miejscu?/zdalna?/w terenie? ----'
      }
    },
    interviewPlace: {
      inputConfig: {
        name: 'interviewPlace',
        placeholder: '---- rekrutacja: na miejscu?/zdalna? ----'
      }
    },
    contact: {
      inputConfig: {
        type: 'text',
        name: 'contact',
        placeholder: 'Kontakt (np. e-mail lub link do rekrutacji)'
      }
    }
  };

  // image uploader or image view - switch
  let switchImageUploadView = (
    <ImageUploader
      clickHandler={props.clickUploadImageHandler}
      uploadImageHandler={props.uploadImageHandler}
      clicked={props.clikedImageUploader}
      warning={props.imageWarning}
      icon={faFileImage}
      iconSize='5x' />
  );

  if (props.showImageView) {
    switchImageUploadView = (
      <ImageViewer
        clickCloseHandler={props.clickCloseImageViewHandler}
        imgSrc={props.image}
        icon={faTimes}
        iconSize='1x' />
    );
  }

  return (
    <div className={classes.Ad}>
      <div className={classes.DivCol}>
        <h1>{props.title}</h1>
        <div className={classes.Row}>
          {switchImageUploadView}
          <div className={classes.Column}>
            <Input
              width='300px'
              inputConfig={inputsConfigs.position.inputConfig}
              inputChange={(e) => props.inputHandler(e, inputsConfigs.position.inputConfig.name)}
              inputVal={props.inputs.position.value} />
            <Select
              customStyle={{ width: '300px', margin: '10px' }}
              options={text.WORK_POSITIONS_ARR}
              name={inputsConfigs.positionMarker.inputConfig.name}
              selectChange={(e) => props.inputHandler(e, inputsConfigs.positionMarker.inputConfig.name)}
              value={props.inputs.positionMarker.value}
              placeholder={inputsConfigs.positionMarker.inputConfig.placeholder} />
            <label className={classes.Label}>{text.SALARY_TEXT}</label>
            <div className={classes.Row}>
              <Input
                width='150px'
                inputConfig={inputsConfigs.minSalary.inputConfig}
                inputChange={(e) => props.inputHandler(e, inputsConfigs.minSalary.inputConfig.name)}
                inputVal={props.inputs.minSalary.value} />
              <Input
                width='150px'
                inputConfig={inputsConfigs.maxSalary.inputConfig}
                inputChange={(e) => props.inputHandler(e, inputsConfigs.maxSalary.inputConfig.name)}
                inputVal={props.inputs.maxSalary.value} />
            </div>
          </div>
        </div>
        <div className={classes.Column}>
          <Select
            customStyle={{ width: '550px', margin: '10px' }}
            options={text.VOIVODESHIP_ARR}
            name={inputsConfigs.voivodeship.inputConfig.name}
            selectChange={(e) => props.inputHandler(e, inputsConfigs.voivodeship.inputConfig.name)}
            value={props.inputs.voivodeship.value}
            placeholder={inputsConfigs.voivodeship.inputConfig.placeholder} />
          <div className={classes.Row}>
            <Input
              width='200px'
              inputConfig={inputsConfigs.city.inputConfig}
              inputChange={(e) => props.inputHandler(e, inputsConfigs.city.inputConfig.name)}
              inputVal={props.inputs.city.value} />
            <Input
              width='300px'
              inputConfig={inputsConfigs.street.inputConfig}
              inputChange={(e) => props.inputHandler(e, inputsConfigs.street.inputConfig.name)}
              inputVal={props.inputs.street.value} />
          </div>
          <div className={classes.Row}>
            <Input
              width='200px'
              inputConfig={inputsConfigs.companyName.inputConfig}
              inputChange={(e) => props.inputHandler(e, inputsConfigs.companyName.inputConfig.name)}
              inputVal={props.inputs.companyName.value} />
            <Input
              width='300px'
              inputConfig={inputsConfigs.agreementType.inputConfig}
              inputChange={(e) => props.inputHandler(e, inputsConfigs.agreementType.inputConfig.name)}
              inputVal={props.inputs.agreementType.value} />
          </div>
          <Select
            customStyle={{ width: '550px', margin: '10px' }}
            options={text.WORK_PLACES_ARR}
            name={inputsConfigs.workPlace.inputConfig.name}
            selectChange={(e) => props.inputHandler(e, inputsConfigs.workPlace.inputConfig.name)}
            value={props.inputs.workPlace.value}
            placeholder={inputsConfigs.workPlace.inputConfig.placeholder} />
          <Select
            customStyle={{ width: '550px', margin: '10px' }}
            options={text.INTERWIEV_PLACES_ARR}
            name={inputsConfigs.interviewPlace.inputConfig.name}
            selectChange={(e) => props.inputHandler(e, inputsConfigs.interviewPlace.inputConfig.name)}
            value={props.inputs.interviewPlace.value}
            placeholder={inputsConfigs.interviewPlace.inputConfig.placeholder} />
          <Input
            width='550px'
            inputConfig={inputsConfigs.contact.inputConfig}
            inputChange={(e) => props.inputHandler(e, inputsConfigs.contact.inputConfig.name)}
            inputVal={props.inputs.contact.value} />
        </div>
      </div>
      <div className={classes.DivCol}>
        <label className={classes.Label2}>{text.DESCRIPTION_TEXT}</label>
        <RichTextEditor
          onChange={(state) => props.editorStateHandler(state)}
          editorState={props.editorState}
          placeholder='Opis firmy/lokalizacja firmy i pracy/opis stanowiska/opis wymagań/
          opis benefitów...' />
      </div>

    </div>

  );
}

export default Ad;