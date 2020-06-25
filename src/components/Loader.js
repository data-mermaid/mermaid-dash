import React from 'react';
import ContentLoader from 'react-content-loader';

export const TextLoader = () => (
  <ContentLoader height={96} width={400} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="0" y="10" rx="4" ry="4" width="200" height="15" />
    <rect x="0" y="35" rx="3" ry="3" width="220" height="10" />
    <rect x="0" y="55" rx="3" ry="3" width="360" height="8" />
    <rect x="0" y="70" rx="3" ry="3" width="380" height="8" />
    <rect x="0" y="85" rx="3" ry="3" width="100" height="8" />
  </ContentLoader>
);

export const ChartLoader = () => (
  <ContentLoader height={300} width={400} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="0" y="10" rx="4" ry="5" width="400" height="300" />
  </ContentLoader>
);
