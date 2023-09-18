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
import {
  sampleUnitTitles,
  pluralizedSampleUnits,
  BLEACHING_PROPERTY_COLONIES_BLEACHED,
} from '../constants/sample-unit-information'
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

  const availableSampleUnits = useMemo(() => {
    const allSites = sites.map(site => site[1]).flat()
    const allSampleUnits = allSites.map(site => Object.keys(site.protocols)).flat()

    const uniqueAvailableSampleUnits = [...new Set(allSampleUnits)].filter(
      // Both keys 'colonies_bleached' and 'quadrat_benthic_percent' are part of Bleaching sample unit.
      // this filter is based on the setup in sample-unit-information.js as 'quadrat_benthic_percent' is used to determined as Bleaching.

      sampleUnitType => sampleUnitType !== BLEACHING_PROPERTY_COLONIES_BLEACHED,
    )

    return uniqueAvailableSampleUnits.reduce((accumulator, sampleUnit) => {
      const sampleUnitTitle = sampleUnitTitles[sampleUnit]

      if (sampleUnitTitle) {
        const sampleUnitDataPolicy =
          sampleUnitTitle === 'Bleaching' ? `data_policy_bleachingqc` : `data_policy_${sampleUnit}`

        const sampleUnitInfo = {
          method: sampleUnitTitle,
          policy: currentSelectedSite[sampleUnitDataPolicy],
          sampleUnit,
        }

        accumulator.push(sampleUnitInfo)
      }

      return accumulator
    }, [])
  }, [currentSelectedSite, sites])

  const handleModalOpen = () => setOpen(true)

  const handleModalClose = () => {
    setOpen(false)
  }

  const handleDownloadCSV = sampleUnit => {
    const sampleUnitToDownload = pluralizedSampleUnits[sampleUnit]
    const downloadCSVApi = `${process.env.REACT_APP_MERMAID_API_URL}/v1/projects/${currentSelectedSite.project_id}/${sampleUnitToDownload}/sampleevents/csv/`

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

  const downloadCSVButton = sampleUnit => (
    <MermaidButton
      size="small"
      variant="contained"
      color="primary"
      onClick={() => handleDownloadCSV(sampleUnit)}
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
          {availableSampleUnits.map(({ method, policy, sampleUnit }) => (
            <TableRow key={method}>
              <TableCellWrapper>{method}</TableCellWrapper>
              <TableCellWrapper>{policy}</TableCellWrapper>
              <TableCellWrapper>
                {policy === 'public' || policy === 'public summary'
                  ? downloadCSVButton(sampleUnit)
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
