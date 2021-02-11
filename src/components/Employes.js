import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import CongeService from '../service';
import TextInputGroup from './TextInputGroup';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Employes extends Component {

    state = {
        employes: [],
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        cin: '',
        fonction: '',
        cnss: '',
        role: '',
        errors: {},
        currentEmploye: {},
        updfirstname: '',
        updlastname: '',
        updemail: '',
        updphone: '',
        updcin: '',
        updfonction: '',
        updcnss: '',
        updrole: '',
    }

    componentDidMount(){
        const user = CongeService.getCurrentUser();
        if(!user){
            this.props.history.push('/');
        }else{
            CongeService.getAllEmployes()
            .then( res => {
                this.setState({
                    employes: res.data
                });
            }).catch( err => {
                NotificationManager.warning('Info ! Erreur de récupérer la liste des employés', 'Info');
            })
        }
    }

    onSubmitNewEmploye = (e) =>{
        e.preventDefault();

        const {firstname, lastname, email, phone, cin, fonction, cnss, role} = this.state;

        if (firstname === '') { this.setState({ errors: { firstname: 'Prénom is required' } }); return; }
        if (lastname === '') { this.setState({ errors: { lastname: 'Nom is required' } }); return; }
        if (email === '') { this.setState({ errors: { email: 'E-mail is required' } }); return; }
        if (phone === '') { this.setState({ errors: { phone: 'Téléphone is required' } }); return; }
        if (cin === '') { this.setState({ errors: { cin: 'N° CIN is required' } }); return; }
        if (fonction === '') { this.setState({ errors: { fonction: 'Fonction is required' } }); return; }
        if (cnss === '') { this.setState({ errors: { cnss: 'N° CNSS is required' } }); return; }
        if (role === '') { this.setState({ errors: { role: 'Role is required' } }); return; }

        const employe =   {
            firstname: firstname ,
            lastname:lastname ,
            email:email ,
            cin: cin,
            phone:phone ,
            cnss:cnss ,
            fonction:fonction ,
            role:role ,
            password: cin
          }

        CongeService.saveEmploye(employe)
        .then( res => {
            NotificationManager.success('Employé enregistré avec succès', 'Success');
            this.setState({
                employes: [res.data,...this.state.employes]
            });
        }).catch( err => {
            NotificationManager.error("Erreur d'ajout ! Essayer plus tard", 'Erreur');
        });
        window.$("#addEmployeModal").modal('hide');

    }

    onSubmitUpdateEmploye = (e) =>{
        e.preventDefault();

        const {updfirstname, updlastname, updemail, updphone, updcin, updfonction, updcnss, updrole, currentEmploye} = this.state;

        if (updfirstname === '') { this.setState({ errors: { updfirstname: 'Prénom is required' } }); return; }
        if (updlastname === '') { this.setState({ errors: { updlastname: 'Nom is required' } }); return; }
        if (updemail === '') { this.setState({ errors: { updemail: 'E-mail is required' } }); return; }
        if (updphone === '') { this.setState({ errors: { updphone: 'Téléphone is required' } }); return; }
        if (updcin === '') { this.setState({ errors: { updcin: 'N° CIN is required' } }); return; }
        if (updfonction === '') { this.setState({ errors: { updfonction: 'Fonction is required' } }); return; }
        if (updcnss === '') { this.setState({ errors: { updcnss: 'N° CNSS is required' } }); return; }
        if (updrole === '') { this.setState({ errors: { updrole: 'Role is required' } }); return; }

        const employe =   {
            id: currentEmploye.id,
            firstname: updfirstname ,
            lastname: updlastname ,
            email: updemail ,
            cin: updcin,
            phone: updphone ,
            cnss: updcnss ,
            fonction: updfonction ,
            role: updrole ,
            password: updcin
          }
        CongeService.updateEmploye(employe)
        .then( res => {
            NotificationManager.success('Employé enregistré avec succès', 'Success');
            this.setState({
                employes: this.state.employes.map(emp => emp.id === employe.id ? emp = employe : emp)
            });
            this.setState({currentEmploye: {} });
        }).catch( err => {
            NotificationManager.error("Erreur de modification ! Essayer plus tard", 'Erreur');
        });
        window.$("#updateEmployeModal").modal('hide');

    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    setCurrentEmploye = (emp) => {
        this.setState({
            currentEmploye : emp,
            updfirstname: emp.firstname,
            updlastname: emp.lastname,
            updemail: emp.email,
            updphone: emp.phone,
            updcin: emp.cin,
            updfonction: emp.fonction,
            updcnss: emp.cnss,
            updrole: emp.role,
        });
    }

    onDeleteEmploye = () => {
        CongeService.deleteEmploye(this.state.currentEmploye.id)
        .then( res => {
            NotificationManager.success('Employé supprimé avec succès', 'Success');
            this.setState({
                employes: this.state.employes.filter((emp) => emp.id !== this.state.currentEmploye.id)
            });
            this.setState({currentEmploye: {} });
        }).catch( err => {
            NotificationManager.error('Erreur de suppression ! Essayer plus tard', 'Erreur');
        });
        window.$("#deleteEmployeModal").modal('hide');
    }

    render() {
        const {firstname, lastname, email, phone, cin, fonction, cnss, role, errors, employes, currentEmploye, updfirstname, updlastname, updemail, updphone, updcin, updfonction, updcnss, updrole,} = this.state;
        return (
            <div className="mx-5 my-5">
                <div className="row">
                    <div className="col-sm-3">
                        <ul className="list-group">
                            <li className="list-group-item active"> <i className="fa fa-list mr-2"></i>Mes Services</li>
                            <Link to="/admin-espace" className="list-group-item">Congés En Attente</Link>
                            <Link to="/admin-espace/all-conges" className="list-group-item">Tous Les Congés</Link>
                            <Link to="/admin-espace/employees" className="list-group-item bg-success text-white">Employees</Link>
                        </ul>
                    </div>
                    <div className="col-sm-9">
                        <div className="card">
                                <div className="card-header bg-primary text-white">EMPLOYEES</div>
                                <div className="card-body">
                                <button className="btn btn-sm btn-success float-right mb-2" data-toggle="modal" data-target="#addEmployeModal"><i className="fa fa-plus mr-2"></i>Nouveau Demande</button>


                                { employes.length > 0 ? (
                                    <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>N°</th>
                                            <th>Nom & Prénom</th>
                                            <th>Email</th>
                                            <th>TEL</th>
                                            <th>Fonction</th>
                                            <th>OPTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employes.map(emp => (
                                    <tr key={emp.id}>
                                        <td>{emp.id}</td>
                                        <td>{(emp.lastname+' '+emp.firstname).toUpperCase()}</td>
                                        <td>{emp.email}</td>
                                        <td>{emp.phone}</td>
                                        <td>{emp.fonction}</td>
                                        <td>
                                        <button onClick={this.setCurrentEmploye.bind(this, emp)} className="btn btn-sm btn-danger mr-2" title="Delete"  data-toggle="modal" data-target="#deleteEmployeModal"><i className="fa fa-trash"></i></button>
                                        <button onClick={this.setCurrentEmploye.bind(this, emp)} className="btn btn-sm btn-warning mr-2" title="Update"  data-toggle="modal" data-target="#updateEmployeModal"><i className="fa fa-pencil text-white"></i></button>
                                        </td>
                                    </tr>
                                    ))}
                                    </tbody>
                                </table>   
                                ) : (
                                    <div class="alert alert-info mt-5" role="alert">
                                        Aucune Employé à afficher !!
                                    </div>
                                )}

                                </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade" id="addEmployeModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">NOUVEAU EMPLOYE</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                <form onSubmit={this.onSubmitNewEmploye}>
                                <TextInputGroup name="firstname" type="text" placeholder="Prénom" value={firstname} onChange={this.onChange} error={errors.firstname} />
                                    <TextInputGroup name="lastname" type="text" placeholder="Nom" value={lastname} onChange={this.onChange} error={errors.lastname} />
                                    <TextInputGroup name="email" type="email" placeholder="E-mail" value={email} onChange={this.onChange} error={errors.email} />
                                    <TextInputGroup name="cin" type="text" placeholder="CIN" value={cin} onChange={this.onChange} error={errors.cin} />
                                    <TextInputGroup name="phone" type="text" placeholder="Téléphone" value={phone} onChange={this.onChange} error={errors.phone} />
                                    <TextInputGroup name="cnss" type="text" placeholder="N° CNSS" value={cnss} onChange={this.onChange} error={errors.cnss} />
                                    <TextInputGroup name="fonction" type="text" placeholder="Fonction" value={fonction} onChange={this.onChange} error={errors.fonction} />
                                    <TextInputGroup name="role" type="text" placeholder="USER ou ADMIN" value={role} onChange={this.onChange} error={errors.role} />

                                        <button type="button" className="btn btn-info mr-2 col-md-5 " data-dismiss="modal"><i className="fa fa-undo mr-2"></i>Close</button>
                                        <button type="submit" className="btn btn-success col-md-5"><i className="fa fa-save mr-2"></i>Enregistrer</button>
                                </form>
                                    
                                </div>
                                </div>
                            </div>
                        </div>


                        <div className="modal fade" id="updateEmployeModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">MODIFIER EMPLOYE : {(currentEmploye.lastname+' '+currentEmploye.firstname).toUpperCase()}</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                <form onSubmit={this.onSubmitUpdateEmploye}>
                                    <TextInputGroup name="updfirstname" type="text" placeholder="Prénom" value={updfirstname} onChange={this.onChange} error={errors.updfirstname} />
                                    <TextInputGroup name="updlastname" type="text" placeholder="Nom" value={updlastname} onChange={this.onChange} error={errors.updlastname} />
                                    <TextInputGroup name="updemail" type="email" placeholder="E-mail" value={updemail} onChange={this.onChange} error={errors.updemail} />
                                    <TextInputGroup name="updcin" type="text" placeholder="CIN" value={updcin} onChange={this.onChange} error={errors.updcin} />
                                    <TextInputGroup name="updphone" type="text" placeholder="Téléphone" value={updphone} onChange={this.onChange} error={errors.updphone} />
                                    <TextInputGroup name="updcnss" type="text" placeholder="N° CNSS" value={updcnss} onChange={this.onChange} error={errors.updcnss} />
                                    <TextInputGroup name="updfonction" type="text" placeholder="Fonction" value={updfonction} onChange={this.onChange} error={errors.updfonction} />
                                    <TextInputGroup name="updrole" type="text" placeholder="USER ou ADMIN" value={updrole} onChange={this.onChange} error={errors.updrole} />
                                        <button type="button" className="btn btn-info mr-2 col-md-5 " data-dismiss="modal"><i className="fa fa-undo mr-2"></i>Close</button>
                                        <button type="submit" className="btn btn-success col-md-5"><i className="fa fa-save mr-2"></i>Modifier</button>
                                </form>
                                    
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal fade" id="deleteEmployeModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">SUPPRIMER EMPLOYE</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                            Vous voulez supprimer l'employé N° {currentEmploye.id}
                                            <hr />
                                        <button type="button" className="btn btn-info mr-2 col-md-5 " data-dismiss="modal"><i className="fa fa-undo mr-2"></i>Close</button>
                                        <button type="button" onClick={this.onDeleteEmploye} className="btn btn-danger col-md-5"><i className="fa fa-trash mr-2"></i>Supprimer</button>
                               
                                    
                                </div>
                                </div>
                            </div>
                        </div>


                        <NotificationContainer/>
            </div>
        )
    }
}

export default Employes;
