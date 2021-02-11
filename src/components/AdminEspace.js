import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import CongeService from '../service';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class AdminEspace extends Component {

    state = {
        conges: [],
        currentConge: {}
    }

    componentDidMount(){
        const user = CongeService.getCurrentUser();
        if(!user){
            this.props.history.push('/');
        }else if(user[0].role !== 'ADMIN'){
            this.props.history.push('/access-denied');
        }

        CongeService.getCongesEnAttente()
        .then( res => {
            this.setState({
                conges: res.data
            });
        }).catch( err => {
            NotificationManager.warning('Info ! Erreur de récupérer la liste de congés en attente', 'Info');
        })
    }

    setCurrentConge = (conge) => {
        this.setState({
            currentConge: conge,
        })
    }

    onValidateConge = () => {
        const { currentConge } = this.state;
        currentConge.etat = 'Validé';

        CongeService.updateConge(currentConge)
        .then( res => {
            NotificationManager.success('Demande Validé avec succès', 'Success');
            this.setState({
                conges: this.state.conges.filter(conge => conge.id !== currentConge.id)
            });
            this.setState({currentConge: {} });
        }).catch( err => {
            NotificationManager.error('Erreur de validation ! Essayer plus tard', 'Erreur');
        });
        window.$("#validateCongeModal").modal('hide');
    }

    onRefuserConge = () => {
        const { currentConge } = this.state;
        currentConge.etat = 'Refusée';

        CongeService.updateConge(currentConge)
        .then( res => {
            NotificationManager.success('Demande Refusée avec succès', 'Success');
            this.setState({
                conges: this.state.conges.filter(conge => conge.id !== currentConge.id)
            });
            this.setState({currentConge: {} });
        }).catch( err => {
            NotificationManager.error('Erreur de refusée ! Essayer plus tard', 'Erreur');
        });
        window.$("#refuserCongeModal").modal('hide');        
    }
    render() {
        const {conges, currentConge} = this.state;
        return (
            <div className="mx-5 my-5">
                <div className="row">
                    <div className="col-sm-3">
                        <ul className="list-group">
                            <li className="list-group-item active"> <i className="fa fa-list mr-2"></i>Mes Services</li>
                            <Link to="/admin-espace" className="list-group-item bg-success text-white">Congés En Attente</Link>
                            <Link to="/admin-espace/all-conges" className="list-group-item">Tous Les Congés</Link>
                            <Link to="/admin-espace/employees" className="list-group-item">Employees</Link>
                        </ul>
                    </div>
                    <div className="col-sm-9">
                        <div className="card">
                                <div className="card-header bg-primary text-white">CONGES EN ATTENTE</div>
                                <div className="card-body">
                                { conges.length > 0 ? (
                                    <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>N°</th>
                                            <th>DATE DEBUT</th>
                                            <th>EMPLOYE</th>
                                            <th>DUREE(jrs)</th>
                                            <th>TYPE</th>
                                            <th>OPTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {conges.map(conge => (
                                        <tr key={conge.id}>
                                        <td>{conge.id}</td>
                                        <td>{conge.name.toUpperCase()}</td>
                                        <td>{conge.datedebut}</td>
                                        <td>{conge.nbjour}</td>
                                        <td>{conge.type}</td>
                                        <td>
                                        <button onClick={this.setCurrentConge.bind(this, conge)} className="btn btn-sm btn-success mr-2" title="Valider" data-toggle="modal" data-target="#validateCongeModal"><i className="fa fa-check"></i></button>
                                        <button onClick={this.setCurrentConge.bind(this, conge)} className="btn btn-sm btn-warning mr-2" title="Réfuser"  data-toggle="modal" data-target="#refuserCongeModal"><i className="fa fa-ban text-white"></i></button>
                                        </td>
                                    </tr>
                                    ))}
                                    </tbody>
                                </table>   
                                ) : (
                                    <div className="alert alert-info mt-5" role="alert">
                                        Aucune Congé En Attente à afficher !!
                                    </div>
                                )}
                                </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade" id="validateCongeModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">VALIDER DEMANDE CONGE</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                            Vous voulez valider le congé N° {currentConge.id} de {currentConge.name}
                                            <hr />
                                        <button type="button" className="btn btn-info mr-2 col-md-5 " data-dismiss="modal"><i className="fa fa-undo mr-2"></i>Close</button>
                                        <button type="button" onClick={this.onValidateConge} className="btn btn-success col-md-5"><i className="fa fa-check mr-2"></i>Valider</button>
                                </div>
                                </div>
                            </div>
                </div>

                <div className="modal fade" id="refuserCongeModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">REFUSER DEMANDE CONGE</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                            Vous voulez réfuser le congé N° {currentConge.id} de {currentConge.name}
                                            <hr />
                                        <button type="button" className="btn btn-info mr-2 col-md-5 " data-dismiss="modal"><i className="fa fa-undo mr-2"></i>Close</button>
                                        <button type="button" onClick={this.onRefuserConge} className="btn btn-warning text-white col-md-5"><i className="fa fa-ban text-white mr-2"></i>Réfuser</button>
                                </div>
                                </div>
                            </div>
                </div>
                

                <NotificationContainer/>
            </div>
        )
    }
}
