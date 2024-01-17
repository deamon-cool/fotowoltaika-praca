import { configureStore } from '@reduxjs/toolkit';
import newAdSlice from './reducers/newAdSlice';
import advertiserSessionSlice from './reducers/advertiserSessionSlice'

let preloadedState = {};
try {
  preloadedState = sessionStorage.getItem("app_store") ? JSON.parse(sessionStorage.getItem("app_store")) : {};
} catch (error) {
  // console.log(error);
}

const store = configureStore({
  reducer: {
    newAd: newAdSlice,
    advertiserSession: advertiserSessionSlice
  },
  preloadedState: preloadedState
});

store.subscribe(() => {
  sessionStorage.setItem("app_store", JSON.stringify({ ...store.getState() }));
});

export default store;
