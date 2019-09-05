import React, {Component} from 'react';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';
import Rank from './components/rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import config from './config';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const app = new Clarifai.App({
  apiKey: config.apiKey
 });

class App extends Component {

  constructor() {
    super();
    this.state= {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.calculateFaceLocation = this.calculateFaceLocation.bind(this);
    this.displayFaceBox = this.displayFaceBox.bind(this);
    this.onSignin = this.onSignin.bind(this);
    this.onRouteChange = this.onRouteChange.bind(this);
  }

  calculateFaceLocation(data) {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputImage');
   const width = Number(image.width);
   const height = Number(image.height);
   return {
     leftCol: clarifaiFace.left_col * width,
     topRow: clarifaiFace.top_row * height,
     rightCol: width - (clarifaiFace.rightCol * width),
     bottomRow: height - (clarifaiFace.bottom_row * height)
   }
  }

  displayFaceBox(box) {
    this.setState({box: box});
  }

  onInputChange(event) {
    this.setState({input: event.target.value});
  }

  onRouteChange(route) {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  onSignin() {

  }

  onSubmit() {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict('a403429f2ddf4b49b307e318f00e528b', this.state.input)
      .then( response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  render() {
      return (
        <div className="App">
          <Particles
                  className='particles' 
                  params={particlesOptions}
                />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          { this.state.route === 'home' 
          ? <div> 
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
          </div>
           
          : (
              this.state.route === 'signin' 
              ? <Signin onRouteChange={this.onRouteChange} /> 
          : <Register onRouteChange={this.onRouteChange}/>)}
        </div>
      );
    }
}

export default App;
