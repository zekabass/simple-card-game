import React, { Component } from 'react';

import Logo from '../../../dist/img/logo.svg';

class App extends Component {

  	render(props) {	
		return (		
			<div className="columns is-mobile game-header">
				<div className="column is-narrow">
					<img width="20" src={Logo} alt=""/>
				</div>
				<div className="column is-narrow is-vcentered">
					<h1 className="title is-4 game-name">Card Game</h1>
				</div>
				<div className="column clickable has-text-right" onClick={this.props.onOpenInfo}>
					Info
				</div>
				<div className="column clickable is-narrow has-text-right" onClick={this.props.onGotoMainMenu}>
					Quit Game
				</div>
			</div>
		);
  	}
}

export default App;
