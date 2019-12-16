import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LocomotiveScroll from 'locomotive-scroll';
import classnames from 'classnames';
import wait from '@jam3/wait';
import checkProps from '@jam3/react-check-extra-props';

import './About.scss';

import ReactMarkdown from 'react-markdown';
import Transition from '../PagesTransitionWrapper';
// import PrefetchLink from '../../components/PrefetchLink/PrefetchLink';
import animate from '../../util/gsap-animate';
// import routeKeys from '../../routes/keys';

import Form from '../../components/Form/Form';

class About extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    animate.set(this.container, { autoAlpha: 0 });
    this.scroll = new LocomotiveScroll({
      el: document.querySelector('#root'),
      smooth: true,
      inertia: 0.6
    });
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
  };

  animateIn = () => {
    animate.to(this.container, 0.3, { autoAlpha: 1 });
  };

  animateOut = () => {
    // Note that the total duration should match `exit` duration for the page inside `data/pages-transitions`
    animate.to(this.container, 0.3, { autoAlpha: 0 });
    this.scroll.destroy();
  };

  handleSubmit = () => {};

  render() {
    return (
      <section className={classnames('About', this.props.className)} ref={el => (this.container = el)}>
        {console.log(this.props.pageData)}
        <h1>{this.props.pageData.name}</h1>
        <div className="content">
          <ReactMarkdown source={this.props.pageData.content} />
          <Form />
        </div>
      </section>
    );
  }
}

About.propTypes = checkProps({
  className: PropTypes.string,
  transitionState: PropTypes.string.isRequired,
  previousRoute: PropTypes.string,
  pageData: PropTypes.object
});

About.defaultProps = {};

const mapStateToProps = state => ({
  previousRoute: state.previousRoute
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transition(About));
