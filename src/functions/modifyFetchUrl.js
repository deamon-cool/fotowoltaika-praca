import * as config from '../config/config';

const modifyFetchUrl = (url) => {
    let modifiedUrl = config.API_URL + url;

    return modifiedUrl;
};

export default modifyFetchUrl;