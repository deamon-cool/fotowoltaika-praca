import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch, withRouter, matchPath } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectAdvertiserID
} from './store/reducers/advertiserSessionSlice';

import * as config from './config/config';
import * as text from './text/text';
import Layout from './containers/Layout/Layout';
import Ads from './containers/Ads/Ads';
import BeatLoader from "react-spinners/BeatLoader";

const AdDescription = lazy(() => import('./containers/AdDescription/AdDescription'));
const Login = lazy(() => import('./containers/Login/Login'));
const NewAd = lazy(() => import('./containers/NewAd/NewAd'));
const PostsGenerator = lazy(() => import('./containers/PostsGenerator/PostsGenerator'));
const EditPublicPost = lazy(() => import('./containers/EditPublicPost/EditPublicPost'));
const EditAd = lazy(() => import('./containers/EditAd/EditAd'));
const CheckAds = lazy(() => import('./containers/CheckAds/CheckAds'));
const Navigation = lazy(() => import('./containers/Navigation/Navigation'));
const Information = lazy(() => import('./components/Information/Information'));
const InfoDownload = lazy(() => import('./components/InfoDownload/InfoDownload'));
const AdvertiserPanel = lazy(() => import('./containers/AdvertiserPanel/AdvertiserPanel'));
const EditAdvertiserAd = lazy(() => import('./containers/EditAdvertiserAd/EditAdvertiserAd'));

function App(props) {
  // advertiser auth
  const advertiserID = useSelector(selectAdvertiserID);

  let redirectToNewAd = null;
  let advertiserRoutes = null;
  if (advertiserID !== '') {
    advertiserRoutes = (
      <>
        <Route path={config.ADVERTISER_PANEL_ROUTER} exact component={AdvertiserPanel} />
        <Route path={config.EDITADVERTISERAD_PATH_ROUTER} exact component={EditAdvertiserAd} />
      </>
    );
  } else {
    if (matchPath(props.location.pathname, { path: config.ADVERTISER_PANEL_ROUTER })) {
      redirectToNewAd = <Redirect to={config.NEWAD_PATH_ROUTER} />;
    }
  }

  // my auth
  const timeTodayMiliseconds = new Date().getTime();
  const expirationTime = parseInt(localStorage.getItem(config.EXP_TIME_NAME_LOCAL_STORAGE));

  let authenticatedRoutes = null;
  if (!isNaN(expirationTime)) {
    if (expirationTime > timeTodayMiliseconds) {
      authenticatedRoutes = (
        <>
          <Route path={config.MY_NAVIGATION_PATH_ROUTER} exact component={Navigation} />
          <Route path={config.MY_GENERATE_POSTS_ROUTER} exact component={PostsGenerator} />
          <Route path={config.MY_PUBLIC_INFO_ROUTER} exact component={EditPublicPost} />
          <Route path={config.MY_CHECKADS_ROUTER} exact component={CheckAds} />
          <Route path={config.EDITAD_PATH_ROUTER} exact component={EditAd} />
        </>
      );
    }
  }

  let routesSum = (
    <>
      {advertiserRoutes}
      {authenticatedRoutes}
    </>
  );

  let redirectToAds = null;
  if (props.location.pathname === '/') {
    redirectToAds = <Redirect to={config.ADS_PATH_PUSH + '0/wszystkie/wszystkie'} />;
  }

  // scroll up if path...
  if (props.location.pathname === config.EMPLOYER_HELP_PATH_ROUTER) {
    window.scrollTo(0, 0);
  }

  const retrunHandler = () => {
    props.history.goBack();
  }

  return (
    <>
      <Layout hideHomeButton={false}>
        <Suspense
          fallback={<BeatLoader
            color='orange'
            css='display: block; width: 60px; margin: 200px auto;' />}>
          <Switch>
            {redirectToAds}
            {redirectToNewAd}

            <Route path={config.ADS_PATH_ROUTER} exact component={Ads} />
            <Route path={config.AD_DESCRIPTION_PATH_ROUTER} exact component={AdDescription} />
            <Route path={config.MY_PATH_ROUTER} exact component={Login} />

            <Route path={config.INFORMATION_PATH_ROUTER} exact component={() =>
              <Information
                title={text.INFORMATION_TEXT}
                description={text.INFORMATION_DESCRIPTION}
                customStyle={{ marginTop: config.INFORMATION_HEIGHT }} />} />

            <Route path={config.RULE_PATH_ROUTER} exact component={() =>
              <InfoDownload
                title={text.RULE_TEXT}
                marginTop={config.INFORMATION_HEIGHT}
                downloadUrl={config.RULE_FETCH}
                fileName={text.RULE_FILENAME}
                downloadButtonName={text.DOWNLOAD_TEXT} />} />

            <Route path={config.PRIVACY_PATH_ROUTER} exact component={() =>
              <InfoDownload
                title={text.PRIVACY_TEXT}
                marginTop={config.INFORMATION_HEIGHT}
                downloadUrl={config.PRIVACY_FETCH}
                fileName={text.PRIVACY_FILENAME}
                downloadButtonName={text.DOWNLOAD_TEXT} />} />

            <Route path={config.CANDIDATE_HELP_PATH_ROUTER} exact component={() =>
              <Information
                title={text.CANDIDATE_HELP_TEXT}
                description={text.CANDIDATE_HELP_DESCRIPTION}
                isList={true}
                customStyle={{ marginTop: config.INFORMATION_HEIGHT }} />} />

            <Route path={config.EMPLOYER_HELP_PATH_ROUTER} exact component={() =>
              <Information
                title={text.EMPLOYER_HELP_TEXT}
                description={text.EMPLOYER_HELP_DESCRIPTION}
                isList={true}
                customStyle={{ marginTop: config.INFORMATION_HEIGHT }}
                retrunHandler={retrunHandler} />} />

            <Route path={config.NEWAD_PATH_ROUTER} exact component={NewAd} />

            <Route path={config.CONTACT_PATH_ROUTER} exact component={() =>
              <Information
                title={text.CONTACT_TEXT}
                description={text.CONTACT_DESCRIPTION}
                isList={true}
                customStyle={{ marginTop: config.INFORMATION_HEIGHT }} />} />

            {routesSum}

          </Switch>
        </Suspense>
      </Layout>
    </>
  );
}

export default withRouter(App);
