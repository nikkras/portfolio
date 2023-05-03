import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { device } from '@jam3/detect';
import { BaseLink } from '@jam3/react-ui';
import wait from '@jam3/wait';
import checkProps from '@jam3/react-check-extra-props';
import classes from 'dom-classes';
import select from 'dom-select';
import sanitazer from '../../util/sanitizer';
import LandingBg from '../../components/LandingBg/LandingBg';
import Smooth from '../../lib/smooth/smooth';

// import { ReactComponent as HandIcon } from '../../../src/assets/svg/waving-hand.svg';

import './Landing.scss';
import 'smooth-scrolling/demos/main.css';

import Transition from '../PagesTransitionWrapper';
import { setLandingLoaded } from '../../redux/modules/landing';
import animate from '../../util/gsap-animate';

class Landing extends React.PureComponent {
  constructor(props) {
    super(props);
    this.initSmoothScrollDebounced = debounce(this.initSmoothScroll, 300);
  }

  componentDidMount() {
    this.footer = select('footer.Footer');
    this.logo = select('.nav-logo');
    this.main = select('main');
    this.body = select('body');
    this.header = select('header.MainTopNav');
    animate.set(this.main, { clearProps: 'all' });
    if (!this.props.loaded) {
      // await for data to be loaded here e.g. via fetch
      this.props.setLandingLoaded(true);
    }
    if (!device.isMobile) {
      this.initSmoothScrollDebounced();
    }
  }

  onAppear = () => {
    this.animateIn();
  };

  onEnter = async (prevSectionExitDuration) => {
    await wait(prevSectionExitDuration); // you need to remove this if you want to perform simultaneous transition
    classes.remove(this.body, 'changePage');
    this.animateIn();
  };

  onLeave = () => {
    this.animateOut();
  };

  animateIn = () => {
    animate.to(this.logo, 0.8, { autoAlpha: 1, delay: 0.7 });
    animate.to(this.header, 0.8, { autoAlpha: 1, delay: 0.5 });
    animate.to(this.footer, 0.8, { autoAlpha: 1, delay: 0.5 });
    animate.to(this.container, 0.8, { autoAlpha: 1, delay: 0.4 });
  };

  animateOut = () => {
    // Note that the total duration should match `exit` duration for the page inside `data/pages-transitions`
    classes.add(this.body, 'changePage');
    animate.to(this.logo, 0.3, { autoAlpha: 0 });
    animate.to(this.header, 0.3, { autoAlpha: 0 });
    animate.to(this.footer, 0.3, { autoAlpha: 0 });
    animate.to(this.container, 0.3, { autoAlpha: 0 }).then(() => {
      if (typeof this.scroll !== 'undefined') {
        this.destroySmoothScroll();
      }
    });
  };

  initSmoothScroll = () => {
    const divs = this.domSmooth.filter((el) => {
      return el != null;
    });
    this.scroll = new Smooth({
      section: this.main,
      divs: divs,
      // footer: this.footer,
      preload: true,
      vs: {
        mouseMultiplier: 0.4,
        touchMultiplier: 2,
        firefoxMultiplier: 50,
      },
      // cb: this.scrollEvents ? this.scrollEvents : null,
    });
    this.scroll.init();
  };

  destroySmoothScroll = () => {
    this.main.style.transform = null;
    this.domSmooth = [];
    this.scroll.destroy();
  };

  render() {
    this.domSmooth = [];
    // const props = this.props;
    return (
      <section className="Landing" ref={(el) => (this.container = el)}>
        <div className="Landing__bg" ref={(el) => this.domSmooth.push(el)} data-scroll-speed="-8">
          <LandingBg />
        </div>
        <header className="Landing__header">
          <h1 ref={(el) => this.domSmooth.push(el)} data-scroll-speed="0.1" className="Landing__header__title">
            {sanitazer('Nikita Krassiouk')}
          </h1>
          <BaseLink
            link="mailto:info@nikkras.com"
            data-scroll
            data-scroll-speed="0.8"
            className="Landing__header__mailLink"
            target="_blank"
          >
            Feel free to say Hello{' '}
            <span role="img" aria-label="backhand index pointing right">
              👉
            </span>{' '}
            info@nikkras.com{' '}
            <span role="img" aria-label="ok hand">
              👌
            </span>
          </BaseLink>
        </header>
        <section className="Landing__works">
          <div className="Landing__works__content">
             <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://marcopolo.paolettiguitars.com/"
              target="_blank"
            >
              Marco Polo - Paoletti Guitars
              <br />
              <span>2022</span>
            </BaseLink>
             <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://www.fadpro.it/"
              target="_blank"
            >
              Fadpro
              <br />
              <span>2022</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://ioleliquore-two.vercel.app/"
              target="_blank"
            >
              i.o.l.e.
              <br />
              <span>2021</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://paolettiguitars.com/"
              target="_blank"
            >
              Paoletti Guitars
              <br />
              <span>2021</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://manovietoscane.it/"
              target="_blank"
            >
              Manovie Toscane
              <br />
              <span>2021</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://www.arredamentimacchini.com/"
              target="_blank"
            >
              Arredamenti Macchini
              <br />
              <span>2021</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://passionfruit.win/"
              target="_blank"
            >
              Passion Fruit
              <br />
              <span>2020</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://centralemontecatini.it/"
              target="_blank"
            >
              Centrale
              <br />
              <span>2020</span>
            </BaseLink>

           <BaseLink
              ref={el => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://gbautomazione.it/"
              target="_blank"
            >
              GB Automazione
              <br />
              <span>2019</span>
            </BaseLink>

            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://biondibistrot.it/"
              target="_blank"
            >
              Biondi Bistrot
              <br />
              <span>2020</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://delave.it/"
              target="_blank"
            >
              Delavè
              <br />
              <span>2018</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://jueclub.it/"
              target="_blank"
            >
              Juè Club
              <br />
              <span>2020</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://www.edilmema.it/"
              target="_blank"
            >
              Edilmema
              <br />
              <span>2021</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://insegno.eu/"
              target="_blank"
            >
              Insegno
              <br />
              <span>2021</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="http://brunoeluca.it/"
              target="_blank"
            >
              Bruno e Luca
              <br />
              <span>2017</span>
            </BaseLink>
            <BaseLink
              ref={(el) => this.domSmooth.push(el)}
              data-scroll-speed="0.8"
              link="https://www.eco2000srl.it/"
              target="_blank"
            >
              Eco 2000
              <br />
              <span>2020</span>
            </BaseLink>
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
  pageData: PropTypes.object,
});

Landing.defaultProps = {};

const mapStateToProps = (state, ownProps) => {
  return {
    previousRoute: state.previousRoute,
    loaded: state.landingLoaded.loaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLandingLoaded: (val) => dispatch(setLandingLoaded(val)),
  };
};

Landing.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Transition(Landing));
