import React, { useState, useMemo } from 'react';

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
import { protocolTitles } from '../constants/transect-protocols';

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

const TableHeadWrapper = styled(TableHead)`
  background-color: lightgrey;
`;

const TableCellWrapper = styled(TableCell)`
  text-transform: capitalize;
`;

const DownloadDataModal = ({ currentSelectedSite }) => {
  const [open, setOpen] = useState(false);

  const availableProtocols = useMemo(() => {
    const protocolKeys = Object.keys(currentSelectedSite.protocols);

    return protocolKeys.reduce((accumulator, protocol) => {
      const protocolMethod = protocolTitles[protocol];

      if (protocolMethod) {
        const protocolDataPolicy =
          protocolMethod === 'Bleaching' ? `data_policy_bleachingqc` : `data_policy_${protocol}`;

        const protocolInfo = {
          method: protocolMethod,
          policy: currentSelectedSite[protocolDataPolicy]
        };
        accumulator.push(protocolInfo);
      }
      return accumulator;
    }, []);
  }, [currentSelectedSite]);

  const handleModalOpen = () => setOpen(true);

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleDownloadCSV = () => {
    const downloadCSVApi = `${process.env.REACT_APP_MERMAID_API_URL}/v1//summarysampleevents/csv/?project_id=${currentSelectedSite.project_id}`;

    window.open(downloadCSVApi, 'window');
  };

  const downloadDataButton = (
    <MermaidButton size="small" variant="contained" color="primary" onClick={handleModalOpen}>
      <CloudDownloadIconWrapper />
      <Box fontWeight="fontWeightMedium">Download data</Box>
    </MermaidButton>
  );

  const downloadCSVButton = (
    <MermaidButton size="small" variant="contained" color="primary" onClick={handleDownloadCSV}>
      <CloudDownloadIconWrapper />
      <Box fontWeight="fontWeightMedium">Download CSV</Box>
    </MermaidButton>
  );

  const contactAdminsButton = (
    <MermaidButton
      target="_blank"
      size="small"
      variant="contained"
      color="primary"
      href={currentSelectedSite.contact_link}
    >
      <ContactIconWrapper />
      <Box fontWeight="fontWeightMedium">Contact Admins</Box>
    </MermaidButton>
  );

  const methodDownloadTable = (
    <TableContainer>
      <Table>
        <TableHeadWrapper>
          <TableRow>
            <TableCellWrapper>Method</TableCellWrapper>
            <TableCellWrapper>Data Sharing Policy</TableCellWrapper>
            <TableCellWrapper>Download</TableCellWrapper>
          </TableRow>
        </TableHeadWrapper>
        <TableBody>
          {availableProtocols.map(row => (
            <TableRow key={row.method}>
              <TableCellWrapper>{row.method}</TableCellWrapper>
              <TableCellWrapper>{row.policy}</TableCellWrapper>
              <TableCellWrapper>
                {row.policy === 'private' ? contactAdminsButton : downloadCSVButton}
              </TableCellWrapper>
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
