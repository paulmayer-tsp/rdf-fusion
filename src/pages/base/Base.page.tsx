import * as React from 'react';

export interface BaseProps {
  readonly dumm?: boolean;
}

interface BaseState {
  readonly dumm:boolean;
}

export class Base extends React.Component<BaseProps, BaseState> {
  readonly state: BaseState = { dumm: false };


  render() {
    return (
      <div >
        hello world
      </div>
    );
  }
}
