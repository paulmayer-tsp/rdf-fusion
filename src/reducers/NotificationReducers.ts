import * as MyTypes from "MyTypes";
import {NotificationTypes} from 'actions/NotificationTypes'
import {INotification} from 'actions'

export const initialState: INotification = {
    id: 0,
    text: '',
    variant: 'success',

};

export const NotificationReducer = (state: INotification = initialState, action: MyTypes.RootAction) => {
    switch (action.type) {
        case NotificationTypes.NEW: {
            return action.payload;
        }
        default:
            return initialState;
    }
};
