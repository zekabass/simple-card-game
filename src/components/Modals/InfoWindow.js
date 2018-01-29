import React, { Component } from 'react';

class App extends Component {

	goToMainMenu() {
		window.location.reload();
	}

  	render(props) {
		return (		
			<div className={"modal " + (this.props.infoActive ? 'is-active' : '')}>
				<div className="modal-background"></div>
				<div className="modal-card">
					<section className="modal-card-body">
						<h1 className="title is-4">INFO</h1>
						<div className="columns is-mobile is-centered">
							<div className="column is-narrow">
								<span className="pulse in-info" ></span>
							</div>
							<div className="column has-text-left">
								<p className="has-text-dark has-normal-font">
									- Indicates who's playing
								</p>
							</div>
						</div>	
						<div className="columns is-mobile is-centered">
							<div className="column">
								<div className="has-text-dark has-normal-font column has-text-left">
									<p>
									- jedan standardni špil od 52 karte <br/>
									- jedno deljenje gde svaki igrač dobija po 10 karata <br/>
									- čovek uvek igra prvi <br/>
									- redosled igranja je u smeru kazaljke na satu <br/>
									- kompjuter po slučajnom izboru bira karte <br/>
									- svaki igrač izbacuje po jednu kartu i najveća karta nosi sve izbačene karte <br/>
									- vrednosti karata su, od najmanje do najveće: A=1, 2 do 10 = vrednost broja koji je na karti, J=12, Q=13, K=14 <br/>
									- ukoliko su dve ili više karata najveće, igrač koji je poslednji bacio tu kartu nosi sve <br/>
									- odnešene karte se ne vraćaju u igru <br/>
									- kraj igre je kada svi igrači ostanu bez karata u ruci, ne treba dalje deliti preostale karte iz špila <br/>
									- pobednik je igrač čiji je zbir vrednosti odnešenih karata najveći (u slučaju istog zbira može biti više podbednika). <br/>
									</p>
								</div>
							</div>	
						</div>
						<div className="columns is-centered">
							<div className="column">
								<button className="button is-primary" onClick={this.props.onClose}> Quit </button>
							</div>
						</div>		
					</section>
				</div>
			</div>
		);
  	}
}

export default App;
