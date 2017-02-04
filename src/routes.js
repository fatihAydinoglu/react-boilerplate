import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Root from './components/Root';
import Dummy from './components/Dummy';

const routes = (
    <Route path="/" component={Root}>
        <IndexRoute component={Dummy} />
    </Route>
);

export default routes;