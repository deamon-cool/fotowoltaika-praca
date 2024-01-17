// convert editorContentJson to obj
// before you start MAKE SURE you COPY DATABASE and COPY UPLOADS

const readline = require('readline');

const connectToDb = require('../my-modules/connectToDb');
const config = require('../config/config.json');

const AdDescription = require('../db/model/AdDescription');

// production or test enviroment
let mongoDbPath = 'mongodb://localhost/fotowoltaika-db';
// if (config.PRODUCTION_MODE) {
//   mongoDbPath = `mongodb://${config.USER_DB}:${config.PASS_DB}@localhost/fotowoltaika-db?authSource=admin`;
// }

connectToDb(mongoDbPath);

const rl = readline.createInterface(process.stdin, process.stdout);

console.log('Make a COPY of DATABASE and /uploads');
rl.question('Do you want to convert editorContentJson to object y ? (y/n) Connect to db...', async (answer) => {
  console.log(answer);
  if (answer === 'y') {
    console.log('Start...');

    try {
      const addescriptions = await AdDescription.find();

      if (addescriptions) {
        for (const key in addescriptions) {
          if (Object.hasOwnProperty.call(addescriptions, key)) {
            const addescr = addescriptions[key];

            if (typeof addescr.editorContent === 'string') {
              const editorContentObj = JSON.parse(addescr.editorContent);

              console.log('[updating...] -> ' + addescr.idKey);
              await addescr.updateOne({ editorContent: editorContentObj });

              console.log('[DONE] -> ' + addescr.idKey);
            }
          }
        }

        console.log('-> Finished');
        console.log('bye');
        rl.close();
      } else {
        console.log('Brak opisów w bazie danych.');
        console.log('bye');
        rl.close();
      }
    } catch (error) {
      console.log(error);
    }

  } else {
    console.log('bye');
    rl.close();
  }
});