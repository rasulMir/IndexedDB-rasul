
import Base from "./Base.js";

class Busket extends Base {
	constructor () {
		super();
		this.initDOM();
		this.init();
	}

	cardTemplate({title, img, price, model, memory}, i) {
		return `
			<li class="busket__item" data-ind="${i}">
				<div class="busket__img">
					<img src='${img}' alt="image">
				</div>
				<div class="busket__body">
					<h2 class="busket__title">
						${title}
					</h2>
					<div class="busket__info">
						<div class="busket__price"><span>price:</span>${price}$</div>
						<div class="busket__model"><span>model:</span>${model}</div>
						<div class="busket__memory"><span>memory:</span>${memory}GB</div>
					</div>
					<div class="busket__bttm">
							<button class="busket__btn-del" type="button">Delete</button>
					</div>
				</div>
			</li>
		`;
	}

	displayBusketCards = async () => {
		let requestUpgrade = (e) => console.log('Upgraded', e.target.result);
		let requestSucces = (e) => {
			let transaction = e.target.result.transaction("users")
																				.objectStore("users");
			let current = transaction.index('currentUser');
			let request = current.get('true');
			this.eventListeners(request, (e) => {
				document.querySelectorAll('.busket__item').forEach(element => element.remove());
				this.busketTotalPrice.innerHTML = '';
				this.busketTotalProducts.innerHTML = '';
				let busket = e.target.result.busket;
				let total = busket.reduce((a, i, ind) => {
					let card = this.cardTemplate(i, ind);
					this.busketList.insertAdjacentHTML('beforeend', card);
					return a + +i.price;
				}, 0);
				this.busketTotalPrice.innerHTML = `<span>total price:</span>${total}`;
				this.busketTotalProducts.innerHTML = `<span>total products:</span>${busket.length}`;
			});
		}
		this.requestDB('users', 1, requestUpgrade, requestSucces);
	}

	deleteHandler = (e) => {
		if (e.target.closest('.busket__btn-del')) {
			let ind = +e.target.closest('.busket__item').dataset.ind;
			let requestUpgrade = (e) => console.log('Upgraded', e.target.result);
			let requestSucces = (e) => {
				let transaction = e.target.result.transaction("users", "readwrite")
																					.objectStore("users");
				let current = transaction.index('currentUser');
				let request = current.get('true');
				this.eventListeners(request, (e) => {
					e.target.result.busket.splice(ind, 1);
					let added = transaction.put(e.target.result);
					this.eventListeners(added, e => {
						this.displayBusketCards();
					});
				});
			}
			this.requestDB('users', 1, requestUpgrade, requestSucces);
			
		} else return;
	}

	initDOM() {
		this.busketList = document.querySelector('.busket__list');
		this.busketTotalPrice = document.querySelector('.busket__total');
		this.busketTotalProducts = document.querySelector('.busket__summ');
	}

	init() {
		this.displayBusketCards();
		document.addEventListener('click', this.deleteHandler);
	}
}

new Busket;