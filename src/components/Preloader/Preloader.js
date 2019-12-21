import React from 'react';
import { connect } from 'react-redux';
import { TextureLoader, DefaultLoadingManager } from 'three';
import axios from 'axios';
import PropTypes from 'prop-types';
import preloader from 'preloader';
import noop from 'no-op';
import wait from '@jam3/wait';
import checkProps from '@jam3/react-check-extra-props';
import settings from '../../data/settings';
import backupData from '../../data/backup-data';

import './Preloader.scss';

import { ReactComponent as LoaderIcon } from '../../assets/svg/loader.svg';

import animate from '../../util/gsap-animate';
import { setProgress, setReady, setSiteData } from '../../redux/modules/preloader';
import preloadAssets from '../../data/preload-assets';

class Preloader extends React.PureComponent {
  async componentDidMount() {
    await Promise.all([this.setTimer(), this.setData(), this.setLoader()]);
    this.setDone();
  }

  animateOut(onComplete) {
    return animate.to(this.container, 0.3, { autoAlpha: 0, onComplete });
  }

  async setTimer() {
    return await wait(this.props.minDisplayTime);
  }

  setData() {
    return new Promise((resolve, reject) => {
      const fetchedData = {};
      axios.get(`${settings.strapi}pages`).then(
        res => {
          fetchedData.about = res.data[0];
          fetchedData.landing = res.data[1];
          if (fetchedData.landing.acf.image) {
            const loader = new TextureLoader();
            const texture = loader.load(fetchedData.landing.acf.image);
            DefaultLoadingManager.onLoad = () => {
              fetchedData.landing.imageBg = texture;
              this.props.setSiteData(fetchedData);
              resolve(fetchedData);
            };
          } else {
            this.props.setSiteData(fetchedData);
            resolve(fetchedData);
          }
        },
        err => {
          fetchedData.landing = backupData[0];
          this.props.setSiteData(fetchedData);
          resolve(fetchedData);
        }
      );
    });
  }

  setLoader() {
    return new Promise((resolve, reject) => {
      this.loader = preloader(this.props.options);
      this.props.assets.forEach(file => this.add(file));
      this.loader.on('progress', this.onProgress);
      this.loader.on('complete', () => this.onComplete(resolve));
      this.load();
    });
  }

  add(url, options = {}) {
    this.loader.add(url, options);
  }

  load() {
    this.loader.load();
  }

  onProgress = val => {
    this.progress.children[0].innerText = `${Math.round(val * 100)}%`;
    this.props.setProgress(val);
  };

  onComplete = done => {
    this.props.setProgress(1);
    done();
  };

  setDone = async () => {
    await this.animateOut();
    this.props.setReady(true);
  };

  render() {
    return (
      <section id="Preloader" ref={r => (this.container = r)}>
        <div className="Preloader__icon">
          <LoaderIcon className="loader-icon" />
        </div>
        <div className="Preloader__progress" ref={r => (this.progress = r)}>
          <span />
        </div>
      </section>
    );
  }
}

Preloader.propTypes = checkProps({
  className: PropTypes.string,
  assets: PropTypes.array.isRequired,
  setProgress: PropTypes.func.isRequired,
  setReady: PropTypes.func.isRequired,
  minDisplayTime: PropTypes.number,
  options: PropTypes.object,
  progress: PropTypes.number,
  transitionState: PropTypes.string,
  siteData: PropTypes.object.isRequired,
  setSiteData: PropTypes.func.isRequired
});

Preloader.defaultProps = {
  className: '',
  assets: [],
  minDisplayTime: 300, // in milliseconds
  options: {
    xhrImages: false,
    loadFullAudio: false,
    loadFullVideo: false,
    onProgress: noop,
    onComplete: noop
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    progress: state.preloader.progress,
    assets: preloadAssets,
    siteData: state.siteData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setProgress: val => dispatch(setProgress(val)),
    setReady: val => dispatch(setReady(val)),
    setSiteData: val => dispatch(setSiteData(val))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { withRef: true }
)(Preloader);
