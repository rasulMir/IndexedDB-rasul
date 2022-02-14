import Base from "./Base.js";
import {db} from "./Base.js";
class MainPage extends Base {
	constructor() {
		super();
		this.init();
		this.initDOM();
	}

	initDOM () {
		this.menuList = document.querySelector('.header__menu-list');
		this.headCurrUser = document.querySelector('.header__curr-user');
		this.menuList = document.querySelector('.header__menu-list');
		this.mainBody = document.querySelector('.main-body');
	}

	displayCurrentUser = async () => {
		let request = indexedDB.open('users', 2);

		request.addEventListener('error', (e) =>	console.log(e.target.error, 'Error'));
		request.addEventListener('upgradeneeded', (e) => {
			db.users = e.target.result;
		});
		request.addEventListener('success', (e) => {
			let transaction = e.target.result.transaction("users");
			let users = transaction.objectStore("users");
			let current = users.index('currentUser');
			let request = current.get('true');
			request.onsuccess = () => {
				if (request.result !== undefined) {
					this.headCurrUser.textContent =  request.result.login;
				} else {
					console.log("Нет таких книг");
				}
			};
		});
	}

	cardTemple({title, img, price, model, memory}) {
		return `
			<div class="phone-card">
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
			</div>
		`;
	}

	displayCards = async () => {
		let request = indexedDB.open('busket', 1);
		request.addEventListener('error', (e) =>	console.log(e.target.error, 'Error'));
		request.addEventListener('upgradeneeded', (e) => {
			let res = e.target.result;
		});
		request.addEventListener('success', (e) => {
			let res = e.target.result;
			let transaction = res.transaction('busket')
												.objectStore('busket');
			let currLogin = transaction.getAll();
			currLogin.addEventListener('success', (e) => {
				e.target.result.forEach(e => {
					let card = this.cardTemple(e);
					this.mainBody.insertAdjacentHTML('beforeend', card);
				});
			});
			currLogin.addEventListener('error', (e) => console.log(e.target.error));
		});
	}

	createBasketDB = async () => {
		let request = indexedDB.open('busket', 1);
		request.addEventListener('error', (e) =>	console.log(e.target.error, 'Error'));
		request.addEventListener('upgradeneeded', (e) => {
			if(!e.target.result.objectStoreNames.contains('busket')) {
				this.busket = e.target.result.createObjectStore("busket", {keyPath: 'title'});
			}
		});
		request.addEventListener('success', (e) => {
			this.busket = e.target.result;
			let products = this.initData();
			products.forEach(e => this.addNotes(this.busket, 'busket', e));
		});
	}
	
	isAdmin = async () => {
		let request = indexedDB.open('users', 3);

		request.addEventListener('error', (e) =>	console.log(e.target.error, 'Error'));
		request.addEventListener('upgradeneeded', (e) => {
			db.users = e.target.result;
		});
		request.addEventListener('success', (e) => {
			this.result = e.target.result;
			let transaction = this.result.transaction("users");
			let users = transaction.objectStore("users");
			let isAdmin = users.index('isAdmin');
			let request = isAdmin.get('true');
			request.onsuccess = (e) => {
				if (request.result !== undefined) {
					let item = `
						<li class="header__item">
							<a href="./admin.html" class="header__item-link">Add cards</a>
						</li>
					`;
					this.menuList.insertAdjacentHTML('beforeend', item);
					return e.target.result;
				} else {
					console.log("Нет таких книг");
				}
			};
		});
	}

	showHideMenu(event) {
		let curr = event.target;
		if (curr.closest('.header__curr-user')) {
			this.menuList.classList.add('header__menu-list_active');
		} 
		else if (curr.closest('.header__menu-list_exit')) {
			this.menuList.classList.remove('header__menu-list_active');
		}else return;
	}

	initData() {
		let data = [
			{title : 'samsung', img : 'https://sanmi.kz/upload/iblock/7c0/1581442324_IMG_1316747.jpg', price: '1000', model:'s5', memory: '64'},
			{title : 'huawei', img : 'https://sanmi.kz/upload/iblock/7c0/1581442324_IMG_1316747.jpg', price: '1000', model:'s6', memory: '64'},
			{title : 'oppo', img : 'https://sanmi.kz/upload/iblock/7c0/1581442324_IMG_1316747.jpg', price: '1000', model:'s7', memory: '64'},
			{title : 'iphone', img : 'https://sanmi.kz/upload/iblock/7c0/1581442324_IMG_1316747.jpg', price: '1000', model:'s8', memory: '64'},
		];
		return data;
	}

	init =  async () => {
		let a = await this.displayCurrentUser();
		let b = await this.isAdmin();
		let c = await this.createBasketDB();
		this.displayCards();
		document.addEventListener('click', event => {
			this.showHideMenu(event);
		});
	}
}

new MainPage;

export default MainPage;