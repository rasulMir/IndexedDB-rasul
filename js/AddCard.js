import Base from "./Base.js";

class AddCard extends Base {
	constructor() {
		super();
		this.initDOM();
		this.initCard();
	}

	initDOM() {
		this.inpTitle = document.querySelector('#inpTitle');
		this.inpImg = document.querySelector('#inpImg');
		this.inpPrice = document.querySelector('#inpPrice');
		this.inpModel = document.querySelector('#inpModel');
		this.inpMemory = document.querySelector('#inpMemory');
		this.btn = document.querySelector('.add-card__btn');
		this.alertSms = document.querySelector('.alert-sms');
	}
	
	btnHandler = () => {
		let card;
		this.alertSms.textContent = '';
		if (this.inpTitle.value && this.inpImg.value 
				&& this.inpPrice.value && this.inpModel.value && this.inpMemory.value) {
			card = {
				title : this.inpTitle.value,
				img : this.inpImg.value, 
				price: this.inpPrice.value, 
				model:	this.inpModel.value, 
				memory: this.inpMemory.value,
			}

			let request = indexedDB.open('busket', 1);
			request.addEventListener('error', (e) =>	console.log(e.target.error, 'Error'));
			request.addEventListener('upgradeneeded', () => {
				console.log('upgraded');
			});
			request.addEventListener('success', (e) => {
				this.addNotes(e.target.result, 'busket', card);
				console.log('added');
			});

		} else {
			this.alertSms.textContent = 'Fill in these fields';
		}
	}

	initCard() {
		this.btn.addEventListener('click', this.btnHandler);
	}
}

new AddCard;