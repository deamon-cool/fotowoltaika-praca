// BEFORE RUNNING THIS SCRIPT
// Make one ad in wstaw ogloszenie page 
// make publish
// and then run this script to copy more than ten times

const mongoose = require('mongoose');
const fs = require('fs');
const slugify = require('slugify');

const config = require('../config/config.json');
const AdDescription = require('../db/model/AdDescription');
const Ad = require('../db/model/Ad');

// production or test enviroment
let mongoDbPath = 'mongodb://localhost/fotowoltaika-db';
if (config.PRODUCTION_MODE) {
  mongoDbPath = `mongodb://${config.USER_DB}:${config.PASS_DB}@localhost/fotowoltaika-db?authSource=admin`;
}

const adsAmount = 120;

const WORK_POSITIONS_ARR = ['montażysta', 'projektant', 'kierownik',
  'serwisant', 'dyrektor', 'handlowiec', 'doradca', 'inny'];
const WORK_PLACES_ARR = ['praca na miejscu', 'praca zdalna', 'praca w terenie'];
const CITIES_ARR = ['Warszawa', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin',
  'Bydgoszcz', 'Lublin', 'Białystok'];
const VOIVODESHIP_ARR = ['dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie',
  'łódzkie', 'małopolskie', 'mazowieckie', 'opolskie', 'podkarpackie', 'podlaskie',
  'pomorskie', 'śląskie', 'świętokrzyskie', 'warmińsko-mazurskie', 'wielkopolskie', 'zachodniopomorskie'];

const getRandomWord = (wordsArr) => {
  const random = parseInt(Math.random() * wordsArr.length);

  return wordsArr[random];
};

// connect to database
mongoose.connect(mongoDbPath, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error connection to Db'));
db.once('open', async () => {
  console.log('Test connected to Db');

  const ad = await Ad.findOne();
  if (ad === null) {
    console.log('Ad not found');
    return;
  }

  const adDescription = await AdDescription.findOne({ idKey: ad.idKey });
  if (adDescription === null) {
    console.log('adDescription not found');
    return;
  }

  const filesFound = fs.readdirSync('../uploads/');

  if (filesFound.length < 1) {
    console.log('----------------> Empty uploads folder. Add some image to Ad');
  }

  let inputsCopy = { ...ad.inputs };

  for (let i = 0; i < adsAmount; i++) {
    // copy image
    const dateNow = Date.now();
    const imageName = 'imageBlob-' + dateNow + '.jpeg';
    fs.copyFileSync('../uploads/' + filesFound[0], '../uploads/' + imageName);

    const idKey = slugify(ad.idKey + dateNow);
    const publicationDate = new Date().toLocaleString().split(',')[0];

    const pos = getRandomWord(WORK_POSITIONS_ARR);
    inputsCopy.position.value = pos;
    inputsCopy.positionMarker.value = pos;
    inputsCopy.city.value = getRandomWord(CITIES_ARR);
    inputsCopy.voivodeship.value = getRandomWord(VOIVODESHIP_ARR);
    inputsCopy.workPlace.value = getRandomWord(WORK_PLACES_ARR);

    await Ad.create({
      idKey: idKey,
      date: dateNow,
      inputs: inputsCopy,
      imageBlobName: imageName,
      publish: true,
      views: 0,
      publicationDate: publicationDate
    });

    await AdDescription.create({
      idKey: idKey,
      editorContent: adDescription.editorContent
    });
  }

  console.log('created test db')
});