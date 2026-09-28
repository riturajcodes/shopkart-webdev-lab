import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logoutUser, changePassword } from '../services/api';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user);

  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        if (isMounted) {
          setProfile(data);
          if (setUser) setUser(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        if (isMounted) {
          if (setUser) setUser(null);
          navigate('/login');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate, setUser]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      if (setUser) setUser(null);
      navigate('/login');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsChangingPassword(true);
    
    try {
      await changePassword({ oldPassword: currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => {
        setShowModal(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return <div style={{ marginTop: '100px', fontSize: '12px', letterSpacing: '1px' }}>LOADING...</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="home-container">
      <div className="profile-header">
        <h1>{profile.fullName}</h1>
        <div className="profile-details">
          <div>EMAIL <span id="customer-email">{profile.email}</span></div>
          <div>PHONE <span id="customer-phone">{profile.phone}</span></div>
        </div>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '40px' }}>
          <button onClick={() => setShowModal(true)} className="btn-black" style={{ maxWidth: '200px' }}>
            Change Password
          </button>
          <button onClick={handleLogout} className="btn-black" style={{ maxWidth: '200px' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="section-title">QUICK ACTIONS</div>

      <div className="quick-actions">
        <div className="action-card">
          <h2>Your Cart</h2>
          <p>Your cart is empty.</p>
          <span className="action-hint">Cart &amp; checkout are coming in a future update.</span>
        </div>

        <div className="action-card">
          <h2>Browse Products</h2>
          <p>Discover our full catalogue of products.</p>
          <button className="btn-black" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '40px', maxWidth: '400px',
            width: '90%', borderRadius: '8px', position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute', top: '15px', right: '15px',
                background: 'none', border: 'none', fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px', fontWeight: '500' }}>Change Password</h2>
            
            {passwordError && <div className="error-message" style={{ marginBottom: '15px' }}>{passwordError}</div>}
            {passwordSuccess && <div style={{ color: 'green', marginBottom: '15px', fontSize: '12px' }}>{passwordSuccess}</div>}
            
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn-black" 
                disabled={isChangingPassword}
                style={{ width: '100%', marginTop: '20px' }}
              >
                {isChangingPassword ? 'CHANGING...' : 'UPDATE PASSWORD'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
