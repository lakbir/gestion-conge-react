import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import CongeService from '../service';

class Header extends Component {
    state = {
        currentUser: {},
        isConnect: false
      };

    componentDidMount(){
        const user = CongeService.getCurrentUser();
        if(user){
            this.setState({
                currentUser: user[0],
                isConnect: true
            });
        }
    }

    render() {
        const { currentUser, isConnect } = this.state;
        return (
            <div>
                <nav className="navbar navbar-expand-sm navbar-dark bg-success">
                    <Link to="/" className="navbar-brand">Gestion de congé</Link>
                    <button className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    { isConnect ? (
                    <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to="my-account" className="nav-link"><i className="fa fa-user mr-2"></i>{(currentUser.lastname+' '+currentUser.firstname).toUpperCase()}</Link>
                                </li>

                                <li className="nav-item">
                                    <Link to="logout" className="nav-link"><i className="fa fa-sign-out mr-2"></i>Logout</Link>
                                </li>
                            </ul>
                    </div>
                    ) : null
                    }

                </nav>
            </div>
        )
    }
}

export default Header;
