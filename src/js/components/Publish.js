import React from "react";
import {Link} from "react-router-dom";

export default class Publish extends React.Component {

    constructor(props) {
        super(props);

        this.onPurchase = this.onPurchase.bind(this);

        this.state={
            error: false
        }
    }

    onPurchase(event) {
        const lines = this.chars.value.split(/\n/);
        const chars = [];
        if (lines.count > this.props.match.params.height) {
            this.setState({error: 'Too many lines!'});
            return;
        }
        let hasError = false;
        lines.forEach((line, i) => {
            if (line.length > this.props.match.params.length) {
                this.setState({error: `Too many chars on line ${i}!`});
                hasError = true;
            }
            chars.push(line.split("").join(" "));
        });
        if (hasError){
            return true;
        }
        this.setState({error: false});
        debugger;
        this.props.contract.publish(this.props.match.params.x, this.props.match.params.y,  chars.join("\n"), this.colour.value.replace('#', '0x'), this.attachment.value)
        // console.log(chars.join("\n"), this.colour.value, this.attachment.value);
    }

    render() {
        return <div>
            <h2>Publish content at {JSON.stringify(this.props.match.params)}</h2>
            <Link to="/">Cancel</Link>



            <label>
                Type in your chars
                <textarea ref={input => this.chars = input} rows={this.props.match.params.height}
                          cols={this.props.match.params.length}
                          placeholder={this.props.match.params.length + " chars per line, " + this.props.match.params.height + ' lines'}></textarea>
            </label>
            <label>
                Colour
                <input type="color" ref={input => this.colour = input}/>
            </label>
            <label>
                Attachment
                <input type="text" ref={input => this.attachment = input}/>
            </label>
            {this.state.error &&
            <div className="callout alert">
                <p>{this.state.error}</p>
            </div>
            }
            <button onClick={this.onPurchase} className="button">Publish</button>
        </div>
    }
}