import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MealsPage = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/meals');
        setMeals(response.data);
      } catch (err) {
        setError('Failed to fetch meals');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  if (loading) return <div>Loading meals...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Available Meals</h1>
      {meals.length === 0 ? (
        <p>No meals available.</p>
      ) : (
        <ul>
          {meals.map(meal => (
            <li key={meal.id}>
              <h2>{meal.name}</h2>
              <p>{meal.description}</p>
              <p>Price: ${meal.price}</p>
              {meal.image_url && <img src={meal.name === 'Vegetarian Pasta Primavera' ? `${meal.image_url}?cachebust=${Date.now()}` : meal.image_url} alt={meal.name} style={{maxWidth: '200px'}} />}
              {meal.sides && <p>Sides: {Array.isArray(meal.sides) ? meal.sides.join(', ') : meal.sides}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MealsPage;
