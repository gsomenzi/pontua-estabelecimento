import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PageLoader from './components/molecules/PageLoader';
import Sidebar from './components/organisms/Layout/Sidebar';
import { RootState } from './store';
import { getLocalAccessToken, getLocalUserData } from './store/slices/auth';

import Login from './views/auth/Login';
import Home from './views/Home';
import Point from './views/Point';
import Admins from './views/Admins/List';
import Users from './views/Users/List';
import UserDetails from './views/Users/Details';
import Products from './views/Products/List';
import ProductDetails from './views/Products/Details';
import Sales from './views/Sales/List';
import SaleDetails from './views/Sales/Details';

export default function Router() {
    const [ready, setReady] = useState(false);
    const dispatch = useDispatch();
    const { access_token } = useSelector((state: RootState) => state.auth);

    async function initApp() {
        await dispatch(getLocalAccessToken());
        await dispatch(getLocalUserData());
        setTimeout(() => setReady(true), 1000);
    }

    useEffect(() => {
        initApp();
    }, [dispatch]);

    return ready ? (
        <BrowserRouter>
            <div>
                {access_token ? (
                    <>
                        <Sidebar />
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/pontuar" component={Point} />
                            <Route exact path="/usuarios" component={Users} />
                            <Route path="/usuarios/:id" component={UserDetails} />
                            <Route exact path="/admins" component={Admins} />
                            <Route exact path="/premios" component={Products} />
                            <Route path="/premios/:id" component={ProductDetails} />
                            <Route exact path="/promocoes" component={Sales} />
                            <Route path="/promocoes/:id" component={SaleDetails} />
                            {/*
                            <Route exact path="/estabelecimentos" component={Establishments} />
                            */}
                        </Switch>
                    </>
                ) : (
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route exact path="*" component={() => <Redirect to="/" />} />
                    </Switch>
                )}
            </div>
        </BrowserRouter>
    ) : (
        <PageLoader />
    );
}
