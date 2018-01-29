import React, { Component } from 'react';

import Player_1 from '../../../dist/img/poker_1.jpg';
import Player_2 from '../../../dist/img/poker_2.jpg';
import Player_3 from '../../../dist/img/poker_3.jpg';

class App extends Component {

  	render(props) {	
		/* GENERATING BOT PLAYERS */ 
		let genPlayers = [];
		let img;
		for (let i = 1; i < this.props.numOfPlayers; i++) {

			if(i===1) {
				img = Player_1
			}
			if(i===2) {
				img = Player_2
			}
			if(i===3) {
				img = Player_3
			}

			genPlayers.push(
				<div key={i} className={"column is-4 " + (this.props.roundWinner === i ? 'win-indicate' : '')}>
					<div className="multiple-img">
						<img width="50" className="player-img" src={img} alt="User"/>
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
