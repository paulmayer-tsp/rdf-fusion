import * as React from 'react'
// import {AuthPageRoute} from 'Routes'
import styles from './Auth.module.scss'
import Logo from 'assets/imgs/fraudbuster_logo.svg'
import classes from 'classnames'


export interface AuthProps {
    readonly dumm?: boolean
}

interface AuthState {
    readonly dumm: boolean
}

class AuthPageComponent extends React.Component<AuthProps, AuthState> {
    readonly state: AuthState = {dumm: false}


    render() {
        return (
            <>
                <span className={styles.background}></span>
                <div className={styles.container}>
                    <div
                        className={classes(
                            styles.grid_system,
                            styles.content,
                        )}
                    >
                        <img src={Logo} className={styles.logo}/>
                        {/*<AuthPageRoute/>*/}
                    </div>
                </div>
            </>
        )
    }
}

export {
    AuthPageComponent as AuthPage
}
