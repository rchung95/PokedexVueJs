// TODO : Refactor code to make it more reusable and clean

/*
	I was learning more about templates. So what it does is it will bind rendered DOM for you. For learning purposes,
	I used the Grid Component example as a guide and made my own template based on it. This template used will be
	<poke-table></poke-table>

	Within this template, it has three props which is data (our pokemon list), columns (our pokColumn list) and filterKey
	(the string you type into the search bar). The data will start out in ascending order, but can switch to descending
	using sortTable() method.
*/

//GLOBAL VARIABLES
var myRadarChart;
var pokenDex;

var naturejson = naturelist;

var stat2 = {
	label: 'Modified Stats',
	data: [ 0, 0, 0, 0, 0, 0],
	backgroundColor: 'rgba(255, 237, 0, 0.5)',
    borderColor: 'rgba(255, 187, 0, 0)',
    // borderWidth: 2,
    pointRadius: 4,
    pointBorderWidth: 1,
    pointBackgroundColor: 'rgba(255, 187, 0, 0.8)',
    pointBorderColor: 'rgba(255, 187, 0, 0.8)',
    pointHoverRadius: 8
};

var pokeTable = {
	template: '#poke-table',
	props: {
		data: Array,
		columns: Array,
		filterKey: String
	},
    
	data: function() {
		var sortOrders = {}
		this.columns.forEach(function(key) {
			sortOrders[key] = 1
		})
		return {
			sortColumn: '',
			sortOrders: sortOrders
		}
	},

	computed: {

		/*
			In filteredPokemon, it will filter out the table based on the search input.
			Compared to the old version, this is more reuseable and cleaner.
		*/

		filteredPokemon: function() {
			var sortKey = this.sortColumn
			var filterKey = this.filterKey;
			var order = this.sortOrders[sortKey] || 1
            var data = this.data
            var filter = "";

			if (filterKey && filterKey.split('?').length === 1) {
                // if not a specific question, use standard filter
				data = data.filter(function(row) {
					return Object.keys(row).some(function() {
						return String(row['nDex']).toLowerCase().indexOf(filterKey) > -1
							|| String(row['name']).toLowerCase().indexOf(filterKey) > -1
							|| String(row['tier']).toLowerCase().indexOf(filterKey) > -1
							|| String(row['type1']).toLowerCase().indexOf(filterKey) > -1
							|| String(row['type2']).toLowerCase().indexOf(filterKey) > -1
					})
				})
			} else if (filterKey) {
                // if it's a question, try to return results based on the question criteria
                // can add more filter variety below, and set the order based on input as well 
                // i.e. strongest or weakest, highest or lowest, etc. Will pull this stat from db.
                let f = filterKey.toLowerCase();
                filter = (() => {
                    // set filter 
                    if (f.includes('fastest') || f.includes('speed')) {
                        return 'spe';
                    } else if (f.includes('strongest') || f.includes('attack') && !f.includes('special')) {
                        return 'atk';
                    } 
                    else if (f.includes('toughest') || f.includes('defense') && !f.includes('special')) {
                        return 'def';
                    } else if (f.includes('healthiest') || f.includes('hp')) {
                        return 'hp';
                    } else if (f.includes('special attack')) {
                        return 'spatk';
                    } else if (f.includes('special defense')) {
                        return 'spdef';
                    }
                })();

                // set order
                if (f.includes('slowest') || f.includes('weakest')
                    || f.includes('lightest') || f.includes('least')
                    || f.includes('worst')) {
                        order = -1;
                } else {
                    // can handle opposite cases-- most, best, greatest, etc
                    order = 1;
                }

                data = data.sort((a, b) => {
                    if (order === -1) {
                        return a[filter] - b[filter];
                    } else {
                        return b[filter] - a[filter];
                    }
                });
            }

			if (sortKey) {
				data = data.slice().sort(function(a, b) {
					a = a[sortKey]
					b = b[sortKey]
					return (a === b ? 0 : a > b ? 1 : -1) * order
				})
			}
			return data

		}
	},

	filters: {

		// capitalize returns the first character in each string capitalized.
		capitalize: function (str) {
    		return str.charAt(0).toUpperCase() + str.slice(1)
    	}
	},

	methods: {
		/*
			classChecker is a function that returns true if the parameter key
			is the string type1 or type2. This is used to add the typeStructure
			class.
		*/

		"classChecker": function(key) {
			return key == 'type1' || key == 'type2'
		},

		"chartMe": function (pokemon, pokemonInfo) {
			// Need to refactor these
			document.getElementById("fff").src = pokemon.image;
			document.getElementById("aaa").value = pokemon.ability1;
			document.getElementById("bbb").value = pokemon.ability2;
			document.getElementById("ccc").value = pokemon.hiddenability;
			console.log(pokemon.ability1);
			document.getElementById("asdfg").classList.add("is-active");
			
			Chart.defaults.global.tooltips.enabled = false;
			Chart.defaults.global.responsive = false;
			Chart.defaults.global.maintainAspectRatio = true;
			var ctx = document.getElementById("myChart").getContext('2d');

			myRadarChart = new Chart(ctx, {
			    type: 'radar',
			    responsive: true,
			    maintainAspectRatio: false,
			    data: {
			    	labels: ["Hp " + pokemonInfo['0'].toString(), "Atk " + pokemonInfo['1'].toString(), "Def " + pokemonInfo['2'].toString(), "Spe " + pokemonInfo['5'].toString(), "Sp.Def " + pokemonInfo['4'].toString(), "Sp.Atk " + pokemonInfo['3'].toString()],
			    	datasets: [{
			    		label: 'Original Stats',
						data: [pokemonInfo[0], pokemonInfo[1], pokemonInfo[2], pokemonInfo[5], pokemonInfo[4], pokemonInfo[3]],
						backgroundColor: 'rgba(5, 98, 191, 0.3)',
					    borderColor: 'rgba(4, 80, 156, 0)',
					    // borderWidth: 2,
					    pointRadius: 4,
					    pointBorderWidth: 2,
					    pointBackgroundColor: 'rgba(0, 63, 127, 0.8)',
					    pointBorderColor: 'rgba(0, 63, 127, 0.8)',
					    pointHoverRadius: 8
			    	}]
			    },
			    options: {
			    	pointDot: false,
					pointLabelFontSize: 20,
			    	title: {
			            display: true,
			            text: pokemon.name,
			            fontSize: 20
			        },
			    	legend: {
			    		display: true
			    	},
			    	animation: {
			            onProgress: function(animation) {
			                myRadarChart.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
			            }
			        },
					scale: {
			              ticks: {
			                beginAtZero: true
			              },
			              pointLabels: {
				            fontSize: 16
				          }
		            }
			    }
			});
		},

		// Need to rewrite it where the nature is a modifier of 1.1, 1.0 or 0.9
		"calcStat": function(base, level, iv, ev, nat) {
			pokenDex = base['orderID'] - 1; // Cannot use nDex id due to duplicates
			var ll = ['atk', 'def', 'sp.atk', 'sp.def', 'spe'];
			var nature = 1;
			var newAtk;
			var newDef;
			var newSpAtk;
			var newSpDef;
			var newSpe;

			var newHp = (Math.floor( ( ( 2 * base['hp'] + iv[0] + Math.floor(ev[0]/4) ) * level )/100 ) + level + 10)
			for (var i=0; i < 5; i++) {
				nature = (nat[0] == ll[i]) ? 1.1 : (nat[1] == ll[i]) ? 0.9 : 1
				if (i == 0) {
					newAtk = Math.floor( ( ( Math.floor( ( 2 * base['atk'] + iv[1] + Math.floor(ev[1]/4) ) * level )/100 ) + 5 ) * nature )
				} else if (i == 1) {
					newDef = Math.floor( ( ( Math.floor( ( 2 * base['def'] + iv[2] + Math.floor(ev[2]/4) ) * level )/100 ) + 5 ) * nature )
				} else if (i == 2) {
					newSpAtk = Math.floor( ( ( Math.floor( ( 2 * base['spatk'] + iv[3] + Math.floor(ev[3]/4) ) * level )/100 ) + 5 ) * nature )
				} else if (i == 3) {
					newSpDef = Math.floor( ( ( Math.floor( ( 2 * base['spdef'] + iv[4] + Math.floor(ev[4]/4) ) * level )/100 ) + 5 ) * nature )
				} else if (i == 4) {
					newSpe = Math.floor( ( ( Math.floor( ( 2 * base['spe'] + iv[5] + Math.floor(ev[5]/4) ) * level )/100 ) + 5 ) * nature )
				}
			}
			return [newHp, newAtk, newDef, newSpAtk, newSpDef, newSpe]
		},

		// sortTable which takes in a parameter called column. This function sorts in ascending or descending order.
		sortTable: function(column) {
			this.sortColumn = column
			this.sortOrders[column] = this.sortOrders[column] * -1
		}
	}
};

