import React, { Component } from 'react';
import CongeService from '../service';
import TextInputGroupTitle from './TextInputGroupTitle';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class UserEspace extends Component {

    state = {
        type: '',
        datedebut: '',
        numberday: '0',
        errors: {},
        mesConges: [],
        currentConge: {},
        updType: '',
        updDatedebut: '',
        updNumberday: '0',
      };

    componentDidMount(){
        const user = CongeService.getCurrentUser();
        if(!user){
            this.props.history.push('/');
        }else{
            CongeService.getMesConges()
            .then( res => {
                this.setState({
                    mesConges: res.data
                });
            }).catch( err => {
                NotificationManager.warning('Info ! Erreur de récupérer la liste de congés', 'Info');
            })
        }
    }

    setCurrentConge = (conge) => {
        this.setState({
            currentConge: conge,
            updType : conge.type,
            updDatedebut: conge.datedebut,
            updNumberday: conge.nbjour
        })
    }


    onChange = e => this.setState({ [e.target.name]: e.target.value });
    
    onSubmitNewConge = (e) =>{
        e.preventDefault();

        const { type, datedebut, numberday } = this.state;

        if (type === '') {
            this.setState({ errors: { type: 'Type is required' } });
            return;
          }
        
        if (datedebut === '') {
            this.setState({ errors: { datedebut: 'Date is required' } });
            return;
          }

        if (numberday === '' || numberday === '0') {
            this.setState({ errors: { numberday: 'Nomber de jour is required' } });
            return;
        }

        CongeService.saveDemandeConge(type, numberday, datedebut)
                    .then( res => {
                        NotificationManager.success('Demande enregistré avec succès', 'Success');
                        this.setState({
                            mesConges: [res.data,...this.state.mesConges]
                        });
                    }).catch( err => {
                        NotificationManager.error('Erreur ! Essayer plus tard', 'Erreur');
                    });
                    window.$("#addCongeModal").modal('hide');
    }

    onUpdateConge = (e) => {
        e.preventDefault();

        const { updType, updDatedebut, updNumberday, currentConge } = this.state;

        if (updType === '') {
            this.setState({ errors: { updType: 'Type is required' } });
            return;
          }
        
        if (updDatedebut === '') {
            this.setState({ errors: { updDatedebut: 'Date is required' } });
            return;
          }

        if (updNumberday === '' || updNumberday === '0') {
            this.setState({ errors: { updNumberday: 'Nomber de jour is required' } });
            return;
        }

        currentConge.nbjour = updNumberday;
        currentConge.type = updType;
        currentConge.datedebut = updDatedebut;
        currentConge.etat = 'En Attente';

        CongeService.updateConge(currentConge)
        .then( res => {
            NotificationManager.success('Demande modifié avec succès', 'Success');
            this.setState({
                mesConges: this.state.mesConges.map(conge => conge.id === currentConge.id ? conge = currentConge : conge)
            });
            this.setState({currentConge: {} });
        }).catch( err => {
            NotificationManager.error('Erreur de modification ! Essayer plus tard', 'Erreur');
        });
        window.$("#updateCongeModal").modal('hide');


    }

    onDeleteConge = () =>{
       CongeService.deleteConge(this.state.currentConge.id)
                    .then( res => {
                        NotificationManager.success('Demande supprimé avec succès', 'Success');
                        this.setState({
                            mesConges: this.state.mesConges.filter((conge) => conge.id !== this.state.currentConge.id)
                        });
                        this.setState({currentConge: {} });
                    }).catch( err => {
                        NotificationManager.error('Erreur de suppression ! Essayer plus tard', 'Erreur');
                    });
        
        window.$("#deleteCongeModal").modal('hide');
    }

    render() {
        const {type, datedebut, numberday, errors, mesConges, currentConge, updType, updDatedebut, updNumberday} = this.state;
        return (
            <div className="col-md-10 offset-md-1 mt-5">
                        <div className="card">
                            <div className="card-header bg-primary text-white">MES CONGES</div>
                            <div className="card-body">
                                <button className="btn btn-sm btn-success float-right mb-2" data-toggle="modal" data-target="#addCongeModal"><i className="fa fa-plus mr-2"></i>Nouvelle Demande</button>
                                { mesConges.length > 0 ? (
                                    <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>N°</th>
                                            <th>DATE DEBUT</th>
                                            <th>DUREE(jrs)</th>
                                            <th>TYPE</th>
                                            <th>ETAT</th>
                                            <th>OPTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mesConges.map(conge => (
                                    <tr key={conge.id}>
                                        <td>{conge.id}</td>
                                        <td>{conge.datedebut}</td>
                                        <td>{conge.nbjour}</td>
                                        <td>{conge.type}</td>
                                        <td><span className={"badge "+(conge.etat === 'Validé' ? 'badge-success' : '')+(conge.etat === 'Refusée' ? 'badge-danger' : '')+(conge.etat === 'En Attente' ? 'badge-warning text-white' : '')}>{conge.etat}</span></td>
                                        <td>
                                            { conge.etat !== 'Validé' ? ( <button onClick={this.setCurrentConge.bind(this, conge)} className="btn btn-sm btn-danger mr-2" title="Delete"  data-toggle="modal" data-target="#deleteCongeModal"><i className="fa fa-trash"></i></button> ): null}
                                            { conge.etat !== 'Validé' ? ( <button onClick={this.setCurrentConge.bind(this, conge)} className="btn btn-sm btn-warning" title="Update"  data-toggle="modal" data-target="#updateCongeModal"><i className="fa fa-pencil text-white"></i></button>): null}
                                        </td>
                                    </tr>
                                    ))}
                                    </tbody>
                                </table>   
                                ) : (
                                    <div class="alert alert-info mt-5" role="alert">
                                        Aucune Congé à afficher !!
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="modal fade" id="addCongeModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">NOUVELLE DEMANDE CONGE</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                <form onSubmit={this.onSubmitNewConge}>
                                    <TextInputGroupTitle
                                        label="Type de conge"
                                        name="type"
                                        type="text"
                                        placeholder="Type Conge"
                                        value={type}
                                        onChange={this.onChange}
                                        error={errors.type}
                                    />
                                    <TextInputGroupTitle
                                        label="Date début"
                                        name="datedebut"
                                        type="text"
                                        placeholder="JJ/MM/AAAA"
                                        value={datedebut}
                                        onChange={this.onChange}
                                        error={errors.datedebut}
                                    />
                                    <TextInputGroupTitle
                                        label="Nomber de jour"
                                        name="numberday"
                                        type="text"
                                        placeholder="Nomber de jour"
                                        value={numberday}
                                        onChange={this.onChange}
                                        error={errors.numberday}
                                    />
                                        <button type="button" className="btn btn-info mr-2 col-md-5 " data-dismiss="modal"><i className="fa fa-undo mr-2"></i>Close</button>
                                        <button type="submit" className="btn btn-success col-md-5"><i className="fa fa-save mr-2"></i>Enregistrer</button>
                                </form>
                                    
                                </div>
                                </div>
                            </div>
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
                        
                        <div className="modal fade" id="updateCongeModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">MODIFIER DEMANDE CONGE</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                <form onSubmit={this.onUpdateConge}>
                                    <TextInputGroupTitle
                                        label="Type de conge"
                                        name="updType"
                                        type="text"
                                        placeholder="Type Conge"
                                        value={updType}
                                        onChange={this.onChange}
                                        error={errors.updType}
                                    />
                                    <TextInputGroupTitle
                                        label="Date début"
                                        name="updDatedebut"
                                        type="text"
                                        placeholder="JJ/MM/AAAA"
                                        value={updDatedebut}
                                        onChange={this.onChange}
                                        error={errors.updDatedebut}
                                    />
                                    <TextInputGroupTitle
                                        label="Nomber de jour"
                                        name="updNumberday"
                                        type="text"
                                        placeholder="Nomber de jour"
                                        value={updNumberday}
                                        onChange={this.onChange}
                                        error={errors.updNumberday}
                                    />
                                        <button type="button" className="btn btn-info mr-2 col-md-5 " data-dismiss="modal"><i className="fa fa-undo mr-2"></i>Close</button>
                                        <button type="submit" className="btn btn-success col-md-5"><i className="fa fa-save mr-2"></i>Modifier</button>
                                </form>
                                    
                                </div>
                                </div>
                            </div>
                        </div>
                        
                        <NotificationContainer/>
            </div>
        )
    }
}

export default UserEspace;
