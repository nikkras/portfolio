import './util/polyfills';

import 'normalize.css';

import './util/unsupported';
import framework from './framework';
import * as serviceWorker from './serviceWorker';

import './style/main.scss';

if (process.env.NODE_ENV !== 'production' && window.location.href.indexOf('?nostat') === -1) require('@jam3/stats')();

framework();
serviceWorker.unregister();
