import * as config from '../config/config'

const computeSessionTimeLeft = () => {
    const timeTodayMiliseconds = new Date().getTime();
    const expirationTime = parseInt(localStorage.getItem(config.EXP_TIME_NAME_LOCAL_STORAGE));

    let difference = expirationTime - timeTodayMiliseconds;
    if (difference <= 0) {
        difference = 0;
    }

    return Math.floor(difference / 1000 / 60);
};

export default computeSessionTimeLeft;