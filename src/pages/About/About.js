import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LocomotiveScroll from 'locomotive-scroll';
import classnames from 'classnames';
import wait from '@jam3/wait';
import checkProps from '@jam3/react-check-extra-props';
import axios from 'axios';

import './About.scss';

// import ReactMarkdown from 'react-markdown';
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
    this.content.innerHTML = this.props.pageData.content.rendered;
    this.scroll = new LocomotiveScroll({
      el: document.querySelector('#root'),
      smooth: true
    });

    // const contactForm = {};
    // axios.get(`https://admin.nikkras.com/wp-json/contact-form-7/v1/contact-forms/19`).then(
    //   res => {
    //     console.log(res);
    //     // contactForm.form = res.data[0];
    //   },
    //   err => {}
    // );
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
        <h1>{this.props.pageData.title.rendered}</h1>
        <div className="content" ref={r => (this.content = r)} />
        <img src={this.props.pageData.acf.image.url} alt="" />
        <Form />
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
