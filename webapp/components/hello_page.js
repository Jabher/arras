import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as helloActions from '../actions/hello';

@connect(state => state.hello)
export default class Index extends Component {
    static propTypes = {
        target: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired
    };
    constructor(...args) {
        super(...args);
        this.props.dispatch(helloActions.loadTargetAsync())
    }
    render() {
        return <div>
            Hello {this.props.target}
            <br/>
            <input type="text" 
                   onChange={e => this.props.dispatch(helloActions.changeTarget(e.target.value))} 
                   value={this.props.target}/>
        </div>
    }
}