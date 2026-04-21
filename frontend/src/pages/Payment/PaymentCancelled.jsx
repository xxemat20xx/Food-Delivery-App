import { useSearchParams } from 'react-router-dom';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  return <div>Payment cancelled. Order #{orderId} not paid.</div>;
};

export default PaymentCancelled;