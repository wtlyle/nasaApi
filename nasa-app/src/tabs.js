import React, { Component } from 'react'

export default class Tabs extends Component {
  constructor(props){
    super(props)
    this.state= {}
  }

  render() {
    return(
    <div>
    <ul className="nav nav-tabs">
      <li className="active"><a href="#asteroids" data-toggle="tab" aria-expanded="true">Armageddon Tracker</a></li>
      <li className=""><a href="#iss" data-toggle="tab" aria-expanded="false">Space Station</a></li>
    </ul>
    <div id="myTabContent" class="tab-content">
      <div className="tab-pane fade active in" id="asteroids">
        <p>hello world</p>
      </div>
      <div className="tab-pane fade" id="iss">
        <p>goodbye world</p>
      </div>
      </div>

    </div>
  )
    }
}
