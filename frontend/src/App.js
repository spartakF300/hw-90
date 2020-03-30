import React, {createRef} from 'react';
import './App.css';

class App extends React.Component {
    state = {
        draw: [],
        color: '#000000'
    };

    componentDidMount() {

        this.websocket = new WebSocket('ws://localhost:8000/draw');
        this.websocket.onmessage = draw => {
            try {
                const data = JSON.parse(draw.data);
                this.setState({draw: data});
                const ctx = this.canvas.current.getContext("2d");
                this.state.draw.forEach(p => {
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x - 5, p.y - 27, 10, 10);
                });

            } catch (e) {
                console.log(e)
            }
        }
    }

    canvas = createRef();

    clickCanvas = (e) => {
        e.persist();

        const data = [];
        const canvas = document.getElementById("canvas");

        canvas.onmousemove = (e) => {
            const ctx = this.canvas.current.getContext("2d");
            ctx.fillStyle = this.state.color;
            ctx.fillRect(e.clientX - 5, e.clientY - 27, 10, 10);
            data.push({x: e.clientX, y: e.clientY, color: this.state.color});
        };

        canvas.onmouseup = () => {
            canvas.onmousemove = null;
            this.sendDraw(data)
        };

    };

    sendDraw = (data) => {
        this.websocket.send(JSON.stringify(data));
    };
    onchangeInput = (e) => {
        this.setState({color: e.target.value})
    };

    render() {
        return (

            <div className="App">
                <input  onChange={this.onchangeInput} value={this.state.color} name="color" type="color"/>
                <canvas id="canvas" width={window.innerWidth} height={window.innerHeight} ref={this.canvas}
                        onMouseDown={this.clickCanvas}/>

            </div>
        );
    }
}

export default App;
