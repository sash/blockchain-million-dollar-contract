import React from "react";
import {Link, Redirect} from "react-router-dom";
import ipfsAPI from 'ipfs-api';
import runes from 'runes';
import ipfsAdd from '../lib/IPFS';

export default class Publish extends React.Component {

    constructor(props) {
        super(props);

        this.onPublish = this.onPublish.bind(this);

        this.state={
            error: false
        }
    }

    onPublish(event) {

        const lines = this.chars.value.split(/\n/);
        const chars = [];
        if (lines.count > this.props.match.params.height) {
            this.setState({error: 'Too many lines!'});
            return;
        }
        let hasError = false;
        lines.forEach((line, i) => {
            if (runes(line).length > this.props.match.params.length) {
                this.setState({error: `Too many chars on line ${i}!`});
                hasError = true;
            }
            chars.push(runes(line).join("\t"));
        });

        if (hasError) {
            return true;
        }

        this.setState({error: false});

        // Read attachment
        let files = this.attachment.files; // FileList object
        // use the 1st file from the list
        let f = files[0];
        (async () => {
            let attachment = "";
            if (f) {
                attachment = await ipfsAdd(f);
            }
            let tx;
            try {
                tx = await this.props.contract.publish(this.props.match.params.x, this.props.match.params.y, chars.join("\n"), this.colour.value.replace('#', '0x'), attachment);
            } catch (e) {
                alert(e.message);
            }
            this.setState({transaction: tx});
        })();
    }

    render() {
        if (this.state.transaction){
            alert(`Transaction with hash ${this.state.transaction.hash} sent`);
            return <Redirect to="/"/>;
        }
        return <div>
            <h2>Publish content at {this.props.match.params.x}x{this.props.match.params.y}<span style={{float:'right'}}><Link
                to="/">Close</Link></span> </h2>




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
                <input type="file" ref={input => this.attachment = input}/>
            </label>
            {this.state.error &&
            <div className="callout alert">
                <p>{this.state.error}</p>
            </div>
            }
            <button onClick={this.onPublish} className="button">Publish</button>
        </div>
    }
}