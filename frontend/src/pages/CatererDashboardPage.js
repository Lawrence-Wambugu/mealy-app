import React, { useState } from 'react';
import CustomNavbar from '../components/CustomNavbar';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../store/authSlice';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DashboardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 2rem;
`;

const LogoBrand = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
  margin-left: 2rem;
`;

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: auto;
  background: none;
`;

const VerticalStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  align-items: stretch;
`;
const TableContainer = styled.div`
  width: 100%;
`;
const FormContainer = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 0.8rem 1.2rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
  font-size: 1rem;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
`;

const TextArea = styled.textarea`
  padding: 0.8rem 1.2rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 100px;
  width: 100%;
  font-size: 1rem;
  box-sizing: border-box;
`;

const SidesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SideInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

const MealsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 2.5rem;
  background: #faf9f6;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px #f3e6d1;
`;
const MealsTh = styled.th`
  background: #FFA500;
  color: #fff;
  padding: 1.1rem 1rem;
  text-align: left;
  font-size: 1.08rem;
  font-weight: 600;
  border-bottom: 2px solid #FFA500;
`;
const MealsTd = styled.td`
  padding: 1rem;
  font-size: 1.05rem;
  background: #fff;
  border-bottom: 1px solid #f3e6d1;
`;
const EditButton = styled.button`
  background-color: #FFA500;
  color: #fff;
  border: none;
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 0.98rem;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: 500;
  margin-right: 8px;
  &:hover { background: #e69500; }
`;
const SaveButton = styled(EditButton)`
  background-color: #28a745;
  &:hover { background: #218838; }
`;
const CancelButton = styled(EditButton)`
  background-color: #dc3545;
  &:hover { background: #a71d2a; }
`;


