import React, { Suspense, lazy } from 'react';
import './App.scss';
import PageLoader from './components/molecules/PageLoader';
import { Provider } from 'react-redux';
import store from './store';
const Router = lazy(() => import('./Router'));

export default function App() {
    return (
        <Provider store={store}>
            <Suspense fallback={<PageLoader />}>
                <Router />
            </Suspense>
        </Provider>
    );
}
