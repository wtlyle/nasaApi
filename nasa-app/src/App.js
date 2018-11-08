import React, { Component } from 'react';
import { PageHeader, Table, Tabs, Tab } from 'react-bootstrap'
//so all we had to do was download yarn add react-bootstrap.
//2. go to bootswatch v3
//3. find a theme, save link of bootstrap.min.css
//4. Put it in public folder.
//5.  in index.html, simply add in <link rel="stylesheet" href="%PUBLIC_URL%/bootstrap.min.css">
//6. import component taht you want from 'react-bootstrap'
import './App.css';
//https://api.nasa.gov/planetary/apod?api_key=lumoAnHY3MuiVO7AazYUFkzwDmjPKpJoD7gmfHFj
import neoData from './sample-neo'
import sampleIss from './sample-iss'

//steps to get api data .
//1. go to nasa api website, enter in info to receive key.
//2. copy nasa link somewhere.
//3. find the curl command on learn website, enter it into terminal in the correct folder of your App
// curl "https://api.nasa.gov/neo/rest/v1/feed?start_date=2017-7-31&api_key=api_key" > sample-neo.js
//4. in the terminal, replace the api_key with your api key from the thing you copied.
//5. move the sample-neo file into your src and then export it and import it wherever you need it .
//rawIss:
// iss_position: {latitude: "18.8676", longitude: "58.8683"}
// message: "success"
// timestamp: 1541619091

class App extends Component {
  constructor(props) {
    super(props)
    let today = new Date()
    this.state = {
      apiKey: "lumoAnHY3MuiVO7AazYUFkzwDmjPKpJoD7gmfHFj",
      startDate: `${today.getFullYear()}-${today.getMonth() +1}-${today.getDate()}`,
      apiUrl: "https://api.nasa.gov/neo/rest/v1/feed",
      rawData: neoData,
      latitude: '',
      longitude: '',
      timestamp: '',
      asteroids: [],
      tab: true
    }
  }

  componentWillMount(){
    //first we use teh fetch().then() function that is standard to javascript.  This fetch is string interpolating the correct url api key by adding the correct start date which is today.
    //2. this retrieves the raw data, and we turn the raw data into a json file, which we then (json).next()  and we do our original on THAT json file as opposed to the old one we had used earlier.
  fetch(`${this.state.apiUrl}?start_date=${this.state.startDate}&api_key=${this.state.apiKey}`).then((rawResponse)=>{
    // rawResponse.json() returns a promise that we pass along
    return rawResponse.json()
  }).then((parsedResponse) => {

    // when this promise resolves, we can work with our data
    let neoData = parsedResponse.near_earth_objects
    let newAsteroids = []
    Object.keys(neoData).forEach((date)=> {
      neoData[date].forEach((asteroid)=>{
        newAsteroids.push({
          id: asteroid.neo_reference_id,
          name: asteroid.name,
          date: asteroid.close_approach_data[0].close_approach_date,
          diameterMin: asteroid.estimated_diameter.feet.estimated_diameter_min.toFixed(0),
          diameterMax: asteroid.estimated_diameter.feet.estimated_diameter_max.toFixed(0),
          closestApproach: asteroid.close_approach_data[0].miss_distance.miles,
          velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(0),
          distance: asteroid.close_approach_data[0].miss_distance.miles
        })
      })
    })
    this.setState({asteroids: newAsteroids})
  })


  fetch("http://api.open-notify.org/iss-now.json").then((rawResponse) => {
    console.log('iss now', rawResponse)
    return rawResponse.json()
  }).then((parsedResponse) => {
    console.log(parsedResponse)
    let iss = parsedResponse
    let latitude = iss.iss_position.latitude
    let longitude = iss.iss_position.longitude
    let timestamp = iss.timestamp
    this.setState({
      latitude: latitude,
      longitude: longitude,
      timestamp: timestamp
    })
  })
}

onClick = () => {
  this.setState({tab: !this.state.tab})
}

clickHandler = () => {
  this.setState({tab: !this.state.tab})
}

refresh = () => {
  window.location.reload()
}

  render() {

    let {asteroids} = this.state
    let {latitude} = this.state
    let {longitude} = this.state
    let {timestamp} = this.state
    // debugger
    return (
      <div className="App">

        <PageHeader>
          <img style={{width: 70, height: 70}} src="https://cdn1.iconfinder.com/data/icons/science-2-2-flat/204/meteor-science-comet-512.png" />
          <span style={{paddingLeft: 10, color: 'gold', fontWeight: 'bold'}}>Meteor Watch</span>
        </PageHeader>
        <div>

        <ul className="nav nav-tabs">
          <li className={(this.state.tab) ? 'active' : ''} onClick = {this.onClick}><a href="#asteroids" data-toggle="tab" aria-expanded="true">Armageddon Tracker</a></li>
          <li className={(this.state.tab) ? '' : 'active'} onClick = {this.clickHandler}><a href="#iss" data-toggle="tab" aria-expanded="false">Space Station</a></li>
        </ul>

        <div id="myTabContent" class="tab-content">
          <div className={(this.state.tab) ? 'tab-pane fade  active in' : 'tab-pane fade'} id="asteroids">
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Estimated Diameter (feet)</th>
                  <th>Date of Closest Approach</th>
                  <th>Distance (Miles)</th>
                  <th>Velocity (miles/hour)</th>
                </tr>
              </thead>
              <tbody>
                {asteroids.map(el=>
                <tr key={el.id}>
                  <td>{el.name}</td>
                  <td>{(el.diameterMax + el.diameterMin) / 2}</td>
                  <td>{el.date}</td>
                  <td>{el.distance}</td>
                  <td>{el.velocity}</td>
                </tr>
                )}
              </tbody>
            </Table>
              <a href = '/#asteroids'><button>Refresh</button></a>
          </div>
          <div className={(this.state.tab) ? "tab-pane fade" : "tab-pane fade active in"} id="iss">
            <Table>
              <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                  </tr>
                </thead>
                <tbody>
                    <td>{timestamp}</td>
                    <td>{latitude}</td>
                    <td>{longitude}</td>
              </tbody>
            </Table>
            <button onClick={this.refresh}>Refresh</button>
          </div>
          </div>

        </div>


      </div>
    );
  }
}

export default App;
