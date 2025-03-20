'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { URL_BASE } from '@/config';

export function UpdatePasswordForm(): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const userId = localStorage.getItem("id"); // Thay bằng ID thực tế của user
    console.log(userId)
  
    try {
      const token = localStorage.getItem("custom-auth-token");
      const response = await fetch(
        `${URL_BASE}/user/change-password/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to update password');
      }
  
      const data = await response.json();
      console.log('Response:', data);
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel>Current Password</InputLabel>
              <OutlinedInput
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formData.currentPassword} // 🟢 Đã sửa lỗi
                onChange={handleChange} 
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>New Password</InputLabel>
              <OutlinedInput
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword} // 🟢 Đã sửa lỗi
                onChange={handleChange} 
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Confirm Password</InputLabel>
              <OutlinedInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword} // 🟢 Đã sửa lỗi
                onChange={handleChange} 
              />
            </FormControl>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
