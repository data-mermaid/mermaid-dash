import React, { useState, useMemo } from 'react'

import styled from 'styled-components/macro'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Box, Dialog, useMediaQuery } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import ContactIcon from '@material-ui/icons/Email'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

import { DialogText, DialogTitle, MermaidButton } from '../styles/MermaidStyledComponents'
import { protocolMethods, pluralizedProtocols } from '../constants/transect-protocols'
import MermaidDashboardTooltip from './MermaidDashboardTooltip'
import { siteDetailPropType, sitesPropType } from '../lib/mermaidDataPropTypes'

const ContactIconWrapper = styled(ContactIcon)`
  padding-right: 5px;
  font-size: small;
`

const CloudDownloadIconWrapper = styled(CloudDownloadIcon)`
  padding-right: 5px;
  font-size: small;
`

const TableHeadWrapper = styled(TableHead)`
  background-color: lightgrey;
`

const TableCellWrapper = styled(TableCell)`
  text-transform: capitalize;
`

const DownloadDataModal = ({ currentSelectedSite, sites }) => {
  const mediaMin1281 = useMediaQuery('(min-width:1281px)')
  const [open, setOpen] = useState(false)

  const availableProtocols = useMemo(() => {
    const allSites = sites.map(site => site[1]).flat()
    const allProtocols = allSites.map(site => Object.keys(site.protocols)).flat()

    const uniqueAvailableProtocol = [...new Set(allProtocols)].filter(
      // Both keys 'colonies_bleached' and 'quadrat_benthic_percent' are part of Bleaching protocol.
      // this filter is based on the setup in transect-protocol.js as 'quadrat_benthic_percent' is used to determined as Bleaching.

      protocols => protocols !== 'colonies_bleached',
    )

    return uniqueAvailableProtocol.reduce((accumulator, protocol) => {
      const protocolMethod = protocolMethods[protocol]

      if (protocolMethod) {
        const protocolDataPolicy =
          protocolMethod === 'Bleaching' ? `data_policy_bleachingqc` : `data_policy_${protocol}`

        const protocolInfo = {
          method: protocolMethod,
          policy: currentSelectedSite[protocolDataPolicy],
          protocol,
        }

        accumulator.push(protocolInfo)
      }

      return accumulator
    }, [])
  }, [currentSelectedSite, sites])

  const handleModalOpen = () => setOpen(true)

  const handleModalClose = () => {
    setOpen(false)
  }

  const handleDownloadCSV = protocol => {
    const protocolToDownload = pluralizedProtocols[protocol]
    const downloadCSVApi = `${process.env.REACT_APP_MERMAID_API_URL}/v1/projects/${currentSelectedSite.project_id}/${protocolToDownload}/sampleevents/csv/`

    window.open(downloadCSVApi)
  }

  const downloadDataButton = (
    <MermaidButton size="small" variant="contained" color="primary" onClick={handleModalOpen}>
      {mediaMin1281 ? (
        <>
          <CloudDownloadIconWrapper />
          <Box fontWeight="fontWeightMedium">Download data</Box>
        </>
      ) : (
        <MermaidDashboardTooltip title="download data" placement="bottom">
          <CloudDownloadIconWrapper />
        </MermaidDashboardTooltip>
      )}
    </MermaidButton>
  )

  const downloadCSVButton = protocol => (
    <MermaidButton
      size="small"
      variant="contained"
      color="primary"
      onClick={() => handleDownloadCSV(protocol)}
    >
      <CloudDownloadIconWrapper />
      <Box fontWeight="fontWeightMedium">Download CSV</Box>
    </MermaidButton>
  )

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
  )

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
                {row.policy === 'public' || row.policy === 'public summary'
                  ? downloadCSVButton(row.protocol)
                  : contactAdminsButton}
              </TableCellWrapper>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  return (
    <>
      {downloadDataButton}
      <Dialog open={open} aria-labelledby="download-data-dialog">
        <MuiDialogTitle>
          <DialogTitle>{currentSelectedSite.project_name}</DialogTitle>
        </MuiDialogTitle>
        <MuiDialogContent>
          <DialogText>Download sample event data in CSV format per method</DialogText>
          {methodDownloadTable}
          <DialogText>
            To download raw observation data,{' '}
            <a target="_blank" href={currentSelectedSite.contact_link} rel="noopener noreferrer">
              contact the project&apos;s admins.
            </a>
          </DialogText>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  )
}

DownloadDataModal.propTypes = {
  currentSelectedSite: siteDetailPropType.isRequired,
  sites: sitesPropType.isRequired,
}

export default DownloadDataModal
