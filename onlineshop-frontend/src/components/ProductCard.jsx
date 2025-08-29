import React from 'react';
import api from '../services/api';
import { getUser } from '../utils/auth';

export default function ProductCard({product}) {
  const user = getUser();

  const addToCart = async () => {
    if (!user) { alert('Login first'); return; }
    try {
      await api.post('/cart', null, { params: { userId: user.id, productId: product.id, quantity: 1 }});
      alert('Added to cart');
    } catch (err) {
      console.error(err); alert('Add to cart failed');
    }
  };

  return (
    <div style={{border:'1px solid #ddd',padding:12,borderRadius:6}}>
      <img src={product.imageUrl || 'https://via.placeholder.com/200'} alt={product.name} style={{width:'100%',height:150,objectFit:'cover'}} />
      <h4>{product.name}</h4>
      <p>{product.description?.substring(0,80)}</p>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <strong>{product.price}</strong>
        <button onClick={addToCart}>Add</button>
      </div>
    </div>
  );
}
