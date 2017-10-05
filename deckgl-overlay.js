import React, {Component} from 'react';
import {setParameters} from 'luma.gl';
import DeckGL, {GeoJsonLayer,ScatterplotLayer} from 'deck.gl';

const LIGHT_SETTINGS = {
  lightsPosition: [-125, 50.5, 5000, -122.8, 48.5, 8000],
  ambientRatio: 0.2,
  diffuseRatio: 0.5,
  specularRatio: 0.3,
  lightsStrength: [1.0, 0.0, 2.0, 0.0],
  numberOfLights: 2
};

export default class DeckGLOverlay extends Component {

  static get defaultViewport() {
    return {
      latitude: 35.7,
      longitude: 139.60,
      zoom: 11,
      maxZoom: 16,
      pitch: 45,
      bearing: 0
    };
  }

  _initialize(gl) {
    setParameters(gl, {
      depthTest: true,
      depthFunc: gl.LEQUAL
    });
  }

  render() {
    const {viewport,data, colorScale, radius} = this.props;

   if (!data) {
     return null;
   }

    const layer = new GeoJsonLayer({
      id: 'geojson',
      data,
      opacity: 0.8,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      fp64: true,
      getElevation: f => (f.properties.nikken_a_8) * 4000*0.00054054,
      getFillColor: f => colorScale((f.properties.nikken_a_8)/20.000),
      getLineColor: f => [255, 255, 255],
      lightSettings: LIGHT_SETTINGS,
      pickable: Boolean(this.props.onHover),
      onHover: this.props.onHover
    });

    if (!data) {
      return null;
    }

    // const layer = new ScatterplotLayer({
    //   id: 'scatter-plot',
    //   data,
    //   //radiusScale: radius,
    //   radiusScale: 10,
    //   radiusMinPixels: 0.25,
    //   getPosition:d => [Number(d.lang), Number(d.lat),0],
    //   getColor : d=> [(Number(d.buildingCode)/10000)*255,0,(1-(Number(d.buildingCode)/10000))*100],

    // });

    return (
      <DeckGL {...viewport} layers={ [layer] } onWebGLInitialized={this._initialize} />
    
      
    );
  }
}
