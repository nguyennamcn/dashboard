import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { URL_BASE } from '@/config';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { checkSession } = useUser();
  const router = useRouter();

  const [user, setUser] = React.useState<{ name: string; email: string } | null>(null);


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
        console.log(data)
        setUser({ name: data.name, email: data.data.email });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (open) {
      fetchUserData();
    }
  }, [open]);

  console.log(user)
  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        logger.error('Sign out error', error);
        return;
      }

      await checkSession?.();
      router.refresh();
    } catch (err) {
      logger.error('Sign out error', err);
    }
  }, [checkSession, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">{user ? user.name : 'Loading...'}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user ? user.email : ''}
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem component={RouterLink} href={paths.dashboard.settings} onClick={onClose}>
          <ListItemIcon>
            <GearSixIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.dashboard.account} onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
