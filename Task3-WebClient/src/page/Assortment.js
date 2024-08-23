import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Assortment.css';

const Assortment = () => {
    const [pizzas, setPizzas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const response = await axios.get('http://localhost:5000/pizza');
                setPizzas(response.data);
            } catch (error) {
                console.error('Error fetching pizzas:', error);
            }
        };

        fetchPizzas();
    }, []);

    const handlePizzaClick = (id) => {
        navigate(`/pizza/${id}`);
    };

    const handleCreateNewPizza = () => {
        navigate('/pizza/create');
    };

    return (
        <div className="assortment-container">
            <button className="create-pizza-button" onClick={handleCreateNewPizza}>
                Create New Pizza
            </button>
            <div className="pizza-grid">
                {pizzas.map((pizza) => (
                    <div
                        key={pizza.id}
                        className="pizza-card"
                        onClick={() => handlePizzaClick(pizza.id)}
                    >
                        <img src={`/resources/${pizza.photo}`}  alt={pizza.photo} className="pizza-image" />
                        <h3 className="pizza-name">{pizza.name}</h3>
                        <p className="pizza-price">${pizza.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assortment;
