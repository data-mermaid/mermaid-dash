import React from 'react'
import ContentLoader from 'react-content-loader'

export const TextLoader = () => (
  <ContentLoader height={66} width={400} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="0" y="5" rx="4" ry="4" width="250" height="20" />
    <rect x="0" y="35" rx="3" ry="3" width="150" height="15" />
    <rect x="0" y="55" rx="3" ry="3" width="360" height="12" />
  </ContentLoader>
)

export const ChartLoader = () => (
  <ContentLoader height={300} width={400} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="0" y="10" rx="4" ry="5" width="400" height="300" />
  </ContentLoader>
)
