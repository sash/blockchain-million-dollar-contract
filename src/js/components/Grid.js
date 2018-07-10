import React from "react";
import "../../css/Grid.scss";

export default class Grid extends React.Component{
    constructor(props){
        super(props);
        this.boxClicked = this.boxClicked.bind(this);
        this.state = {
            selectionStart: null,
            selectionEnd: null
        }
    }
    componentDidMount(){

    }
    boxClicked(x, y){
        if (this.state.selectionStart == null || this.state.selectionEnd != null){
            this.setState({selectionStart: {x, y}, selectionEnd:null});
        } else {
            this.setState({selectionEnd: {x, y}}, () => (this.selection(async (x, y, length, height) => {
                await this.props.contract.buy(x, y, length, height);

            })));
        }
    }
    selection(callback){
        if (this.state.selectionEnd == null) {
            if (this.state.selectionStart!==null){
                callback(this.state.selectionStart.x, this.state.selectionStart.y, 1, 1);
            }
            else {
                // no selection
            }
        } else {
            let x, y, length, height;
            if (this.state.selectionStart.x < this.state.selectionEnd.x) {
                x = this.state.selectionStart.x;
                length = this.state.selectionEnd.x - this.state.selectionStart.x + 1;
            } else {
                x = this.state.selectionStart.x;
                length = this.state.selectionEnd.x - this.state.selectionStart.x + 1;
            }
            if (this.state.selectionStart.y < this.state.selectionEnd.y) {
                y = this.state.selectionStart.y;
                height = this.state.selectionEnd.y - this.state.selectionStart.y + 1;
            } else {
                y = this.state.selectionEnd.y;
                height = this.state.selectionStart.y - this.state.selectionStart.y + 1;
            }
            callback(x, y, length, height);
        }

    }
    render(){
        return <div className="Grid">
            {Array.apply(null, Array(this.props.size)).map((_, y) =>
                <div key={y} className="Grid__row">
                    {Array.apply(null, Array(this.props.size)).map((_, x) => {
                        let selected = false;
                        if (this.state.selectionEnd == null){
                            selected = this.state.selectionStart && this.state.selectionStart.x === x && this.state.selectionStart.y === y;
                        } else {
                            let selectedX;
                            let selectedY;
                            if (this.state.selectionStart.x < this.state.selectionEnd.x){
                                selectedX = this.state.selectionStart.x <= x && this.state.selectionEnd.x >= x;
                            } else {
                                selectedX = this.state.selectionStart.x >= x && this.state.selectionEnd.x <= x;
                            }
                            if (this.state.selectionStart.y < this.state.selectionEnd.y) {
                                selectedY = this.state.selectionStart.y <= y && this.state.selectionEnd.y >= y;
                            } else {
                                selectedY = this.state.selectionStart.y >= y && this.state.selectionEnd.y <= y;
                            }

                            selected = selectedX && selectedY;
                        }
                        return <div onClick={() => this.boxClicked(x, y)} key={"" + x + "-" + y} className={"Grid__cell " + (
                            selected && "Grid__cell--selected")}>A</div>

                    })}
                </div>)}

        </div>
    }
}

