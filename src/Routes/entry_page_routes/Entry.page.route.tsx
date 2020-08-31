import React from 'react';
import {Switch, Route} from "react-router-dom";

import {
    HomePage,
    ResultsPage,
    StatsPage,
} from './../../pages';

interface EntryPageRouteProps {
    readonly url?: boolean;
    readonly saveData?: any;
    readonly saveResult?: any;
    readonly data:any;
    readonly result:any;
}

const EntryPageRoute: React.FC<EntryPageRouteProps> = (props) => {
    const {
        url = '/dashboard',
        saveData,
        saveResult,
        data,
        result,
    } = props

    return (
        <Switch>
            <Route
                path={`${url}/results`}
                exact
                render={routeProps => (
                    <ResultsPage 
                        {...routeProps}
                        saveResult={saveResult}
                        saveData={saveData} 
                    />
                )}
            />
            <Route
                exact
                path={`${url}/results/stats`}
                render={routeProps => (
                    <StatsPage 
                        {...routeProps}
                        data={data}
                        result={result} 
                    />
                )}
            />
            <Route
                path={`${url}`}
                exact
                render={routeProps => (
                    <HomePage 
                        {...routeProps}
                        // data={data}
                        // saveData={saveData} 
                    />
                )}
            />
        </Switch>
    );
}

export default EntryPageRoute