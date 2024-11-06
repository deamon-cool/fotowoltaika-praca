const slugify = require('slugify');
const bcrypt = require('bcrypt');
const randomString = require('../my-modules/randomString');

const Ad = require('../db/model/Ad');
const AdDescription = require('../db/model/AdDescription');
const AdvertiserShortSession = require('../db/model/AdvertiserShortSession');

module.exports = async (req, res) => {
    try {
        const inputs = req.body.inputs;
        const dateNow = Date.now();
        const idKey = slugify(inputs.city.value + '-' + inputs.position.value + '-' + dateNow);
        let advertiserID = req.body.advertiserID;
        let entryKey = req.body.entryKey;

        // saving ad
        await Ad.create({
            idKey: idKey,
            date: dateNow,
            inputs: inputs,
            imageBlobName: '',
            publish: false,
            views: 0,
            publicationDate: '-'
        });

        await AdDescription.create({
            idKey: idKey,
            editorContent: req.body.editorContent
        });

        // checking advertiser session

        // validation
        if (typeof advertiserID !== 'string' || typeof entryKey !== 'string') {
            advertiserID = '';
            entryKey = '';
        }

        let newIdKeys = [];
        let createAdvertiserSession = false;
        const advertiserShortSession = await AdvertiserShortSession.findOne({ advertiserID: advertiserID });
        if (advertiserShortSession) {
            const advertiserCorrect = await bcrypt.compare(entryKey, advertiserShortSession.entryKeyHash);

            if (advertiserCorrect) {
                newIdKeys = advertiserShortSession.idKeys.concat(idKey);

                await advertiserShortSession.updateOne({
                    $push: { idKeys: idKey }
                });
            } else { createAdvertiserSession = true; }
        } else { createAdvertiserSession = true; }

        // if it is new advertiser then create session
        if (createAdvertiserSession) {
            advertiserID = randomString(50,['letters', 'numbers']);   // it must be only letters and numbers, because mongoose doesnt recognize signs well in find function
            entryKey = randomString(60);
            const entryKeyHash = await bcrypt.hash(entryKey, 10);
            newIdKeys = [idKey];

            await AdvertiserShortSession.create({
                advertiserID: advertiserID,
                entryKeyHash: entryKeyHash,
                idKeys: newIdKeys
            });
        }

        return res.status(200).send({
            text: 'Ogłoszenie zapisano',
            idKey: idKey,
            advertiserID: advertiserID,
            entryKey: entryKey,
            idKeys: newIdKeys
        });
    } catch (e) {
        console.log('Err for: receiveAdController ------------->\n' + e);

        return res.status(500).send({
            error: 'Przepraszamy, wystąpił błąd na serwerze. Możesz zgłosić problem do administratora.'
        });
    }
}