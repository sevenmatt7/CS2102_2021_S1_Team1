import React, {Fragment} from 'react';
import Appbar from './components/Appbar'
import './App.css';

//components
 import InputItem from "./components/Input";
 import ListItems from "./components/ItemList";
 

function App() {
  return (
    <Fragment>
    <Appbar />
      <div className="container">
        <InputItem />
        <ListItems />
      </div>
      
      
    </Fragment>
  );
}

export default App;
