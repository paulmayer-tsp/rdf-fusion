import * as React from 'react';
import styles from './RoundedIndicatorTab.module.scss'

export interface RoundedIndicatorTabProps {
  readonly dumm?: boolean;
}

interface RoundedIndicatorTabState {
  readonly dumm:boolean;
}

export class RoundedIndicatorTab extends React.Component<RoundedIndicatorTabProps, RoundedIndicatorTabState> {
  readonly state: RoundedIndicatorTabState = { dumm: false };


  render() {
    return (
      <div >
        hello world
      </div>
    );
  }
}
