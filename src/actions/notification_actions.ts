import {action} from "typesafe-actions"
import {NotificationTypes} from './NotificationTypes'
import {SnackbarOrigin} from "@material-ui/core/Snackbar";

export interface INotification {
    id: number
    text: string
    variant: 'warning' | 'success' | 'error'
    origin?: SnackbarOrigin
}

export const notificationActions = {
    newNotification: (notifInfo: INotification) => action(NotificationTypes.NEW, notifInfo),
};
