import * as React from 'react';
import './Toolbar.css';

interface PropType {
    onZoomIn: any,
    onZoomOut: any
}

interface ToolbarState {
    scale: number
}

export default class Toolbar extends React.Component<PropType, ToolbarState> {
    constructor(props: PropType | Readonly<PropType>) {
        super(props);
        this.state = {
            scale: 0
        };
    }
    zoomIn(e) {
        if (this.props.onZoomIn) {
            this.props.onZoomIn(e);
        }
    }
    zoomOut(e) {
        if (this.props.onZoomOut) {
            this.props.onZoomOut(e);
        }
    }
    shouldComponentUpdate(nextProps: any, nextState: { scale: number; }) {
        if (this.state.scale !== nextState.scale) {
            return true;
        }
        return false;
    }
    render() {
        console.log('toolbar');
        return (<div className="Toolbar">
            <button className="ZoomIn" onClick={(e) => this.zoomOut(e)}>-</button>
            <button className="ZoomOut" onClick={(e) => this.zoomIn(e)}>+</button>
            <div className="ZoomPercent">{(this.state.scale * 100).toFixed(1)}%</div>
        </div>);
    }
}