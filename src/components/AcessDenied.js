import React, { Component } from 'react'

class AcessDenied extends Component {
    render() {
        return (
            <div className="container">
                <div className="alert alert-danger mt-5">
                    <strong>Access Denied !</strong> You don't have permission to access this resource.
                </div>
            </div>
        )
    }
}

export default AcessDenied;
