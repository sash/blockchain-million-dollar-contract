import React from "react";
import "../../css/Grid.scss";

import helpers from '../lib/helpers';

import {Redirect} from "react-router-dom";
import Popover from 'react-simple-popover';
import config from '../config';

export default class Grid extends React.Component{
    constructor(props){
        super(props);

        this.boxClicked = this.boxClicked.bind(this);

        this.state = {
            selectionStart: null,
            selectionEnd: null,
            bought: this._format(props.contract, props.contract.bought),
            published: this._format(props.contract, props.contract.published),
            loading: props.contract.loading,
            open: false
        };
        // this.state.loading = props.contract.loading;

        // setTimeout(() => this.setState({loading: false}), 10000);

    }

    _format(contract, boxes){
        let formatted = {}
        boxes.forEach((box) => {
            formatted[`${box.x}-${box.y}`] = box;
        });

        return formatted;
    }


    componentDidMount(){
        this.props.contract.onBought(
            this._debounce(() => {
                this.setState({
                    bought: this._format(this.props.contract, this.props.contract.bought),
                    loading: this.props.contract.loading,
                })
            }, 100)

        );
        this.props.contract.onPublished(
            this._debounce(() => {
                this.setState({
                    published: this._format(this.props.contract, this.props.contract.published),
                    loading: this.props.contract.loading,
                })
            }, 100)
        );
    }

    _debounce(func, delay) {
        let inDebounce;
        return function () {
            const context = this
            const args = arguments
            clearTimeout(inDebounce)
            inDebounce = setTimeout(() => func.apply(context, args), delay)
        }
    }

    boxClicked(x, y){

        if(this._isPublished(x, y)){
            if (this.state.open === x + "-" + y){
                this.setState({open: false});
            } else {
                this.setState({open: x + "-" + y});
            }
            if(!this._isOwn(x, y)){
                return;
            }
        } else {
            this.setState({open: false});
        }
        if (!this.props.provider.isEthersEnabledBrowser() || this.props.provider.accountIsLocked()) {
            return;
        }
        if (this._isBought(x, y) && !this._isOwn(x, y)){
            return;
        }
        if (this.state.selectionStart == null || this.state.selectionEnd != null){
            // Begin selection
            this.setState({selectionStart: {x, y}, selectionEnd:null});
        } else {
            // End selection
            this.setState({selectionEnd: {x, y}}, () => (this.getCurrentSelection((x, y, length, height) => {
                this.handleSelectionChange({x, y, length, height});
            })));
        }
    }
    _isBought(x, y){
        return typeof this.state.bought[`${x}-${y}`] !== 'undefined';
    }
    _isPublished(x, y){
        return typeof this.state.published[`${x}-${y}`] !== 'undefined' && this.state.published[`${x}-${y}`];
    }
    _isOwn(x, y){
        return typeof this.state.bought[`${x}-${y}`] !== 'undefined' && this.state.bought[`${x}-${y}`].buyer === this.props.account;
    }
    async handleSelectionChange(selection){
        if (!this._isBought(selection.x, selection.y)){
            try{
                const tx = await this.props.contract.buy(selection.x, selection.y, selection.length, selection.height);
                alert('Transaction sent with hash '+tx.hash);
            }catch (e){
                alert(e.message);
            }
            this.setState({
                selectionStart: null,
                selectionEnd: null
            });
        } else if(this.state.bought[`${selection.x}-${selection.y}`].buyer === this.props.account) {
            // Open the purchase dialog
            this.setState({openPublish: selection});

        }
    }
    getCurrentSelection(callback){
        if (this.state.selectionEnd == null) {
            if (this.state.selectionStart!==null){
                callback(this.state.selectionStart.x, this.state.selectionStart.y, 1, 1);
            }
            else {
                // no getCurrentSelection
            }
        } else {

            let x, y, length, height;
            if (this.state.selectionStart.x < this.state.selectionEnd.x) {
                x = this.state.selectionStart.x;
                length = this.state.selectionEnd.x - this.state.selectionStart.x + 1;
            } else {
                x = this.state.selectionEnd.x;
                length = this.state.selectionStart.x - this.state.selectionEnd.x + 1;
            }
            if (this.state.selectionStart.y < this.state.selectionEnd.y) {
                y = this.state.selectionStart.y;
                height = this.state.selectionEnd.y - this.state.selectionStart.y + 1;
            } else {
                y = this.state.selectionEnd.y;
                height = this.state.selectionStart.y - this.state.selectionEnd.y + 1;
            }
            callback(x, y, length, height);
        }

    }

    render(){
        let redir;
        if (this.state.openPublish) {
            let selection = this.state.openPublish;
            redir = <Redirect
                push
                to={`/publish/${selection.x}/${selection.y}/${selection.length}/${selection.height}`}
            />;
            this.setState({openPublish: false})
        }


        return <div className="Grid">
            {redir}
            {this.state.loading && <div className="Grid__loading"><span>Loading...</span></div>}
            {Array.apply(null, Array(this.props.size)).map((_, y) =>
                <div key={y} className="Grid__row">
                    {Array.apply(null, Array(this.props.size)).map((_, x) => {
                        let selected = false;
                        this.getCurrentSelection((selection_x, selection_y, length, height) => {
                            selected = x >= selection_x && x < selection_x+length
                                && y >= selection_y && y < selection_y+height
                        });

                        let classes = ["Grid__cell"];
                        if (selected){
                            classes.push("Grid__cell--selected");
                        }
                        if (this._isBought(x, y)) {
                            classes.push("Grid__cell--bought");
                            if (this.props.account && this._isOwn(x, y)) {
                                classes.push("Grid__cell--owned");
                            }
                        }
                        let color = 'transparent';
                        if (this._isPublished(x, y)){
                            color = this._isPublished(x, y).colour.replace('0x', '#');
                        }

                        return <div onClick={() => this.boxClicked(x, y)}
                                    key={"" + x + "-" + y}
                                    className={classes.join(" ")}
                                    style={{color: color}}
                                    ref={'target-' + x + "-" + y}
                        >
                            {this._isPublished(x, y) && this._isPublished(x, y).attachment &&
                            <Popover
                                placement={x>50?'left':'right'}
                                container={this}
                                target={this.refs['target-'+ x+"-"+ y]}
                                show={this.state.open === x + "-" + y}

                                style={{minWidth: '800px'}}
                                >
                                <div className="responsive-embed">
                                    <iframe width="100%" height="100%" src={config.ipfs.gateway + this._isPublished(x, y).attachment}
                                            frameBorder="0" allowFullScreen></iframe>
                                </div>

                            </Popover>
                            }
                            {this._isPublished(x, y) && helpers.toString(this._isPublished(x, y).char)}
                        </div>

                    })}
                </div>)}

        </div>
    }
}

