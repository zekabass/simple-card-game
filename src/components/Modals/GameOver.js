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
				<div>
					<h1 className="title is-6">
						<span className="has-text-dark" key="win1"> Awesome, we have {this.props.gameWinners.length} winners</span>
					</h1>
					<h1 className="title is-4">
						<span className="has-text-dark" key="win1"> Winners are: </span>
					</h1>
				</div>
			)
		} else {
			winnerText.push (
				<span className="has-text-dark" key="win2"> Winner is: </span>
			)
		}

		return (		
			<div className={"modal " + (this.props.gameOverActive ? 'is-active' : '')}>
				<div className="modal-background"></div>
				<div className="modal-card">
					<section className="modal-card-body">
						<h1 className="title is-4">GAME FINISHED!</h1>
						{winnerText}
						{winners}
						<div className="columns">
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
