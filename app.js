/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import {json as requestJson} from 'd3-request';
import {csv as requestCsv} from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = "pk.eyJ1IjoiZGRsIiwiYSI6ImNqMjcxaDU1eTAwMnYycXBqdHU2eDF3NnEifQ.GmZGEAsreyN1qJ4Jfki8qQ"; // eslint-disable-line

// Source data GeoJSON
//const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/geojson/vancouver-blocks.json'; // eslint-disable-line
const DATA_URL = './data/tokyo.geojson';  // eslint-disable-line

//
const DATA_info = './data/BPO13101.csv'

//
const DATA_ROAD= './data/DB_RO.geojson';



const colorScale = r => [r * 255, 140, 200 * (1 - r)];

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      //data: null,
      //data1: null,
      plotdata:null,
      shapedata:null,
      roaddata:null
    };

    requestJson(DATA_URL, (error, response) => {
      if (!error) {
        this.setState({shapedata:response});
      }
    });

    requestJson(DATA_ROAD, (error, response) => {
      if (!error) {
        this.setState({roaddata:response});
      }
    });

    requestCsv(DATA_info, (error, response) => {
      if (!error) {
        //const data= response.map(d => ([Number(d.lang), Number(d.lat)]));
        this.setState({plotdata:response});
      }
    });


  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }


  render() {
    //const {viewport,data1,data2} = this.state;
    const {viewport,plotdata,shapedata,roaddata} = this.state;

    return (
      <MapGL
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          data1={shapedata}
          data2={plotdata}
          data3={roaddata}
          colorScale={colorScale}
          radius={30}
           />
          
      </MapGL>
    );
  }
}
  

render(<Root />, document.body.appendChild(document.createElement('div'))
);
