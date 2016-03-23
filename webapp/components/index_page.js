import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

export default class Index extends Component {
    render() {
        return <Link to="/hello">see hello</Link>
    }
}