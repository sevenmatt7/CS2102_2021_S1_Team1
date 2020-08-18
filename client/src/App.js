import React, {Fragment} from 'react';
import './App.css';

//components
 import InputItem from "./components/Input";
 import ListItems from "./components/ItemList";

function App() {
  return (
    <Fragment>
      <div className="container">
      <InputItem />
      <ListItems />
      </div>
      
      
    </Fragment>
  );
}

export default App;
