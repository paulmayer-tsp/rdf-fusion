import * as React from 'react';
import styles from './ResultsComponent.module.scss'
import { BorderlessTextField } from "../../components";
import classNames from 'classnames'
import { Button, IconButton } from "@material-ui/core";
import {
    PlayArrowRounded,
    PauseRounded,
    StopRounded,
    CloudUploadRounded
} from '@material-ui/icons'
import Typography from "@material-ui/core/Typography/Typography";
import { Link, RouteComponentProps } from 'react-router-dom';
import { useEffect } from "react";
import { URLSearchParams } from "url";
import * as MyTypes from "MyTypes";
import { Dispatch } from "redux";
import { INewSources, INotification, NotificationTypes, SourcesTypes } from "../../actions";
import { connect } from 'react-redux'
import { hostIp, hostPort } from "../../services/urls";

declare var Paho: any;


export interface ResultsPageComponentState {
    readonly open?: boolean;
    readonly query?: string;
    readonly data?: string[];
}

export interface ResultsPageComponentProps {
    readonly sources?: INewSources[];
    readonly newNotification: (info: INotification) => void;
    readonly newSources: (info: INewSources[]) => void;
    readonly saveData: (data) => void;
    readonly saveResult: (data) => void;
}

class ResultsPageComponent extends React.Component<ResultsPageComponentProps & RouteComponentProps> {
    state = {
        data: [],
        results: [],
        query: '',
        open: false,
    }

    dataTopicClient;
    resultTopicClient;
    dataTopic = 'data_topic';
    resultTopic = 'result_topic';

