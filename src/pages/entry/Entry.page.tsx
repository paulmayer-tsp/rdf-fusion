import * as React from 'react';
import {EntryPageRoute} from 'Routes';
import {connect} from "react-redux"
import * as MyTypes from "MyTypes";
import {Dispatch} from "redux";
import {
    INewSources,
    INotification,
    SourcesTypes,
    newSourcesAction,
    NotificationTypes,
} from "actions";
import {RouteComponentProps} from "react-router"
import {hostIp, hostPort} from "../../services/urls";

declare var Paho: any;

export interface EntryPageProps {
    readonly sources?: INewSources[];
    readonly newNotification: (info: INotification) => void;
    readonly newSources: (info: INewSources[]) => void;

}

interface EntryPageState {
    readonly signed_in: boolean;
    readonly result?: any;
    readonly data?: any;
}

class EntryPageComponent extends React.Component<EntryPageProps & RouteComponentProps, EntryPageState> {
    readonly state: EntryPageState = {
        signed_in: false,
        data:{}
    };

    onMount = () => {
        let client = new Paho.MQTT.Client(hostIp, Number(hostPort), "clientId7955");
        let {
            newNotification,
            newSources,
        } = this.props
        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        // connect the dataTopicClient
        client.connect({onSuccess: onConnect});


        // called when the dataTopicClient connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");
            client.subscribe("config");
            // let message = new Paho.MQTT.Message("Hello");
            // message.destinationName = "S1";
            // dataTopicClient.send(message);
        }

        // called when the dataTopicClient loses its connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                newNotification({
                    id: new Date().getTime(),
                    text: 'Disconnected',
                    variant: 'error'
                })
                console.log("onConnectionLost:" + responseObject.errorMessage);
            }
        }

        // called when a message arrives
        function onMessageArrived(message) {
            newNotification({
                id: new Date().getTime(),
                text: 'Sources received',
                variant: 'success'
            })
            let sourcesSplits = `${message.payloadString}`.split('#?')
            let sources = sourcesSplits.map(source => {
                let sourceElements = source.split('wwww')
                let [topic, title, desc] = sourceElements
                return {
                    topic, title, desc
                }
            });
            newSources(sources)
        }
    }

    saveData = data => this.setState({data})
    saveResult = result => this.setState({result})


    componentDidMount() {
        this.onMount();
    }

    render() {
        const {
            sources
        } = this.props

        return (
            <EntryPageRoute 
                saveData={this.saveData}
                saveResult={this.saveResult}
                data={this.state.data}
                result={this.state.result}
            />
        );
    }
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

const EntryPage = connect(
    MapStateToProps,
    MapDispatchToProps
)(EntryPageComponent)

export {
    EntryPage,
}
