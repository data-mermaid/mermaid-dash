import React, { Component } from 'react';
import summary from '../apis/summary';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MetricCard from './MetricCard';

const metricStyle = theme => ({
  root: {
    padding: theme.spacing(2, 0)
  }
});

class MetricCards extends Component {
  state = {
    metrics: [
      { title: 'Countries', count: 10 },
      { title: 'Projects', count: 2 },
      { title: 'Users', count: 20 },
      { title: 'Sites', count: null },
      { title: 'Transects', count: 5 },
      { title: 'Avg Coral Coverage', count: '12%' }
    ]
  };

  async componentDidMount() {
    const {
      data: { features }
    } = await summary.get('/sites');

    const metrics = [...this.state.metrics];
    metrics[3].count = features.length;
    this.setState({ metrics });
  }

  render() {
    const { classes } = this.props;
    const cardList = this.state.metrics.map((card, index) => {
      return (
        <Grid item xs={4} key={index}>
          <MetricCard content={card} />
        </Grid>
      );
    });

    return (
      <Grid container spacing={2} className={classes.root}>
        {cardList}
      </Grid>
    );
  }
}

export default withStyles(metricStyle)(MetricCards);
