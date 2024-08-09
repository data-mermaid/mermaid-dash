import React, { Component } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import summary from '../apis/summary'
import '../customStyles.css'
import * as leafletProperty from '../constants/leaflet-properties'

import { HistogramContext } from '../context/histogramContext'
import Header from './Header'
import DrawerDashBoard from './DrawerDashBoard'
import LeafletMap from './LeafletMap'
import LeafletMapControl from './LeafletMapControl'
import BottomSummaryPanel from './BottomSummaryPanel'
import {
  convertQueryParamsToIds,
  getChoices,
  getSitesGroupBySampleEvents,
} from '../lib/array-helpers'

class MermaidDash extends Component {
  state = {
    showSiteDetail: false,
    sites: [],
    allSites: [],
    siteDetail: null,
    projectFishFamilies: [],
    metrics: [
      { title: 'Countries', count: null },
      { title: 'Projects', count: null },
      { title: 'Years', count: null },
      { title: 'Sites', count: null },
      { title: 'Transects', count: null },
      { title: 'Avg Coral Coverage', count: null },
    ],
    bbox: null,
    zoomFullMap: false,
    zoomToSite: false,
    highlightMarker: null,
    highlightCluster: null,
    isLoading: false,
    isFiltering: true,
    isFilteringChoices: true,
    sidePanelOpen: window.innerWidth >= 960,
    popupOpen: false,
    mobileDisplay: window.innerWidth < 960,
    filterParams: {
      country: [],
      project: [],
      organization: [],
      sample_date_after: '',
      sample_date_before: '',
    },
    filterChoices: { countries: [], projects: [], tags: [], fishFamilies: [] },
    showFilterNumbers: false,
    queryLimit: 1000,
  }

  componentDidMount() {
    const { filterParams, queryLimit } = this.state

    const params = new URLSearchParams(this.props.location.search) // eslint-disable-line
    const countryName = params.get('country')
    const projectId = params.get('project')
    const organizationId = params.get('organization')
    const sampleDateAfter = params.get('sample_date_after')
    const sampleDateBefore = params.get('sample_date_before')
    const queryStringsFound =
      countryName || projectId || organizationId || sampleDateAfter || sampleDateBefore

    const paramsObj = {
      limit: queryLimit,
      country_name: countryName,
      project_id: projectId,
      tag_id: organizationId,
      sample_date_after: sampleDateAfter,
      sample_date_before: sampleDateBefore,
    }

    this.fetchAllSites(paramsObj)
    this.fetchAllSitesWithEmptyQueryParams()

    if (countryName) {
      filterParams.country = countryName.split(',')
    }

    if (projectId) {
      filterParams.project = projectId.split(/,(?=\S)|:/)
    }

    if (organizationId) {
      filterParams.organization = organizationId.split(/,(?=\S)|:/)
    }

    if (sampleDateAfter) {
      filterParams.sample_date_after = sampleDateAfter
    }

    if (sampleDateBefore) {
      filterParams.sample_date_before = sampleDateBefore
    }

    this.setState({
      filterParams,
      showFilterNumbers: queryStringsFound !== null,
    })

    window.addEventListener('resize', this.resize.bind(this))
    this.resize()
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      sites,
      bbox,
      metrics,
      filterParams: {
        country: countryName,
        project: projectId,
        organization: organizationId,
        sample_date_after: sampleDateAfter,
        sample_date_before: sampleDateBefore,
      },
      isFiltering,
    } = this.state

    const { histogram, setHistogram } = this.context

    const {
      metrics: prevMetrics,
      bbox: prevBbox,
      filterParams: {
        country: prevCountryName,
        project: prevProjectId,
        organization: prevOrganizationId,
        sample_date_after: prevSampleDateAfter,
        sample_date_before: prevSampleDateBefore,
      },
    } = prevState

    const prevMetricCountriesCount = prevMetrics[0].count
    const prevMetricProjectsCount = prevMetrics[1].count
    const prevMetricYearsCount = prevMetrics[2].count
    const prevMetricSitesCount = prevMetrics[3].count
    const prevMetricTransectsCount = prevMetrics[4].count
    const prevMetricAvgCoralCoverCount = prevMetrics[5].count

