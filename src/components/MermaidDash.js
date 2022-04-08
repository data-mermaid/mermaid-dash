import React, { Component } from 'react';
import { histogramContext } from '../context/histogramContext';

import summary from '../apis/summary';
import '../customStyles.css';
import * as leafletProperty from '../constants/leaflet-properties';
import CssBaseline from '@material-ui/core/CssBaseline';

import Header from './Header';
import DrawerDashBoard from './DrawerDashBoard';
import LeafletMap from './LeafletMap';
import LeafletMapControl from './LeafletMapControl';
import BottomSummaryPanel from './BottomSummaryPanel';

class MermaidDash extends Component {
  static contextType = histogramContext;

  state = {
    showSiteDetail: false,
    sites: [],
    siteDetail: null,
    projectFishFamilies: [],
    popupSiteList: [],
    metrics: [
      { title: 'Countries', count: null },
      { title: 'Projects', count: null },
      { title: 'Years', count: null },
      { title: 'Sites', count: null },
      { title: 'Transects', count: null },
      { title: 'Avg Coral Coverage', count: null }
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
    dragPanelPosition: { x: 0, y: -175 },
    filterParams: {
      country: [],
      project: [],
      organization: [],
      sample_date_after: '',
      sample_date_before: ''
    },
    filterChoices: { countries: [], projects: [], tags: [], fishFamilies: [] },
    showFilterNumbers: false,
    queryLimit: 1000
  };

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
        sample_date_before: sampleDateBefore
      },
      isFiltering
    } = this.state;

    const { histogram } = this.context;

    const {
      metrics: prevMetrics,
      bbox: prevBbox,
      filterParams: {
        country: prevCountryName,
        project: prevProjectId,
        organization: prevOrganizationId,
        sample_date_after: prevSampleDateAfter,
        sample_date_before: prevSampleDateBefore
      }
    } = prevState;

    const prevMetricCountriesCount = prevMetrics[0].count;
    const prevMetricProjectsCount = prevMetrics[1].count;
    const prevMetricYearsCount = prevMetrics[2].count;
    const prevMetricSitesCount = prevMetrics[3].count;
    const prevMetricTransectsCount = prevMetrics[4].count;
    const prevMetricAvgCoralCoverCount = prevMetrics[5].count;

    if (
      countryName !== prevCountryName ||
      projectId !== prevProjectId ||
      organizationId !== prevOrganizationId ||
      sampleDateAfter !== prevSampleDateAfter ||
      sampleDateBefore !== prevSampleDateBefore
    ) {
      this.filterUpdate();
    }

    if (bbox !== prevBbox && !isFiltering) {
      const updatedSites = this.filterSites(sites, bbox);
      const sampleEventsFromSites = updatedSites.reduce((sampleEvents, site) => {
        for (const sampleEvent of site[1]) {
          sampleEvents.push(sampleEvent);
        }
        return sampleEvents;
      }, []);

      const sampleEventProtocols = sampleEventsFromSites.map(({ protocols }) => protocols);

      this.context.setHistogram(this.histogramCount(sampleEventProtocols, histogram));

      const countryCount = this.getCount(sampleEventsFromSites, 'country_id');
      const projectCount = this.getCount(sampleEventsFromSites, 'project_id');
      const yearCount = this.getCount(sampleEventsFromSites, 'sample_date');
      const uniqueSiteCount = updatedSites.length;
      const transectCount = this.getTransectCount(sampleEventProtocols);
      const avgCoralCoverCount = this.getAvgCoralCount(sampleEventProtocols);

      if (prevMetricCountriesCount !== countryCount) metrics[0].count = countryCount;
      if (prevMetricProjectsCount !== projectCount) metrics[1].count = projectCount;
      if (prevMetricYearsCount !== yearCount) metrics[2].count = yearCount;
      if (prevMetricSitesCount !== uniqueSiteCount) metrics[3].count = uniqueSiteCount;
      if (prevMetricTransectsCount !== transectCount) metrics[4].count = transectCount;
      if (prevMetricAvgCoralCoverCount !== avgCoralCoverCount)
        metrics[5].count = avgCoralCoverCount;

      this.setState({ metrics, isLoading: false });
    }
  }

  componentDidMount() {
    const { filterParams, queryLimit } = this.state;

    const params = new URLSearchParams(this.props.location.search);
    const countryName = params.get('country');
    const projectId = params.get('project');
    const organizationId = params.get('organization');
    const sampleDateAfter = params.get('sample_date_after');
    const sampleDateBefore = params.get('sample_date_before');
    const queryStringsFound =
      countryName || projectId || organizationId || sampleDateAfter || sampleDateBefore
        ? true
        : false;

    const paramsObj = {
      limit: queryLimit,
      country_name: countryName,
      project_id: projectId,
      tag_id: organizationId,
      sample_date_after: sampleDateAfter,
      sample_date_before: sampleDateBefore
    };
    this.fetchAllSites(paramsObj);

    if (countryName) filterParams.country = countryName.split(',');

    if (projectId) filterParams.project = projectId.split(/,(?=\S)|:/);

    if (organizationId) filterParams.organization = organizationId.split(/,(?=\S)|:/);

    if (sampleDateAfter) filterParams.sample_date_after = sampleDateAfter;

    if (sampleDateBefore) filterParams.sample_date_before = sampleDateBefore;

    this.setState({
      filterParams,
      showFilterNumbers: queryStringsFound
    });

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  convertToId = (names, filtered_options) => {
    const result = names
      .map(name => {
        return filtered_options.find(item => item.name === name)?.id;
      })
      .join(',');

    const unknownResult = result.length === 0;

    return unknownResult ? 'undefined' : result;
  };

  getBboxXY = bbox => {
    return bbox.map(item => {
      const bboxItem = item[0];

      return { x: [bboxItem[0][0], bboxItem[1][0]], y: [bboxItem[0][1], bboxItem[2][1]] };
    });
  };

  filterSites = (sites, bbox) => {
    const bboxList = this.getBboxXY(bbox);

    return sites.reduce((newSites, site) => {
      const { longitude, latitude } = site[1][0];
      const point = [longitude, latitude];

      for (const { x, y } of bboxList) {
        if (point[0] >= x[0] && point[0] <= x[1] && point[1] >= y[0] && point[1] <= y[1])
          newSites.push(site);
      }

      return newSites;
    }, []);
  };

  fetchSampleEventsChunk = async (params, pageNo = 1) => {
    const { data } =
      (await summary.get('/summarysampleevents/', {
        params: {
          page: pageNo,
          ...params
        }
      })) || {};

    return data;
  };

  fetchEntiresSampleEvents = async (params, pageNo = 1) => {
    const fetchResults = await this.fetchSampleEventsChunk(params, pageNo);
    const { results, count } = fetchResults;

    if (pageNo * this.state.queryLimit < count) {
      return [...results].concat(await this.fetchEntiresSampleEvents(params, pageNo + 1));
    }

    return results;
  };

  fetchAllChoices = async params => {
    const { filterChoices } = this.state;
    const projectsParam = params.project_id && params.project_id.split(/,(?=\S)|:/);
    const organizationsParam = params.tag_id && params.tag_id.split(/,(?=\S)|:/);
    const projectApi = summary.get('/projects/?showall&status=90&limit=1000');
    const organizationApi = summary.get('/projecttags/?limit=1000');
    const choicesApi = summary.get('/choices/');
    const fishFamiliesApi = summary.get('fishfamilies/?limit=500');

    return await Promise.all([projectApi, organizationApi, choicesApi, fishFamiliesApi]).then(
      response => {
        const {
          data: { results: projects }
        } = response[0];

        const {
          data: { results: organizations }
        } = response[1];

        const { data: countries } = response[2];
        const country_list = this.getChoices('countries', countries);

        const {
          data: { results: fishFamilies }
        } = response[3];

        filterChoices.projects = projects;
        filterChoices.countries = this.fetchNonTestProjectChoices(
          projects,
          'countries',
          country_list
        );
        filterChoices.tags = this.fetchNonTestProjectChoices(projects, 'tags', organizations);
        filterChoices.fishFamilies = fishFamilies;

        //when project names are set, convert to project ids for querying
        if (projectsParam) params.project_id = this.convertToId(projectsParam, projects);

        //when organization names are set, convert to tag ids for querying
        if (organizationsParam) params.tag_id = this.convertToId(organizationsParam, organizations);

        this.setState({ filterChoices, isFilteringChoices: false });
        return params;
      }
    );
  };

  fetchAllSites = async params => {
    const { metrics } = this.state;
    const updatedParams = await this.fetchAllChoices(params);
    const sampleEvents = await this.fetchEntiresSampleEvents(updatedParams);
    const sortedSampleEvents = sampleEvents.sort((a, b) =>
      a.sample_date > b.sample_date ? 1 : -1
    );

    const reducedSites = sortedSampleEvents.reduce((result, sample) => {
      let key = sample.site_id;
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(sample);
      return result;
    }, {});

    const siteEntries = Object.entries(reducedSites);

    if (siteEntries.length === 0) {
      metrics.map(metric => (metric.count = 0));
    }

    this.setState({ sites: siteEntries, metrics, isFiltering: false });
  };

  resize() {
    let currentMobileDisplay = window.innerWidth < 960;

    if (currentMobileDisplay !== this.state.mobileDisplay)
      this.setState({
        mobileDisplay: currentMobileDisplay,
        sidePanelOpen: !currentMobileDisplay
      });
  }

  handleDrawerChange = () => this.setState({ sidePanelOpen: !this.state.sidePanelOpen });

  siteClickHandler = site => {
    const {
      sidePanelOpen,
      mobileDisplay,
      filterChoices: { projects, fishFamilies }
    } = this.state;
    const selectedSiteDetail = site[1];

    const foundRelatedProject = projects.find(({ id }) => id === selectedSiteDetail.project_id);

    const fishFamilyList =
      foundRelatedProject?.data?.settings?.fishFamilySubset.map(family_id => {
        return (
          fishFamilies.find(({ id }) => id === family_id)?.name ||
          `Missing name for id ${family_id}`
        );
      }) || [];

    if (!mobileDisplay && !sidePanelOpen) this.setState({ sidePanelOpen: true });

    this.setState({
      siteDetail: selectedSiteDetail,
      projectFishFamilies: fishFamilyList,
      showSiteDetail: true,
      zoomFullMap: false,
      dragPanelPosition: { x: 0, y: -70 }
    });
  };

  siteDropDownHandler = selectedSites => {
    const { sidePanelOpen, mobileDisplay } = this.state;
    const firstSiteInPopupDropdown = selectedSites[0][1];

    if (!(mobileDisplay || sidePanelOpen)) this.setState({ sidePanelOpen: true });
    this.setState({
      siteDetail: firstSiteInPopupDropdown,
      popupSiteList: selectedSites,
      popupOpen: true,
      showSiteDetail: true,
      zoomFullMap: false,
      dragPanelPosition: { x: 0, y: -70 }
    });
  };

  clearSelectedSiteHandler = () => {
    const { highlightMarker, highlightCluster } = this.state;

    if (highlightMarker !== null) {
      highlightMarker.setIcon(leafletProperty.icon);
      this.setState({ highlightMarker: null });
    }

    if (highlightCluster !== null) {
      highlightCluster.clearLayers();
      this.setState({ highlightCluster: null });
    }

    this.setState({
      showSiteDetail: false,
      zoomFullMap: false,
      siteDetail: null,
      popupOpen: false,
      dragPanelPosition: { x: 0, y: -175 }
    });
  };

  fullMapZoomHandler = zoomOffOption => {
    const zoomFullMap = zoomOffOption ? true : false;

    this.setState({ zoomFullMap });
  };

  zoomToSiteHandler = zoomToOption => {
    const zoomToSite = zoomToOption ? true : false;

    this.setState({ zoomToSite });
  };

  removeHighlight = () => {
    const { highlightMarker } = this.state;

    if (highlightMarker !== null) {
      highlightMarker.setIcon(leafletProperty.icon);
      this.setState({ highlightMarker: null });
    }
  };

  setIconActive = marker => {
    marker.setIcon(leafletProperty.activeIcon);
    this.setState({ highlightMarker: marker });
  };

  removeHighlightCluster = () => {
    const { highlightCluster } = this.state;
    if (highlightCluster !== null) {
      highlightCluster.clearLayers();
      this.setState({ highlightCluster: null });
    }
  };

  setClusterActive = clusterMarker => this.setState({ highlightCluster: clusterMarker });

  getMapBounds = bbox => this.setState({ bbox });

  getCount(sampleEvents, key) {
    let result =
      key === 'sample_date'
        ? sampleEvents.map(({ sample_date }) => sample_date.substring(0, 4))
        : sampleEvents.map(sampleEvent => sampleEvent[key]);

    return new Set(result).size;
  }

  getTransectCount(protocols) {
    const protocolCount = protocols
      .map(({ beltfish, benthicpit, benthiclit, habitatcomplexity, colonies_bleached }) => {
        const beltfishCount = beltfish ? beltfish.sample_unit_count : 0;
        const benthicPitCount = benthicpit ? benthicpit.sample_unit_count : 0;
        const benthicLitCount = benthiclit ? benthiclit.sample_unit_count : 0;
        const habitatComplexityCount = habitatcomplexity ? habitatcomplexity.sample_unit_count : 0;
        const coloniesBleachedCount = colonies_bleached ? colonies_bleached.sample_unit_count : 0;

        return (
          beltfishCount +
          benthicPitCount +
          benthicLitCount +
          habitatComplexityCount +
          coloniesBleachedCount
        );
      })
      .reduce((acc, val) => acc + val, 0);

    return protocolCount;
  }

  getBenthicHardCoralCount = protocols => {
    return protocols.map(({ benthiclit, benthicpit }) => {
      let hardCoralValue;
      if (benthiclit || benthicpit) {
        const benthicpitPercentCover =
          benthicpit !== undefined && benthicpit.percent_cover_by_benthic_category_avg;
        const benthiclitPercentCover =
          benthiclit !== undefined && benthiclit.percent_cover_by_benthic_category_avg;
        const benthicPercentCover = benthicpit ? benthicpitPercentCover : benthiclitPercentCover;
        hardCoralValue = benthicPercentCover && benthicPercentCover['Hard coral'];

        if (benthicpit !== undefined && benthiclit !== undefined) {
          hardCoralValue =
            (benthicpitPercentCover['Hard coral'] + benthiclitPercentCover['Hard coral']) / 2;
        }
      }
      return hardCoralValue;
    });
  };

  getAvgCoralCount(protocols) {
    const benthicHardCoralCount = this.getBenthicHardCoralCount(protocols);
    const filteredBenthicHardCoralCount = benthicHardCoralCount.filter(val => val !== undefined);
    const sumOfCoralCover = filteredBenthicHardCoralCount.reduce((acc, val) => acc + val, 0);
    const avgCoralCover = sumOfCoralCover
      ? sumOfCoralCover / filteredBenthicHardCoralCount.length
      : sumOfCoralCover;

    return Math.round(avgCoralCover);
  }

  histogramCount(protocols, histogramData) {
    const benthicHardCoralCount = this.getBenthicHardCoralCount(protocols);

    return histogramData.map(({ x }) => {
      let count = 0;

      for (let i = 0; i < benthicHardCoralCount.length; i++) {
        const calDiff = parseFloat(x - benthicHardCoralCount[i]).toFixed(2);
        if (benthicHardCoralCount[i] && (0 <= calDiff && calDiff < 2)) {
          count += 1;
        }
      }

      return { x, y: count, label: count };
    });
  }

  contentLoadHandler = option => this.setState({ isLoading: option });

  filterHandler = ({ country, project, organization, sample_date_after, sample_date_before }) => {
    const filterParams = { ...this.state.filterParams };
    filterParams.country = country;
    filterParams.project = project;
    filterParams.organization = organization;
    filterParams.sample_date_after = sample_date_after;
    filterParams.sample_date_before = sample_date_before;

    this.setState({ filterParams });
  };

  filterUpdate = (queryStrings = []) => {
    const { filterParams } = this.state;
    const countryProperty = Object.entries(filterParams)[0];
    const projectIdProperty = Object.entries(filterParams)[1];
    const organizationIdProperty = Object.entries(filterParams)[2];
    const sampleDateAfterProperty = Object.entries(filterParams)[3];
    const sampleDateBeforeProperty = Object.entries(filterParams)[4];

    if (countryProperty[1].length > 0)
      queryStrings.push([countryProperty[0], countryProperty[1].join(',')].join('='));

    if (projectIdProperty[1].length > 0)
      queryStrings.push([projectIdProperty[0], projectIdProperty[1].join(',')].join('='));

    if (organizationIdProperty[1].length > 0)
      queryStrings.push([organizationIdProperty[0], organizationIdProperty[1].join(',')].join('='));

    if (sampleDateAfterProperty[1].length > 0) {
      queryStrings.push([sampleDateAfterProperty[0], sampleDateAfterProperty[1]].join('='));
    }
    if (sampleDateBeforeProperty[1].length > 0) {
      queryStrings.push([sampleDateBeforeProperty[0], sampleDateBeforeProperty[1]].join('='));
    }

    this.props.history.push({
      pathname: '/',
      search: '?' + queryStrings.join('&')
    });

    window.location.reload();
  };

  getChoices = (choice_name, choices) => {
    return choices
      .reduce((resultArray, obj) => {
        if (obj.name === choice_name) resultArray = obj.data;

        return resultArray;
      }, [])
      .map(({ site_id: id, name }) => ({ id, name }));
  };

  fetchNonTestProjectChoices = (projects, property, property_array) => {
    const result = projects
      .reduce((nonTestProject, project) => {
        if (project[property].length !== 0) nonTestProject.push(project[property]);

        return nonTestProject;
      }, [])
      .join(',')
      .split(',');

    return property_array.filter(({ name }) => [...new Set(result)].includes(name));
  };

  render() {
    return (
      <>
        <CssBaseline />
        <Header />
        <DrawerDashBoard
          sidePanelOpen={this.state.sidePanelOpen}
          handleDrawerChange={this.handleDrawerChange}
          siteDetail={this.state.siteDetail}
          showSiteDetail={this.state.showSiteDetail}
          metrics={this.state.metrics}
          isFiltering={this.state.isFiltering}
          clearSelectedSiteHandler={this.clearSelectedSiteHandler}
          fullMapZoomHandler={this.fullMapZoomHandler}
          zoomToSiteHandler={this.zoomToSiteHandler}
          isLoading={this.state.isLoading}
          hideDrawer={this.state.mobileDisplay}
          projectFishFamilies={this.state.projectFishFamilies}
        />
        <LeafletMapControl
          fullMapZoomHandler={this.fullMapZoomHandler}
          zoomToSiteHandler={this.zoomToSiteHandler}
          filterHandler={this.filterHandler}
          filterParams={this.state.filterParams}
          filterChoices={this.state.filterChoices}
          showFilterNumbers={this.state.showFilterNumbers}
          numberOfFilteredSites={this.state.sites.length}
          isFilteringChoices={this.state.isFilteringChoices}
          highlightMarker={this.state.highlightMarker}
        />
        <LeafletMap
          sidePanelOpen={this.state.sidePanelOpen}
          markersData={this.state.sites}
          siteDetail={this.state.siteDetail}
          siteClickHandler={this.siteClickHandler}
          siteDropDownHandler={this.siteDropDownHandler}
          zoomFullMap={this.state.zoomFullMap}
          fullMapZoomHandler={this.fullMapZoomHandler}
          zoomToSite={this.state.zoomToSite}
          zoomToSiteHandler={this.zoomToSiteHandler}
          getMapBounds={this.getMapBounds}
          bbox={this.state.bbox}
          contentLoadHandler={this.contentLoadHandler}
          removeHighlight={this.removeHighlight}
          setIconActive={this.setIconActive}
          removeHighlightCluster={this.removeHighlightCluster}
          setClusterActive={this.setClusterActive}
          highlightMarker={this.state.highlightMarker}
          popupOpen={this.state.popupOpen}
          mobileDisplay={this.state.mobileDisplay}
        />
        {this.state.mobileDisplay && (
          <BottomSummaryPanel
            metrics={this.state.metrics}
            isLoading={this.state.isLoading}
            siteDetail={this.state.siteDetail}
            showSiteDetail={this.state.showSiteDetail}
            clearSelectedSiteHandler={this.clearSelectedSiteHandler}
            projectFishFamilies={this.state.projectFishFamilies}
          />
        )}
      </>
    );
  }
}

export default MermaidDash;
