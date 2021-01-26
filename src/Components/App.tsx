import * as React from "react";
import './App.css';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import Viewer from './Viewer';
import Toolbar from './Toolbar';


interface AppProps {
  url: string
}

function downloadFile(sourceUrl: string) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/fetchPdf', true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = () => {
      if (xhr.status === 200) {
        var blob = new Blob([xhr.response], { type: 'application/pdf' });
        let reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onload = function () {
          resolve(reader.result);
        };
      }
      else {
        reject('Maybe some errors downloading the file');
      }
    }

    xhr.send(JSON.stringify({ url: sourceUrl }));
  });
}

export default class App extends React.Component<AppProps, any> {
  viewer: Viewer;
  toolbar: Toolbar;
  constructor(props: AppProps | Readonly<AppProps>) {
    super(props);
  }
  componentDidMount() {
    console.log('Application Component mounted');
    console.log(`Source url is ${this.props.url}`);
    downloadFile(this.props.url).then((dataUrl: string) => {
      let loadingTask = pdfjsLib.getDocument(dataUrl);
      loadingTask.promise.then((doc) => {
        console.log(`Document loaded ${doc.numPages} page(s)`);
        this.viewer.setState({
          doc,
        });
      }, (reason) => {
        console.error(`Error during PDF loading: ${reason}`);
      });
    });

  }
  zoomIn(e) {
    this.viewer.setState({
      scale: this.viewer.state.scale * 1.1
    });
  }
  zoomOut(e) {
    this.viewer.setState({
      scale: this.viewer.state.scale / 1.1
    });
  }
  init(e) {
    console.log('PDF Viewer initialized');
  }
  displayScaleChanged(e) {
    this.toolbar.setState({
      scale: e.scale
    });
  }
  render() {
    console.log('App Rendering');
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to PDF.js</h2>
        </div>
        <Toolbar
          ref={(ref) => { this.toolbar = ref; console.log(ref); }}
          onZoomIn={(e) => this.zoomIn(e)}
          onZoomOut={(e) => this.zoomOut(e)}></Toolbar>
        <div className="App-body">
          <Viewer
            ref={(ref) => { this.viewer = ref; console.log(ref); }}
            onScaleChanged={(e) => this.displayScaleChanged(e)}
            onInit={(e) => this.init(e)}>
          </Viewer>
        </div>
      </div>
    );
  }
}
