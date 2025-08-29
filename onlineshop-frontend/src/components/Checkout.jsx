import React, {useState} from 'react';
import api from '../services/api';
import { getUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Checkout(){
  const user = getUser();
  const navigate = useNavigate();
  const [method, setMethod] = useState('CARD');

  if (!user) return <div>Please login</div>;

  const doCheckout = async () => {
    try {
      // 1) Place order from cart
      const orderRes = await api.post('/orders/place', null, { params: { userId: user.id }});
      const order = orderRes.data;
      // 2) Process payment
      const payReq = { orderId: order.id, paymentMethod: method, amount: order.totalAmount };
      const payRes = await api.post('/payments', payReq);
      alert('Payment success: ' + payRes.data.transactionId);
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('Checkout failed: ' + (err?.response?.data || err.message));
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <label>Payment Method:
        <select value={method} onChange={e=>setMethod(e.target.value)}>
          <option value="CARD">Card</option>
          <option value="UPI">UPI</option>
          <option value="NETBANKING">Net-banking</option>
        </select>
      </label>
      <br/>
      <button onClick={doCheckout}>Pay & Place Order</button>
    </div>
  );
}
