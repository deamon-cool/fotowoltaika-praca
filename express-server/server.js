const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config/config.json');

// middlewares
const connectToDb = require('./my-modules/connectToDb');
const loginVerification = require('./middlewares/loginVerification');
const authCheck = require('./middlewares/authCheck');
const checkInputsBody = require('./middlewares/checkInputsBody');
const checkImageReq = require('./middlewares/checkImageReq');
const checkPublishBody = require('./middlewares/checkPublishBody');
const checkIdBody = require('./middlewares/checkIdBody');
const checkEditorContentBody = require('./middlewares/checkEditorContentBody');
const loginBlackIps = require('./middlewares/loginBlackIps');
const adDdosBlackIps = require('./middlewares/adDdosBlackIps');
const checkRecaptcha = require('./middlewares/checkRecaptcha');
const checkSendAdsParams = require('./middlewares/checkSendAdsParams');
const checkIdArrayBody = require('./middlewares/checkIdArrayBody');
const advertiserLoginCheck = require('./middlewares/advertiserLoginCheck');
const compareIdsWithDb = require('./middlewares/compareIdsWithDb');
const compareOneIdWithDb = require('./middlewares/compareOneIdWithDb');
const compareOneIdParamWithDb = require('./middlewares/compareOneIdParamWithDb');

// controllers
const loginController = require('./controllers/loginController');
const receiveAdController = require('./controllers/receiveAdController');
const receiveImageAdController = require('./controllers/receiveImageAdController');
const sendAdsController = require('./controllers/sendAdsController');
const sendAdminAdsController = require('./controllers/sendAdminAdsController');
const sendAdminImageController = require('./controllers/sendAdminImageController');
const sendDescriptionController = require('./controllers/sendDescriptionController');
const updatePublishWithDateController = require('./controllers/updatePublishWithDateController');
const updateInputsAdController = require('./controllers/updateInputsAdController');
const updateAdDescriptionController = require('./controllers/updateAdDescriptionController');
const updateImageAdController = require('./controllers/updateImageAdController');
const deleteAdsController = require('./controllers/deleteAdsController');
const sendAdController = require('./controllers/sendAdController');
const sendAdsAmountCotroller = require('./controllers/sendAdsAmountCotroller');
const loginOutController = require('./controllers/loginOutController');
const sendAdminAdsAmountCotroller = require('./controllers/sendAdminAdsAmountCotroller');
const sendSearchedAdminAdsCotroller = require('./controllers/sendSearchedAdminAdsCotroller');
const sendAdvertiserAdsController = require('./controllers/sendAdvertiserAdsController');
const deleteAdvertiserAdsController = require('./controllers/deleteAdvertiserAdsController');
const sendPublicInfoController = require('./controllers/sendPublicInfoController');
const changePublicInfoController = require('./controllers/changePublicInfoController');

// check settings and display console message
if (!config.PRODUCTION_MODE) {
    console.log('Warning: Turn on production mode !');
}
if (!config.SECURE_COOKIE) {
    console.log('Warning: Turn on secure cookie !');
}
if (!config.SAMESITE_COOKIE) {
    console.log('Warning: Turn on same site cookie !');
}


const app = express();

// production or test enviroment
let mongoDbPath = 'mongodb://127.0.0.1/fotowoltaika-db';
if (config.PRODUCTION_MODE) {
    app.set('trust proxy', '127.0.0.1');
}

// cors     // addd domains e.x. 'http://fotowoltaikapraca.pl', 'http://fotowoltaikapraca.pl'
const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000',
        'http://127.0.0.1:9000', 'http://localhost:9000'],
    credentials: true,
};

app.use(cors(corsOptions));

// helmet config
// app.use(helmet()); // default, but caused problems with CSP
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// cookie parser configuration
app.use(cookieParser(config.COOKIE_SECRET));

// body parser configuration
// app.use(express.urlencoded({ limit: '5mb', extended: true }));    // something was not working after that
app.use(express.urlencoded({ extended: false }));
// app.use(express.json()); // normal/default
app.use(express.json({ limit: config.LIMIT_JSON_BODY })); // protection dos attack

// connect to database
connectToDb(mongoDbPath);


//--------------------------admin

// my admin login endpoint
app.post('/api/8xMUkaDXA.hmkZMrXflTGum96ZJz7Zg.LKfbr2XLBCVTb9dvDvdGC',
    loginBlackIps, loginVerification, loginController);

// my admin login out endpoint
app.get('/api/8xMUkaDXA1hmkZloginTGum96OUT7ZgsLKfbr2XLBCVTb9dvDvdGC',
    loginOutController);

// change public info set by admin to every user
app.post('/api/M6oOd0xlWsgez9hcntYsrevMqM8jOI3Nad7XyjzBeagy6J4iYax4', authCheck, changePublicInfoController);

//------send ads to admin

// send admin ads amount endpoint
app.get('/api/praca/ogloszenia/ilosc-ogloszen/moje/:publishParam',
    authCheck, sendAdminAdsAmountCotroller);

