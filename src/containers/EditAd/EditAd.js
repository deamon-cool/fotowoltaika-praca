import React, { useEffect, useRef, useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import imageCompression from 'browser-image-compression';

import modifyFetchUrl from '../../functions/modifyFetchUrl';
import getValidatedInputs from '../../functions/getValidatedInputs';
import * as config from '../../config/config';
import * as text from '../../text/text';
import Ad from '../../components/Ad/Ad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classes from './EditAd.module.css';
import ToastBar from '../../components/ToastBar/ToastBar';
import Button from '../../components/Button/Button';

function EditAd(props) {
  const [clikedImageUploader, setClikedImageUploader] = useState(false);
  const [image, setImage] = useState('');
  const [showImageView, setshowImageView] = useState(false);
  const [imageWarning, setImageWarning] = useState('');
  const [warning, setWarning] = useState('');
  const [info, setInfo] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [inputs, setInputs] = useState({
    position: {
      value: '',
    },
    positionMarker: {
      value: '',
    },
    minSalary: {
      value: '',
    },
    maxSalary: {
      value: '',
    },
    city: {
      value: '',
    },
    street: {
      value: '',
    },
    voivodeship: {
      value: '',
    },
    companyName: {
      value: '',
    },
    agreementType: {
      value: '',
    },
    workPlace: {
      value: '',
    },
    interviewPlace: {
      value: '',
    },
    contact: {
      value: '',
    }
  });
  const [inputChanged, setInputChanged] = useState(false);
  const [editorStateChanged, setEditorStateChanged] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  const componentMounted = useRef(false);

  const { idKeyParam } = useParams();

  useEffect(() => {
    componentMounted.current = true;
    window.scrollTo(0, 0);

    downloadAd();

    return () => {
      componentMounted.current = false;
    };
  }, []);

  // download Ad
  const downloadAd = () => {
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

          setWarning('');
          const serverAd = dataServer.ad;

          if (serverAd === null) {
            setInfo(text.INFO_CANNOT_FETCH_AD);
          } else {
            setInfo('');

            const validatedInputs = getValidatedInputs(serverAd.inputs,
              ['position', 'positionMarker', 'minSalary', 'maxSalary', 'city', 'street', 'voivodeship',
                'companyName', 'agreementType', 'workPlace', 'interviewPlace', 'contact']);

            setInputs(validatedInputs);
            
            downloadImage(serverAd.imageBlobName);
            downloadDescription();
          }

        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.WARNING_CANNOT_FETCH_AD);
        }
      });
  };

  // download image
  const downloadImage = (imageBlobName) => {
    if (imageBlobName !== '') {
      const url = modifyFetchUrl(config.IMAGE_FETCH + imageBlobName);
      const init = {
        method: 'GET'
      };

      fetch(url, init)
        .then(res => {
          if (componentMounted.current) {
            if (res.status === 200) {
              setImage(res.url);
              setshowImageView(true);
            }
          }
        })
        .catch(e => {
          setWarning(text.WARNING_CANNOT_DOWNLOAD_IMAGE);
        });
    }
  };

  // download descritption
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
        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.WARNING_CANNOT_FETCH_DESCRIPTION);
        }
      });
  };

  const clickUploadImageHandler = (e) => {
    setClikedImageUploader(true);
  };

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
        .then(function (compressedImageFile) {
          if (componentMounted.current) {
            const objURL = URL.createObjectURL(compressedImageFile);

            setImage(objURL);
            setshowImageView(true);
            setImageWarning('');

            setImageChanged(true);
          }
        })
        .catch(function (error) {
          if (componentMounted.current) {
            setImageWarning(error.message);
          }
        });

      return;
    }

    setImageWarning(text.WARNING_IMAGE);
  };

  const clickCloseImageViewHandler = () => {
    // delete image url from internal memory
    URL.revokeObjectURL(image);

    setshowImageView(false);
    setImage('');

    setImageChanged(true);
  };

  const inputHandler = (e, inputName) => {
    const updatedInputs = {
      ...inputs,
      [inputName]: {
        ...inputs[inputName],
        value: e.target.value
      }
    };

    setInputs(updatedInputs);

    setInputChanged(true);
  };

  const editorStateHandler = (state) => {
    setEditorState(state);

    setEditorStateChanged(true);
  };

  const sendAdHandler = async (e) => {
    e.preventDefault();
    setWarning('');
    setInfo('');

    let serverWarnings = '';
    let serverInfos = '';

    // send inputs if changed
    if (inputChanged) {
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

      const data = {
        idKey: idKeyParam,
        inputs: inputsData
      };
      const url = modifyFetchUrl(config.MY_EDITAD_EDIT_INPUTS_FETCH);
      const init = {
        method: 'POST',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };

      await fetch(url, init)
        .then(res => res.json())
        .then(dataServer => {
          if (componentMounted.current) {

            if (dataServer.error) {
              serverWarnings = dataServer.error;
              setWarning(serverWarnings);
              return;
            }

            serverInfos = dataServer.text;
            setInfo(serverInfos);

          }
        }).catch(e => {
          if (componentMounted.current) {
            serverWarnings = text.WARNING_FETCH_INPUTS;
            setWarning(serverWarnings);
          }
        });
    }

    // send editorState if changed
    if (editorStateChanged) {
      const content = convertToRaw(editorState.getCurrentContent());

      const data = {
        idKey: idKeyParam,
        editorContent: content
      };

      const url = modifyFetchUrl(config.MY_EDITAD_EDIT_DESCRIPTION_FETCH);
      const init = {
        method: 'POST',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };

      await fetch(url, init)
        .then(res => res.json())
        .then(dataServer => {
          if (componentMounted.current) {

            if (dataServer.error) {
              if (serverWarnings) {
                serverWarnings = serverWarnings + ', ' + dataServer.error;
              } else {
                serverWarnings = dataServer.error;
              }

              setWarning(serverWarnings);
              return;
            }

            if (serverInfos) {
              serverInfos = serverInfos + ', ' + dataServer.text;
            } else {
              serverInfos = dataServer.text;
            }

            setInfo(serverInfos);

          }
        }).catch(e => {
          if (componentMounted.current) {

            if (serverWarnings) {
              serverWarnings = serverWarnings + ', ' + text.WARNING_FETCH_EDITORSTATE;
            } else {
              serverWarnings = text.WARNING_FETCH_EDITORSTATE;
            }
            setWarning(serverWarnings);

          }
        });
    }

    // send image if changed
    if (imageChanged) {
      let command = '';
      if (image === '') {
        command = 'delete';
      } else {
        command = 'update';
      }
      editImageOnServer(command, serverInfos, serverWarnings);
    }
  };

  // edit ad image
  const editImageOnServer = async (command, serverInfos, serverWarnings) => {
    // get blob obj from internal memory
    const imageBlob = await fetch(image).then(data => data.blob());

    let formData = new FormData();
    formData.append(config.IMAGE_NAME_SENT, imageBlob);

    const url = modifyFetchUrl(config.MY_EDITAD_EDIT_IMAGE_FETCH + idKeyParam + '/' + command);
    const init = {
      method: 'POST',
      credentials: 'include',
      body: formData
    };

    fetch(url, init)
      .then(res => res.json())
      .then(dataServer => {
        if (componentMounted.current) {

          if (dataServer.error) {
            if (serverWarnings) {
              serverWarnings = serverWarnings + ', ' + dataServer.error;
            } else {
              serverWarnings = dataServer.error
            }

            setWarning(serverWarnings);
            return;
          }

          if (serverInfos) {
            serverInfos = serverInfos + ', ' + dataServer.text;
          } else {
            serverInfos = dataServer.text;
          }

          setInfo(serverInfos);

        }
      }).catch(e => {
        if (componentMounted.current) {
          if (serverWarnings) {
            serverWarnings = serverWarnings + ', ' + text.WARNING_FETCH_EDIT_IMAGE;
          } else {
            serverWarnings = text.WARNING_FETCH_EDIT_IMAGE;
          }
          setWarning(serverWarnings);
        }
      });
  };

  // return
  const retrunClickHandler = () => {
    props.history.goBack();
  };

  return (
    <div className={classes.EditAd}>
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
        onClick={retrunClickHandler} />
      <div className={classes.PaddingTop}>
        <Ad
          showImageView={showImageView}
          clickUploadImageHandler={clickUploadImageHandler}
          uploadImageHandler={uploadImageHandler}
          clikedImageUploader={clikedImageUploader}
          imageWarning={imageWarning}
          clickCloseImageViewHandler={clickCloseImageViewHandler}
          image={image}
          title={text.EDIT_AD_TITLE}
          inputs={inputs}
          inputHandler={(e, name) => inputHandler(e, name)}
          editorStateHandler={(state) => editorStateHandler(state)}
          editorState={editorState} />
      </div>
      <Button
        customStyle={{ width: '300px', margin: '10px auto' }}
        buttonType='submit'
        clickHandler={sendAdHandler}>
        Wyślij poprawione ogłoszenie
      </Button>
    </div>
  );
}

export default withRouter(EditAd);