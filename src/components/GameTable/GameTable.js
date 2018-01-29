import React, { Component } from 'react';

// ASSETS
import '../../scss/game.scss';

// COMPONENTS
import GameOver from '../Modals/GameOver';
import InfoWindow from '../Modals/InfoWindow';
import Loading from './partials/Loading';
import TopBar from './partials/TopBar';
import BotPlayers from './partials/BotPlayers';
import Pile from './partials/Pile';
import UserView from './partials/UserView';

// AXIOS FOR HTTP REQS
import axios from 'axios';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			gameLoaded 		:	false,
			shuffleHand 	: 	10,
			deck 			:	{},
			players 		:	[],
			pile 			:	[],
			round 			:	[],
			infoActive 		: 	false,
			gameOverActive	: 	false,
			blockingUser 	: 	true,
			activePlayer 	: 	0,
			gameWinners 	: 	[],
			roundWinner 	: 	false,
			
			cardValueMap	: 	{
				"ACE"	: 	1,
				"1"		: 	1,
				"2"		: 	2,
				"3"		: 	3,
				"4"		: 	4,
				"5"		: 	5,
				"6"		: 	6,
				"7"		: 	7,
				"8"		: 	8,
				"9"		: 	9,
				"10"	:	10,
				"JACK"	: 	12,
				"QUEEN"	: 	13,
				"KING"	: 	14,
			}
		};
		
		/* Mapping player objects */
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
		
		/* Necessary binding */
		this.getDeckOfCard.bind(this);
		this.discardFromHand.bind(this);
		this.drawCards.bind(this);
		this.onEndOfRound.bind(this);
		this.onEndOfGame.bind(this);

		/* GET dack of cars */
		this.getDeckOfCard();
	}

	componentDidMount() {
		this._isMounted = true;
	}

	/* Go to main menu click handle */
	goToMainMenu() {
		/* Quiting game */
		this.props.onQuit();
	}

	/* Open info window click handle */
	openInfoWindow() {
		/* Opening info window */
		this.setState({ infoActive : true });	
	}

	/* Close info window click handle */
	closeInfoWindow() {
		/* Closing info window */
		this.setState({ infoActive : false });
	}

	/**
	 * Getting and storing deck of cards from API
	 */
	getDeckOfCard() {
		axios({
			method:'get',
			url:'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
		})
		.then((response) => {
			if(response.status === 200) {
				this.setState({ deck : response.data });
				
				for(let i = 0; i < this.props.numOfPlayers; i++) {
					this.drawCards(i);
				}
			}
		});
	}

	/**
	 * Getting random cards from deck and giving it to players
	 * @param {Number} playerIndex 
	 */
	drawCards(playerIndex) {
		axios({
			method:'get',
			url:`https://deckofcardsapi.com/api/deck/${this.state.deck.deck_id}/draw/?count=${this.state.shuffleHand}`,
		})
		.then((response) => {
			if(response.status === 200) {
				let playersArr = this.state.players;

				/* Regenerate players array with updated player object */
				playersArr[playerIndex] = {
					cards : [...response.data.cards],
					cardsCount: this.state.shuffleHand,
					score : 0,
					name: this.state.players[playerIndex].name
				};		
				
				this.setState({ players : playersArr });	
		
				if(playerIndex === (this.props.numOfPlayers - 1)) {
					/* All card are drawed to players. Hide game loader */
					this.setState({ gameLoaded : true });
					this.setState({ blockingUser: false });
				}
			}
		});
	}

	/**
	 * Removing card from players hand
	 * @param {Number} playerId 
	 * @param {Object} playerCard 
	 */
	discardFromHand(playerId,playerCard) {
		let cardIndex;
		let currentRound = this.state.round;
		let players = this.state.players;

		if(playerCard) {
			/* Finding User card code by card index and change it to undifined
			Because we want cards to stay on the same place on the table*/
			cardIndex = players[playerId].cards.findIndex((card) =>{
				if(card) {	
					return card.code === playerCard.code;
				} 
				return false;
			});
			players[playerId].cards[cardIndex] = undefined;

		} else {
			/* Get card from bot players array. 
			We dont need graphic view so we remove it from array */
			cardIndex = Math.floor(Math.random() * players[playerId].cardsCount);
			playerCard = players[playerId].cards[cardIndex];	
			players[playerId].cards.splice(cardIndex,1);
		}	
		
		/* Generate round object.*/
		currentRound.push({
			playerId: playerId,
			cardValue: playerCard.value,
			cardImg: playerCard.image
		})

		players[playerId].cardsCount -= 1;

		this.setState({ players : players });
		this.setState({ round : currentRound });
	}

	/**
	 * User click on the card event handling
	 * @param {Object} card 
	 */
	onUserCardSelect(card) {
	
		if(card && !this.state.blockingUser) {
			let delay = 500;

			// Block user click on card until end of the round
			this.setState({blockingUser: true});

			// take card that user clicks
			this.discardFromHand(0, card);
			this.setState({ activePlayer : 1 });

			// take random card from bot players
			for(let i = 1; i < this.props.numOfPlayers; i++) {
				setTimeout(()=> {
					this.setState({ activePlayer : i });
					
					setTimeout(()=> {
						this.discardFromHand(i);
						// Last player has played
						if(i === (this.props.numOfPlayers - 1)){
							setTimeout(()=> {
								this.onEndOfRound();
							},700)
						}
					},700)

				},delay)
				delay += 1000;
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

		this.setState({ roundWinner : winner} );
	
		/* 1s Timeout so we can show round winner */
		setTimeout(()=> {
			/* Unblock user action */
			this.setState({ blockingUser : false });
			this.setState({ activePlayer : 0 });
			this.setState({ players : players });
			this.setState({ roundWinner : false });
			// Starting new round - reset array
			let newRound = [];
			this.setState({round: newRound })

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

		this.setState({ gameWinners: winners });
		this.setState({ gameOverActive: true });	
	}

  	render() {

		if(this.state.gameLoaded) {
			return (
				<div className="game-table">

					{/* Top Header */}	
					<TopBar 
						onOpenInfo		=	{ this.openInfoWindow.bind(this) } 
						onGotoMainMenu	=	{ this.goToMainMenu.bind(this) } 
					/>


					{/* Generate Bot players */}	
					<BotPlayers 
						numOfPlayers	=	{ this.props.numOfPlayers }
						roundWinner		=	{ this.state.roundWinner }
						activePlayer	=	{ this.state.activePlayer }
						players			=	{ this.state.players }
					/>


					{/* Generate View for pile of discarded cards */}		
					<Pile 
						numOfPlayers	=	{ this.props.numOfPlayers } 
						round			=	{ this.state.round } 
						roundWinner		=	{ this.state.roundWinner }
					/>


					{/* Generate User cards and his result */}	
					<UserView 
						shuffleHand		=	{ this.state.shuffleHand }
						players			=	{ this.state.players }
						blockingUser	=	{ this.state.blockingUser }
						activePlayer	=	{ this.state.activePlayer }
						roundWinner		=	{ this.state.roundWinner }
						playerName		=	{ this.props.playerName }
						gameWinners		= 	{ this.state.gameWinners }
						onUserCardSelect= 	{ this.onUserCardSelect.bind(this) }
					/>
					

					{/* MODALS */}		
					<GameOver gameOverActive={this.state.gameOverActive} gameWinners={this.state.gameWinners} goToMainMenu={this.goToMainMenu.bind(this)} />
					<InfoWindow  infoActive={this.state.infoActive} onClose={this.closeInfoWindow.bind(this)} />
				</div>
			);
		} else {
			return (
				<Loading />
			);
		}
  	}
}

export default App;
