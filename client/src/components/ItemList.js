import React, {Fragment, useEffect, useState} from "react";

import EditItem from "./EditItems"

const ListItems = () => {

    const [items, setItems] = useState([]);

    const deleteItem = async (id) => {
        try {
            const deleteItem = await fetch(`http://localhost:5000/items/${id}`, {
                method: "DELETE"
            });

            setItems(items.filter(item => item.id !== id))
        } catch (error) {
            console.log(error.message)
        }
    }

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
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>
                  <EditItem item={item}/>
              </td>
              <td>
                  <button className="btn btn-danger" onClick={() => deleteItem(item.id)}>Delete</button>
              </td>
            </tr>
            ))}
            </tbody>
        </table>
    </Fragment>

}

export default ListItems;