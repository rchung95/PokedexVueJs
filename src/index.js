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

var natureJSON = naturelist;

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
                let filteredSearch = filterKey.toLowerCase();
                filter = (() => {
                    // set filter 
                    if (filteredSearch.includes('fastest') || filteredSearch.includes('speed')) {
                        return 'spe';
                    } else if (filteredSearch.includes('strongest') || filteredSearch.includes('attack') && !filteredSearch.includes('special')) {
                        return 'atk';
                    } 
                    else if (filteredSearch.includes('toughest') || filteredSearch.includes('defense') && !filteredSearch.includes('special')) {
                        return 'def';
                    } else if (filteredSearch.includes('healthiest') || filteredSearch.includes('hp')) {
                        return 'hp';
                    } else if (filteredSearch.includes('special attack')) {
                        return 'spatk';
                    } else if (filteredSearch.includes('special defense')) {
                        return 'spdef';
                    }
                })();

                // set order
                if (filteredSearch.includes('slowest') || filteredSearch.includes('weakest')
                    || filteredSearch.includes('lightest') || filteredSearch.includes('least')
                    || filteredSearch.includes('worst')) {
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
			var statNames = ['hp', 'atk', 'def', 'sp.atk', 'sp.def', 'spe'];
			var nature = 1;
			var newAtk;
			var newDef;
			var newSpAtk;
			var newSpDef;
			var newSpe;

			for (var i=0; i < 6; i++) {
				if (isNaN(iv[i])) {
					iv[i] = 0;
				}

				if (isNaN(ev[i])) {
					ev[i] = 0;
				}
				nature = (nat[0] == statNames[i]) ? 1.1 : (nat[1] == statNames[i]) ? 0.9 : 1
				if (i == 1) {
					newAtk = statFormula(base, iv, ev, level, 'atk', i, nature)
				} else if (i == 2) {
					newDef = statFormula(base, iv, ev, level, 'def', i, nature)
				} else if (i == 3) {
					newSpAtk = statFormula(base, iv, ev, level, 'spatk', i , nature)
				} else if (i == 4) {
					newSpDef = statFormula(base, iv, ev, level, 'spdef', i, nature)
				} else if (i == 5) {
					newSpe = statFormula(base, iv, ev, level, 'spe', i, nature);
				}
			}
			var newHp = (Math.floor( ( ( 2 * base['hp'] + iv[0] + Math.floor(ev[0]/4) ) * level )/100 ) + level + 10)
			return [newHp, newAtk, newDef, newSpAtk, newSpDef, newSpe];
		},

		// sortTable which takes in a parameter called column. This function sorts in ascending or descending order.
		sortTable: function(column) {
			this.sortColumn = column
			this.sortOrders[column] = this.sortOrders[column] * -1
		}
	}
};

function statFormula(base, iv, ev, level, type, index, nature) {
	return Math.floor( ( ( Math.floor( ( 2 * base[type] + iv[index] + Math.floor(ev[index]/4) ) * level )/100 ) + 5 ) * nature )
}

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
		options: this.natureJSON
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
			if (this.ev[0] > 252 || this.ev[0] < 0
				|| this.ev[1] > 252 || this.ev[1] < 0
				|| this.ev[2] > 252 || this.ev[2] < 0
				|| this.ev[3] > 252 || this.ev[3] < 0
				|| this.ev[4] > 252 || this.ev[4] < 0
				|| this.ev[5] > 252 || this.ev[5] < 0) {
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
		"addData": function(pokemon) {
			this.check = true;
			this.desiredlevel = parseInt(document.getElementById("desiredlevel").value);
			this.iv = [parseInt(document.getElementById("ivHp").value), parseInt(document.getElementById("ivAtk").value), parseInt(document.getElementById("ivDef").value), parseInt(document.getElementById("ivSpAtk").value), parseInt(document.getElementById("ivSpDef").value), parseInt(document.getElementById("ivSpe").value)];
			this.ev = [parseInt(document.getElementById("evHp").value), parseInt(document.getElementById("evAtk").value), parseInt(document.getElementById("evDef").value), parseInt(document.getElementById("evSpAtk").value), parseInt(document.getElementById("evSpDef").value), parseInt(document.getElementById("evSpe").value)];
			if (this.desiredlevel > 100 || this.desiredlevel < 1) {
				document.getElementById("desiredlevel").classList.add("is-danger");
				this.check = !this.check;
			} else {
				document.getElementById("desiredlevel").classList.remove("is-danger");
			}

			this.checkEV(this.ev);
			this.checkIV(this.iv);

			if (this.check) {
				// Stats without modifications
				var base = pokeTable.methods.calcStat(pokemon, this.desiredlevel, [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], this.selected);	
				var baseHp = base[0];
				var baseAtk = base[1];
				var baseDef = base[2];
				var baseSpAtk = base[3];
				var baseSpDef = base[4];
				var baseSpe = base[5];

				// Stats with modfications
				var modifiedStat = pokeTable.methods.calcStat(pokemon, this.desiredlevel, this.iv, this.ev, this.selected);
				var modifedStatHp = modifiedStat[0];
				var modifedStatAtk = modifiedStat[1];
				var modifedStatDef = modifiedStat[2];
				var modifedStatSpAtk = modifiedStat[3];
				var modifedStatSpDef = modifiedStat[4];
				var modifedStatSpe = modifiedStat[5];

				myRadarChart.data.datasets[0].data = base;

				if (baseHp != modifedStatHp
					| baseAtk != modifedStatAtk
					| baseDef != modifedStatDef
					| baseSpAtk != modifedStatSpAtk
					| baseSpDef != modifedStatSpDef
					| baseSpe != modifedStatSpe) {
					if (myRadarChart.data.datasets.length < 2) {
						myRadarChart.data.datasets.push(stat2);
					}
					myRadarChart.data.datasets[1].data = [modifedStatHp, modifedStatAtk, modifedStatDef, modifedStatSpe, modifedStatSpDef, modifedStatSpAtk];

					myRadarChart.data.datasets[1].hidden = false;
					myRadarChart.data.datasets[1].fill = '-1';
					myRadarChart.data.labels = ["Hp " + baseHp + " | " + modifedStatHp, "Atk " + baseAtk+ " | " + modifedStatAtk, "Def " + baseDef + " | " + modifedStatDef, "Spe " + baseSpe + " | " + modifedStatSpe, "Sp.Def " + baseSpDef + " | " + modifedStatSpDef, "Sp.Atk " + baseSpAtk + " | " + modifedStatSpAtk];
				} else {
					myRadarChart.data.labels = ["Hp " + baseHp, "Atk " + baseAtk, "Def " + baseDef, "Spe " + baseSpe, "Sp.Def " + baseSpDef, "Sp.Atk " + baseSpAtk];
				}
				myRadarChart.update();

			}
		}

	}
})