const CatererDashboardPage = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutSuccess());
    window.location.href = '/login';
  };
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sides, setSides] = useState(['']);
  const [meals, setMeals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({ price: '', description: '' });

  const handleSideChange = (index, value) => {
    const newSides = [...sides];
    newSides[index] = value;
    setSides(newSides);
  };

  const addSide = () => {
    setSides([...sides, '']);
  };

  const removeSide = (index) => {
    const newSides = sides.filter((_, i) => i !== index);
    setSides(newSides);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/meals',
        {
          name,
          description,
          price: parseFloat(price),
          image_url: imageUrl,
          sides: sides.filter(side => side).join(', '), // Send as comma-separated string
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Meal created:', response.data);
      // Clear form
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setSides(['']);
    } catch (error) {
      console.error('Failed to create meal:', error);
    }
  };

  React.useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/meals/mine', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeals(response.data);
      } catch (err) {
        // handle error
      }
    };
    if (token) fetchMeals();
  }, [token]);

  const startEdit = (meal) => {
    setEditingId(meal.id);
    setEditFields({ price: meal.price, description: meal.description });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditFields({ price: '', description: '' });
  };
  const saveEdit = async (meal) => {
    try {
      await axios.put(`http://localhost:5000/meals/${meal.id}`, {
        price: parseFloat(editFields.price),
        description: editFields.description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals(meals => meals.map(m => m.id === meal.id ? { ...m, price: parseFloat(editFields.price), description: editFields.description } : m));
      cancelEdit();
    } catch (err) {
      alert('Failed to update meal');
    }
  };

  return (
    <div style={{background:'#f8f8f8', minHeight:'100vh'}}>
      <DashboardHeader>
        <LogoBrand>
          <img src="https://i.pinimg.com/736x/cd/46/dd/cd46dda11eec042b2cfc2ec6c497f5ce.jpg" alt="Mealy Logo" style={{height:'48px',marginRight:'14px',borderRadius:'8px'}} />
          <span style={{fontSize:'2.2rem',fontWeight:'bold',color:'#FFA500',letterSpacing:'2px'}}>Mealy</span>
        </LogoBrand>
        <div style={{marginTop:'1.5rem',marginRight:'2rem'}}>
          <CustomNavbar type="caterer" onLogout={handleLogout} />
        </div>
      </DashboardHeader>
      <DashboardContainer>
        <h1 style={{textAlign:'center', color:'#FFA500', margin:'2rem 0 1rem'}}>Caterer Dashboard</h1>
        <VerticalStack>
          <TableContainer>
            <h2 style={{textAlign:'center', color:'#333', margin:'0 0 1.2rem 0'}}>My Meals</h2>
            <MealsTable>
              <thead>
                <tr>
                  <MealsTh>Name</MealsTh>
                  <MealsTh>Description</MealsTh>
                  <MealsTh>Price (Kes)</MealsTh>
                  <MealsTh>Image</MealsTh>
                  <MealsTh>Sides</MealsTh>
                  <MealsTh>Action</MealsTh>
                </tr>
              </thead>
              <tbody>
                {meals.map(meal => (
                  <tr key={meal.id}>
                    <MealsTd>{meal.name}</MealsTd>
                    <MealsTd>
                      {editingId === meal.id ? (
                        <TextArea
                          value={editFields.description}
                          onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                          style={{minHeight:'60px',fontSize:'1rem'}}
                        />
                      ) : meal.description}
                    </MealsTd>
                    <MealsTd>
                      {editingId === meal.id ? (
                        <Input
                          type="number"
                          value={editFields.price}
                          onChange={e => setEditFields(f => ({ ...f, price: e.target.value }))}
                          style={{width:'90px'}}
                        />
                      ) : `Kes ${meal.price}`}
                    </MealsTd>
                    <MealsTd>
                      {meal.image_url && <img src={meal.image_url} alt={meal.name} style={{width:'70px',height:'50px',objectFit:'cover',borderRadius:'8px',boxShadow:'0 1px 4px #eee'}} />}
                    </MealsTd>
                    <MealsTd>{Array.isArray(meal.sides) ? meal.sides.join(', ') : meal.sides}</MealsTd>
                    <MealsTd>
                      {editingId === meal.id ? (
                        <>
                          <SaveButton onClick={() => saveEdit(meal)}>Save</SaveButton>
                          <CancelButton onClick={cancelEdit}>Cancel</CancelButton>
                        </>
                      ) : (
                        <EditButton onClick={() => startEdit(meal)}>Edit</EditButton>
                      )}
                    </MealsTd>
                  </tr>
                ))}
              </tbody>
            </MealsTable>
          </TableContainer>
          <FormContainer>
            <h2 style={{textAlign:'center', color:'#333', marginBottom:'2rem'}}>Add a New Meal</h2>
            <Form onSubmit={handleSubmit} style={{borderRadius:'12px',boxShadow:'0 2px 12px #eee',padding:'2rem',background:'none'}}>
              <Input type="text" placeholder="Meal Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <TextArea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <div style={{display:'flex',gap:'1rem'}}>
                <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required style={{flex:1}} />
                <Input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{flex:2}} />
              </div>
              <h3 style={{margin:'1rem 0 0.5rem 0',color:'#FFA500'}}>Sides/Toppings</h3>
              <SidesContainer>
                {sides.map((side, index) => (
                  <SideInputContainer key={index}>
                    <Input type="text" value={side} onChange={(e) => handleSideChange(index, e.target.value)} placeholder={`Side ${index+1}`} />
                    <button type="button" onClick={() => removeSide(index)} style={{background:'#dc3545',color:'#fff',border:'none',borderRadius:'6px',padding:'0.5rem 1rem',cursor:'pointer'}}>Remove</button>
                  </SideInputContainer>
                ))}
              </SidesContainer>
              <button type="button" onClick={addSide} style={{background:'#FFA500',color:'#fff',border:'none',borderRadius:'6px',padding:'0.7rem 1.5rem',marginTop:'0.5rem',fontWeight:'bold',fontSize:'1rem',cursor:'pointer'}}>Add Side</button>
              <button type="submit" style={{background:'#FFA500',color:'#fff',border:'none',borderRadius:'6px',padding:'0.9rem 1.5rem',marginTop:'1.2rem',fontWeight:'bold',fontSize:'1.1rem',cursor:'pointer'}}>Create Meal</button>
            </Form>
          </FormContainer>
        </VerticalStack>
      </DashboardContainer>
    </div>
  );
};

export default CatererDashboardPage;
