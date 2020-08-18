import React, {Fragment, useEffect, useState} from "react";

const ListItems = () => {

    const [items, setItems] = useState([]);

    const getItems = async() => {
        try {
            const response = await fetch("http://localhost:5000/items")
            const jsonData = await response.json();
            setItems(jsonData);
        } catch (error) {
            console.log(error.message);
        }
    }
    useEffect(() => {
        getItems();
    }, []);

    return <Fragment>
        <table class="table mt-5 text-center">
    <thead>
      <tr>
        <th>Description</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      {items.map(item => (
          <tr>
              <td>{item.description}</td>
              <td>Edit</td>
              <td>Delete</td>
          </tr>
      ))
      }
    </tbody>
  </table>
    </Fragment>

}

export default ListItems;