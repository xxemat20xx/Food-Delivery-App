import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  return <div>Payment successful! Order #{orderId} confirmed.</div>;
};

export default PaymentSuccess;