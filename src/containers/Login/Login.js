import React, { useState } from 'react';

import modifyFetchUrl from '../../functions/modifyFetchUrl';
import * as text from '../../text/text';
import * as config from '../../config/config';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import classes from './Login.module.css';
import { withRouter } from 'react-router-dom';

function Login(props) {
    const [u, setU] = useState('');
    const [p, setP] = useState('');
    const [warning, setWarning] = useState('');

    const inputHandler = (e, type) => {
        switch (type) {
            case 'text':
                setU(e.target.value)
                break;
            case 'password':
                setP(e.target.value)
                break;
            default:
                break;
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const data = {
            u: u,
            p: p
        };

        let url = modifyFetchUrl(config.MY_PATH_FETCH);
        let init = {
            method: 'POST',
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }

        fetch(url, init)
            .then(res => res.json())
            .then(dataServer => {
                if (dataServer.error) {
                    setWarning(dataServer.error);
                }
                if (dataServer.correct) {
                    if (dataServer.tokenTime) {
                        const timeTodayMiliseconds = new Date().getTime();
                        const expirationTime = timeTodayMiliseconds + dataServer.tokenTime;
                        localStorage.setItem(config.EXP_TIME_NAME_LOCAL_STORAGE, expirationTime);

                        props.history.push(config.MY_NAVIGATION_PATH_ROUTER);
                    }
                }
            }).catch(e => {
                setWarning(text.CATCH_ERROR_FETCH);
            });
    };

    const uInputConfig = {
        type: 'text',
        name: 'u',
        placeholder: 'u'
    };

    const pInputConfig = {
        type: 'password',
        name: 'p',
        placeholder: 'p'
    };

    return (
        <form onSubmit={submitHandler} className={classes.Login}>
            <h1 className={classes.Title}>Logowanie</h1>
            <Input
                inputConfig={uInputConfig}
                inputChange={(e) => inputHandler(e, uInputConfig.type)}
                value={u} />
            <Input
                inputConfig={pInputConfig}
                inputChange={(e) => inputHandler(e, pInputConfig.type)}
                value={p} />
            <div className={classes.Element}>
                <Button
                    customStyle={{ width: '150px', margin: '10px 0 0 130px' }}
                    buttonType='submit'
                    clickHandler={submitHandler} >
                    OK
                </Button>
            </div>
            {warning}
        </form>
    );
}

export default withRouter(Login);