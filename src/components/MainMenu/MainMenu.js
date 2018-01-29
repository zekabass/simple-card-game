import React, { Component } from 'react';

import Logo from '../../dist/img/logo.svg';

class App extends Component {

  	render() {
		return (
			<div className="main-menu center">
				<div className="section">
					<img width="40" src={Logo} alt=""/>
					<h1 className="title is-4 game-name">Card Game</h1>
				</div>

				<div className="section game-logo">
					<div className="columns is-centered">
						<div className="column is-narrow is-vcentered">
							<h1 className="title is-5">Name:</h1>
						</div>
						<div className="column is-6">
							<div className="field">
								<div className="control">
								<input className="input is-medium player-name" type="text" placeholder="Your Name" defaultValue={this.props.playerName} onChange={this.props.playerNameAction} />
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="section">
					<div className="columns is-centered">
						<div className="column is-narrow">
							<label className="radio">
								<input type="radio" name="players" value="2" onChange={this.props.numOfPlayersAction} checked={this.props.numOfPlayers === 2}/>
								2 Players
							</label>
						</div>
						<div className="column is-narrow">
							<label className="radio">
								<input type="radio" name="players" value="3" onChange={this.props.numOfPlayersAction} checked={this.props.numOfPlayers === 3}/>
								3 Players
							</label>
						</div>
						<div className="column is-narrow">	
							<label className="radio">
								<input type="radio" name="players" value="4" onChange={this.props.numOfPlayersAction} checked={this.props.numOfPlayers === 4}/>
								4 Players
							</label>
						</div>
					</div>  
				</div>

				<div className="section">
					<div className="columns is-centered">
						<div className="column is-5">
							<button onClick={this.props.onStartGame} className="button is-danger is-fullwidth is-size-4">START</button>
						</div>
					</div>
				</div>
			</div>
		);
  	}
}

export default App;
