import React, { Component } from 'react';
import '../../scss/main.scss';

import MainMenu from '../MainMenu/MainMenu';
import GameTable from '../GameTable/GameTable';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			playerName		: 	'Player',
			numOfPlayers	: 	4,
			gameStarted		: 	false
		};

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handlePlayersChange = this.handlePlayersChange.bind(this);
		this.startGame = this.startGame.bind(this);
		this.quitGame = this.quitGame.bind(this) 
	}

	componentDidMount() {
		this._isMounted = true;
	}

	handleNameChange(event) {
		if(this._isMounted) {
			this.setState({playerName: event.target.value});
		}	
	}

	handlePlayersChange(event) {
		this.setState({numOfPlayers: parseInt(event.target.value,10)});
	}

	startGame() {
		this.setState({gameStarted: true});
	}

	quitGame() {
		this.setState({gameStarted: false});
	}

	render() {
		return (
			<div className={"App " + ( !this.state.gameStarted ? 'is-vcentered' : '')}>
				{ this.state.gameStarted
					? 	<GameTable 
							playerName		=	{this.state.playerName} 
							numOfPlayers	=	{this.state.numOfPlayers}
							onQuit			=	{this.quitGame}	
						/>
					: 	<MainMenu 
							playerName			=	{this.state.playerName} 
							numOfPlayers		=	{this.state.numOfPlayers}
							playerNameAction	=	{this.handleNameChange} 
							numOfPlayersAction  =	{this.handlePlayersChange}
							onStartGame			=	{this.startGame}
						/>
				}
			</div>
		);
	}
}

export default App;

