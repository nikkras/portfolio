import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import checkProps from '@jam3/react-check-extra-props';
import sanitizer from '../../util/sanitizer';

import './NotFound.scss';

// import { ReactComponent as NotFoundIcon } from '../../assets/svg/not-found-icon.svg';

const NotFound = props => {
  const componentProps = {
    className: classnames('NotFound', props.className)
  };

  return (
    <div {...componentProps}>
      {/* <NotFoundIcon /> */}
      <h3>{sanitizer('Oops! Nothing found')}</h3>
    </div>
  );
};

NotFound.propTypes = checkProps({
  className: PropTypes.string
});

NotFound.defaultProps = {
  className: ''
};

export default NotFound;
