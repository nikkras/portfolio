import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { BaseLink } from '@jam3/react-ui';
import LocomotiveScroll from 'locomotive-scroll';
import wait from '@jam3/wait';
import checkProps from '@jam3/react-check-extra-props';
import sanitazer from '../../util/sanitizer';
import LandingBg from '../../components/LandingBg/LandingBg';

// import { ReactComponent as HandIcon } from '../../../src/assets/svg/waving-hand.svg';

import './Landing.scss';

import Transition from '../PagesTransitionWrapper';
import { setLandingLoaded } from '../../redux/modules/landing';
import animate from '../../util/gsap-animate';

class Landing extends React.PureComponent {
  componentDidMount() {
    animate.set(this.container, { autoAlpha: 0 });
    this.scroll = new LocomotiveScroll({
      el: document.querySelector('#root'),
      smooth: true,
      inertia: 0.6
    });

    if (!this.props.loaded) {
      // await for data to be loaded here e.g. via fetch
      this.props.setLandingLoaded(true);
    }
  }

  onAppear = () => {
    this.animateIn();
  };

  onEnter = async prevSectionExitDuration => {
    await wait(prevSectionExitDuration); // you need to remove this if you want to perform simultaneous transition
    this.animateIn();
  };

  onLeave = () => {
    this.animateOut();
    this.scroll.destroy();
  };

  animateIn = () => {
    animate.to(this.container, 0.3, { autoAlpha: 1 });
  };

  animateOut = () => {
    // Note that the total duration should match `exit` duration for the page inside `data/pages-transitions`
    animate.to(this.container, 0.3, { autoAlpha: 0 });
  };

  render() {
    return (
      <section className={classnames('Landing', this.props.className)} ref={el => (this.container = el)}>
        <LandingBg />
        <header className="Landing__header">
          <h1 data-scroll data-scroll-speed="0.1" className="Landing__header__title">
            Nikita Krassiouk
          </h1>
          <BaseLink
            link="mailto:info@nikkras.com"
            data-scroll
            data-scroll-speed="0.8"
            className="Landing__header__mailLink"
            target="blank"
          >
            {sanitazer('Feel free to say Hi 👋')}
            {/* <HandIcon className="Landing__header__icon" /> */}
          </BaseLink>
        </header>
        <section className="Landing__works">
          <div className="Landing__works__content">
            {this.props.pageData.works.map((el, i) => {
              return (
                <BaseLink key={el.title} data-scroll data-scroll-speed="0.8" link={el.link} target="blank">
                  {sanitazer(el.title)}
                </BaseLink>
              );
            })}
          </div>
        </section>
      </section>
    );
  }
}

Landing.propTypes = checkProps({
  className: PropTypes.string,
  transitionState: PropTypes.string.isRequired,
  previousRoute: PropTypes.string,
  loaded: PropTypes.bool,
  setLandingLoaded: PropTypes.func,
  pageData: PropTypes.object
});

Landing.defaultProps = {};

const mapStateToProps = (state, ownProps) => {
  return {
    previousRoute: state.previousRoute,
    loaded: state.landingLoaded.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLandingLoaded: val => dispatch(setLandingLoaded(val))
  };
};

Landing.defaultProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transition(Landing));
