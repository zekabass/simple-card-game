import React, { Component } from 'react';

class App extends Component {

  	render(props) {	
		let pileRow1 = [] ;
		let pileRow2 = [] ;
		let pileRow3 = [] ;

		/* Generating players postions on the table.
		 Positions depends on players number  */
		for (let i = 1; i <= this.props.numOfPlayers; i++) {

			/* Setting card image as background image */
			let background = {
				backgroundImage: this.props.round[i-1] ? `url(${this.props.round[i-1].cardImg})` : '',
			};
	
			if(i === 1) {
				/* USER IS ALWAYS ON THE SAME POSITION */
				pileRow1.push(
					<div key={i} className="column is-narrow">
						<div className = {"card-holder " 
							+ ( this.props.numOfPlayers > 3 ? 'lower-card-pos ' : '' ) 
							+ ( (i-1) === this.props.roundWinner ? 'blink-me' : '' )} 
							style={background}
						></div>
					</div>	
				);
				/* ---------------- */
			} else {

				/* If is 2 players. Putting bot player above player */
				if(this.props.numOfPlayers === 2) {
					pileRow3.push(
						<div key={i} className="column is-narrow">
							<div 
								className = {"card-holder " 
								+ ( (i-1) === this.props.roundWinner ? 'blink-me' : '' )} 
								style={background}
							></div>
						</div>	
					);
				}	
				/* ---------------- */

				/* If is 3 player. Putting 2 bot players on sides */
				if(this.props.numOfPlayers === 3) {
					pileRow2.push(
						<div key={i} className="column is-narrow">
							<div className = {"card-holder " 
								+ ( (i-1) === this.props.roundWinner ? 'blink-me' : '' )} 
								style={background}
							></div>
						</div>	
					);
				}	
				/* ---------------- */

				/* If is 4 player. Putting players on every side*/
				if(this.props.numOfPlayers === 4) {
					if(i === 2 || i === 4) {
						pileRow2.push(
							<div key={i} className="column">
								<div className = {"card-holder " 
									+ ( (i-1) === this.props.roundWinner ? 'blink-me' : '' )} 
									style={background}
								></div>
							</div>	
						);
					}	
					if(i === 3) {
						pileRow3.push(
							<div key={i} className="column is-narrow">
								<div className={"card-holder upper-card-pos "  
									+ ( (i-1) === this.props.roundWinner ? 'blink-me' : '' )} 
									style={background}
								></div>
							</div>	
						);
					}	
				} 
				/* ---------------- */
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