    if (
      countryName !== prevCountryName ||
      projectId !== prevProjectId ||
      organizationId !== prevOrganizationId ||
      sampleDateAfter !== prevSampleDateAfter ||
      sampleDateBefore !== prevSampleDateBefore
    ) {
      this.filterUpdate()
    }

    if (bbox !== prevBbox && !isFiltering) {
      const updatedSites = this.filterSites(sites, bbox)
      const sampleEventsFromSites = updatedSites.reduce((sampleEvents, site) => {
        for (const sampleEvent of site[1]) {
          sampleEvents.push(sampleEvent)
        }

        return sampleEvents
      }, [])

      const sampleUnitProtocols = sampleEventsFromSites.map(({ protocols }) => protocols)

      setHistogram(this.histogramCount(sampleUnitProtocols, histogram))

      const countryCount = this.getCount(sampleEventsFromSites, 'country_id')
      const projectCount = this.getCount(sampleEventsFromSites, 'project_id')
      const yearCount = this.getCount(sampleEventsFromSites, 'sample_date')
      const uniqueSiteCount = updatedSites.length
      const transectCount = this.getTransectCount(sampleUnitProtocols)
      const averageCoralCoverageCount = this.getAverageCoralCoverage(sampleUnitProtocols)

      if (prevMetricCountriesCount !== countryCount) {
        metrics[0].count = countryCount
      }
      if (prevMetricProjectsCount !== projectCount) {
        metrics[1].count = projectCount
      }
      if (prevMetricYearsCount !== yearCount) {
        metrics[2].count = yearCount
      }
      if (prevMetricSitesCount !== uniqueSiteCount) {
        metrics[3].count = uniqueSiteCount
      }
      if (prevMetricTransectsCount !== transectCount) {
        metrics[4].count = transectCount
      }
      if (prevMetricAvgCoralCoverCount !== averageCoralCoverageCount) {
        metrics[5].count = averageCoralCoverageCount
      }

      this.setState({ metrics, isLoading: false })
    }
  }

  fetchSampleEventsChunk = async (params, pageNo = 1) => {
    const { data } =
      (await summary.get('/summarysampleevents/', {
        params: {
          page: pageNo,
          ...params,
        },
      })) || {}

    return data
  }

  fetchEntiresSampleEvents = async (params, pageNo = 1) => {
    const fetchResults = await this.fetchSampleEventsChunk(params, pageNo)
    const { results, count } = fetchResults
    const { queryLimit } = this.state

    if (pageNo * queryLimit < count) {
      return [...results].concat(await this.fetchEntiresSampleEvents(params, pageNo + 1))
    }

    return results
  }

  fetchAllChoices = async params => {
    const updatedParams = { ...params }
    const { filterChoices } = this.state
    const projectsParam = updatedParams.project_id && updatedParams.project_id.split(/,(?=\S)|:/)
    const organizationsParam = updatedParams.tag_id && updatedParams.tag_id.split(/,(?=\S)|:/)
    const projectApi = summary.get(
      '/projects/?showall&status=90&limit=1000&fields=id,name,countries,tags',
    )
    const organizationApi = summary.get('/projecttags/?limit=1000')
    const choicesApi = summary.get('/choices/')
    const fishFamiliesApi = summary.get('fishfamilies/?limit=500')

    const response = await Promise.all([projectApi, organizationApi, choicesApi, fishFamiliesApi])
    const {
      data: { results: projects },
    } = response[0]
    const {
      data: { results: organizations },
    } = response[1]
    const { data: countries } = response[2]
    const country_list = getChoices('countries', countries)
    const {
      data: { results: fishFamilies },
    } = response[3]

    filterChoices.projects = projects
    filterChoices.countries = this.fetchNonTestProjectChoices(projects, 'countries', country_list)
    filterChoices.tags = this.fetchNonTestProjectChoices(projects, 'tags', organizations)
    filterChoices.fishFamilies = fishFamilies

    // When project names are set, convert to project ids for querying
    if (projectsParam) {
      const projectQueryParamIds = convertQueryParamsToIds(projectsParam, projects)

      updatedParams.project_id = projectQueryParamIds
    }

    // When organization names are set, convert to tag ids for querying
    if (organizationsParam) {
      updatedParams.tag_id = convertQueryParamsToIds(organizationsParam, organizations)
    }

    this.setState({ filterChoices, isFilteringChoices: false })

    return updatedParams
  }

  fetchAllSites = async params => {
    let { metrics: updatedMetrics } = this.state
    const updatedParams = await this.fetchAllChoices(params)
    const sampleEvents = await this.fetchEntiresSampleEvents(updatedParams)
    const sitesGroupedBySampleEventName = getSitesGroupBySampleEvents(sampleEvents)

    if (sitesGroupedBySampleEventName.length === 0) {
      updatedMetrics = [
        { title: 'Countries', count: 0 },
        { title: 'Projects', count: 0 },
        { title: 'Years', count: 0 },
        { title: 'Sites', count: 0 },
        { title: 'Transects', count: 0 },
        { title: 'Avg Coral Coverage', count: 0 },
      ]
    }

    this.setState({
      sites: sitesGroupedBySampleEventName,
      metrics: updatedMetrics,
      isFiltering: false,
    })
  }

  fetchAllSitesWithEmptyQueryParams = async () => {
    const emptyParams = {
      country_name: null,
      limit: 1000,
      project_id: null,
      sample_date_after: null,
      sample_date_before: null,
      tag_id: null,
    }

    const sampleEvents = await this.fetchEntiresSampleEvents(emptyParams)
    const sitesGroupedBySampleEventName = getSitesGroupBySampleEvents(sampleEvents)

    this.setState({ allSites: sitesGroupedBySampleEventName })
  }

  fetchNonTestProjectChoices = (projects, property, property_array) => {
    const result = projects
      .reduce((nonTestProject, project) => {
        if (project[property].length !== 0) {
          nonTestProject.push(project[property])
        }

        return nonTestProject
      }, [])
      .join(',')
      .split(',')

    return property_array.filter(({ name }) => [...new Set(result)].includes(name))
  }

  getBboxXY = bbox => {
    return bbox.map(item => {
      const bboxItem = item[0]

      return { x: [bboxItem[0][0], bboxItem[1][0]], y: [bboxItem[0][1], bboxItem[2][1]] }
    })
  }

  handleDrawerChange = () => {
    const { sidePanelOpen } = this.state

    this.setState({ sidePanelOpen: !sidePanelOpen })
  }

  resize = () => {
    const { mobileDisplay } = this.state
    const currentMobileDisplay = window.innerWidth < 960

    if (currentMobileDisplay !== mobileDisplay) {
      this.setState({
        mobileDisplay: currentMobileDisplay,
        sidePanelOpen: !currentMobileDisplay,
      })
    }
  }

  removeHighlight = () => {
    const { highlightMarker } = this.state

    if (highlightMarker !== null) {
      highlightMarker.setIcon(leafletProperty.icon)
      this.setState({ highlightMarker: null })
    }
  }

  setIconActive = marker => {
    marker.setIcon(leafletProperty.activeIcon)
    this.setState({ highlightMarker: marker })
  }

  removeHighlightCluster = () => {
    const { highlightCluster } = this.state

    if (highlightCluster !== null) {
      highlightCluster.clearLayers()
      this.setState({ highlightCluster: null })
    }
  }

  setClusterActive = clusterMarker => this.setState({ highlightCluster: clusterMarker })

  getMapBounds = bbox => this.setState({ bbox })

  getCount = (sampleEvents, key) => {
    const result =
      key === 'sample_date'
        ? sampleEvents.map(({ sample_date }) => sample_date.substring(0, 4))
        : sampleEvents.map(sampleEvent => sampleEvent[key])

    return new Set(result).size
  }

  getTransectCount = sampleUnits => {
    const sampleUnitCount = sampleUnits
      .map(
        ({
          beltfish,
          benthicpit,
          benthiclit,
          benthicpqt,
          habitatcomplexity,
          colonies_bleached,
        }) => {
          const beltfishCount = beltfish ? beltfish.sample_unit_count : 0
          const benthicPitCount = benthicpit ? benthicpit.sample_unit_count : 0
          const benthicLitCount = benthiclit ? benthiclit.sample_unit_count : 0
          const benthicPqtCount = benthicpqt ? benthicpqt.sample_unit_count : 0
          const habitatComplexityCount = habitatcomplexity ? habitatcomplexity.sample_unit_count : 0
          const coloniesBleachedCount = colonies_bleached ? colonies_bleached.sample_unit_count : 0

          return (
            beltfishCount +
            benthicPitCount +
            benthicLitCount +
            benthicPqtCount +
            habitatComplexityCount +
            coloniesBleachedCount
          )
        },
      )
      .reduce((acc, val) => acc + val, 0)

    return sampleUnitCount
  }

  getSampleEventBenthicHardCoralAverages = sampleUnits => {
    return sampleUnits.map(({ benthiclit, benthicpit, benthicpqt, quadrat_benthic_percent }) => {
      const benthicLITCover = benthiclit && benthiclit.percent_cover_benthic_category_avg
      const benthicPITCover = benthicpit && benthicpit.percent_cover_benthic_category_avg
      const benthicPQTCover = benthicpqt && benthicpqt.percent_cover_benthic_category_avg
      const benthicBQCHardCoral =
        quadrat_benthic_percent && quadrat_benthic_percent.percent_hard_avg_avg

      if (benthicLITCover || benthicPITCover || benthicPQTCover || benthicBQCHardCoral) {
        const benthicLITHardCoral = benthicLITCover && benthicLITCover['Hard coral']
        const benthicPITHardCoral = benthicPITCover && benthicPITCover['Hard coral']
        const benthicPQTHardCoral = benthicPQTCover && benthicPQTCover['Hard coral']

        const numerator =
          (benthicLITHardCoral !== undefined ? benthicLITHardCoral : 0) +
          (benthicPITHardCoral !== undefined ? benthicPITHardCoral : 0) +
          (benthicPQTHardCoral !== undefined ? benthicPQTHardCoral : 0) +
          (benthicBQCHardCoral !== undefined ? benthicBQCHardCoral : 0)

        const denominator =
          (benthicLITHardCoral !== undefined ? 1 : 0) +
          (benthicPITHardCoral !== undefined ? 1 : 0) +
          (benthicPQTHardCoral !== undefined ? 1 : 0) +
          (benthicBQCHardCoral !== undefined ? 1 : 0)

        return numerator / denominator
      }

      return null
    })
  }

  getAverageCoralCoverage = sampleUnits => {
    const benthicHardCoralAverages = this.getSampleEventBenthicHardCoralAverages(sampleUnits)
    const filteredBenthicHardCoralAverages = benthicHardCoralAverages.filter(val => val !== null)
    const sumOfHardCoralAverages = filteredBenthicHardCoralAverages.reduce(
      (acc, val) => acc + val,
      0,
    )

    return filteredBenthicHardCoralAverages.length
      ? Math.round(sumOfHardCoralAverages / filteredBenthicHardCoralAverages.length)
      : 0
  }

  siteClickHandler = site => {
    const {
      sidePanelOpen,
      mobileDisplay,
      filterChoices: { projects, fishFamilies },
    } = this.state
    const selectedSiteDetail = site[1]
    const foundRelatedProject = projects.find(({ id }) => id === selectedSiteDetail[0].project_id)

    const fishFamilyList =
      foundRelatedProject?.data?.settings?.fishFamilySubset.map(family_id => {
        return (
          fishFamilies.find(({ id }) => id === family_id)?.name ||
          `Missing name for id ${family_id}`
        )
      }) || []

    if (!mobileDisplay && !sidePanelOpen) {
      this.setState({ sidePanelOpen: true })
    }

    this.setState({
      siteDetail: selectedSiteDetail,
      projectFishFamilies: fishFamilyList,
      showSiteDetail: true,
      zoomFullMap: false,
    })
  }

  siteDropDownHandler = selectedSites => {
    const { sidePanelOpen, mobileDisplay } = this.state
    const firstSiteInPopupDropdown = selectedSites[0][1]

    if (!(mobileDisplay || sidePanelOpen)) {
      this.setState({ sidePanelOpen: true })
    }

    this.setState({
      siteDetail: firstSiteInPopupDropdown,
      popupOpen: true,
      showSiteDetail: true,
      zoomFullMap: false,
    })
  }

  clearSelectedSiteHandler = () => {
    const { highlightMarker, highlightCluster } = this.state

    if (highlightMarker !== null) {
      highlightMarker.setIcon(leafletProperty.icon)
      this.setState({ highlightMarker: null })
    }

    if (highlightCluster !== null) {
      highlightCluster.clearLayers()
      this.setState({ highlightCluster: null })
    }

    this.setState({
      showSiteDetail: false,
      zoomFullMap: false,
      siteDetail: null,
      popupOpen: false,
    })
  }

  fullMapZoomHandler = zoomFullMapOption => this.setState({ zoomFullMap: zoomFullMapOption })

  zoomToSiteHandler = zoomToSiteOption => this.setState({ zoomToSite: zoomToSiteOption })

  histogramCount = (sampleUnits, histogramData) => {
    const benthicHardCoralCount = this.getSampleEventBenthicHardCoralAverages(sampleUnits)

    return histogramData.map(({ x }) => {
      let count = 0

      for (let i = 0; i < benthicHardCoralCount.length; i++) {
        const calDiff = parseFloat(x - benthicHardCoralCount[i]).toFixed(2)

        if (benthicHardCoralCount[i] && calDiff >= 0 && calDiff < 2) {
          count += 1
        }
      }

      return { x, y: count, label: count }
    })
  }

  contentLoadHandler = option => this.setState({ isLoading: option })

  filterSites = (sites, bbox) => {
    const normalizeLongitude = lon => {
      let lng = lon

      while (lng < -180) {
        lng += 360
      }
      while (lng > 180) {
        lng -= 360
      }

      return lng
    }

    const x1 = bbox._southWest.lng
    const x2 = bbox._northEast.lng
    const y1 = bbox._southWest.lat
    const y2 = bbox._northEast.lat
    const searchBoxes = []

    if (x1 < -180 && x2 > 180) {
      searchBoxes.push([-180, y1, 180, y2])
    } else if ((x1 > 180 && x2 > 180) || (x1 < -180 && x2 <= 180)) {
      searchBoxes.push([normalizeLongitude(x1), y1, normalizeLongitude(x2), y2])
    } else if (x1 >= -180 && x2 > 180) {
      searchBoxes.push([x1, y1, 180, y2])
      searchBoxes.push([-180, y1, normalizeLongitude(x2), y2])
    } else if (x1 < -180 && x2 <= 180) {
      searchBoxes.push([-180, y1, x2, y2])
      searchBoxes.push([normalizeLongitude(x1), y1, 180, y2])
    } else {
      searchBoxes.push([x1, y1, x2, y2])
    }

    const filteredSites = sites.reduce((newSites, site) => {
      const { longitude, latitude } = site[1][0]

      const is_in_bbox =
        searchBoxes.filter(([_x1, _y1, _x2, _y2]) => {
          return longitude >= _x1 && longitude <= _x2 && latitude >= _y1 && latitude <= _y2
        }).length > 0

      if (is_in_bbox) {
        newSites.push(site)
      }

      return newSites
    }, [])

    return filteredSites
  }

  filterHandler = ({ country, project, organization, sample_date_after, sample_date_before }) => {
    this.setState({
      filterParams: {
        country,
        project,
        organization,
        sample_date_after,
        sample_date_before,
      },
    })
  }

  filterUpdate = () => {
    const queryStrings = new URLSearchParams()
    const { filterParams } = this.state
    const countryProperty = Object.entries(filterParams)[0]
    const projectIdProperty = Object.entries(filterParams)[1]
    const organizationIdProperty = Object.entries(filterParams)[2]
    const sampleDateAfterProperty = Object.entries(filterParams)[3]
    const sampleDateBeforeProperty = Object.entries(filterParams)[4]

    if (countryProperty[1].length > 0) {
      queryStrings.append(`${countryProperty[0]}`, `${countryProperty[1].join(',')}`)
    }

    if (projectIdProperty[1].length > 0) {
      queryStrings.append(`${projectIdProperty[0]}`, `${projectIdProperty[1].join(',')}`)
    }

    if (organizationIdProperty[1].length > 0) {
      queryStrings.append(`${organizationIdProperty[0]}`, `${organizationIdProperty[1].join(',')}`)
    }

    if (sampleDateAfterProperty[1].length > 0) {
      queryStrings.append(`${sampleDateAfterProperty[0]}`, `${sampleDateAfterProperty[1]}`)
    }
    if (sampleDateBeforeProperty[1].length > 0) {
      queryStrings.append(`${sampleDateBeforeProperty[0]}`, `${sampleDateBeforeProperty[1]}`)
    }

    // eslint-disable-next-line
    this.props.history.push({
      pathname: '/',
      search: `?${queryStrings.toString()}`,
    })

    window.location.reload()
  }

  render() {
    const {
      mobileDisplay,
      filterParams,
      filterChoices,
      isFiltering,
      isFilteringChoices,
      isLoading,
      metrics,
      projectFishFamilies,
      showSiteDetail,
      showFilterNumbers,
      sidePanelOpen,
      siteDetail,
      sites,
      allSites,
      highlightMarker,
      zoomFullMap,
      zoomToSite,
      bbox,
      popupOpen,
    } = this.state

    return (
      <>
        <CssBaseline />
        <Header />
        <DrawerDashBoard
          clearSelectedSiteHandler={this.clearSelectedSiteHandler}
          handleDrawerChange={this.handleDrawerChange}
          hideDrawer={mobileDisplay}
          isFiltering={isFiltering}
          isLoading={isLoading}
          metrics={metrics}
          projectFishFamilies={projectFishFamilies}
          showSiteDetail={showSiteDetail}
          sidePanelOpen={sidePanelOpen}
          siteDetail={siteDetail}
          sites={sites}
        />
        <LeafletMapControl
          fullMapZoomHandler={this.fullMapZoomHandler}
          zoomToSiteHandler={this.zoomToSiteHandler}
          filterHandler={this.filterHandler}
          filterParams={filterParams}
          filterChoices={filterChoices}
          showFilterNumbers={showFilterNumbers}
          numberOfFilteredSites={sites.length}
          isFilteringChoices={isFilteringChoices}
          highlightMarker={highlightMarker}
          allSites={allSites}
        />
        <LeafletMap
          sidePanelOpen={sidePanelOpen}
          markersData={sites}
          siteDetail={siteDetail}
          siteClickHandler={this.siteClickHandler}
          siteDropDownHandler={this.siteDropDownHandler}
          zoomFullMap={zoomFullMap}
          fullMapZoomHandler={this.fullMapZoomHandler}
          zoomToSite={zoomToSite}
          zoomToSiteHandler={this.zoomToSiteHandler}
          getMapBounds={this.getMapBounds}
          bbox={bbox}
          contentLoadHandler={this.contentLoadHandler}
          removeHighlight={this.removeHighlight}
          setIconActive={this.setIconActive}
          removeHighlightCluster={this.removeHighlightCluster}
          setClusterActive={this.setClusterActive}
          highlightMarker={highlightMarker}
          popupOpen={popupOpen}
          mobileDisplay={mobileDisplay}
        />
        {mobileDisplay && (
          <BottomSummaryPanel
            metrics={metrics}
            isLoading={isLoading}
            siteDetail={siteDetail}
            showSiteDetail={showSiteDetail}
            clearSelectedSiteHandler={this.clearSelectedSiteHandler}
            projectFishFamilies={projectFishFamilies}
            sites={sites}
          />
        )}
      </>
    )
  }
}

MermaidDash.contextType = HistogramContext

export default MermaidDash
