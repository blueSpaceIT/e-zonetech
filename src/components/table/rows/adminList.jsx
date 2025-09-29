'use client';
import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Stack, IconButton, Tooltip } from '@mui/material';
import Label from 'src/components/label';
import { MdEdit, MdDelete } from 'react-icons/md';

export default function AdminRow({ row, onEdit, onDelete }) {
  const {
    _id,
    firstName = '',
    lastName = '',
    email = '-',
    phone = '-',
    role = '-',
    createdAt,
    status = '-'
  } = row || {};

  const createdAtText = createdAt ? new Date(createdAt).toLocaleDateString() : '-';

  return (
    <TableRow hover>
      <TableCell>{`${firstName} ${lastName}`.trim() || '-'}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{phone}</TableCell>
      <TableCell sx={{ textTransform: 'capitalize' }}>{role}</TableCell>
      <TableCell>{createdAtText}</TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Tooltip title="Edit">
            <IconButton onClick={() => onEdit && onEdit(_id)}>
              <MdEdit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete && onDelete(_id)}>
              <MdDelete />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
