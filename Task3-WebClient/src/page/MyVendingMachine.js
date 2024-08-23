import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/MyVendingMachine.css';
import { useNavigate } from 'react-router-dom';

const MyVendingMachine = () => {
    const [pizzas, setPizzas] = useState([]);
    const navigate = useNavigate();
    const machineId = localStorage.getItem('machine_id');

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/pizza-availability/machine-id/${machineId}`);
                setPizzas(response.data);
            } catch (error) {
                console.error('Error fetching pizzas:', error);
            }
        };

        fetchPizzas();
    }, [machineId]);

    const handleDelete = async (pizzaId) => {
        try {
            await axios.delete(`http://localhost:5000/pizza-availability/${pizzaId}/${machineId}`);
            setPizzas(pizzas.filter(pizza => pizza.id !== pizzaId)); // Удаляем пиццу из списка
        } catch (error) {
            console.error('Error deleting pizza:', error);
        }
    };

    return (
        <div className="vending-machine-container">
            <h2>My Vending Machine</h2>
            <div className="pizza-grid">
                {pizzas.length > 0 ? (
                    pizzas.map((pizza) => (
                        <div key={pizza.id} className="pizza-card">
                            <img
                                src={`/resources/${pizza.photo}`}
                                alt={pizza.name}
                                className="pizza-image"
                                onClick={() => navigate(`/pizza/${pizza.id}`)}
                            />
                            <h3 className="pizza-name">{pizza.name}</h3>
                            <p className="pizza-price">${pizza.price}</p>
                            <p className="pizza-count">In Stock: {pizza.count}</p>
                            <button className="delete-button" onClick={() => handleDelete(pizza.id)}>
                                Delete from Vending Machine
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No pizzas available in this vending machine.</p>
                )}
            </div>
        </div>
    );
};

export default MyVendingMachine;
