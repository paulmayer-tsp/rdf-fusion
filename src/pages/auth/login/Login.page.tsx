import * as React from 'react';
import {connect} from "react-redux"
import {Dispatch} from "redux"
import * as MyTypes from "MyTypes"
import {Link, RouteComponentProps} from "react-router-dom"
import {
    ILoginInfo,
    AuthTypes,
    NotificationTypes,
    INotification,
} from 'actions'
import {
    AuthService,
} from 'services'
import {
    BorderlessTextField,
} from "components"
import {Formik, FormikActions, FormikProps, Form, Field, FieldProps} from 'formik';
import {CircularProgress} from "@material-ui/core";
import * as Yup from 'yup'
import styles from './Login.module.scss'
import IconEye from 'assets/imgs/icon_eye.svg'
import IconMessage from 'assets/imgs/icon_message.svg'
import IconLock from 'assets/imgs/icon_lock.svg'
import InputAdornment from '@material-ui/core/InputAdornment';
import classes from 'classnames'

export interface ILoginFormValues {
    email: string;
    password: string;
}

export interface LoginProps extends RouteComponentProps {
    readonly sign_in?: boolean;
    readonly saveLoginToAppState: (info: ILoginInfo) => void;
    readonly newNotification: (info: INotification) => void;
}

interface LoginState {
    readonly sign_in: boolean;
    readonly show_password: boolean;
}

class LoginPageComponent extends React.Component<LoginProps, LoginState> {
    readonly state: LoginState = {
        sign_in: false,
        show_password: false,
    };

    login = (
        values: ILoginFormValues,
        setSubmitting: any,
    ) => {
        const {
            saveLoginToAppState,
            newNotification,
            history,
        } = this.props
        AuthService.login(values)
            .catch(error => {
                setSubmitting(false)
                newNotification({
                    id: new Date().getTime(),
                    text: 'Unknown error, please try later',
                    variant: 'error'
                })
            })
            .then(async response => {
                setSubmitting(false)
                const responseStatus = response.status
                console.log({responseStatus})
                if ([201, 200].includes(responseStatus)) {
                    let responseData = await response.json() as ILoginInfo
                    saveLoginToAppState(responseData)
                    newNotification({
                        id: new Date().getTime(),
                        text: `Welcome mr/mrs ${responseData.firstName}`,
                        variant: 'success'
                    })
                    history.push('/dashboard')
                } else if ([404, 401, 500].includes(responseStatus)) {
                    let {message} = await response.json();
                    newNotification({
                        id: new Date().getTime(),
                        text: message,
                        variant: 'error'
                    })
                } else {
                    newNotification({
                        id: new Date().getTime(),
                        text: 'Unknown error, please try later',
                        variant: 'error'
                    })
                }
            })
    }

    fields = [
        {
            name: 'email',
            icon: IconMessage,
            type: 'email',
            label: 'Username or Email address',
            // InputProps:{
            //     endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
            //   }
        },
    ]


    render() {
        return (
            <Formik
                initialValues={{
                    email: 'bara@bara.ca',
                    password: 'bara2019',
                }}
                onSubmit={(
                    values: ILoginFormValues,
                    actions: FormikActions<ILoginFormValues>
                ) => {
                    this.login(values, actions.setSubmitting)
                    console.log({logging: 'logging'})
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email("Email not valid")
                        .required("Email is required"),
                    password: Yup.string().required("Password is required")
                })}
                render={({
                             values,
                             handleBlur,
                             handleChange,
                             submitForm,
                             handleSubmit,
                             isSubmitting,
                             setSubmitting,
                             errors,
                             touched,
                         }: FormikProps<ILoginFormValues>) => (
                    <div className={styles.container}>
                        <div
                            className={classes(
                                styles.grid_system,
                                styles.content
                            )}
                        >
                            <span className={styles.title}>Login into account</span>
                            <span className={styles.sub_title}>Use your username or email to access your account.</span>
                            {this.fields.map(field => (
                                <BorderlessTextField
                                    label={errors[field.name] ?
                                        <span className={styles.error}>{errors[field.name]}</span> : field.label}
                                    name={field.name}
                                    type={field.type}
                                    value={values[field.name]}
                                    error={Boolean(errors[field.name])}
                                    onChange={e => {
                                        handleChange(e)
                                        handleBlur(e)
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">
                                            <img
                                                src={field.icon}
                                                className={styles.adornLeft}
                                            />
                                        </InputAdornment>,
                                        endAdornment: <InputAdornment
                                            position="end"
                                            style={{cursor: 'pointer'}}
                                        >
                                        </InputAdornment>,
                                    }}
                                />
                            ))}
                            <BorderlessTextField
                                otherClasses={{
                                    label: styles.label
                                }}
                                label={errors.password ?
                                    <span className={styles.error}>{errors.password}</span> : 'password'}
                                name={'password'}
                                type={this.state.show_password ? 'text' : 'password'}
                                value={values['password']}
                                error={touched.password && Boolean(errors.password)}
                                onChange={e => {
                                    handleChange(e)
                                    handleBlur(e)
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment
                                        position="start"
                                    >
                                        <img src={IconLock} className={styles.adornLeft}/>
                                    </InputAdornment>,
                                    endAdornment: <InputAdornment
                                        position="end"
                                        onClick={e => this.setState({show_password: !this.state.show_password})}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <img src={IconEye} className={styles.adornRight}/>
                                    </InputAdornment>,
                                }}
                            />

                            <div className={styles.actions}>
                                <Link to='/auth/recover' className={styles.link}> Forgot password?</Link>
                                <button
                                    //@ts-ignore
                                    onClick={handleSubmit}
                                    className={styles.button}
                                >
                                    Login {isSubmitting && (<CircularProgress size={15}/>)}
                                </button>
                            </div>
                            <div className={styles.link}>
                                Don't have an account? <Link to='/auth/recover' className={styles.link_signup}>Register
                                here</Link>
                            </div>

                        </div>
                    </div>
                )}
            />
        );
    }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
    return {
        signed_in: store.auth.access_token !== '',
    }
}

const MapDispatchToProps = (dispatch: Dispatch<MyTypes.RootAction>) => ({
    saveLoginToAppState: (loginInfo: ILoginInfo) => dispatch({type: AuthTypes.LOGIN, payload: loginInfo}),
    newNotification: (notification: INotification) => dispatch({type: NotificationTypes.NEW, payload: notification}),
})

const LoginPage = connect(
    MapStateToProps,
    MapDispatchToProps
)(LoginPageComponent)

export {
    LoginPage
}