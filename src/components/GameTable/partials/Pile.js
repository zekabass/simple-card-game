import React, { Component } from 'react';

class App extends Component {

  	render(props) {	
		let pileRow1 = [] ;
		let pileRow2 = [] ;
		let pileRow3 = [] ;
		for (let i = 1; i <= this.props.numOfPlayers; i++) {
			if(i === 1) {
				pileRow1.push(
					<div key={i} className="column is-narrow">
						<div className={"card-holder " + ( this.props.numOfPlayers > 2 ? 'lower-card-pos' : '' )}></div>
					</div>	
				);
			}
			if(this.props.numOfPlayers > 2) {
				if(i === 2 || i === 3) {
					pileRow2.push(
						<div key={i} className="column">
							<div className="card-holder"></div>
						</div>	
					);
				}	
				if(i === 4) {
					pileRow3.push(
						<div key={i} className="column is-narrow">
							<div className="card-holder upper-card-pos"></div>
						</div>	
					);
				}	
			} else {
				if(i === 2) {
					pileRow3.push(
						<div key={i} className="column is-narrow">
							<div className="card-holder "></div>
						</div>	
					);
				}	
			}
		}

		return (		
			<div className="columns table-part pile is-centered">
				<div className="column is-8">
					<div className="columns is-mobile is-centered">
						{pileRow3}
					</div>
					<div className="columns is-mobile is-centered">
						{pileRow2}
					</div>
					<div className="columns is-mobile is-centered">
						{pileRow1}
					</div>
				</div>
			</div>
		);
  	}
}

export default App;
