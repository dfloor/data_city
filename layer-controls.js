import React, {Component} from 'react'

export default class LayerControls extends Component{
    render(){
        return(
            <div className = "control-panel">
                <h1>test</h1>
                <input type="checkbox" name="example" value="road" />road
                <input type="checkbox" name="example" value="road" />bldg
                <input type="checkbox" name="example" value="road" />point
            </div>
        )
    }
}