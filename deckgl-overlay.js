import React, {Component} from 'react';
import {setParameters} from 'luma.gl';
import DeckGL, {GeoJsonLayer,ScatterplotLayer,LineLayer} from 'deck.gl';

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

  constructor(props) {
    super(props);
    this.startAnimationTimer = null;
    this.intervalTimer = null;
    this.state = {
      traffic: 0
    };

    this._startAnimate = this._startAnimate.bind(this);
    this._animateHeight = this._animateHeight.bind(this);

  }

  componentDidMount() {
    this._animate();
  }

  componentWillReceiveProps(nextProps) {
    //if (nextProps.data.length !== this.props.data.length) {
      this._animate();
    //}
  }

  componentWillUnmount() {
    this._stopAnimate();
  }

  _animate() {
    this._stopAnimate();

    // wait 1.5 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 1500);
  }

  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 20);
  }

  _stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }

  _animateHeight() {
    if (this.state.traffic === 24) {
      this.setState({traffic:0});
    } else {
      this.setState({traffic: this.state.traffic + 0.1});
    }
    //console.log(this.state.traffic);
  }

  _initialize(gl) {
    setParameters(gl, {
      depthTest: true,
      depthFunc: gl.LEQUAL
    });
  }
  

  render() {
    const {viewport,data1, data2, data3, colorScale, radius} = this.props;

   if (!data1) {
     return null;
   }
   //console.log(data3);

    // const layer1 = new GeoJsonLayer({
    //   id: 'geojson',
    //   data:data1,
    //   opacity: 0.8,
    //   stroked: false,
    //   filled: true,
    //   extruded: true,
    //   wireframe: true,
    //   fp64: true,
    //   getElevation: f => (f.properties.nikken_a_8) * 4000*0.00054054,
    //   getFillColor: f => colorScale((f.properties.nikken_a_8)/20.000),
    //   getLineColor: f => [255, 255, 255],
    //   lightSettings: LIGHT_SETTINGS,
    //   pickable: Boolean(this.props.onHover),
    //   onHover: this.props.onHover
    // });

    // if (!data1) {
    //   return null;
    // }


    const layer2 = new ScatterplotLayer({
      id: 'scatter-plot',
      data:data2,
      //radiusScale: radius,
      radiusScale: 10,
      radiusMinPixels: 0.25,
      getPosition:a => [Number(a.lang), Number(a.lat),0],
      getColor : a=> [(Number(a.buildingCode)/10000)*255,0,(1-(Number(a.buildingCode)/10000))*100],

    });
    var traffic_prm = "heijitu_"+String(Math.floor(this.state.traffic));
    //console.log(traffic_prm);


    const layer3 = new GeoJsonLayer({
      id: 'geojson',
      data:data3,
      opacity:1,
      //opacity:f => eval("Number(f.properties.heijitu_"+Math.floor(this.state.traffic)+")/6000"),
      stroked: true,
      filled: false,
      extruded: false,
      wireframe: false,
      fp64: false,
      lineWidthScale:3,
      //getElevation: f => (f.properties.nikken_a_8) * 4000*0.00054054,
      //getFillColor: f => colorScale((f.properties.nikken_a_8)/20.000),
      //getLineColor: f => [(Number(f.properties.heijitu_0)/2000)*255, 0, 0],
      //getLineColor: f => eval("[(Number(f.properties.heijitu_"+Math.floor(this.state.traffic)+")/2000)*255, 0, 0]"),
      getLineColor: f => [(this.state.traffic/24)*255, 0, 0],
      //lightSettings: LIGHT_SETTINGS,
      //pickable: Boolean(this.props.onHover),
      //onHover: this.props.onHover
    });

    return (
      <DeckGL {...viewport} layers={ [layer3] } onWebGLInitialized={this._initialize} />
    
      
    );
  }
}
