import Base from "./Base.js";
class MainPage extends Base {
	constructor() {
		super();
		this.init();
		this.initDOM();
	}
	
	initDOM () {
		this.menuList = document.querySelector('.header__menu-list');
		this.headCurrUser = document.querySelector('.header__curr-user');
		this.mainBody = document.querySelector('.main-body');
	}

	displayCurrentUser = () => {
		let requestUpgrade = (e) => console.log('Upgraded', e.target.result);
		let requestSucces = (e) => {
			let transaction = e.target.result.transaction("users")
																				.objectStore("users");
			let current = transaction.index('currentUser');
			let request = current.get('true');
			this.eventListeners(request, (e) => {
				if (e.target.result) {
					this.headCurrUser.textContent = e.target.result.login;
				} else	console.log("Error displayCurrentUser");
			});
		}
		this.requestDB('users', 1, requestUpgrade, requestSucces);
	}

	cardTemple({title, img, price, model, memory, id}) {
		return `
			<div class="phone-card" data-id="${id}">
				<h2 class="phone-card__title">
					${title}
				</h2>
				<div class="phone-card__img">
					<img src=${img} alt="image">
				</div>
				<div class="phone-card__info">
					<div class="phone-card__price"><span>price:</span>${price}$</div>
					<div class="phone-card__model"><span>model:</span>${model}</div>
					<div class="phone-card__memory"><span>memory:</span>${memory}GB</div>
				</div>
				<div class="add-card__bttm">
						<button class="add-card__btn" type="button">Busket</button>
				</div>
			</div>
		`;
	}

	displayCards = async () => {
		let requestUpgrade = (e) => console.log('Upgraded', e.target.result);
		let requestSucces = (e) => {
			let res = e.target.result;
			let transaction = res.transaction('phoneCards')
												.objectStore('phoneCards');
			let currLogin = transaction.getAll();
			this.eventListeners(currLogin, (e) => {
				e.target.result.forEach(e => {
					let card = this.cardTemple(e);
					this.mainBody.insertAdjacentHTML('beforeend', card);
				});
			});
		};
		this.requestDB('phoneCards', 1, requestUpgrade, requestSucces);
	}

	isAdmin = () => {
		let requestUpgrade = (e) => console.log('Upgraded', e.target.result);
		let requestSucces = (e) => {
			this.result = e.target.result;
			let transaction = this.result.transaction("users")
																		.objectStore("users");
			let isAdmin = transaction.index('isAdmin');
			let request = isAdmin.get('true');
			this.eventListeners(request, (e) => {
				if (e.target.result && e.target.result.current) {
					let item = `
						<li class="header__item">
							<a href="./admin.html" class="header__item-link">Add cards</a>
						</li>
					`;
					this.menuList.insertAdjacentHTML('beforeend', item);
				} else {
					console.log("Error isAdmin");
				}
			});
		}
		this.requestDB('users', 1, requestUpgrade, requestSucces);
	}

	showHideMenu(event) {
		let curr = event.target;
		let menuList = document.querySelector('.header__menu-list');
		if (curr.closest('.header__curr-user')) {
			menuList.classList.add('header__menu-list_active');
		} 
		else if (curr.closest('.header__menu-list_exit')) {
			menuList.classList.remove('header__menu-list_active');
		}else return;
	}

	addToBusket = (event) => {
		if (event.target.closest('.add-card__btn')) {
			let currentCard = null;
			let id = +event.target.closest('.phone-card').dataset.id;
			let reqUpg = (e) => console.log('Upgraded', e.target.result);
			let reqSucc = (e) => {
				let res = e.target;
				let transaction = res.result.transaction("phoneCards")
																		.objectStore("phoneCards");
				let request = transaction.get(id);
				this.eventListeners(request, e => {
					currentCard = e.target.result;
					let usUpg = (e) => console.log('Upgraded', e.target.result);
					let usSucc = (e) => {
						let transaction2 = e.target.result.transaction("users", 'readwrite')
																				.objectStore("users");
						let current = transaction2.index('currentUser');
						let request = current.get('true');
						this.eventListeners(request, e => {
							e.target.result.busket.push(currentCard);
							let added = transaction2.put(e.target.result);
							this.eventListeners(added, e => console.log(e.target.result.busket, 'Added'));
						});
					}
					this.requestDB('users', 1, usUpg, usSucc);
				});
			}

			this.requestDB('phoneCards', 1, reqUpg, reqSucc);
		} else return;
	}

	init =  async () => {
		this.isAdmin();
		this.displayCurrentUser();
		this.displayCards();
		document.addEventListener('click', e => {
			this.showHideMenu(e);
			this.addToBusket(e);
		});
	}
}

new MainPage;

export default MainPage;