Vue.component('poke-table', pokeTable);

var pokedex = new Vue({
	el: '#pokedex',
	data: {
		desiredlevel: 1,
		check: true,
		iv: 0,
		ev: 0,
		searchQuery: '',
		selected: ['atk', 'sp.atk'],
		pokColumns: ['nDex', 'name', 'tier', 'ability1', 'ability2', 'hiddenability', 'type1', 'type2'],
		pokemonList: [],
		options: this.naturejson
	},

	mounted() {
		/*
			mounted() is a function in Vue.js which allows me to call a new instance of pokemonList
			axios is a promised based HTTP client which works well with Vue.js and Node.js
		*/

		axios.get('/pokedexdb')
			.then(response => {
				this.pokemonList = response.data;
			});
	},

	methods: {
		"unChartMe": function() {
			document.getElementById("asdfg").classList.remove("is-active");
			document.getElementById("desiredlevel").value = 1;
			document.getElementById("ivHp").value = 0;
			document.getElementById("ivAtk").value = 0;
			document.getElementById("ivDef").value = 0;
			document.getElementById("ivSpAtk").value = 0;
			document.getElementById("ivSpDef").value = 0;
			document.getElementById("ivSpe").value = 0;
			document.getElementById("evHp").value = 0;
			document.getElementById("evAtk").value = 0;
			document.getElementById("evDef").value = 0;
			document.getElementById("evSpAtk").value = 0;
			document.getElementById("evSpDef").value = 0;
			document.getElementById("evSpe").value = 0;
			myRadarChart.destroy();
		},

		"checkIV": function(iv) {
			var ivList = ["ivHp", "ivAtk", "ivDef", "ivSpAtk", "ivSpDef", "ivSpe"];
			for (i=0; i < iv.length; i++) {
				if (this.iv[i] > 31 || this.iv[i] < 0) {
					document.getElementById(ivList[i]).classList.add("is-danger");
					this.check = false;
				} else {
					document.getElementById(ivList[i]).classList.remove("is-danger");
				}
			}
		},

		"checkEV": function(ev) {
			if (this.ev[0] > 252 || this.ev[1] > 252 || this.ev[2] > 252 || this.ev[3] > 252 || this.ev[4] > 252 || this.ev[5] > 252 || this.ev[0] < 0 || this.ev[1] < 0 || this.ev[2] < 0 || this.ev[3] < 0 || this.ev[4] < 0 || this.ev[5] < 0 || (this.ev[0] + this.ev[1] + this.ev[2] + this.ev[3] + this.ev[4] + this.ev[5]) > 510 || (this.ev[0] + this.ev[1] + this.ev[2] + this.ev[3] + this.ev[4] + this.ev[5]) < 0) {
				document.getElementById("evHp").classList.add("is-danger");
				document.getElementById("evAtk").classList.add("is-danger");
				document.getElementById("evDef").classList.add("is-danger");
				document.getElementById("evSpAtk").classList.add("is-danger");
				document.getElementById("evSpDef").classList.add("is-danger");
				document.getElementById("evSpe").classList.add("is-danger");
				this.check = false;

			} else {
				document.getElementById("evHp").classList.remove("is-danger");
				document.getElementById("evAtk").classList.remove("is-danger");
				document.getElementById("evDef").classList.remove("is-danger");
				document.getElementById("evSpAtk").classList.remove("is-danger");
				document.getElementById("evSpDef").classList.remove("is-danger");
				document.getElementById("evSpe").classList.remove("is-danger");
			}
		},

		// Need to refactor this code and its helper function better
		"addData": function(pokemon, level) {
			this.check = true;
			this.desiredlevel = parseInt(document.getElementById("desiredlevel").value);
			this.iv = [parseInt(document.getElementById("ivHp").value), parseInt(document.getElementById("ivAtk").value), parseInt(document.getElementById("ivDef").value), parseInt(document.getElementById("ivSpAtk").value), parseInt(document.getElementById("ivSpDef").value), parseInt(document.getElementById("ivSpe").value)];
			this.ev = [parseInt(document.getElementById("evHp").value), parseInt(document.getElementById("evAtk").value), parseInt(document.getElementById("evDef").value), parseInt(document.getElementById("evSpAtk").value), parseInt(document.getElementById("evSpDef").value), parseInt(document.getElementById("evSpe").value)];
			
			if (this.desiredlevel > 100 || this.desiredlevel < 1) {
				document.getElementById("desiredlevel").classList.add("is-danger");
				this.check = (this.check == true) ? false : true;
			} else {
				document.getElementById("desiredlevel").classList.remove("is-danger");
			}

			this.checkEV(this.ev);
			this.checkIV(this.iv);

			if (this.check) {
				var base2 = pokeTable.methods.calcStat(pokemon, this.desiredlevel, this.iv, this.ev, this.selected);
				var base = pokeTable.methods.calcStat(pokemon, this.desiredlevel, [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], this.selected);

				myRadarChart.data.datasets[0].data = base;

				if (base[0] != base2[0] | base[1] != base2[1] | base[2] != base2[2] | base[3] != base2[3] | base[4] != base2[4] | base[5] != base2[5]) {
					if (myRadarChart.data.datasets.length < 2) {
						myRadarChart.data.datasets.push(stat2);
					}
					myRadarChart.data.datasets[1].data = [base2[0], base2[1], base2[2], base2[5], base2[4], base2[3]];

					myRadarChart.data.datasets[1].hidden = false;
					myRadarChart.data.datasets[1].fill = '-1';
					myRadarChart.data.labels = ["Hp " + base['0'] + " | " + base2['0'], "Atk " + base['1']+ " | " + base2['1'], "Def " + base['2'] + " | " + base2['2'], "Spe " + base['5'] + " | " + base2['5'], "Sp.Def " + base['4'] + " | " + base2['4'], "Sp.Atk " + base['3'] + " | " + base2['3']];
				} else {
					myRadarChart.data.labels = ["Hp " + base['0'], "Atk " + base['1'], "Def " + base['2'], "Spe " + base['5'], "Sp.Def " + base['4'], "Sp.Atk " + base['3']];
				}
				myRadarChart.update();

			}
		}

	}
})