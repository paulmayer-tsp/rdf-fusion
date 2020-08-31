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
import styles from './SignUp.module.scss'
import IconCategory from 'assets/imgs/icon_category.svg'
import IconEye from 'assets/imgs/icon_eye.svg'
import IconKey from 'assets/imgs/icon_key.svg'
import IconLeaf from 'assets/imgs/icon_leaf.svg'
import IconMessage from 'assets/imgs/icon_message.svg'
import IconPerson from 'assets/imgs/icon_person.svg'
import IconLock from 'assets/imgs/icon_lock.svg'
import InputAdornment from '@material-ui/core/InputAdornment';
import classes from 'classnames'

interface ISignUpFormValues {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    username: string;
    province: string;
    ref_id: string;
}

export interface SignUpProps extends RouteComponentProps {
    readonly sign_in?: boolean;
    readonly saveLoginToAppState: (info: ILoginInfo) => void;
    readonly newNotification: (info: INotification) => void;
}

interface SignUpState {
    readonly sign_in: boolean;
    readonly show_password: boolean;
}

class SignUpPageComponent extends React.Component<SignUpProps, SignUpState> {
    readonly state: SignUpState = {
        sign_in: false,
        show_password: false,
    };

    login = (
        values: ISignUpFormValues | any,
        setSubmitting: any,
    ) => {
        const {
            saveLoginToAppState,
            newNotification,
            history,
        } = this.props
        AuthService.login(values)
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
                } else if ([404, 500].includes(responseStatus)) {
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
            .catch(error => {
                setSubmitting(false)
            })
    }

    fields = [
        {
            name: 'username',
            icon: IconMessage,
            label: 'Username or Email address',
        },
    ]


    render() {
        return (
            <Formik
                initialValues={{
                    email: 'bara@bara.ca',
                    password: 'bara2019',
                    firstname: 'bara2019',
                    lastname: 'bara2019',
                    username: 'bara2019',
                    province: 'quebec',
                    ref_id: 'quebec',
                }}
                onSubmit={(
                    values: ISignUpFormValues,
                    actions: FormikActions<ISignUpFormValues>
                ) => {
                    // this.login(values, actions.setSubmitting)
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
                         }: FormikProps<ISignUpFormValues>) => (
                    <div className={styles.container}>
                        <div
                            className={classes(
                                styles.grid_system,
                                styles.content
                            )}
                        >
                            <span className={styles.title}>Create an account on Fraud-Busters</span>
                            <span className={styles.sub_title}>Create a new Customer account in a minute</span>
                            <BorderlessTextField
                                otherClasses={{
                                    label: styles.label
                                }}
                                label={"Firstname"}
                                name={'firstname'}
                                type={this.state.show_password ? 'text' : 'firstname'}
                                value={values['firstname']}
                                error={touched.firstname && Boolean(errors.firstname)}
                                onChange={e => {
                                    handleChange(e)
                                    handleBlur(e)
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment
                                        position="start"
                                    >
                                        <img src={IconPerson} className={styles.adornLeft}/>
                                    </InputAdornment>,
                                }}
                            />

                            <BorderlessTextField
                                otherClasses={{
                                    label: styles.label
                                }}
                                label={'Lastname'}
                                name={'lastname'}
                                type={this.state.show_password ? 'text' : 'lastname'}
                                value={values['lastname']}
                                error={touched.lastname && Boolean(errors.lastname)}
                                onChange={e => {
                                    handleChange(e)
                                    handleBlur(e)
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment
                                        position="start"
                                    >
                                        <img src={IconPerson} className={styles.adornLeft}/>
                                    </InputAdornment>,
                                }}
                            />

                            <BorderlessTextField
                                otherClasses={{
                                    label: styles.label
                                }}
                                label={"Username"}
                                name={'username'}
                                type={this.state.show_password ? 'text' : 'username'}
                                value={values['username']}
                                error={touched.username && Boolean(errors.username)}
                                onChange={e => {
                                    handleChange(e)
                                    handleBlur(e)
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment
                                        position="start"
                                    >
                                        <img src={IconKey} className={styles.adornLeft}/>
                                    </InputAdornment>,
                                }}
                            />

                            <BorderlessTextField
                                otherClasses={{
                                    label: styles.label
                                }}
                                label={"email"}
                                name={'email'}
                                type={this.state.show_password ? 'text' : 'email'}
                                value={values['email']}
                                error={touched.email && Boolean(errors.email)}
                                onChange={e => {
                                    handleChange(e)
                                    handleBlur(e)
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment
                                        position="start"
                                    >
                                        <img src={IconMessage} className={styles.adornLeft}/>
                                    </InputAdornment>,
                                }}
                            />
                            <BorderlessTextField
                                otherClasses={{
                                    label: styles.label
                                }}
                                label={'Province'}
                                name={'province'}
                                type={this.state.show_password ? 'text' : 'province'}
                                value={values['province']}
                                error={touched.province && Boolean(errors.province)}
                                onChange={e => {
                                    handleChange(e)
                                    handleBlur(e)
                                }}
                                select
                                InputProps={{
                                    startAdornment: <InputAdornment
                                        position="start"
                                    >
                                        <img src={IconLeaf} className={styles.adornLeft}/>
                                    </InputAdornment>,
                                }}
                            >
                                {['quebec', 'Labrador'].map(text => <option value={text}>{text}</option>)}
                            </BorderlessTextField>

                            <BorderlessTextField
                                otherClasses={{
                                    label: styles.label
                                }}
                                label={"Reference ID"}
                                name={'ref_id'}
                                type={this.state.show_password ? 'text' : 'ref_id'}
                                value={values['ref_id']}
                                error={touched.ref_id && Boolean(errors.ref_id)}
                                onChange={e => {
                                    handleChange(e)
                                    handleBlur(e)
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment
                                        position="start"
                                    >
                                        <img src={IconKey} className={styles.adornLeft}/>
                                    </InputAdornment>,
                                }}
                            />

                            <div className={styles.actions}>
                                <button className={styles.btn_register}>
                                    Register
                                </button>
                            </div>
                            <div className={styles.link}>
                                Already have an account?&nbsp;<Link to='/auth/login' className={styles.link_signup}>Login
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

const SignUpPage = connect(
    MapStateToProps,
    MapDispatchToProps
)(SignUpPageComponent)

export {
    SignUpPage
}