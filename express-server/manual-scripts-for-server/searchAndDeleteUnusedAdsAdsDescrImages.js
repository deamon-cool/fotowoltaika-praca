// search and delete unused ads, adsDescriptions, images
// before you start MAKE SURE you COPY DATABASE and COPY UPLOADS

const readline = require('readline');
const fs = require('fs');

const connectToDb = require('../my-modules/connectToDb');
const config = require('../config/config.json');

const Ad = require('../db/model/Ad');
const AdDescription = require('../db/model/AdDescription');

// production or test enviroment
let mongoDbPath = 'mongodb://localhost/fotowoltaika-db';
if (config.PRODUCTION_MODE) {
  mongoDbPath = `mongodb://${config.USER_DB}:${config.PASS_DB}@localhost/fotowoltaika-db?authSource=admin`;
}

connectToDb(mongoDbPath);

const rl = readline.createInterface(
  process.stdin, process.stdout);

console.log('Make a COPY of DATABASE and /uploads');
rl.question('Do you want to search unused adsDescriptions, images ? (y/n) Connect to db...', (answer) => {
  console.log(answer);
  if (answer === 'y') {
    console.log('Start...');

    fs.readdir('../uploads/', async (err, files) => {
      if (err) {
        console.log(err);
        rl.close();
        return;
      }

      let arrayImagesToDelete = [];
      console.log('---fileName -> yes/no, yes-exist in Ad collection, no-not')
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const adItem = await Ad.findOne({ imageBlobName: file });
        if (adItem) {
          console.log('yes -> ' + file);
        } else {
          arrayImagesToDelete.push(file);
          console.log('no -> ' + file);
        }
      }

      rl.question('Do u want to delete all \'no\' images \n' + arrayImagesToDelete +
        `\n(${arrayImagesToDelete.length}) ? (y/n)`, async (answer) => {
          if (answer === 'y') {

            for (let i = 0; i < arrayImagesToDelete.length; i++) {
              const fileToDelete = arrayImagesToDelete[i];
              // delete file
              await fs.unlink('../uploads/' + fileToDelete, (err) => {
                if (err) {
                  console.log('---Error for deleting: ' + fileToDelete + '----- probably not found. -----'); // not found ???
                } else {
                  console.log('----deleted image/es---');
                }
              });
            }
          }

          console.log('--------------------');
          console.log('---Checking all AdDescription idKeys... (yes-found in Ad as well, no-not)');
          const adDescriptions = await AdDescription.find();
          if (adDescriptions) {
            let adDescriptionsToDelete = [];

            for (let i = 0; i < adDescriptions.length; i++) {
              const adDescr = adDescriptions[i];

              const checkAd = await Ad.findOne({ idKey: adDescr.idKey });
              if (checkAd) {
                console.log('yes -> ' + adDescr.idKey);
              } else {
                adDescriptionsToDelete.push(adDescr.idKey);
                console.log('no -> ' + adDescr.idKey);
              }
            }

            rl.question('---Delete those that are not use in Ad ? (Checking Ad.find({idKey:adDescr.idKey}) \n' +
              adDescriptionsToDelete + `\n(${adDescriptionsToDelete.length}) ? (y/n)`, async (answer) => {
                if (answer === 'y') {
                  for (let i = 0; i < adDescriptionsToDelete.length; i++) {
                    const idKeyToDel = adDescriptionsToDelete[i];

                    await AdDescription.deleteOne({ idKey: idKeyToDel });
                  }
                  console.log('---deleted unused adDescriptions');
                  console.log('bye');
                  rl.close
                } else {
                  console.log('bye');
                  rl.close();
                }
              });

          } else {
            console.log('---Checking completed - AdDescription idKeys empty');
            console.log('bye');
            rl.close();
          }
        })
    });

  } else {
    console.log('bye');
    rl.close();
  }
});