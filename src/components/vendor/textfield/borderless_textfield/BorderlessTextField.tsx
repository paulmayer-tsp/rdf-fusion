import * as React from 'react';
import styles from './BorderlessTextField.module.scss'
import Textfield, {TextFieldProps} from '@material-ui/core/TextField'
import classNames from 'classnames'

/**
 * This component respects the same api as the default material ui textfield component.
 * have a look at UserListPage.tsx file on the last commit of this branch feature_textfield_custom_component
 * to have an idea how it's used.
 */

 interface BorderlessTextFieldProps {
     readonly otherClasses?:{
         container?:string,
         label?:string,
        //  ...TextFieldProps.classes,
     }
 }


export const BorderlessTextField: React.FC<BorderlessTextFieldProps & TextFieldProps> = (props) => {

    const {
        otherClasses= {
            container : '',
            label : '',
        },
        classes: {
            root: classes_root,
            ...restClasses
        } = {
            root: '',
            dummy: '',
        },
        variant,
        label,
        InputProps = {
            classes: {
                input: '',
                root: '',
            }
        },
        select,
        children,
        ...rest
    } = props

    let label_definite = label;
    if (select === false) {
        label_definite = ''
    }
    const renderTextField = () =>(
        <Textfield
            {...rest}
            classes={{
                root: classNames(
                    styles.container,
                    classes_root,
                ),
                ...restClasses
            }}
            variant={'outlined'}
            InputProps={{
                ...InputProps,
                classes: {
                    input: styles.textfield_input,
                    root: styles.textfield_root,
                },
            }}
            select={Boolean(select)}
        >
            {children}
        </Textfield>
    );

    return (
        <>
        {label ? (
            <div
                className={classNames(
                    styles.container,
                    otherClasses.container,
                )}
            >
                <span
                className={
                    classNames(
                        styles.label,
                        otherClasses.label,
                    )
                }
                >{label}</span>
                {renderTextField()}
            </div>
        ) : (
            <>
            {renderTextField()}
            </>
        )}
        </>
    )
}
