'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import { useSelection } from '@/hooks/use-selection';
import { CustomersFilters } from './customers-filters';

export interface Customer {
  id: string;
  name: string;
  price: number;
  img: string;
  diseasePrevention?: string; // ✅ Add this field
  dosageRegimen: {
    doses: number;
    intervals: string[];
  };
}

interface CustomersTableProps {
  rows: Customer[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CustomersTable({ rows = [], onEdit, onDelete }: CustomersTableProps): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;
  const [searchTerm, setSearchTerm] = React.useState('');

  // Lọc dữ liệu theo tên khách hàng
  const filteredRows = React.useMemo(() => {
    return rows.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm]);

  const rowIds = React.useMemo(() => filteredRows.map((customer) => customer.id), [filteredRows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = selected.size > 0 && selected.size < filteredRows.length;
  const selectedAll = filteredRows.length > 0 && selected.size === filteredRows.length;

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Card>
      {/* Ô tìm kiếm */}
      <CustomersFilters onSearch={setSearchTerm} />

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    event.target.checked ? selectAll() : deselectAll();
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              {/* <TableCell>Status</TableCell> */}
              <TableCell>Price</TableCell>
              <TableCell>Import date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              const isSelected = selected.has(row._id);

              return (
                <TableRow hover key={row._id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        event.target.checked ? selectOne(row._id) : deselectOne(row._id);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.img} />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  {/* <TableCell>{row.status}</TableCell> */}
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEdit(row._id)} color="primary">
                      ✏️
                    </IconButton>
                    <IconButton onClick={() => onDelete(row._id)} color="error">
                      🗑️
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={() => {}}
        rowsPerPageOptions={[5]}
      />
    </Card>
  );
}
