import React, { useState } from 'react';
import axios from 'axios';
import '../style/CreatePizza.css';

const CreatePizza = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [photo, setPhoto] = useState(''); // Здесь будет сохраняться имя файла

    const handleFileChange = (e) => {
        const fileName = e.target.files[0]?.name; // Получаем имя выбранного файла
        setPhoto(fileName || ''); // Если файл выбран, сохраняем его имя
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const pizzaData = {
            name,
            description,
            price,
            photo, // Отправляем только имя файла
        };

        try {
            const response = await axios.post('http://localhost:5000/pizza', pizzaData);

            if (response.status === 201) {
                alert('Pizza created successfully!');
                setName('');
                setDescription('');
                setPrice('');
                setPhoto('');
            }
        } catch (error) {
            console.error('Error creating pizza:', error);
            alert('Failed to create pizza');
        }
    };

    return (
        <div className="create-pizza-container">
            <h2>Create a New Pizza</h2>
            <form onSubmit={handleSubmit} className="create-pizza-form">
                <div className="form-group">
                    <label htmlFor="name">Pizza Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="photo">Photo</label>
                    <input
                        type="file"
                        id="photo"
                        onChange={handleFileChange} // Здесь обрабатываем выбор файла
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Create Pizza</button>
            </form>
        </div>
    );
};

export default CreatePizza;
