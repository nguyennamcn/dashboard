import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface CustomersFiltersProps {
  onSearch: (value: string) => void;
}

export function CustomersFilters({ onSearch }: CustomersFiltersProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        fullWidth
        placeholder="Search customer"
        onChange={(e) => onSearch(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
}
