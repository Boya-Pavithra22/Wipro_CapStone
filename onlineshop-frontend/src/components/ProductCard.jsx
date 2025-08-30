import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getUser } from '../utils/auth';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
  const user = getUser();
  const { refreshCart } = useContext(CartContext);
  const navigate = useNavigate();

  const addToCart = async (e) => {
    e.stopPropagation(); 
    if (!user) { 
      alert('Login first'); 
      return; 
    }
    try {
      await api.post('/cart', null, { 
        params: { 
          userId: user.id, 
          productId: product.id, 
          quantity: 1 
        }
      });
      alert('Added to cart');
      refreshCart();
    } catch (err) {
      console.error(err); 
      alert('Add to cart failed');
    }
  };

  return (
    <div 
      style={{ border:'1px solid #ddd', padding:12, borderRadius:6, cursor: "pointer" }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <img 
        src={product.imageUrl || 'https://via.placeholder.com/200'} 
        alt={product.name} 
        style={{ width:'100%', height:150, objectFit:'cover' }} 
      />
      <h4>{product.name}</h4>
      <p>{product.description?.substring(0,80)}</p>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <strong>₹{product.price}</strong>
        <button onClick={addToCart}>Add</button>
      </div>
    </div>
  );
}
