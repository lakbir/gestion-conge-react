import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import CongeService from '../service';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Conges extends Component {
    state = {
        conges: [],
        currentConge: {}
    }

    componentDidMount(){
        CongeService.getAllConges()
        .then( res => {
            this.setState({
                conges: res.data
            });
        }).catch( err => {
            NotificationManager.warning('Info ! Erreur de récupérer la liste de congés', 'Info');
        })
    }

    setCurrentConge = (conge) => {
        this.setState({
            currentConge: conge,
        })
    }

    onDeleteConge = () =>{
        CongeService.deleteConge(this.state.currentConge.id)
                     .then( res => {
                         NotificationManager.success('Congé supprimé avec succès', 'Success');
                         this.setState({
                            conges: this.state.conges.filter((conge) => conge.id !== this.state.currentConge.id)
                         });
                         this.setState({currentConge: {} });
                     }).catch( err => {
                         NotificationManager.error('Erreur de suppression ! Essayer plus tard', 'Erreur');
                     });
         
         window.$("#deleteCongeModal").modal('hide');
     }

    render() {
        const {conges, currentConge} = this.state;
        return (
            <div className="mx-5 my-5">
                <div className="row">
                    <div className="col-sm-3">
                        <ul className="list-group">
                            <li className="list-group-item active"> <i className="fa fa-list mr-2"></i>Mes Services</li>
                            <Link to="/admin-espace" className="list-group-item">Congés En Attente</Link>
                            <Link to="/admin-espace/all-conges" className="list-group-item bg-success text-white">Tous Les Congés</Link>
                            <Link to="/admin-espace/employees" className="list-group-item">Employees</Link>
                        </ul>
                    </div>
                    <div className="col-sm-9">
                        <div className="card">
                                <div className="card-header bg-primary text-white">HISTORIQUE CONGES</div>
                                <div className="card-body">
                                { conges.length > 0 ? (
                                    <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>N°</th>
                                            <th>EMPLOYE</th>
                                            <th>DATE DEBUT</th>
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
                                        <button onClick={this.setCurrentConge.bind(this, conge)} className="btn btn-sm btn-danger mr-2" title="Valider" data-toggle="modal" data-target="#deleteCongeModal"><i className="fa fa-trash"></i></button>
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

                            <div className="modal fade" id="deleteCongeModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">SUPPRIMER DEMANDE CONGE</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                            Vous voulez supprimer congé N° {currentConge.id}
                                            <hr />
                                        <button type="button" className="btn btn-info mr-2 col-md-5 " data-dismiss="modal"><i className="fa fa-undo mr-2"></i>Close</button>
                                        <button type="button" onClick={this.onDeleteConge} className="btn btn-danger col-md-5"><i className="fa fa-trash mr-2"></i>Supprimer</button>
                               
                                    
                                </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>



                <NotificationContainer/>
            </div>
        )
    }
}

export default Conges;
