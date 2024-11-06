import React, { useState, useRef, useEffect } from 'react';

import classes from './EditPublicPost.module.css';
import modifyFetchUrl from '../../functions/modifyFetchUrl';
import * as text from '../../text/text';
import * as config from '../../config/config';
import ToastBar from '../../components/ToastBar/ToastBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

function EditPublicPost(props) {
  const [warning, setWarning] = useState('');
  const [info, setInfo] = useState('');
  const [input, setInput] = useState('');

  const componentMounted = useRef(false);

  useEffect(() => {
    componentMounted.current = true;

    fetchInput();

    return () => {
      componentMounted.current = false;
    };
  }, []);

  // fetch actually visible public info
  const fetchInput = async () => {
    const url = modifyFetchUrl(config.PUBLIC_INFORMATION_FETCH);

    const init = {
      method: 'GET'
    };

    await fetch(url, init)
      .then(res => res.json())
      .then(dataServer => {
        if (componentMounted.current) {
          setInput(dataServer.publicInfo);
        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.CATCH_ERROR_FETCH)
        }
      });
  };

  // change public info handler
  const changeHandler = async () => {
    const data = {
      text: input
    };
    const url = modifyFetchUrl(config.MY_SET_PUBLIC_INFO);

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
            setWarning(dataServer.error);

            return;
          }

          setInfo(dataServer.text);
        }
      }).catch(e => {
        if (componentMounted.current) {
          setWarning(text.CATCH_ERROR_FETCH)
        }
      });
  };

  // return to list from description
  const returnHandler = () => {
    props.history.goBack();
  };

  return (
    <div className={classes.EditPublicPost}>
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
        <h1 className={classes.Title}>Zmień Publiczny Post</h1>
        <div className={classes.PanelRow}>
          <Input
            width='500px'
            inputConfig={{ type: 'text', placeholder: 'Wpisz tutaj text postu publicznego' }}
            inputChange={(e) => setInput(e.target.value)}
            inputVal={input} />
          <Button
            customStyle={{ width: '100px', margin: '10px' }}
            clickHandler={changeHandler}>
            Zmień
          </Button>
        </div>

      </div>
    </div>
  );
}

export default EditPublicPost;