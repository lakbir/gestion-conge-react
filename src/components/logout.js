import React, { Component } from 'react';
import CongeService from '../service';

class Logout extends Component {

    componentDidMount(){
        CongeService.deleteItemFromLocalStorage();
        this.props.history.push('/');
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default Logout;
