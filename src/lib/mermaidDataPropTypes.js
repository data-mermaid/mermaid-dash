import PropTypes from 'prop-types'

export const histogramContentPropType = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    label: PropTypes.number,
  }),
)

export const pieChartContentPropType = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.number,
  }),
)

export const textContentPropType = PropTypes.shape({
  title: PropTypes.string,
  header: PropTypes.string,
  body: PropTypes.string,
  type: PropTypes.string,
})

export const filterParamsPropType = PropTypes.shape({
  country: PropTypes.arrayOf(PropTypes.string),
  project: PropTypes.arrayOf(PropTypes.string),
  organization: PropTypes.arrayOf(PropTypes.string),
  sample_date_after: PropTypes.string,
  sample_date_before: PropTypes.string,
})

export const filterChoicesPropType = PropTypes.shape({
  countries: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })),
  projects: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })),
  tags: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })),
})

export const bleachingPropType = PropTypes.shape({
  count_genera_avg: PropTypes.number,
  count_total_avg: PropTypes.number,
  percent_bleached_avg: PropTypes.number,
  percent_normal_avg: PropTypes.number,
  percent_pale_avg: PropTypes.number,
  sample_unit_count: PropTypes.number,
})

export const fishbeltPropType = PropTypes.shape({
  sample_unit_count: PropTypes.number,
  biomass_kgha_avg: PropTypes.number,
  biomass_kgha_trophic_group_avg: PropTypes.shape({
    'herbivore-detritivore': PropTypes.number,
    'herbivore-macroalgae': PropTypes.number,
    'invertivore-mobile': PropTypes.number,
    'invertivore-sessile': PropTypes.number,
    other: PropTypes.number,
    omnivore: PropTypes.number,
    piscivore: PropTypes.number,
    planktivore: PropTypes.number,
  }),
})

export const benthicPitPropType = PropTypes.shape({
  percent_cover_benthic_category_avg: PropTypes.shape({
    'Bare substrate': PropTypes.number,
    'Crustose coralline algae': PropTypes.number,
    Cyanobacteria: PropTypes.number,
    'Hard coral': PropTypes.number,
    'Other invertebrates': PropTypes.number,
    Rubble: PropTypes.number,
    Sand: PropTypes.number,
    Seagrass: PropTypes.number,
    'Soft coral': PropTypes.number,
    Trash: PropTypes.number,
    'Turf algae': PropTypes.number,
  }),
  sample_unit_count: PropTypes.number,
})

export const siteDetailPropType = PropTypes.shape({
  contact_link: PropTypes.string,
  country_id: PropTypes.string,
  country_name: PropTypes.string,
  data_policy_beltfish: PropTypes.string,
  data_policy_benthiclit: PropTypes.string,
  data_policy_benthicpit: PropTypes.string,
  data_policy_benthicpqt: PropTypes.string,
  data_policy_bleachingqc: PropTypes.string,
  data_policy_habitatcomplexity: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  management_id: PropTypes.string,
  management_name: PropTypes.string,
  management_notes: PropTypes.string,
  project_admins: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
  project_id: PropTypes.string,
  project_name: PropTypes.string,
  project_notes: PropTypes.string,
  protocols: PropTypes.shape({
    beltfish: fishbeltPropType,
    benthicpit: benthicPitPropType,
  }),
  reef_exposure: PropTypes.string,
  reef_type: PropTypes.string,
  reef_zone: PropTypes.string,
  sample_date: PropTypes.string,
  sample_event_id: PropTypes.string,
  site_id: PropTypes.string,
  site_name: PropTypes.string,
  site_notes: PropTypes.string,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
})

const sitePropType = (props, propName, componentName) => {
  if (!Array.isArray(props[propName])) {
    return new Error(
      `Failed prop type: Invalid prop ${propName} supplied to ${componentName}, expected an Array.`,
    )
  }
  if (typeof props[propName][0] !== 'string') {
    return new Error(
      `Failed prop type: Invalid property element ${propName}[0] supplied to ${componentName}, expected an String.`,
    )
  }
  if (!Array.isArray(props[propName][1])) {
    return new Error(
      `Failed prop type: Invalid property element ${propName}[1] supplied to ${componentName}, expected an Array.`,
    )
  }

  return null
}

export const sitesPropType = PropTypes.arrayOf(sitePropType)

export const dropdownOptionsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    label: PropTypes.string,
    group: PropTypes.string,
  }),
)