// send admin ads(published and not) endpoint
app.get('/api/OHPi3vY5w3M7T67tBnuUzivYX4bduiIRkAZLURpR7lLb39VG3d0mm/:publishParam/:skippedDocs/:limitDocs',
    authCheck, checkSendAdsParams, sendAdminAdsController);

//------send searched ads to admin endpoint
app.get('/api/praca/szukane-ogloszenia/moje',
    authCheck, sendSearchedAdminAdsCotroller);

//-----------edit admin ad

// update publish and date ad endpoint
app.post('/api/Q8Zn6GsA5X1z6O5tZQgoOOPj2NgLZ1Rvn52vosAYxaMsveRv55ryC',
    authCheck, checkIdBody, checkPublishBody, updatePublishWithDateController);

// edit ad inputs endpoint
app.post('/api/4CqNZPczpTnL2Vi8axXT1eKkmydHbtF26sPE2GaOuvDiyy3xZsheq',
    authCheck, checkIdBody, checkInputsBody, updateInputsAdController);

// edit ad description endpoint
app.post('/api/nKm1k6JoaFVwhr6WncrRUe2bXQepzf13nk71f0wwcOmYZNWikXHei',
    authCheck, checkIdBody, checkEditorContentBody, updateAdDescriptionController);

// edit ad image
app.post('/api/FtIwZhSUxsn14wxlrvfcfeliBY1mCFjX1cYVJjHjNC7Hjf0medUyf/:idKey/:command',
    authCheck, updateImageAdController);

// delete ad, image, adDescription
app.delete('/api/vl7Yrf2fDpslsUsLZy17ruoC7nkdIYMJEEhu3C0iQ9aMOBZ3NCbMm',
    authCheck, checkIdArrayBody, deleteAdsController);


//--------------------------default

//------create new ad

// receive ad with description endpoint
app.put('/api/tjNT6PofpdHle6uHRlkuT.obsAf.JuXHcx8rThJWLpOL86P7GIeui',
    checkRecaptcha, adDdosBlackIps, checkInputsBody, checkEditorContentBody, receiveAdController);

// receive image ad endpoint
app.put('/api/xXkDaTZxCvm8n5BOAw.tdeNi7HS5aanUCDWPp3Hm.88cJN9ymcMJ2/:idKey',
    adDdosBlackIps, advertiserLoginCheck, compareOneIdParamWithDb, receiveImageAdController);

//-------send advertiser ads

// send advertiser ads endpoint
app.get('/api/ogloszenia-pracodawcy/:skippedDocs/:limitDocs',
    loginBlackIps, advertiserLoginCheck, checkSendAdsParams, sendAdvertiserAdsController);

//-------edit advertsier ad

// edit advertsier ad inputs endpoint
app.post('/api/edytuj-wejscia-ogloszenia-pracodawcy',
    loginBlackIps, advertiserLoginCheck, checkIdBody, compareOneIdWithDb, checkInputsBody, updateInputsAdController);

// edit advertsier ad description endpoint
app.post('/api/edytuj-opis-ogloszenia-pracodawcy',
    loginBlackIps, advertiserLoginCheck, checkIdBody, compareOneIdWithDb, checkEditorContentBody, updateAdDescriptionController);

// edit advertsier ad image
app.post('/api/edytuj-obraz-ogloszenia-pracodawcy/:idKey/:command',
    loginBlackIps, advertiserLoginCheck, compareOneIdParamWithDb, updateImageAdController);


// delete advertiser ad, image, adDescription endpoint
app.delete('/api/usun-ogloszenia-pracodawcy',
    loginBlackIps, advertiserLoginCheck, checkIdArrayBody, compareIdsWithDb, deleteAdvertiserAdsController);

//----normal user

// send public info set by admin to every user
app.get('/api/informacja-publiczna', sendPublicInfoController)

// send ads endpoint
app.get('/api/praca/ogloszenia/:positionMarker/:voivodeship/:skippedDocs/:limitDocs',
    checkSendAdsParams, sendAdsController);

// get ads.length endpoint
app.get('/api/praca/ogloszenia/ilosc-ogloszen/:positionMarker/:voivodeship', sendAdsAmountCotroller);

// send ad endpoint
app.get('/api/ogloszenie/:idKey', sendAdController);

// send ad image endpoint
app.get('/api/obraz/:imageName',
    checkImageReq, sendAdminImageController);

// send ad description endpoint
app.get('/api/opis/:idKey',
    sendDescriptionController);

// get terms
app.get('/api/regulamin/pobierz', (req, res) => {
    return res.status(200).sendFile('REGULAMIN.pdf', { root: `${__dirname}/files` });
});

// get privacy policy
app.get('/api/polityka-prywatnosci/pobierz', (req, res) => {
    return res.status(200).sendFile('POLITYKA-PRYWATNOSCI.pdf', { root: `${__dirname}/files` });
});

//------------------------

app.use(express.static(path.join(__dirname, '../build')));

// main endpoint
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// server on
app.listen(config.PORT_SERVER, () => {
    console.log('127.0.0.1:' + config.PORT_SERVER);
});