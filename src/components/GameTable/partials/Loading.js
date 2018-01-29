import React, { Component } from 'react';

class App extends Component {

  	render(props) {	
		return (		
			<div>
				<div className="columns full-loader">
					<div className="column is-vcentered">
						<h1 className="title is-3 blink-me "><span>LOADING GAME....</span> </h1>
					</div>
				</div>
			</div>
		);
  	}
}

export default App;
