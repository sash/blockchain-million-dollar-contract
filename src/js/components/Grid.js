import React from "react";
import "../../css/Grid.scss";

import helpers from '../lib/helpers';

import {Redirect} from "react-router-dom";

export default class Grid extends React.Component{
    constructor(props){
        super(props);
        this.boxClicked = this.boxClicked.bind(this);

        this.state = {
            selectionStart: null,
            selectionEnd: null,
            bought: this._format(props.contract, props.contract.bought),
            published: this._format(props.contract, props.contract.published),
            loading: true,
        }

    }

    _format(contract, boxes){
        let formatted = {}
        boxes.forEach((box) => {
            formatted[`${box.x}-${box.y}`] = box;
        });

        return formatted;
    }

    debounce(func, delay) {
        let inDebounce;
        return function () {
            const context = this
            const args = arguments
            clearTimeout(inDebounce)
            inDebounce = setTimeout(() => func.apply(context, args), delay)
        }
    }

    componentDidMount(){
        this.props.contract.onBought(
            this.debounce(() => {
                this.setState({bought: this._format(this.props.contract, this.props.contract.bought), loading: false})
            }, 100)

        );
        this.props.contract.onPublished(
            this.debounce(() => {
                this.setState({published: this._format(this.props.contract, this.props.contract.published),
                    loading: false})
            }, 100)
        );
    }
    boxClicked(x, y){
        if (this.state.selectionStart == null || this.state.selectionEnd != null){
            this.setState({selectionStart: {x, y}, selectionEnd:null});
        } else {
            this.setState({selectionEnd: {x, y}}, () => (this.selection(async (x, y, length, height) => {
                this.selected({x, y, length, height});


            })));
        }
    }
    async selected(selection){
        if (!this.state.bought[`${selection.x}-${selection.y}`]){
            await this.props.contract.buy(selection.x, selection.y, selection.length, selection.height);
        } else if(this.state.bought[`${selection.x}-${selection.y}`].buyer === this.props.account) {
            // Open the purchase dialog
            this.setState({redirect: selection});

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
        if (this.state.redirect) {
            let selection = this.state.redirect;
            return <Redirect push
                                  to={`/publish/${selection.x}/${selection.y}/${selection.length}/${selection.height}`}
            />;
        }


        return <div className="Grid">
            {this.state.loading && <div className="Grid__loading"><span>Loading...</span></div>}
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
                        let classes = ["Grid__cell"];
                        if (selected){
                            classes.push("Grid__cell--selected");
                        }
                        if (this.state.bought[x + "-" + y]) {
                            classes.push("Grid__cell--bought");
                            if (this.state.bought[x + "-" + y].buyer === this.props.account && this.props.account) {
                                classes.push("Grid__cell--owned");
                            }
                        }
                        let color = 'transparent';
                        if (this.state.published[x + "-" + y]){
                            color = this.state.published[x + "-" + y].colour.replace('0x', '#');
                        }

                        return <div onClick={() => this.boxClicked(x, y)}
                                    key={"" + x + "-" + y}
                                    className={classes.join(" ")}
                                    style={{color: color}}
                        >{this.state.published[x + "-" + y] && helpers.toString(this.state.published[x + "-" + y].char)}</div>

                    })}
                </div>)}

        </div>
    }
}

