import React, { Component } from 'react';

import PlayerImgPH from '../../../dist/img/ph-user-pic.png';

class App extends Component {

  	render(props) {	
		
		/* GENERATING BOT PLAYERS */ 
		let genPlayers = [];
		for (let i = 1; i < this.props.numOfPlayers; i++) {
			genPlayers.push(
				<div key={i} className={"column " + (this.props.roundWinner === i ? 'win-indicate blink-me' : '')}>
					<div className="multiple-img">
						<img width="50" className="player-img" src={PlayerImgPH} alt="User"/>
						<span className={"pulse " + (this.props.activePlayer === i ? 'active-player' : '')}></span>
					</div>
					<div>
						<h1 className="is-size-3">{this.props.players[i].name}</h1>
						<h1>Score: {this.props.players[i].score}</h1>
					</div>
				</div>
			);
		}

		return (		
			<div className="columns is-mobile table-part is-centered">
				{genPlayers}
			</div>
		);
  	}
}

export default App;
