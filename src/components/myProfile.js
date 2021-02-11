import React, { Component } from 'react'
import CongeService from '../service';
import TextInputGroup from './TextInputGroup';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class myProfile extends Component {

    state = {
        id:null,
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        cin: '',
        fonction: '',
        cnss: '',
        password: '',
        role: '',
        errors: {},
        currentUser: {},
        repassword:'',
        cpassword:'',
        ppassword:''
    }

    componentDidMount(){
        const user = CongeService.getCurrentUser();
        if(!user){
            this.props.history.push('/');
        }else{
           this.setState({
            currentUser: user[0],
            id : user[0].id,
            firstname: user[0].firstname,
            lastname: user[0].lastname,
            email: user[0].email,
            phone: user[0].phone,
            cin: user[0].cin,
            fonction: user[0].fonction,
            cnss: user[0].cnss,
            password: user[0].password,
            role: user[0].role
           })
        }
    }


    onSubmitMesInfos = (e) =>{
        e.preventDefault();

        const {id, firstname, lastname, email, phone, cin, fonction, cnss, password, role} = this.state;

        if (firstname === '') { this.setState({ errors: { firstname: 'Prénom is required' } }); return; }
        if (lastname === '') { this.setState({ errors: { lastname: 'Nom is required' } }); return; }
        if (email === '') { this.setState({ errors: { email: 'E-mail is required' } }); return; }
        if (phone === '') { this.setState({ errors: { phone: 'Téléphone is required' } }); return; }
        if (cin === '') { this.setState({ errors: { cin: 'N° CIN is required' } }); return; }
        if (fonction === '') { this.setState({ errors: { fonction: 'Fonction is required' } }); return; }
        if (cnss === '') { this.setState({ errors: { cnss: 'N° CNSS is required' } }); return; }

        const employe =   {
            id: id,
            firstname: firstname ,
            lastname:lastname ,
            email:email ,
            cin: cin,
            phone:phone ,
            cnss:cnss ,
            fonction:fonction ,
            password: password,
            role: role
          }

         CongeService.updateEmploye(employe)
        .then( res => {
            NotificationManager.success('Vos informations sont enregistrées avec succès', 'Success');
            setTimeout(() => {  this.props.history.push('/logout'); }, 2000);
            
        }).catch( err => {
            NotificationManager.error("Erreur de modification ! Essayer plus tard", 'Erreur');
        }); 

    }

    updateMyPassword = (e) => {
        e.preventDefault();
        this.setState({ errors: {} });
        const {ppassword, repassword, cpassword, currentUser} = this.state;

        if (ppassword === '') { this.setState({ errors: { ppassword: 'Ancien Mot de passe is required' } }); return; }
        if (repassword === '') { this.setState({ errors: { repassword: 'Nouveau Mot de passe is required' } }); return; }
        if (cpassword === '') { this.setState({ errors: { cpassword: 'Confirmation Mot de passe is required' } }); return; }
        if (repassword !== cpassword) { this.setState({ errors: { cpassword: 'Nouveau mot de passe et confirmation ne sont identiques' } }); return; }

        currentUser.password = repassword;

        CongeService.updateEmploye(currentUser)
        .then( res => {
            NotificationManager.success('Votre mot de passe a été modifié avec succès', 'Success');
            setTimeout(() => {  this.props.history.push('/logout'); }, 2000);
            
        }).catch( err => {
            NotificationManager.error("Erreur de modification de mot de passe ! Essayer plus tard", 'Erreur');
        }); 

    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });


    render() {
        const {firstname, lastname, email, phone, cin, fonction, cnss, errors, repassword, cpassword, ppassword} = this.state;
        return (
            <div className="mx-5 my-5">
                    <div className="card">

                            <div className="row">
                                <div className="col-md-6">
                                <div className="card-header bg-primary text-white">MODIFIER MES INFORMATIONS</div>
                                    <div className="card-body">
                                        <form onSubmit={this.onSubmitMesInfos}>
                                            <TextInputGroup name="firstname" type="text" placeholder="Prénom" value={firstname} onChange={this.onChange} error={errors.firstname} />
                                            <TextInputGroup name="lastname" type="text" placeholder="Nom" value={lastname} onChange={this.onChange} error={errors.lastname} />
                                            <TextInputGroup name="email" type="email" placeholder="E-mail" value={email} onChange={this.onChange} error={errors.email} />
                                            <TextInputGroup name="cin" type="text" placeholder="CIN" value={cin} onChange={this.onChange} error={errors.cin} />
                                            <TextInputGroup name="phone" type="text" placeholder="Téléphone" value={phone} onChange={this.onChange} error={errors.phone} />
                                            <TextInputGroup name="cnss" type="text" placeholder="N° CNSS" value={cnss} onChange={this.onChange} error={errors.cnss} />
                                            <TextInputGroup name="fonction" type="text" placeholder="Fonction" value={fonction} onChange={this.onChange} error={errors.fonction} />
                                            <button type="submit" className="btn btn-success col-md-5"><i className="fa fa-save mr-2"></i>Enregistrer</button>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                <div className="card-header bg-primary text-white">MODIFIER MOT DE PASSE</div>
                                    <div className="card-body">

                                    <form onSubmit={this.updateMyPassword}>
                                            <TextInputGroup name="ppassword" type="password" placeholder="Encien mot de passe" value={ppassword} onChange={this.onChange} error={errors.ppassword} />
                                            <TextInputGroup name="repassword" type="password" placeholder="Nouveau mot de passe" value={repassword} onChange={this.onChange} error={errors.repassword} />
                                            <TextInputGroup name="cpassword" type="password" placeholder="Confirmation" value={cpassword} onChange={this.onChange} error={errors.cpassword} />
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

export default myProfile;
