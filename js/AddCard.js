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
		this.alertSms.textContent = '';
		if (this.inpTitle.value && this.inpImg.value 
				&& this.inpPrice.value && this.inpModel.value && this.inpMemory.value) {
			let reqUpgrade = (e) => console.log(e.target.result, 'upgraded');
			let reqSucces = (e) => {
				let res = e.target.result;
				let cards = res.transaction('phoneCards', "readwrite")
							.objectStore('phoneCards');
				let request = cards.getAll();
				this.eventListeners(request, e => {
					let card = {
						id : e.target.result.length + 1,
						title : this.inpTitle.value,
						img : this.inpImg.value, 
						price: this.inpPrice.value, 
						model:	this.inpModel.value, 
						memory: this.inpMemory.value,
					}
					this.addNotes(res, 'phoneCards', card);
				});
			}
			this.requestDB('phoneCards', 1, reqUpgrade, reqSucces);
		} else {
			this.alertSms.textContent = 'Fill in these fields';
		}
	}

	initCard() {
		this.btn.addEventListener('click', this.btnHandler);
	}
}

new AddCard;