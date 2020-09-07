import React, {useEffect,} from 'react'
import {RouteComponentProps, withRouter} from "react-router"
import {Base, BorderlessTextField} from 'components'
import styles from './Home.module.scss'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from "@material-ui/core/Typography/Typography";
import RadioButtonChecked from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import {Button, CircularProgress, IconButton} from "@material-ui/core";
import {CloudUploadRounded, KeyboardArrowRight, PauseRounded, PlayArrowRounded, StopRounded} from "@material-ui/icons";
import * as MyTypes from "MyTypes";
import {Dispatch} from "redux";
import {INewSources, INotification, NotificationTypes, SourcesTypes} from "../../actions";
import {connect} from 'react-redux'
import classNames from 'classnames'
import {hostIp, hostPort} from "../../services/urls";
declare var Paho: any;

export interface HomePageProps {
    readonly sources?: INewSources[];
    readonly newNotification: (info: INotification) => void;
    readonly newSources: (info: INewSources[]) => void;
}

interface HomePageState {
    readonly signed_in: boolean
}

let sourceTopic = 'source_topic';

const HomePageComponent: React.FC<HomePageProps & RouteComponentProps> = (props) => {
    const [selectedSources, setSelectedSources] = React.useState<string[]>([]);
    const [query, setQuery] = React.useState<string>('');
    const [client, setclient] = React.useState<any>(new Paho.MQTT.Client(hostIp, Number(hostPort), "clientId2"));

    const setup = () => {
        let {
            newNotification,
            // newSources,
        } = props

        // called when the dataTopicClient connects
        const onConnect = () => {
            // Once a connection has been made, make a subscription and send a message.
            // dataTopicClient.subscribe(dataTopic)
        }

        // called when the this.dataTopicClient loses its connection
        const onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                newNotification({
                    id: new Date().getTime(),
                    text: 'Lost connection while in homepage' + responseObject.errorMessage,
                    variant: 'error'
                })
            }
        }

        // called when a message arrives
        const onMessageArrived = (message) => {
        }

        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        // connect the this.dataTopicClient
        client.connect({onSuccess: onConnect});


    }

    useEffect(setup, [])

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        if (selectedSources.includes(panel)) {
            setSelectedSources(selectedSources.filter(panelItem => panelItem !== panel))
        } else {
            setSelectedSources([...selectedSources, panel])
        }
    };

    const handleNext = (i: any) => {
        const {
            newNotification
        } = props

        if (selectedSources.length < 1) {
            newNotification({
                id: new Date().getTime(),
                text: 'Please, select a source',
                variant: 'warning'
            })
            // return;
        } else if (query === '') {
            newNotification({
                id: new Date().getTime(),
                text: 'Please, enter a valid query',
                variant: 'warning'
            })
            return;
        } else {}{
            let messageString = `${selectedSources.join('wwww')}wwww${query}`
            let message = new Paho.MQTT.Message(messageString);
            message.destinationName = sourceTopic
            client.send(message);
            const {
                history
            } = props
            history.push('/dashboard/results')
        }
    }

    /**
     * resolution to this method gotten from
     * https://javascript.info/file
     */
    const onFileDroped = filesData => {
        // @ts-ignore
        var fileToLoad = document.getElementById("input_file").files[0];

        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            // @ts-ignore
            var textFromFileLoaded = fileLoadedEvent.target.result;
            // @ts-ignore
            setQuery(textFromFileLoaded)
        };

        fileReader.readAsText(fileToLoad, "UTF-8");
    }

    const {
        sources,
    } = props
    // console.log({sources})
    return (
        <div className={styles.container}>
            <Typography className={styles.heading} variant={'h2'}>
                Please provide a query and select the various sources
            </Typography>
            <div className={styles.content}>

                <div
                    className={classNames(
                        styles.box_section,
                        styles.grid_width_full,
                    )}
                >
                    <span>Insert your query below or select a txt file containing the query</span>
                    <BorderlessTextField
                        multiline={true}
                        // label={`Insert your query below or select a txt file containing the query`}
                        rows={5}
                        onChange={e => setQuery(e.target.value)}
                        value={query}
                        rowsMax={8}
                        fullWidth={true}
                        classes={{root: styles.grid_width_full}}
                    />
                </div>
                <div
                    className={classNames(
                        styles.box_section,
                        styles.query_actions,
                    )}
                >
                    {/*
                <IconButton onClick={handleAction('play')}>
                    <PlayArrowRounded/>
                </IconButton>
                <IconButton onClick={handleAction('pause')}>
                    <PauseRounded/>
                </IconButton>
                <IconButton onClick={handleAction('stop')}>
                    <StopRounded/>
                </IconButton>
*/}
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                    <input
                        accept=".txt"
                        className={styles.input_upload_file}
                        id={'input_file'}
                        multiple
                        type="file"
                        onChange={onFileDroped}
                    />
                    <label htmlFor={'input_file'} className={styles.label_upload_file}>
                        <Button component='span'>Select a file <CloudUploadRounded/> </Button>
                    </label>
                </div>

                {sources && sources.length > 0 && sources.map(source => (
                    <ExpansionPanel expanded={selectedSources.includes(source.topic)}
                                    onChange={handleChange(source.topic)}>
                        <ExpansionPanelSummary
                            expandIcon={selectedSources.includes(source.topic) ? <RadioButtonChecked/> :
                                <RadioButtonUnchecked/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={styles.panel_heading}>{source.title}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography align={"left"}>
                                {source.desc}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))}
                {!sources || sources.length < 1 && (
                    <CircularProgress size={30}/>
                )}
                <Button
                    classes={{root: styles.btn_next}}
                    onClick={handleNext}
                    variant={'contained'}
                >NEXT <KeyboardArrowRight/>
                </Button>
            </div>
        </div>
    )
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
    return {
        sources: store.sources
    }
}

const MapDispatchToProps = (dispatch: Dispatch<MyTypes.RootAction>) => ({
    newNotification: (notification: INotification) => dispatch({type: NotificationTypes.NEW, payload: notification}),
    newSources: (sources: INewSources[]) => dispatch({type: SourcesTypes.NEW_SOURCES, payload: sources}),
})

const HomePage = connect(
    MapStateToProps,
    MapDispatchToProps
)(HomePageComponent)

export {
    HomePage
}
