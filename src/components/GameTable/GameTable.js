import React, { Component } from 'react';

// ASSETS
import '../../scss/game.scss';
import Logo from '../../dist/img/logo.svg';
import PlayerImgPH from '../../dist/img/ph-user-pic.png';

// COMPONENTS
import GameOver from '../Modals/GameOver';
import InfoWindow from '../Modals/InfoWindow';
// AXIOS FOR HTTP REQS
import axios from 'axios';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			gameLoaded :	false,
			shuffleHand : 	10,
			deck :			{},
			players :		[],
			pile :			[],
			round :			[],
			infoActive : 	false,
			gameOverActive: false,
			blockingUser : 	false,
			activePlayer : 	0,
			gameWinners : 	[],
			roundWinner : 	false,
			cardValueMap : 	{
				"ACE": 		1,
				"1": 		2,
				"3": 		3,
				"4": 		4,
				"5": 		5,
				"6": 		6,
				"7": 		7,
				"8": 		8,
				"9": 		9,
				"10": 		10,
				"JACK": 	12,
				"QUEEN": 	13,
				"KING": 	14,
			}
		};
		
		//Mapping player objects
		for(let i = 0; i < this.props.numOfPlayers; i++) {
			this.state.players.push({
				cards: [],
				cardsCount:0,
				score: 0,
				name: ''	
			})
			if(i === 0) {
				this.state.players[i].name = this.props.playerName;
			} else {
				this.state.players[i].name = `Bot ${i}`;
			}	
		}
		
		// Nessecery binding
		this.getDeckOfCard.bind(this);
		this.discardFromHand.bind(this);
		this.drawCards.bind(this);
		this.onEndOfRound.bind(this);
		this.onEndOfGame.bind(this);
		// 

		// GET dack of cars
		this.getDeckOfCard();
	}

	/* Menu Actions */
	goToMainMenu() {
		this.props.onQuit();
	}

	openInfoWindow() {
		this.setState({infoActive:true});	
	}

	closeInfoWindow() {
		this.setState({infoActive: false});
	}
	/* ------------ */

	getDeckOfCard() {
		console.info('getting deck')
		axios({
			method:'get',
			url:'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
		})
		.then((response) => {
			if(response.status === 200) {
				this.setState({deck: response.data});
				
				for(let i = 0; i < this.props.numOfPlayers; i++) {
					this.drawCards(i);
				}
			}
		});
	}

	drawCards(playerIndex) {
		console.info('drawing cards', 'player:' + playerIndex)
		axios({
			method:'get',
			url:`https://deckofcardsapi.com/api/deck/${this.state.deck.deck_id}/draw/?count=${this.state.shuffleHand}`,
		})
		.then((response) => {
			if(response.status === 200) {
				let playersArr = this.state.players;

				// regenerate player object
				playersArr[playerIndex] = {
					cards : [...response.data.cards],
					cardsCount: this.state.shuffleHand,
					score : 0,
					name: this.state.players[playerIndex].name
				};		
				
				this.setState({players: playersArr});	
		
				if(playerIndex === (this.props.numOfPlayers - 1)) {
					/* All card are drawed. Hide game loader */
					this.setState({gameLoaded: true});
				}
			}
		});
	}

	discardFromHand(playerId,playerCard) {
		let cardIndex;
		let currentRound = this.state.round;
		let players = this.state.players;

		if(playerCard) {
			// Get card from user
			cardIndex = players[playerId].cards.findIndex((card) =>{
				if(card) {	
					return card.code === playerCard.code;
				} 
				return false;
			});
			players[playerId].cards[cardIndex] = undefined;
		} else {
			// get card from bot player
			cardIndex = Math.floor(Math.random() * players[playerId].cardsCount);
			playerCard = players[playerId].cards[cardIndex];	
			players[playerId].cards.splice(cardIndex,1);
		}	
		
		currentRound.push({
			playerId: playerId,
			cardValue: playerCard.value,
			cardImg: playerCard.img
		})

		players[playerId].cardsCount -= 1;

		this.setState({players: players});
		this.setState({round: currentRound});
		
	}

	onUserCardSelect(card) {
		if(card && !this.state.blockingUser) {
			let delay = 500;

			// Starting new round - reset array
			this.setState({round: this.state.round.splice(0,this.state.round.length)});

			// Block user click on card until end of the round
			this.setState({blockingUser: true});

			// take card that user clicks
			this.discardFromHand(0, card);
			
			// take random card from bot players
			for(let i = 1; i < this.props.numOfPlayers; i++) {
				delay += 700;
				setTimeout(()=> {
					this.discardFromHand(i);
					this.setState({activePlayer: i});

					// Last player has played
					if(i === (this.props.numOfPlayers - 1)){
						setTimeout(()=> {
							this.onEndOfRound();
						},700)
					}
				},delay)
			}
		}
	}

	onEndOfRound() {
		let winner;
		let cardValKey = 0;
		let cardVal = 0;
		let roundVal = 0;

		for(let i = 0; i < this.state.round.length; i++) {		
			cardValKey = this.state.round[i].cardValue;
			if(this.state.cardValueMap[cardValKey] >= cardVal) {
				winner = this.state.round[i].playerId;
				cardVal = this.state.cardValueMap[cardValKey];
			}
			roundVal += cardVal;
		}
		
		let players = this.state.players;
		players[winner].score += roundVal;

		this.setState({roundWinner: winner});

		/* 1s Timeout so we can show round winner */
		setTimeout(()=> {
			/* Unblock user action */
			this.setState({blockingUser: false});
			this.setState({activePlayer: 0});
			this.setState({players: players});
			this.setState({roundWinner: false});

			// END OF THE GAME
			if(players[winner].cardsCount === 0) {
				this.onEndOfGame(winner);
			}
		},1000)
	}

	onEndOfGame(winnerIndex) {
		
		let maxResult = Math.max.apply(Math,this.state.players.map(function(o){return o.score;}))
		let winners = this.state.players.filter(function(o){ 
			return o.score === maxResult; 
		})

		this.setState({gameWinners: winners });
		this.setState({gameOverActive: true});	
	}

  	render() {
		let genPlayers = [];
		
		// GENERATING BOT PLAYERS
		for (let i = 1; i < this.props.numOfPlayers; i++) {
			genPlayers.push(
				<div key={i} className={"column " + (this.state.roundWinner === i ? 'win-indicate blink-me' : '')}>
					<div className="multiple-img">
						<img width="50" className="player-img" src={PlayerImgPH} alt="User"/>
						<span className={"pulse " + (this.state.activePlayer === i ? 'active-player' : '')}></span>
						{/* <img width="50" className={"playing-img " + (this.state.activePlayer === i ? 'active-player' : '')} src={PlayingLoader} alt="loading"/> */}
					</div>
					<div>
						<h1 className="is-size-3">{this.state.players[i].name}</h1>
						<h1>Score: {this.state.players[i].score}</h1>
					</div>
				</div>
			);
		}
		
		// GENERATING USER CARDS IMAGES
		let userCardsRow1 = [] ;
		let userCardsRow2 = [] ;
        for (let i = 0; i < this.state.shuffleHand; i++) {
			let card = this.state.players[0].cards[i];
			let background = {
				backgroundImage: card ? `url(${card.image})` : '',
			};
			if(i < (this.state.shuffleHand/2)) {
				userCardsRow1.push(
					<div className="column is-2-desktop is-one-fifth-mobile" key={i}>
						<div onClick={this.onUserCardSelect.bind(this, card)} className={"card-holder "  + (this.state.blockingUser ? 'inactive' : '')} style={background}></div>
					</div>
				);
			} else {
				userCardsRow2.push(
					<div className="column is-2-desktop is-one-fifth-mobile" key={i}>
						<div onClick={this.onUserCardSelect.bind(this, card)} className={"card-holder "  + (this.state.blockingUser ? 'inactive' : '')} style={background}></div>
					</div>
				);	
			}
		}
		

		/* GENERATE PILE */
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

		if(this.state.gameLoaded) {
			return (
				<div className="game-table">
					<div className="columns is-mobile game-header">
						<div className="column is-narrow">
							<img width="20" src={Logo} alt=""/>
						</div>
						<div className="column is-narrow is-vcentered">
							<h1 className="title is-4 game-name">Card Game</h1>
						</div>
						<div className="column clickable has-text-right" onClick={this.openInfoWindow.bind(this)}>
							Info
						</div>
						<div className="column clickable is-narrow has-text-right" onClick={this.goToMainMenu.bind(this)}>
							Quit Game
						</div>
					</div>

					<div className="columns is-mobile table-part is-centered">
						{genPlayers}
					</div>

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

					<div className="columns table-part user is-marginless is-centered">
						<div className="column">
						{/* {this.props.playerName} - Cards left: */}
							<h1> {this.state.players[0].cardsCount > 0 }</h1>
							<h1 className="title is-2">
								<span className={"pulse " + (this.state.activePlayer === 0 ? 'active-player' : '')}></span>
								<span>{this.props.playerName}</span> 
								<span className="ver-divider"> | </span> 
								<span className={"has-text-dark " + (this.state.roundWinner === 0 ? 'blink-me' : '')}>Score: {this.state.players[0].score}</span>
							</h1>
							<div className="user-cards">
								<div className="columns is-mobile is-multiline is-centered">
									{userCardsRow1}
								</div>
								<div className="columns is-mobile is-multiline is-centered">
									{userCardsRow2}
								</div>
							</div>
						</div>
					</div>
					
					{/* MODAL Game Over */}
				
					
					<GameOver gameOverActive={this.state.gameOverActive} gameWinners={this.state.gameWinners} goToMainMenu={this.goToMainMenu.bind(this)} />
					<InfoWindow  infoActive={this.state.infoActive} onClose={this.closeInfoWindow.bind(this)} />
				</div>
			);
		} else {
			return (
				<div>
					<div className="columns full-loader">
						<div className="column is-vcentered">
							<h1 className="title is-3"><span>LOADING GAME....</span> </h1>
						</div>
					</div>
					
				</div>
			);
		}
  	}
}

export default App;
