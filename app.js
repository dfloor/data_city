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
const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/geojson/vancouver-blocks.json'; // eslint-disable-line
//const DATA_URL = './data/tokyo.geojson';  // eslint-disable-line

//
const DATA_info = './data/BPO13101.csv'



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
      data: null
    };

    requestJson(DATA_URL, (error, response) => {
      if (!error) {
        this.setState({data: response});
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
    const {viewport,data} = this.state;

    return (
      <MapGL
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          data={data}
          colorScale={colorScale}
          radius={30}
           />
          
      </MapGL>
    );
  }
}

class Root1 extends Component {
  
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
        data: null
      };
  
      requestJson(DATA_URL, (error, response) => {
        if (!error) {
          this.setState({data: response});
        }
      });
  
      requestCsv(DATA_info, (error, response) => {
        if (!error) {
          //const data= response.map(d => ([Number(d.lang), Number(d.lat)]));
          this.setState({data:response});
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
      const {viewport,data} = this.state;
  
      return (
        <MapGL
          {...viewport}
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay viewport={viewport}
            data={data}
            colorScale={colorScale}
            radius={30}
             />
            
        </MapGL>
      );
    }
  }
  

render(<Root />, document.body.appendChild(document.createElement('div'))
);
