var LOAD_NUM = 4;
var watcher;


	new Vue(
		{
			el: "#app",
			data: {
				total: 0,
				products: [],
				cart: [],
				search: "cat",
				lastsearch: "",
				loding: false,
				results: []
			},

			methods: {
				addtoCart: function (product) {
					this.total += product.price;
					var check = false;
					for (var a = 0; a < this.cart.length; a++) {
						if (this.cart[a].id == product.id) {
							this.cart[a].qty++;
							check = true;
						}
					}
					if (!check) {
						this.cart.push(
							{
								id: product.id,
								title: product.title,
								price: product.price,
								qty: 1
							});
					}
				},
				inc: function (item) {
					item.qty++;
					this.total += item.price;
				},
				dec: function (item) {
					item.qty--;
					this.total -= item.price;
					if (item.qty <= 0) {
						var RemovedItem = this.cart.indexOf(item);
						this.cart.splice(RemovedItem, 1);

					}
				},
				onSubmit: function () {
					this.products = [];
					this.results = [];
					this.loading = true;
					var path = "/search?q=".concat(this.search);
					this.$http.get(path)
						.then(function (response) {
							this.results = response.body
							this.lastsearch = this.search;
							this.appenedResults();
							this.loading = false;
						});

				},
				appenedResults: function () {
					if (this.products.length < this.results.length) {
						var toAppend = this.results.slice(
							this.products.length,
							LOAD_NUM + this.products.length
						);
						this.products = this.products.concat(toAppend);
					}
				}
			},


			filters: {
				currency: function (price) {
					return "$".concat(price.toFixed(2));
				}
			},
			created: function () {
				this.onSubmit();
			},
			updated: function () {
				var sensor = document.querySelector("#product-list-bottom")
				watcher = scrollMonitor.create(sensor);
				watcher.enterViewport(this.appenedResults);
			},
			beforeUpdate: function () {
				if (watcher) {
					watcher.destory();
					watcher = null;
				};

			}
		});


