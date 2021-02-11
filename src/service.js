import axios from "axios";

const API_URL = "http://localhost:4000/";

class CongeService {

    login(cin, password){
        return axios.get(API_URL+`users?cin=${cin}&password=${password}`)
    }

    setItemInLocalStorage(user){
        localStorage.setItem("conge_user", JSON.stringify(user));
    }

    deleteItemFromLocalStorage(){
        localStorage.removeItem("conge_user");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('conge_user'));
    }

    isAdmin(props){
        const user = JSON.parse(localStorage.getItem('conge_user'));
         if(user[0].role === 'USER'){
            props.history.push('/mon-espace'); 
        }else{
            props.history.push('/admin-espace'); 
        }
    }

    saveDemandeConge = (type, nbjour, datedebut) => {
        const user = this.getCurrentUser();
        const conge = {
            idUser: user[0].id,
            etat: "En Attente",
            datedebut: datedebut,
            nbjour: nbjour,
            type: type,
            name: user[0].firstname+' '+user[0].lastname
        }
        return axios.post(API_URL+'conges', conge);
    }

    getMesConges = () => {
        const user = this.getCurrentUser();
        if(user) return axios.get(API_URL+`conges?idUser=${user[0].id}`);
    }

    getCongesEnAttente = () => {
        return axios.get(API_URL+`conges?etat=En%20Attente`);
    }

    getAllConges = () => {
        return axios.get(API_URL+`conges?etat=Validé`);
    }

    deleteConge = (id) => {
        return axios.delete(API_URL+`conges/${id}`);
    }

    updateConge = (conge) => {
        return axios.put(API_URL+`conges/${conge.id}`, conge);
    }

    saveEmploye = (employe) => {
        return axios.post(API_URL+'users', employe);
    }

    updateEmploye = (employe) => {
        return axios.put(API_URL+`users/${employe.id}`, employe);
    }

    getAllEmployes = () => {
        return axios.get(API_URL+`users`);
    }

    deleteEmploye = (id) => {
        return axios.delete(API_URL+`users/${id}`);
    }

}

export default new CongeService();