import React, { useState } from 'react';
import { Typography, Grid, TextField, Button } from '@mui/material';

const ChangePasswordForm = ({ onClose, onChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            return;
        }

        try {
            await onChangePassword(currentPassword, newPassword);
            setError('');
        } catch (err) {
            setError('Failed to change password');
        }
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>Change Password</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">Current Password:</Typography>
                    <TextField
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">New Password:</Typography>
                    <TextField
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Confirm Password:</Typography>
                    <TextField
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                </Grid>
                {error && (
                    <Grid item xs={12}>
                        <Typography color="error">{error}</Typography>
                    </Grid>
                )}
            </Grid>
            <Button variant="contained" color="primary" onClick={handleChangePassword} sx={{ mt: 2 }}>
                Change Password
            </Button>
            <Button variant="outlined" onClick={onClose} sx={{ mt: 2, ml: 2 }}>
                Cancel
            </Button>
        </>
    );
};

export default ChangePasswordForm;
