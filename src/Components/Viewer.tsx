import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PDFJS from 'pdfjs-dist/web/pdf_viewer.js';
import './Viewer.css';
import 'pdfjs-dist/web/pdf_viewer.css';

interface ViewerProps {
  onInit: any,
  onScaleChanged: any
}

interface ViewerState {
  scale: number
  doc: any
}

export default class Viewer extends React.Component<ViewerProps, ViewerState> {
  _eventBus: PDFJS.EventBus;
  _pdfViewer: PDFJS.PDFViewer;

  constructor(props: ViewerProps | Readonly<ViewerProps>) {
    super(props);
    this.initEventBus();
    this.state = {
      doc: null,
      scale: undefined,
    };
  }
  initEventBus() {
    let eventBus = new PDFJS.EventBus();
    eventBus.on('pagesinit', (e: any) => {
      this.setState({
        scale: this._pdfViewer.currentScale
      });
      if (this.props.onInit) {
        this.props.onInit({});
      }
      if (this.props.onScaleChanged) {
        this.props.onScaleChanged({ scale: this.state.scale });
      }
    });
    eventBus.on('scalechange', (e: { scale: any; }) => {
      if (this.props.onScaleChanged) {
        this.props.onScaleChanged({ scale: e.scale });
      }
    });
    this._eventBus = eventBus;
  }
  componentDidMount() {
    let viewerContainer = ReactDOM.findDOMNode(this);
    this._pdfViewer = new PDFJS.PDFViewer({
      container: viewerContainer,
      eventBus: this._eventBus,
    });
  }
  componentWillUpdate(nextProps: any, nextState: { doc: any; scale: number; }) {
    if (this.state.doc !== nextState.doc) {
      this._pdfViewer.setDocument(nextState.doc);
    }
    if (this.state.scale !== nextState.scale) {
      this._pdfViewer.currentScale = nextState.scale;
    }
  }
  shouldComponentUpdate(nextProps: any, nextState: { doc: any; scale: number; }) {
    if (this.state.doc !== nextState.doc ||
      this.state.scale !== nextState.scale) {
      return true;
    }
    return false;
  }
  render() {
    console.log('viewer');
    return (<div className="Viewer">
      <div className="pdfViewer"></div>
    </div>);
  }
}