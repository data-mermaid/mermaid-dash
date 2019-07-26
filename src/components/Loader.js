import React from 'react';
import ContentLoader from 'react-content-loader';

export const TextLoader = () => (
  <ContentLoader height={200} width={400} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="0" y="13" rx="4" ry="4" width="150" height="15" />
    <rect x="0" y="51" rx="3" ry="3" width="350" height="6" />
    <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
    <rect x="0" y="92" rx="3" ry="3" width="201" height="6" />
  </ContentLoader>
);

export const ChartLoader = () => (
  <ContentLoader height={375} width={400} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="0" y="13" rx="4" ry="4" width="150" height="15" />
    <rect x="0" y="56" rx="5" ry="5" width="400" height="400" />
  </ContentLoader>
);
