import React, { Component } from 'react';

class App extends Component {

  	render(props) {
		let winners = [];
		for (let i = 0; i < this.props.gameWinners.length ; i++) {
			winners.push(
				<h1 className="title is-3" key={i}>{this.props.gameWinners[i].name} </h1> 
			)
		}  	

		let winnerText=[];
		if(this.props.gameWinners.length > 1) {
			winnerText.push (
				<span key="win1"> Winners are: </span>
			)
		} else {
			winnerText.push (
				<span key="win2"> Winners is: </span>
			)
		}

		return (		
			<div className={"modal " + (this.props.gameOverActive ? 'is-active' : '')}>
				<div className="modal-background"></div>
				<div className="modal-card">
					<section className="modal-card-body">
						<h1 className="title is-4">GAME FINISHED!</h1>
						<h1 className="title is-4">{winnerText}</h1>
						{winners}
						<div className="columns">
							{/* <div className="column">
								<button className="button is-primary"> Restart </button>
							</div> */}
							<div className="column">
								<button className="button is-primary" onClick={this.props.goToMainMenu}> Go to Main Menu </button>
							</div>
						</div>
					</section>
				</div>
			</div>
		);
  	}
}

export default App;
