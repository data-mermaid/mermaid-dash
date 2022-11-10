import React, { useState } from 'react';

import styled from 'styled-components/macro';
import { theme } from '../constants/theme';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';
import { Box, Dialog } from '@material-ui/core';
import { DialogText } from '../styles/MermaidStyledComponents';
import ContactIcon from '@material-ui/icons/Email';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const ContactIconWrapper = styled(ContactIcon)`
  padding-right: 5px;
  font-size: small;
`;

const CloudDownloadIconWrapper = styled(CloudDownloadIcon)`
  padding-right: 5px;
  font-size: small;
`;

const MermaidButton = withStyles({
  root: {
    margin: '4px',
    color: theme.cardButton.color.mermaidWhite,
    backgroundColor: theme.cardButton.bgColor,
    '&:hover': {
      backgroundColor: theme.cardButton.bgColor
    }
  }
})(Button);

const DownloadDataModal = () => {
  const [open, setOpen] = useState(false);

  const handleModalOpen = () => setOpen(true);

  const handleModalClose = () => {
    setOpen(false);
  };

  const createData = (id, method, policy, buttonName) => {
    return { id, method, policy, buttonName };
  };

  const downloadDataButton = (
    <MermaidButton size="small" variant="contained" color="primary" onClick={handleModalOpen}>
      <CloudDownloadIconWrapper />
      <Box fontWeight="fontWeightMedium">Download data</Box>
    </MermaidButton>
  );

  const rows = [
    createData('1', 'Benthic PIT', 'Private', 'Download CSV'),
    createData('2', 'Fish Belt', 'Public Summary', 'Contact Admins')
  ];

  const methodDownloadTable = (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Method</TableCell>
            <TableCell>Data Sharing Policy</TableCell>
            <TableCell>Download</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.method}</TableCell>
              <TableCell>{row.policy}</TableCell>
              <TableCell>
                <MermaidButton size="small" variant="contained" color="primary" onClick={() => {}}>
                  {row.buttonName === 'Contact Admins' ? (
                    <ContactIconWrapper />
                  ) : (
                    <CloudDownloadIconWrapper />
                  )}
                  <Box>{row.buttonName}</Box>
                </MermaidButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      {downloadDataButton}
      <Dialog open={open} aria-labelledby="download-data-dialog">
        <MuiDialogTitle>
          <DialogText dialogTitle>Great Sea Reef 2019</DialogText>
        </MuiDialogTitle>
        <MuiDialogContent>
          <DialogText subtext>Download sample event data in CSV format per method</DialogText>
          {methodDownloadTable}
          <DialogText subtext>
            To download raw observation data, contact the project's admins.
          </DialogText>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  );
};

export default DownloadDataModal;
