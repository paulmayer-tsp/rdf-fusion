import {action} from "typesafe-actions"
import {SourcesTypes} from './SourcesTypes'

export interface INewSources {
    topic: string
    title: string
    desc: string
}

export const newSourcesAction = {
    newSources: (sources: INewSources[]) => action(SourcesTypes.NEW_SOURCES, sources),
};
