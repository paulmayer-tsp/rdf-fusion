import * as MyTypes from "MyTypes";
import {SourcesTypes} from 'actions'
import {INewSources} from 'actions'

export const initialState: INewSources[] = [];

export const SourcesReducer = (state: INewSources[] = initialState, action: MyTypes.RootAction) => {
    console.log({load: action.payload})
    switch (action.type) {
        case SourcesTypes.NEW_SOURCES: {
            return action.payload;
        }
        default:
            return state;
    }
};
