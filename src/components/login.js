import React, { Component } from 'react';
import TextInputGroup from './TextInputGroup';
import CongeService from '../service';

class Login extends Component {
    state = {
        cin: '',
        password: '',
        errors: {},
        msg:'',
        isError: false
      };

      componentDidMount(){
          const user = CongeService.getCurrentUser();
          if(user){
            CongeService.isAdmin(this.props);
          }
      }

      onSubmit = (e) => {
        e.preventDefault();
    
        const { cin, password} = this.state;
    
        // Check For Errors
        if (cin === '') {
          this.setState({ errors: { cin: 'CIN is required' } });
          return;
        }
    
        if (password === '') {
          this.setState({ errors: { password: 'Password is required' } });
          return;
        }
        
        CongeService.login(cin, password).then(res => {
            if(res.data.length == 0){
                this.setState({
                    msg : 'CIN or Password Incorrect.',
                    isError : true
                });
            }else{
                CongeService.deleteItemFromLocalStorage();
                CongeService.setItemInLocalStorage(res.data);
                CongeService.isAdmin(this.props);
                window.location.reload(false);                  
            }
        }).catch(err =>{
            this.setState({
                msg : err,
                isError : true
            });
        })

      };

      onChange = e => this.setState({ [e.target.name]: e.target.value });
    render() {
        const { cin, password, errors, isError, msg } = this.state;
        return (
            <div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                        <div className="card">
                            <div className="card-header bg-success text-white">LOGIN</div>
                            <div className="card-body">
                            <form onSubmit={this.onSubmit}>
                                <TextInputGroup
                                name="cin"
                                type="text"
                                placeholder="Your CIN Number"
                                value={cin}
                                onChange={this.onChange}
                                error={errors.cin}
                                />
                                <TextInputGroup
                                name="password"
                                type="password"
                                placeholder="Your Password"
                                value={password}
                                onChange={this.onChange}
                                error={errors.password}
                                />
                                <input
                                type="submit"
                                value="Connect"
                                className="btn btn-success btn-block"
                                />
                            </form>
                            </div>
                        </div>
                        { isError ? (
                        <div className="alert alert-danger alert-dismissible mt-3">
                            <button type="button" className="close" data-dismiss="alert">&times;</button>
                            <strong>Error ! </strong> {msg}
                        </div> 
                        ) : null }
                          
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;
