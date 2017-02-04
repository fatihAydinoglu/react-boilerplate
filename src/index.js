import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import routes from './routes';
import App from './components/App';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

require('./sass/index.scss');

const render = () => {
    ReactDOM.render(
        <AppContainer>
            <App>
                <Provider store={store}>
                    <Router history={history} routes={routes} />
                </Provider>
            </App>
        </AppContainer>,
        document.getElementById('root')
    );
};

render();

if (module.hot) {
    module.hot.accept('./components/App', () => {
        render();
    });
}