import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';

export default function Settings() {
    const  { user } = useAuth();
    const { success, error } = useToast();

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
            });
        }
    }, [user]);

    const handleProfileChange = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            await userAPI.updateProfile(profileData);
            success('Profile updated successfully');
        } catch (err) {
            error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            return error('New passwords do not match');
        }
        
        setLoadingPassword(true);

        try {
            await userAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            success('Password changed successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (err) {
            error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <>
            <header className="page-header">
                <div className="page-header-content">
                    <div>
                        <h1 className="page-title">Settings</h1>
                        <p className="page-subtitle">Manage your account settings</p>
                    </div>
                </div>
            </header>

            <div className="page-content">
                {/* Profile Settings */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Profile Information</h3>
                    </div>
                    <form onSubmit={handleProfileSubmit} className="card-body">
                        <div className="settings-grid">
                            <div className="form-group">
                                <label>First Name</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        value={profileData.firstName}
                                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        value={profileData.lastName}
                                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" size={20} />
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                    />
                                </div>
                                <small className="form-hint">Email cannot be changed</small>
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <div className="input-wrapper">
                                    <Phone className="input-icon" size={20} />
                                    <input
                                        type="tel"
                                        value={profileData.phoneNumber}
                                        onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loadingProfile}>
                            <Save size={20} />
                            {loadingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Password Settings */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Change Password</h3>
                    </div>
                    <form onSubmit={handlePasswordSubmit} className="card-body">
                        <div className="settings-grid">
                            <div className="form-group">
                                <label>Current Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        minLength={8}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        minLength={8}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loadingPassword}>
                            <Lock size={20} />
                            {loadingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}