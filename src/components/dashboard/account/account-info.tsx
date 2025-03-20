'use client'; // 🟢 Thêm dòng này ở đầu file

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { URL_BASE } from '@/config';


export function AccountInfo(): React.JSX.Element {
  // 🟢 State để lưu dữ liệu từ API
  const [user, setUser] = React.useState({
    name: '',
    avatar: '/assets/avatar.png',
    jobTitle: '',
    country: '',
    city: '',
    timezone: '',
  });

  // 🟢 Gọi API lấy thông tin người dùng
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("id"); 
        const token = localStorage.getItem("custom-auth-token");
        const response = await fetch(`${URL_BASE}/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 🟢 Gửi token trong header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log(data.data)
        setUser({
          name: data.data.email || 'Unknown',
          avatar: '/assets/avatar.png', // Avatar mặc định nếu không có
          jobTitle: data.jobTitle || 'N/A',
          country: 'Role',
          timezone: data.data.role || 'N/A',
        });
        console.log(user)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // Chạy 1 lần khi component mount

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user.name}</Typography>
            <Typography color="text.secondary" variant="body2">
               {user.country}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.timezone}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
