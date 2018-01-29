import React, { Component } from 'react';

class App extends Component {

	onUserCardSelect(card) {
		this.props.onUserCardSelect(card)
	}

  	render(props) {	
		// const isMobile = window.innerWidth <= 768;
		let userCardsRow1 = [] ;
		let userCardsRow2 = [] ;

        for (let i = 0; i < this.props.shuffleHand; i++) {
			let card = this.props.players[0].cards[i];
			let background = {
				backgroundImage: card ? `url(${card.image})` : '',
			};
			if(i < (this.props.shuffleHand/2)) {
				userCardsRow1.push(
					<div className="column is-2-desktop is-one-fifth-mobile" key={i}>
						<div onClick={ this.onUserCardSelect.bind(this, card) } className={"card-holder "  + (this.props.blockingUser ? 'inactive' : '')} style={background}></div>
					</div>
				);
			} else {
				userCardsRow2.push(
					<div className="column is-2-desktop is-one-fifth-mobile" key={i}>
						<div onClick={ this.onUserCardSelect.bind(this, card) } className={"card-holder "  + (this.props.blockingUser ? 'inactive' : '')} style={background}></div>
					</div>
				);	
			}
		}

		return (		
			<div  className="columns table-part user is-marginless is-centered ">
				<div className="column">
					<h1> {this.props.players[0].cardsCount > 0 }</h1>
					<h1 className="title is-2">
						<span className={"pulse " + (this.props.activePlayer === 0 ? 'active-player' : '')}></span>
						<span>{this.props.playerName}</span> 
						<span className="ver-divider"> | </span> 
						<span className={"has-text-dark " + (this.props.roundWinner === 0 ? 'blink-me' : '')}>Score: {this.props.players[0].score}</span>
					</h1>
					<div className={"user-cards " + (!this.props.blockingUser && !this.props.gameWinners.length > 0 ? 'visible ' : 'hide') }>
						<div className="columns is-mobile is-multiline is-centered">
							{userCardsRow1}
						</div>
						<div className="columns is-mobile is-multiline is-centered">
							{userCardsRow2}
						</div>
					</div>
				</div>
			</div>
		);
  	}
}

export default App;
