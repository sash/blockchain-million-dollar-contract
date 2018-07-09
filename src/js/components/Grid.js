import React from "react";
import "../../css/Grid.scss";

export default class Grid extends React.Component{
    render(){
        return <div className="Grid">
            {Array.apply(null, Array(this.props.size)).map((_, i) =>
                <div key={i} className="Grid--row">
                    {Array.apply(null, Array(this.props.size)).map((_, j) =>
                        <div onMouseEnter={} key={""+i+"-"+j} className="Grid--cell">A</div>
                    )}
                </div>)}

        </div>
    }
}

