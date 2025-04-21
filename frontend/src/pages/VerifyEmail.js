import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';

const VerifyEmail = () => {
  const [msg, setMsg] = useState('');
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      api.get(`/auth/verify-email?token=${token}`)
        .then(res => {
          setMsg(res.data.message);
          setTimeout(() => navigate('/login'), 3000); // ✅ redirect after 3 sec
        })
        .catch(err => {
          setMsg(err.response?.data?.message || 'Verification failed');
        });
    }
  }, [params, navigate]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{msg}</p>
      {msg === 'Email verified successfully' && (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
