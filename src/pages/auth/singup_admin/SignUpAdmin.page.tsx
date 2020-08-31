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
import styles from './SignUpAdmin.module.scss'
import IconCategory from 'assets/imgs/icon_category.svg'
import IconEye from 'assets/imgs/icon_eye.svg'
import IconKey from 'assets/imgs/icon_key.svg'
import IconLeaf from 'assets/imgs/icon_leaf.svg'
import IconMessage from 'assets/imgs/icon_message.svg'
import IconPerson from 'assets/imgs/icon_person.svg'
import IconLock from 'assets/imgs/icon_lock.svg'
import InputAdornment from '@material-ui/core/InputAdornment';
import classes from 'classnames'

interface ISignUpAdminFormValues {
    org_email: string;
    password: string;
    org_name: string;
    province: string;
    category: string;
    org_licence_number: string;
}

export interface SignUpAdminProps extends RouteComponentProps {
    readonly sign_in?: boolean;
    readonly saveLoginToAppState: (info: ILoginInfo) => void;
    readonly newNotification: (info: INotification) => void;
}

interface SignUpAdminState {
    readonly sign_in: boolean;
    readonly show_password: boolean;
}

class SignUpAdminPageComponent extends React.Component<SignUpAdminProps, SignUpAdminState> {
    readonly state: SignUpAdminState = {
        sign_in: false,
        show_password: false,
    };

    login = (
        values: ISignUpAdminFormValues|any,
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
                    org_email: 'bara@bara.ca',
                    password: 'bara2019',
                    org_name: 'bara2019',
                    province: 'quebec',
                    category: 'quebec',
                    org_licence_number: 'bara2019',
                }}
                onSubmit={(
                    values: ISignUpAdminFormValues,
                    actions: FormikActions<ISignUpAdminFormValues>
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
                         }: FormikProps<ISignUpAdminFormValues>) => (
                    <div className={styles.container}>
                        <div
                            className={classes(
                                styles.grid_system,
                                styles.content
                            )}
                        >
                            <span className={styles.title}>Create an account on Fraud-Busters</span>
                            <span className={styles.sub_title}>Create a new Administrators account in a minute</span>
                            <BorderlessTextField
                                otherClasses={{
                                    label: styles.label
                                }}
                                label={'Name of organization'}
                                name={'org_name'}
                                type={this.state.show_password ? 'text' : 'org_name'}
                                value={values['org_name']}
                                error={touched.org_name && Boolean(errors.org_name)}
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
                                label={'Category'}
                                name={'category'}
                                type={this.state.show_password ? 'text' : 'category'}
                                value={values['category']}
                                error={touched.category && Boolean(errors.category)}
                                onChange={e => {
                                    handleChange(e)
                                    handleBlur(e)
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment
                                        position="start"
                                    >
                                        <img src={IconCategory} className={styles.adornLeft}/>
                                    </InputAdornment>,
                                }}
                            />

                            <BorderlessTextField
                                otherClasses={{
                                    label: styles.label
                                }}
                                label={'Organization or Company license number'}
                                name={'org_licence_number'}
                                type={this.state.show_password ? 'text' : 'org_licence_number'}
                                value={values['org_licence_number']}
                                error={touched.org_licence_number && Boolean(errors.org_licence_number)}
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
                                label={'Organization email address'}
                                name={'org_email'}
                                type={this.state.show_password ? 'text' : 'org_email'}
                                value={values['org_email']}
                                error={touched.org_email && Boolean(errors.org_email)}
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

                            <div className={styles.actions}>
                                <button className={styles.btn_register}>
                                    Regiter
                                </button>
                            </div>
                            <div className={styles.link}>
                                Already have an account? <Link to='/auth/login' className={styles.link_signup}>Login
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

const SignUpAdminPage = connect(
    MapStateToProps,
    MapDispatchToProps
)(SignUpAdminPageComponent)

export {
    SignUpAdminPage
}