    subscribeToDataTopic = () => {
        this.resultTopicClient = new Paho.MQTT.Client(hostIp, Number(hostPort), "clientId62");
        console.log({ client: this.resultTopicClient })
        let {
            newNotification,
            // newSources,
        } = this.props

        // called when the this.resultTopicClient connects
        const onConnect = () => {
            // Once a connection has been made, make a subscription and send a message.
            this.resultTopicClient.subscribe(this.dataTopic)
            console.log({ connected: true })
        }

        // called when the this.resultTopicClient loses its connection
        const onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                newNotification({
                    id: new Date().getTime(),
                    text: 'on disconnect listening to specific topics',
                    variant: 'error'
                })
                console.log("onConnectionLost here:" + responseObject.errorMessage);
            }
        }

        // called when a message arrives
        const onMessageArrived = (message) => {
            // newSources(sources)
            const payloadString = message.payloadString;
            // console.log({message})
            this.setState({ data: [...this.state.data, payloadString] })
            this.onScroll()
            setTimeout(() => {
                this.props.saveData(this.state.data)
            }, 300);
        }

        // set callback handlers
        this.resultTopicClient.onConnectionLost = onConnectionLost;
        this.resultTopicClient.onMessageArrived = onMessageArrived;

        // connect the this.resultTopicClient
        this.resultTopicClient.connect({ onSuccess: onConnect });
    }

    subscribeToResultTopic = () => {
        this.dataTopicClient = new Paho.MQTT.Client(hostIp, Number(hostPort), "clientId41");
        let {
            newNotification,
            // newSources,
        } = this.props

        // called when the this.dataTopicClient connects
        const onConnect = () => {
            // Once a connection has been made, make a subscription and send a message.
            this.dataTopicClient.subscribe(this.resultTopic)
            console.log({ connected: true })
        }

        // called when the this.dataTopicClient loses its connection
        const onConnectionLost = (responseObject) => {
            //do nothing as the listener for dataTopic will show the error, same for on connect.
            newNotification({
                id: new Date().getTime(),
                text: 'on disconnect listening to on result topics',
                variant: 'error'
            })
        }

        // called when a message arrives
        const onMessageArrived = (message) => {
            const payloadString = message.payloadString;
            this.setState({ results: [...this.state.results, payloadString] })
            this.onScroll()
            setTimeout(() => {
                this.props.saveResult(this.state.results)
            }, 300);
        }

        // set callback handlers
        this.dataTopicClient.onConnectionLost = onConnectionLost;
        this.dataTopicClient.onMessageArrived = onMessageArrived;

        // connect the this.dataTopicClient
        this.dataTopicClient.connect({ onSuccess: onConnect });
    }

    onMount = () => {
        this.subscribeToResultTopic()
        this.subscribeToDataTopic()
    }

    componentDidMount() {
        if (localStorage['reload'] === 'true') {
            localStorage['reload'] = false
            window.location.reload();
        }
        this.onMount();
    }

    componentWillUnmount() {
        this.dataTopicClient.disconnect()
        this.resultTopicClient.disconnect()
    }

    onScroll = () => {

        //results box
        let resultsBox = document.getElementById('results');
        //@ts-ignore
        let xHResult = resultsBox.scrollHeight;
        //@ts-ignore
        resultsBox.scrollTo({
            top: xHResult,
            left: 0,
            behavior: "smooth"
        });

        //data box
        let dataBox = document.getElementById('data');
        //@ts-ignore
        let xHBox = dataBox.scrollHeight;
        //@ts-ignore
        dataBox.scrollTo(
            {
                top: xHBox,
                left: 0,
                behavior: "smooth"
            });
    }

    /**
     * resolution to this method gotten from
     * https://javascript.info/file
     */
    onFileDroped = filesData => {
        // @ts-ignore
        var fileToLoad = document.getElementById("input_file").files[0];

        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            // @ts-ignore
            var textFromFileLoaded = fileLoadedEvent.target.result;
            // @ts-ignore
            this.setState({ query: textFromFileLoaded })
        };

        fileReader.readAsText(fileToLoad, "UTF-8");
    }

    handleAction = (type: 'play' | 'stop') => () => {
        let message = new Paho.MQTT.Message(type);
        message.destinationName = "client_actions";
        this.dataTopicClient.send(message);
    }

    render() {
        const {
            match: { url },
        } = this.props

        const {
            data,
            results,
        } = this.state

        return (
            <div className={styles.container}>
                <Typography className={styles.heading} variant={'h2'} align={'center'}>View Results and Multiple RDF graph streams</Typography>
                <div
                    className={classNames(
                        styles.box_section,
                        styles.query_actions,
                    )}
                >
                    {/* <IconButton onClick={this.handleAction('play')}>
                        <PlayArrowRounded />
                    </IconButton> */}
                    <span></span>
                    <IconButton onClick={this.handleAction('stop')}>
                        <StopRounded />
                    </IconButton>
                    <span></span>
                </div>
                <div
                    className={classNames(
                        styles.grid_width_full,
                        styles.responsive_columns,
                    )}
                >
                    <div
                        className={classNames(
                            styles.box_section,
                        )}
                    >
                        <span>FUSION MATCHES</span>
                        <span className={styles.box} id='results'>
                            {results.map(result => (
                                <span>{result}</span>
                            ))}
                        </span>
                    </div>
                    <div
                        className={classNames(
                            styles.box_section,
                        )}
                    >
                        <span>MULTIPLE RDF GRAPH STREAMS</span>
                        <span className={styles.box} id='data'>
                            {data.map(datum => (
                                <span>{datum}</span>
                            ))}
                        </span>
                    </div>
                </div>
                <div
                    className={classNames(
                        styles.grid_width_full,
                    )}
                    style={{
                        justifyItems: 'flex-end',
                        display: 'grid',
                    }}
                >
                    <Button component={Link} to={`${url}/stats`}>See statistics</Button>
                </div>
            </div>
        );
    }
}


const MapStateToProps = (store: MyTypes.ReducerState) => {
    return {
        sources: store.sources
    }
}

const MapDispatchToProps = (dispatch: Dispatch<MyTypes.RootAction>) => ({
    newNotification: (notification: INotification) => dispatch({ type: NotificationTypes.NEW, payload: notification }),
})

const ResultsPage = connect(
    MapStateToProps,
    MapDispatchToProps
)(ResultsPageComponent)

export {
    ResultsPage,
}
