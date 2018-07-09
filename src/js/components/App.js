import React from "react";
import {HashRouter as Router, Route, Link} from "react-router-dom";
import "./../../css/nav.scss";
import Grid from "./Grid.js";

class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {balance: 0}
        // let {provider, account} = props;
        this.props.provider.getBalance().then(balance => (this.setState({balance: balance})));
    }

    componentDidUpdate(prevProps){
        if (prevProps.account !== this.props.account){
            this.props.provider.getBalance().then(balance => (this.setState({balance: balance})));
        }
    }

    render(){

        return <Router>
            <div>
                {!this.props.ethBrowser && <div className="callout warning">
                    <h5>This browser is not ethereum enabled!</h5>
                    <p>Please use Google Crome + MetaMask, Mist or Parity</p>
                </div>}
                {this.props.account &&
                <div>{this.props.account} - {this.state.balance} tETH</div>}
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/topics">Topics</Link>
                        </li>
                    </ul>
                </nav>

                <hr/>

                <Route exact path="/" component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/topics" component={Topics}/>
            </div>
        </Router>

    }
}

const Home = () => (
    <div>
        <p>Buy your box of history! Available blocks are highlighted in green;</p>
        <div style={{display: 'flex', justifyContent:'center'}}>
        <Grid size={100}/>
        </div>
    </div>
);

const About = () => (
    <div>
        <h2>About</h2>
    </div>
);

const Topics = ({match}) => (
    <div>
        <h2>Topics</h2>
        <ul>
            <li>
                <Link to={`${match.url}/rendering`}>Rendering with React</Link>
            </li>
            <li>
                <Link to={`${match.url}/components`}>Components</Link>
            </li>
            <li>
                <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
            </li>
        </ul>

        <Route path={`${match.url}/:topicId`} component={Topic}/>
        <Route
            exact
            path={match.url}
            render={() => <h3>Please select a topic.</h3>}
        />
    </div>
);

const Topic = ({match}) => (
    <div>
        <h3>{match.params.topicId}</h3>
    </div>
);

export default App;