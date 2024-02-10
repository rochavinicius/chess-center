import * as React from "react";
import "./App.css";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";

class App extends React.Component {

    componentDidMount() {
        fetch("http://localhost:3000") //TODO read port from env
            .then((res) => res.json());
    }

    render() {
        return <div className="max-height">
            <Header/>
            <SideMenu/>
        </div>;
    }
}

export default App;
