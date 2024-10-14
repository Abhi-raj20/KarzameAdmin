import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Paper,
  Chip
} from '@mui/material';
import { green, red, orange, purple } from '@mui/material/colors';

// Sample data
const users = [
  {
    id: 1,
    name: 'Bruce Wayne',
    imageUrl: '/images/bruce.jpg',
    battery: 'Battery Low (less than 15%)',
    gsmNetwork: 'No GSM network',
    timestamp: 'Alert timestamp',
    zoneFencing: 'Zone Set',
    movementIndicator: 'Is Moving',
    lastLocation: 'Last Known Location',
  },
  // Add more users as needed
];

const BatteryStatusChip = ({ status }) => {
  return (
    <Chip
      label={status}
      style={{ backgroundColor: red[500], color: 'white' }}
      icon={<span style={{ color: red[500], fontSize: '12px' }}>●</span>}
    />
  );
};

const GSMNetworkChip = ({ status }) => {
  return (
    <Chip
      label={status}
      style={{ backgroundColor: purple[500], color: 'white' }}
      icon={<span style={{ color: purple[500], fontSize: '12px' }}>●</span>}
    />
  );
};

const TimestampChip = ({ status }) => {
  return (
    <Chip
      label={status}
      style={{ backgroundColor: orange[300], color: 'black' }}
      icon={<span style={{ color: orange[300], fontSize: '12px' }}>●</span>}
    />
  );
};

const ZoneFencingChip = ({ status }) => {
  return (
    <Chip
      label={status}
      style={{ backgroundColor: green[500], color: 'white' }}
      icon={<span style={{ color: green[500], fontSize: '12px' }}>●</span>}
    />
  );
};

const MovementIndicatorChip = ({ status }) => {
  return (
    <Chip
      label={status}
      style={{ backgroundColor: orange[500], color: 'white' }}
      icon={<span style={{ color: orange[500], fontSize: '12px' }}>●</span>}
    />
  );
};

const UserTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="user table">
        <TableHead>
          <TableRow>
            <TableCell>User Name</TableCell>
            <TableCell align="center">Battery Indicator</TableCell>
            <TableCell align="center">GSM Network</TableCell>
            <TableCell align="center">Stamp</TableCell>
            <TableCell align="center">Zone Fencing</TableCell>
            <TableCell align="center">Movement Indicator</TableCell>
            <TableCell align="center">Last Known Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                <Avatar src={user.imageUrl} alt={user.name} style={{ marginRight: '10px' }} />
                {user.name}
              </TableCell>
              <TableCell align="center">
                <BatteryStatusChip status={user.battery} />
              </TableCell>
              <TableCell align="center">
                <GSMNetworkChip status={user.gsmNetwork} />
              </TableCell>
              <TableCell align="center">
                <TimestampChip status={user.timestamp} />
              </TableCell>
              <TableCell align="center">
                <ZoneFencingChip status={user.zoneFencing} />
              </TableCell>
              <TableCell align="center">
                <MovementIndicatorChip status={user.movementIndicator} />
              </TableCell>
              <TableCell align="center">{user.lastLocation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
