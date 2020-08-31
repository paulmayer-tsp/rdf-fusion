import styles from './NotificationWrapper.module.scss'
import React, {SyntheticEvent, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import {
    NotificationTypes,
    notificationActions,
    INotification,
} from 'actions'
import * as MyTypes from "MyTypes";
import {Dispatch} from "redux";
import {connect} from 'react-redux'
import classNames from "classnames";
import {SnackbarContent} from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';

export interface INotificationProps {
    notification: INotification;
}

export interface State {
    open: boolean;
    currentNotification?: INotification;
}

const ConsecutiveSnackbars: React.FC<INotificationProps> = (props) => {
    const {
        notification,
    } = props

    const queueRef = React.useRef<INotification[]>([]);
    const [open, setOpen] = React.useState(false);
    const [currentNotification, setCurrentNotification] = React.useState<INotification | undefined>(undefined);

    const processQueue = () => {
        if (queueRef.current.length > 0) {
            setCurrentNotification(queueRef.current.shift());
            setOpen(true);
        }
    };

    const handleClick = (notification: INotification) => {
        queueRef.current.push(notification);
        console.log({handlingClick: true})
        if (open) {
            // immediately begin dismissing current message
            // to start showing new one
            setOpen(false);
        } else {
            processQueue();
        }
    };

    useEffect(() => {
        if (notification.id !== 0 && !queueRef.current.map(u => u.id).includes(notification.id)) {
            if (currentNotification === undefined) {
                handleClick(notification)
            } else if (currentNotification.id !== notification.id) {
                handleClick(notification);
            }
        }
    })

    const handleClose = (event: SyntheticEvent | MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        processQueue();
    };

    return (
        <Snackbar
            key={currentNotification ? currentNotification.id : undefined}
            anchorOrigin={{
                vertical: currentNotification ? currentNotification.origin ? currentNotification.origin.vertical : 'bottom' : 'bottom',
                horizontal: currentNotification ? currentNotification.origin ? currentNotification.origin.horizontal : 'left' : 'left',
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            onExited={handleExited}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
        >
            <MySnackbarContentWrapper
                onClose={handleClose}
                className={styles.snackbar}
                variant={currentNotification ? currentNotification.variant : 'success'}
                message={currentNotification ? currentNotification.text : ''}
            />
        </Snackbar>
    );
}


const MapStateToProps = (store: MyTypes.ReducerState) => ({
    notification: store.notification
})

const MapDispatchToProps = (dispatch: Dispatch<MyTypes.RootAction>) => ({
    newNotification: (notification: INotification) => dispatch({type: NotificationTypes.NEW, payload: notification}),
})

export default connect(
    MapStateToProps,
    MapDispatchToProps
)(ConsecutiveSnackbars)


export interface Props {
    className?: string;
    message?: string;
    onClose?: (event: SyntheticEvent | MouseEvent, reason?: string) => void;
    variant: keyof typeof variantIcon;
}

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

function MySnackbarContentWrapper(props: Props) {
    const {className, message, onClose, variant, ...other} = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(`snackbar_${variant}`, className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={styles.message}>
                    <Icon className={classNames(styles.icon, styles.iconVariant)}/>
                    <span>{message}</span>
                </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={styles.icon}/>
                </IconButton>,
            ]}
            {...other}
        />
    );
}