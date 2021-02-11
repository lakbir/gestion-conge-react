import Header from './components/header';
import './App.css';
import Login from './components/login';
import Footer from './components/footer';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import UserEspace from './components/UserEspace';
import AdminEspace from './components/AdminEspace';
import myProfile from './components/myProfile';
import AccessDenied from './components/AcessDenied';
import 'react-notifications/lib/notifications.css';
import Logout from './components/logout';
import Employes from './components/Employes';
import Conges from './components/Conges';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/mon-espace" component={UserEspace} />
          <Route exact path="/admin-espace" component={AdminEspace} />
          <Route exact path="/my-account" component={myProfile} />
          <Route exact path="/access-denied" component={AccessDenied} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/admin-espace/employees" component={Employes} />
          <Route exact path="/admin-espace/all-conges" component={Conges} />
          <Route component={Login} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
