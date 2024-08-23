import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/PizzaDetails.css';

const PizzaDetails = () => {
    const { id } = useParams();
    const [pizza, setPizza] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const machineId = localStorage.getItem('machine_id');

    useEffect(() => {
        const fetchPizza = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/pizza/${id}`);
                setPizza(response.data);
                setName(response.data.name);
                setDescription(response.data.description);
                setPrice(response.data.price);
            } catch (error) {
                console.error('Error fetching pizza:', error);
            }
        };

        fetchPizza();
    }, [id]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/pizza/${id}`, {
                name,
                description,
                price,
            });
            setPizza(response.data);
            setIsEditing(false);
            alert('Pizza updated successfully!');
        } catch (error) {
            console.error('Error updating pizza:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/pizza/${id}`);
            alert('Pizza deleted successfully!');
            navigate('/assortment');
        } catch (error) {
            console.error('Error deleting pizza:', error);
        }
    };

    const handleAddToVendingMachine = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/pizza-availability/machine-id/${machineId}`);
            const pizzasInMachine = response.data;
            const pizzaExists = pizzasInMachine.some(p => p.id === pizza.id);

            if (pizzaExists) {
                setMessage('This pizza is already in your vending machine.');
            } else {
                await axios.post('http://localhost:5000/pizza-availability', {
                    pizza_id: pizza.id,
                    machine_id: machineId,
                    count: 0
                });
                alert("Pizza added to your vending machine successfully!")
            }
        } catch (error) {
            console.error('Error adding pizza to vending machine:', error);
            setMessage('Failed to add pizza to vending machine.');
        }
    };

    return (
        <div className="pizza-details-container">
            <div className="pizza-image-container">
                <img src={`/resources/${pizza.photo}`} alt={pizza.name} className="pizza-image" />
            </div>
            <div className="pizza-info-container">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pizza-name-input"
                        />
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="pizza-price-input"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="pizza-description-input"
                        />
                        <div className="button-group">
                            <button className="save-button" onClick={handleSave}>
                                Save
                            </button>
                            <button className="delete-button" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="pizza-name">{pizza.name}</h2>
                        <p className="pizza-price">${pizza.price}</p>
                        <p className="pizza-description">{pizza.description}</p>
                        <button className="edit-button" onClick={handleEdit}>
                            Edit
                        </button>
                        <button className="add-button" onClick={handleAddToVendingMachine}>
                            Add to Vending Machine
                        </button>
                        {message && <p className="message">{message}</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export default PizzaDetails;
