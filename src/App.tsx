import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from "react-router-dom";
import {
    EntryPage, AuthPage,
} from './pages';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Provider} from "react-redux";
import store from "./store/store";
import {NotificationComponent} from 'components'

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <NotificationComponent/>
                <CssBaseline/>
                <div className="App">
                    <Switch>
                        <Route
                            path={'/dashboard'}
                            component={EntryPage}
                        />
                        <Route
                            path={'/auth'}
                            component={AuthPage}
                        />
                        <Redirect to={"/dashboard"}/>
                    </Switch>
                </div>
            </Router>
        </Provider>

    );
}

export default App;
