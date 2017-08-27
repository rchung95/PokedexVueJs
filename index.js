// In the pokedex variable, what I did was created the data I will be using for the table.
// In the future, I will be adding all 151 Pokemon from the first generation and soon Pokemon
// of every generation! I can see myself using a JSON potentially found on the web otherwise
// I will create my own.

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
			var filterKey = this.filterKey && this.filterKey.toLowerCase()
			var order = this.sortOrders[sortKey] || 1
			var data = this.data

			if (filterKey) {
				data = data.filter(function(row) {
					return Object.keys(row).some(function() {
						return String(row['nDex']).toLowerCase().indexOf(filterKey) > -1
							|| String(row['name']).toLowerCase().indexOf(filterKey) > -1
							|| String(row['type1']).toLowerCase().indexOf(filterKey) > -1
							|| String(row['type2']).toLowerCase().indexOf(filterKey) > -1
					})
				})
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
			document.getElementById("fff").src = pokemon.image;
			document.getElementById("asdfg").classList.add("is-active");
			Chart.defaults.global.tooltips.enabled = false;
			Chart.defaults.global.responsive = true;
			Chart.defaults.global.maintainAspectRatio = false;
			var ctx = document.getElementById("myChart").getContext('2d');

			myRadarChart = new Chart(ctx, {
			    type: 'radar',
			    data: {
			    	labels: ["Hit Point " + pokemonInfo['0'].toString(), "Attack " + pokemonInfo['1'].toString(), "Defense " + pokemonInfo['2'].toString(), "Speed " + pokemonInfo['5'].toString(), "Special Defense " + pokemonInfo['4'].toString(), "Special Attack " + pokemonInfo['3'].toString()],
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
		"calcStat": function(base, level, iv, ev) {
			pokenDex = base['nDex'] - 1;
			var nature = 1;
			var newHp = (Math.floor( ( ( 2 * base['hp'] + iv[0] + Math.floor(ev[0]/4) ) * level )/100 ) + level + 10)
			var newAtk = Math.floor( ( ( Math.floor( ( 2 * base['atk'] + iv[1] + Math.floor(ev[1]/4) ) * level )/100 ) + 5 ) * nature )
			var newDef = Math.floor( ( ( Math.floor( ( 2 * base['def'] + iv[2] + Math.floor(ev[2]/4) ) * level )/100 ) + 5 ) * nature )
			var newSpAtk = Math.floor( ( ( Math.floor( ( 2 * base['spatk'] + iv[3] + Math.floor(ev[3]/4) ) * level )/100 ) + 5 ) * nature )
			var newSpDef = Math.floor( ( ( Math.floor( ( 2 * base['spdef'] + iv[4] + Math.floor(ev[4]/4) ) * level )/100 ) + 5 ) * nature )
			var newSpe = Math.floor( ( ( Math.floor( ( 2 * base['spe'] + iv[5] + Math.floor(ev[5]/4) ) * level )/100 ) + 5 ) * nature )
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
		pokColumns: ['nDex', 'name', 'type1', 'type2'],
		pokemonList: [
			{ "nDex": 1, "name": "Bulbasaur", "type1": "Grass", "type2": "Poison", "hp": 45, "atk":  49, "def": 49, "spatk":  65, "spdef":  65, "spe": 45, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png" },
			{ "nDex": 2, "name": "Ivysaur", "type1": "Grass", "type2": "Poison", "hp": 60, "atk":  62, "def": 63, "spatk":  80, "spdef":  80, "spe": 60, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png" },
			{ "nDex": 3, "name": "Venusaur", "type1": "Grass", "type2": "Poison", "hp": 80, "atk":  82, "def": 83, "spatk":  100, "spdef":  100, "spe": 80, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png" },
			{ "nDex": 4, "name": "Charmander", "type1": "Fire", "type2": "", "hp": 39, "atk":  52, "def": 43, "spatk":  60, "spdef":  50, "spe": 65, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png" },
			{ "nDex": 5, "name": "Charmeleon", "type1": "Fire", "type2": "", "hp": 58, "atk":  64, "def": 58, "spatk":  80, "spdef":  65, "spe": 80, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/005.png" },
			{ "nDex": 6, "name": "Charizard", "type1": "Fire", "type2": "Flying", "hp": 78, "atk":  84, "def": 78, "spatk":  109, "spdef":  85, "spe": 100, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png" },
			{ "nDex": 7, "name": "Squirtle", "type1": "Water", "type2": "", "hp": 44, "atk":  48, "def": 65, "spatk":  50, "spdef":  64, "spe": 43, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png" },
			{ "nDex": 8, "name": "Wartortle", "type1": "Water", "type2": "", "hp": 59, "atk":  63, "def": 80, "spatk":  65, "spdef":  80, "spe": 58, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/008.png" },
			{ "nDex": 9, "name": "Blastoise", "type1": "Water", "type2": "", "hp": 79, "atk":  83, "def": 100, "spatk":  85, "spdef":  105, "spe": 78, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png" },
			{ "nDex": 10, "name": "Caterpie", "type1": "Bug", "type2": "", "hp": 45, "atk":  30, "def": 35, "spatk":  20, "spdef":  20, "spe": 45, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/010.png" },
			{ "nDex": 11, "name": "Metapod", "type1": "Bug", "type2": "", "hp": 50, "atk":  20, "def": 55, "spatk":  25, "spdef":  25, "spe": 30, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/011.png" },
			{ "nDex": 12, "name": "Butterfree", "type1": "Bug", "type2": "Flying", "hp": 60, "atk":  45, "def": 50, "spatk":  90, "spdef":  80, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/012.png" },
			{ "nDex": 13, "name": "Weedle", "type1": "Bug", "type2": "Poison", "hp": 40, "atk":  35, "def": 30, "spatk":  20, "spdef":  20, "spe": 50, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/013.png" },
			{ "nDex": 14, "name": "Kakuna", "type1": "Bug", "type2": "Poison", "hp": 45, "atk":  25, "def": 50, "spatk":  25, "spdef":  25, "spe": 35, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/014.png" },
			{ "nDex": 15, "name": "Beedrill", "type1": "Bug", "type2": "Poison", "hp": 65, "atk":  90, "def": 40, "spatk":  45, "spdef":  80, "spe": 75, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/015.png" },
			{ "nDex": 16, "name": "Pidgey", "type1": "Normal", "type2": "Flying", "hp": 40, "atk":  45, "def": 40, "spatk":  35, "spdef":  35, "spe": 56, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/016.png" },
			{ "nDex": 17, "name": "Pidgeotto", "type1": "Normal", "type2": "Flying", "hp": 63, "atk":  60, "def": 55, "spatk":  50, "spdef":  50, "spe": 71, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/017.png" },
			{ "nDex": 18, "name": "Pidgeot", "type1": "Normal", "type2": "Flying", "hp": 83, "atk":  80, "def": 75, "spatk":  70, "spdef":  70, "spe": 101, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/018.png" },
			{ "nDex": 19, "name": "Rattata", "type1": "Normal", "type2": "", "hp": 30, "atk":  56, "def": 35, "spatk":  25, "spdef":  35, "spe": 72, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/019.png" },
			{ "nDex": 20, "name": "Raticate", "type1": "Normal", "type2": "", "hp": 55, "atk":  81, "def": 60, "spatk":  50, "spdef":  70, "spe": 97, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/020.png" },
			{ "nDex": 21, "name": "Spearow", "type1": "Normal", "type2": "Flying", "hp": 40, "atk":  60, "def": 30, "spatk":  31, "spdef":  31, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/021.png" },
			{ "nDex": 22, "name": "Fearow", "type1": "Normal", "type2": "Flying", "hp": 65, "atk":  90, "def": 65, "spatk":  61, "spdef":  61, "spe": 100, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/022.png" },
			{ "nDex": 23, "name": "Ekans", "type1": "Poison", "type2": "", "hp": 35, "atk":  60, "def": 44, "spatk":  40, "spdef":  54, "spe": 55, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/023.png" },
			{ "nDex": 24, "name": "Arbok", "type1": "Poison", "type2": "", "hp": 60, "atk":  95, "def": 69, "spatk":  65, "spdef":  79, "spe": 80, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/024.png" },
			{ "nDex": 25, "name": "Pikachu", "type1": "Electric", "type2": "", "hp": 35, "atk":  55, "def": 40, "spatk":  50, "spdef":  50, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png" },
			{ "nDex": 26, "name": "Raichu", "type1": "Electric", "type2": "", "hp": 60, "atk":  90, "def": 55, "spatk":  90, "spdef":  80, "spe": 110, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/026.png" },
			{ "nDex": 27, "name": "Sandshrew", "type1": "Ground", "type2": "", "hp": 50, "atk":  75, "def": 85, "spatk":  20, "spdef":  30, "spe": 40, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/027.png" },
			{ "nDex": 28, "name": "Sandslash", "type1": "Ground", "type2": "", "hp": 75, "atk":  100, "def": 110, "spatk":  45, "spdef":  55, "spe": 65, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/028.png" },
			{ "nDex": 29, "name": "Nidorana F", "type1": "Poison", "type2": "", "hp": 55, "atk":  47, "def": 52, "spatk":  40, "spdef":  40, "spe": 41, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/029.png" },
			{ "nDex": 30, "name": "Nidorina", "type1": "Poison", "type2": "", "hp": 70, "atk":  62, "def": 67, "spatk":  55, "spdef":  55, "spe": 56, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/030.png" },
			{ "nDex": 31, "name": "Nidoqueen", "type1": "Poison", "type2": "Ground", "hp": 90, "atk":  92, "def": 87, "spatk":  75, "spdef":  85, "spe": 76, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/031.png" },
			{ "nDex": 32, "name": "Nidorana M", "type1": "Poison", "type2": "", "hp": 46, "atk":  57, "def": 40, "spatk":  40, "spdef":  40, "spe": 50, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/032.png" },
			{ "nDex": 33, "name": "Nidorino", "type1": "Poison", "type2": "", "hp": 61, "atk":  72, "def": 57, "spatk":  55, "spdef":  55, "spe": 65, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/033.png" },
			{ "nDex": 34, "name": "Nidoking", "type1": "Poison", "type2": "Ground", "hp": 81, "atk":  102, "def": 77, "spatk":  85, "spdef":  75, "spe": 85, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/034.png" },
			{ "nDex": 35, "name": "Clefairy", "type1": "Fairy", "type2": "", "hp": 70, "atk":  45, "def": 48, "spatk":  60, "spdef":  65, "spe": 35, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/035.png" },
			{ "nDex": 36, "name": "Clefable", "type1": "Fairy", "type2": "", "hp": 95, "atk":  70, "def": 73, "spatk":  95, "spdef":  90, "spe": 60, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/036.png" },
			{ "nDex": 37, "name": "Vulpix", "type1": "Fire", "type2": "", "hp": 38, "atk":  41, "def": 40, "spatk":  50, "spdef":  65, "spe": 65, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/037.png" },
			{ "nDex": 38, "name": "Ninetales", "type1": "Fire", "type2": "", "hp": 73, "atk":  76, "def": 75, "spatk":  81, "spdef":  100, "spe": 100, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/038.png" },
			{ "nDex": 39, "name": "Jigglypuff", "type1": "Normal", "type2": "Fairy", "hp": 115, "atk":  45, "def": 20, "spatk":  45, "spdef":  25, "spe": 20, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/039.png" },
			{ "nDex": 40, "name": "Wigglytuff", "type1": "Normal", "type2": "Fairy", "hp": 140, "atk":  70, "def": 45, "spatk":  85, "spdef":  50, "spe": 45, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/040.png" },
			{ "nDex": 41, "name": "Zubat", "type1": "Poison", "type2": "Flying", "hp": 40, "atk":  45, "def": 35, "spatk":  30, "spdef":  40, "spe": 55, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/041.png" },
			{ "nDex": 42, "name": "Golbat", "type1": "Poison", "type2": "Flying", "hp": 75, "atk":  80, "def": 70, "spatk":  65, "spdef":  75, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/042.png" },
			{ "nDex": 43, "name": "Oddish", "type1": "Grass", "type2": "Poison", "hp": 45, "atk":  50, "def": 55, "spatk":  75, "spdef":  65, "spe": 30, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/043.png" },
			{ "nDex": 44, "name": "Gloom", "type1": "Grass", "type2": "Poison", "hp": 60, "atk":  65, "def": 70, "spatk":  85, "spdef":  75, "spe": 40, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/044.png" },
			{ "nDex": 45, "name": "Vileplume", "type1": "Grass", "type2": "Poison", "hp": 75, "atk":  80, "def": 85, "spatk":  110, "spdef":  90, "spe": 50, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/045.png" },
			{ "nDex": 46, "name": "Paras", "type1": "Bug", "type2": "Grass", "hp": 35, "atk":  70, "def": 55, "spatk":  45, "spdef":  55, "spe": 25, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/046.png" },
			{ "nDex": 47, "name": "Parasect", "type1": "Bug", "type2": "Grass", "hp": 60, "atk":  95, "def": 80, "spatk":  60, "spdef":  80, "spe": 30, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/047.png" },
			{ "nDex": 48, "name": "Venonat", "type1": "Bug", "type2": "Poison", "hp": 60, "atk":  55, "def": 50, "spatk":  40, "spdef":  55, "spe": 45, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/048.png" },
			{ "nDex": 49, "name": "Venomoth", "type1": "Bug", "type2": "Poison", "hp": 70, "atk":  65, "def": 60, "spatk":  90, "spdef":  75, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/049.png" },
			{ "nDex": 50, "name": "Diglett", "type1": "Ground", "type2": "", "hp": 10, "atk":  55, "def": 25, "spatk":  35, "spdef":  45, "spe": 95, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/050.png" },
			{ "nDex": 51, "name": "Dugtrio", "type1": "Ground", "type2": "", "hp": 35, "atk":  100, "def": 50, "spatk":  50, "spdef":  70, "spe": 120, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/051.png" },
			{ "nDex": 52, "name": "Meowth", "type1": "Normal", "type2": "", "hp": 40, "atk":  45, "def": 35, "spatk":  40, "spdef":  40, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/052.png" },
			{ "nDex": 53, "name": "Persian", "type1": "Normal", "type2": "", "hp": 65, "atk":  70, "def": 60, "spatk":  65, "spdef":  65, "spe": 115, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/053.png" },
			{ "nDex": 54, "name": "Psyduck", "type1": "Water", "type2": "", "hp": 50, "atk":  52, "def": 48, "spatk":  65, "spdef":  50, "spe": 55, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/054.png" },
			{ "nDex": 55, "name": "Golduck", "type1": "Water", "type2": "", "hp": 80, "atk":  82, "def": 78, "spatk":  95, "spdef":  80, "spe": 85, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/055.png" },
			{ "nDex": 56, "name": "Mankey", "type1": "Fighting", "type2": "", "hp": 40, "atk":  80, "def": 35, "spatk":  35, "spdef":  45, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/056.png" },
			{ "nDex": 57, "name": "Primeape", "type1": "Fighting", "type2": "", "hp": 65, "atk":  105, "def": 60, "spatk":  60, "spdef":  70, "spe": 95, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/057.png" },
			{ "nDex": 58, "name": "Growlithe", "type1": "Fire", "type2": "", "hp": 55, "atk":  70, "def": 45, "spatk":  70, "spdef":  50, "spe": 60, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/058.png" },
			{ "nDex": 59, "name": "Arcanine", "type1": "Fire", "type2": "", "hp": 90, "atk":  110, "def": 80, "spatk":  100, "spdef":  80, "spe": 95, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/059.png" },
			{ "nDex": 60, "name": "Poliwag", "type1": "Water", "type2": "", "hp": 40, "atk":  50, "def": 40, "spatk":  40, "spdef":  40, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/060.png" },
			{ "nDex": 61, "name": "Poliwhirl", "type1": "Water", "type2": "", "hp": 65, "atk":  65, "def": 65, "spatk":  50, "spdef":  50, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/061.png" },
			{ "nDex": 62, "name": "Poliwrath", "type1": "Water", "type2": "Fighting", "hp": 90, "atk":  95, "def": 95, "spatk":  70, "spdef":  90, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/062.png" },
			{ "nDex": 63, "name": "Abra", "type1": "Psychic", "type2": "", "hp": 25, "atk":  20, "def": 15, "spatk":  105, "spdef":  55, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/063.png" },
			{ "nDex": 64, "name": "Kadabra", "type1": "Psychic", "type2": "", "hp": 40, "atk":  35, "def": 30, "spatk":  120, "spdef":  70, "spe": 105, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/064.png" },
			{ "nDex": 65, "name": "Alakazam", "type1": "Psychic", "type2": "", "hp": 55, "atk":  50, "def": 45, "spatk":  135, "spdef":  95, "spe": 120, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/065.png" },
			{ "nDex": 66, "name": "Machop", "type1": "Fighting", "type2": "", "hp": 70, "atk":  80, "def": 50, "spatk":  35, "spdef":  35, "spe": 35, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/066.png" },
			{ "nDex": 67, "name": "Machoke", "type1": "Fighting", "type2": "", "hp": 80, "atk":  100, "def": 70, "spatk":  50, "spdef":  60, "spe": 45, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/067.png" },
			{ "nDex": 68, "name": "Machamp", "type1": "Fighting", "type2": "", "hp": 90, "atk":  130, "def": 80, "spatk":  65, "spdef":  85, "spe": 55, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/068.png" },
			{ "nDex": 69, "name": "Bellsprout", "type1": "Grass", "type2": "Poison", "hp": 50, "atk":  75, "def": 35, "spatk":  70, "spdef":  30, "spe": 40, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/069.png" },
			{ "nDex": 70, "name": "Weepinbell", "type1": "Grass", "type2": "Poison", "hp": 65, "atk":  90, "def": 50, "spatk":  85, "spdef":  45, "spe": 55, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/070.png" },
			{ "nDex": 71, "name": "Victreebel", "type1": "Grass", "type2": "Poison", "hp": 80, "atk":  105, "def": 65, "spatk":  100, "spdef":  70, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/071.png" },
			{ "nDex": 72, "name": "Tentacool", "type1": "Water", "type2": "Poison", "hp": 40, "atk":  40, "def": 35, "spatk":  50, "spdef":  100, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/072.png" },
			{ "nDex": 73, "name": "Tentacruel", "type1": "Water", "type2": "Poison", "hp": 80, "atk":  70, "def": 65, "spatk":  80, "spdef":  120, "spe": 100, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/073.png" },
			{ "nDex": 74, "name": "Geodude", "type1": "Rock", "type2": "Ground", "hp": 40, "atk":  80, "def": 100, "spatk":  30, "spdef":  30, "spe": 20, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/074.png" },
			{ "nDex": 75, "name": "Graveler", "type1": "Rock", "type2": "Ground", "hp": 55, "atk":  95, "def": 115, "spatk":  45, "spdef":  45, "spe": 35, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/075.png" },
			{ "nDex": 76, "name": "Golem", "type1": "Rock", "type2": "Ground", "hp": 80, "atk":  120, "def": 130, "spatk":  55, "spdef":  65, "spe": 45, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/076.png" },
			{ "nDex": 77, "name": "Ponyta", "type1": "Fire", "type2": "", "hp": 50, "atk":  85, "def": 55, "spatk":  65, "spdef":  65, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/077.png" },
			{ "nDex": 78, "name": "Rapidash", "type1": "Fire", "type2": "", "hp": 65, "atk":  100, "def": 70, "spatk":  80, "spdef":  80, "spe": 105, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/078.png" },
			{ "nDex": 79, "name": "Slowpoke", "type1": "Water", "type2": "Psychic", "hp": 90, "atk":  65, "def": 65, "spatk":  40, "spdef":  40, "spe": 15, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/079.png" },
			{ "nDex": 80, "name": "Slowbro", "type1": "Water", "type2": "Psychic", "hp": 95, "atk":  75, "def": 110, "spatk":  100, "spdef":  80, "spe": 30, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/080.png" },
			{ "nDex": 81, "name": "Magnemite", "type1": "Electric", "type2": "Steel", "hp": 25, "atk":  35, "def": 70, "spatk":  95, "spdef":  55, "spe": 45, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/081.png" },
			{ "nDex": 82, "name": "Magneton", "type1": "Electric", "type2": "Steel", "hp": 50, "atk":  60, "def": 95, "spatk":  120, "spdef":  70, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/082.png" },
			{ "nDex": 83, "name": "Farfetch'd", "type1": "Normal", "type2": "Flying", "hp": 52, "atk":  90, "def": 55, "spatk":  58, "spdef":  62, "spe": 60, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/083.png" },
			{ "nDex": 84, "name": "Doduo", "type1": "Normal", "type2": "Flying", "hp": 35, "atk":  85, "def": 45, "spatk":  35, "spdef":  35, "spe": 75, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/084.png" },
			{ "nDex": 85, "name": "Dodrio", "type1": "Normal", "type2": "Flying", "hp": 60, "atk":  110, "def": 70, "spatk":  60, "spdef":  60, "spe": 110, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/085.png" },
			{ "nDex": 86, "name": "Seel", "type1": "Water", "type2": "", "hp": 65, "atk":  45, "def": 55, "spatk":  45, "spdef":  70, "spe": 45, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/086.png" },
			{ "nDex": 87, "name": "Dewgong", "type1": "Water", "type2": "Ice", "hp": 90, "atk":  70, "def": 80, "spatk":  70, "spdef":  95, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/087.png" },
			{ "nDex": 88, "name": "Grimer", "type1": "Poison", "type2": "", "hp": 80, "atk":  80, "def": 50, "spatk":  40, "spdef":  50, "spe": 25, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/088.png" },
			{ "nDex": 89, "name": "Muk", "type1": "Poison", "type2": "", "hp": 105, "atk":  105, "def": 75, "spatk":  65, "spdef":  100, "spe": 50, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/089.png" },
			{ "nDex": 90, "name": "Shellder", "type1": "Water", "type2": "", "hp": 30, "atk":  65, "def": 100, "spatk":  45, "spdef":  25, "spe": 40, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/090.png" },
			{ "nDex": 91, "name": "Cloyster", "type1": "Water", "type2": "Ice", "hp": 50, "atk":  95, "def": 180, "spatk":  85, "spdef":  45, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/091.png" },
			{ "nDex": 92, "name": "Gastly", "type1": "Ghost", "type2": "Poison", "hp": 30, "atk":  35, "def": 30, "spatk":  100, "spdef":  35, "spe": 80, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/092.png" },
			{ "nDex": 93, "name": "Haunter", "type1": "Ghost", "type2": "Poison", "hp": 45, "atk":  50, "def": 45, "spatk":  115, "spdef":  55, "spe": 95, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/093.png" },
			{ "nDex": 94, "name": "Gengar", "type1": "Ghost", "type2": "Poison", "hp": 60, "atk":  65, "def": 60, "spatk":  130, "spdef":  75, "spe": 110, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png" },
			{ "nDex": 95, "name": "Onix", "type1": "Rock", "type2": "Ground", "hp": 35, "atk":  45, "def": 160, "spatk":  30, "spdef":  45, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/095.png" },
			{ "nDex": 96, "name": "Drowzee", "type1": "Psychic", "type2": "", "hp": 60, "atk":  48, "def": 45, "spatk":  43, "spdef":  90, "spe": 42, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/096.png" },
			{ "nDex": 97, "name": "Hypno", "type1": "Psychic", "type2": "", "hp": 85, "atk":  73, "def": 70, "spatk":  73, "spdef":  115, "spe": 67, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/097.png" },
			{ "nDex": 98, "name": "Krabby", "type1": "Water", "type2": "", "hp": 30, "atk":  105, "def": 90, "spatk":  25, "spdef":  25, "spe": 50, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/098.png" },
			{ "nDex": 99, "name": "Kingler", "type1": "Water", "type2": "", "hp": 55, "atk":  130, "def": 115, "spatk":  50, "spdef":  50, "spe": 75, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/099.png" },
			{ "nDex": 100, "name": "Voltorb", "type1": "Electric", "type2": "", "hp": 40, "atk":  30, "def": 50, "spatk":  55, "spdef":  55, "spe": 100, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/100.png" },
			{ "nDex": 101, "name": "Electrode", "type1": "Electric", "type2": "", "hp": 60, "atk":  50, "def": 70, "spatk":  80, "spdef":  80, "spe": 150, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/101.png" },
			{ "nDex": 102, "name": "Exeggcute", "type1": "Grass", "type2": "Psychic", "hp": 60, "atk":  40, "def": 80, "spatk":  60, "spdef":  45, "spe": 40, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/102.png" },
			{ "nDex": 103, "name": "Exeggutor", "type1": "Grass", "type2": "Psychic", "hp": 95, "atk":  95, "def": 85, "spatk":  125, "spdef":  75, "spe": 55, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/103.png" },
			{ "nDex": 104, "name": "Cubone", "type1": "Ground", "type2": "", "hp": 50, "atk":  50, "def": 95, "spatk":  40, "spdef":  50, "spe": 35, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/104.png" },
			{ "nDex": 105, "name": "Marowak", "type1": "Ground", "type2": "", "hp": 60, "atk":  80, "def": 110, "spatk":  50, "spdef":  80, "spe": 45, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/105.png" },
			{ "nDex": 106, "name": "Hitmonlee", "type1": "Fighting", "type2": "", "hp": 50, "atk":  120, "def": 53, "spatk":  35, "spdef":  110, "spe": 87, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/106.png" },
			{ "nDex": 107, "name": "Hitmonchan", "type1": "Fighting", "type2": "", "hp": 50, "atk":  105, "def": 79, "spatk":  35, "spdef":  110, "spe": 76, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/107.png" },
			{ "nDex": 108, "name": "Lickitung", "type1": "Normal", "type2": "", "hp": 90, "atk":  55, "def": 75, "spatk":  60, "spdef":  75, "spe": 30, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/108.png" },
			{ "nDex": 109, "name": "Koffing", "type1": "Poison", "type2": "", "hp": 40, "atk":  65, "def": 95, "spatk":  60, "spdef":  45, "spe": 35, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/109.png" },
			{ "nDex": 110, "name": "Weezing", "type1": "Poison", "type2": "", "hp": 65, "atk":  90, "def": 120, "spatk":  85, "spdef":  70, "spe": 60, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/110.png" },
			{ "nDex": 111, "name": "Rhyhorn", "type1": "Ground", "type2": "Rock", "hp": 80, "atk":  85, "def": 95, "spatk":  30, "spdef":  30, "spe": 25, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/111.png" },
			{ "nDex": 112, "name": "Rhydon", "type1": "Ground", "type2": "Rock", "hp": 105, "atk":  130, "def": 120, "spatk":  45, "spdef":  45, "spe": 40, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/112.png" },
			{ "nDex": 113, "name": "Chansey", "type1": "Normal", "type2": "", "hp": 250, "atk":  5, "def": 5, "spatk":  35, "spdef":  105, "spe": 50, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/113.png" },
			{ "nDex": 114, "name": "Tangela", "type1": "Grass", "type2": "", "hp": 65, "atk":  55, "def": 115, "spatk":  100, "spdef":  40, "spe": 60, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/114.png" },
			{ "nDex": 115, "name": "Kangaskhan", "type1": "Normal", "type2": "", "hp": 105, "atk":  95, "def": 80, "spatk":  40, "spdef":  80, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/115.png" },
			{ "nDex": 116, "name": "Horsea", "type1": "Water", "type2": "", "hp": 30, "atk":  40, "def": 70, "spatk":  70, "spdef":  25, "spe": 60, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/116.png" },
			{ "nDex": 117, "name": "Seadra", "type1": "Water", "type2": "", "hp": 55, "atk":  65, "def": 95, "spatk":  95, "spdef":  45, "spe": 85, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/117.png" },
			{ "nDex": 118, "name": "Goldeen", "type1": "Water", "type2": "", "hp": 45, "atk":  67, "def": 60, "spatk":  35, "spdef":  50, "spe": 63, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/118.png" },
			{ "nDex": 119, "name": "Seaking", "type1": "Water", "type2": "", "hp": 80, "atk":  92, "def": 65, "spatk":  65, "spdef":  80, "spe": 68, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/119.png" },
			{ "nDex": 120, "name": "Staryu", "type1": "Water", "type2": "", "hp": 30, "atk":  45, "def": 55, "spatk":  70, "spdef":  55, "spe": 85, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/120.png" },
			{ "nDex": 121, "name": "Starmie", "type1": "Water", "type2": "Psychic", "hp": 60, "atk":  75, "def": 85, "spatk":  100, "spdef":  85, "spe": 115, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/121.png" },
			{ "nDex": 122, "name": "Mr. Mime", "type1": "Psychic", "type2": "Fairy", "hp": 40, "atk":  45, "def": 65, "spatk":  100, "spdef":  120, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/122.png" },
			{ "nDex": 123, "name": "Scyther", "type1": "Bug", "type2": "Flying", "hp": 70, "atk":  110, "def": 80, "spatk":  55, "spdef":  80, "spe": 105, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/123.png" },
			{ "nDex": 124, "name": "Jynx", "type1": "Ice", "type2": "Psychic", "hp": 65, "atk":  50, "def": 35, "spatk":  115, "spdef":  95, "spe": 95, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/124.png" },
			{ "nDex": 125, "name": "Electabuzz", "type1": "Electric", "type2": "Electric", "hp": 65, "atk":  83, "def": 57, "spatk":  95, "spdef":  85, "spe": 105, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/125.png" },
			{ "nDex": 126, "name": "Magmar", "type1": "Fire", "type2": "", "hp": 65, "atk":  95, "def": 57, "spatk":  100, "spdef":  85, "spe": 93, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/126.png" },
			{ "nDex": 127, "name": "Pinsir", "type1": "Bug", "type2": "", "hp": 65, "atk":  125, "def": 100, "spatk":  55, "spdef":  70, "spe": 85, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/127.png" },
			{ "nDex": 128, "name": "Tauros", "type1": "Normal", "type2": "", "hp": 75, "atk":  100, "def": 95, "spatk":  40, "spdef":  70, "spe": 110, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/128.png" },
			{ "nDex": 129, "name": "Magikarp", "type1": "Water", "type2": "", "hp": 20, "atk":  10, "def": 55, "spatk":  15, "spdef":  20, "spe": 80, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/129.png" },
			{ "nDex": 130, "name": "Gyarados", "type1": "Water", "type2": "Flying", "hp": 95, "atk":  125, "def": 79, "spatk":  60, "spdef":  100, "spe": 81, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/130.png" },
			{ "nDex": 131, "name": "Lapras", "type1": "Water", "type2": "Ice", "hp": 130, "atk":  85, "def": 80, "spatk":  85, "spdef":  95, "spe": 60, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/131.png" },
			{ "nDex": 132, "name": "Ditto", "type1": "Normal", "type2": "", "hp": 48, "atk":  48, "def": 48, "spatk":  48, "spdef":  48, "spe": 48, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/132.png" },
			{ "nDex": 133, "name": "Eevee", "type1": "Normal", "type2": "", "hp": 55, "atk":  55, "def": 50, "spatk":  45, "spdef":  65, "spe": 55, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png" },
			{ "nDex": 134, "name": "Vaporeon", "type1": "Water", "type2": "", "hp": 130, "atk":  65, "def": 60, "spatk":  110, "spdef":  95, "spe": 65, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/134.png" },
			{ "nDex": 135, "name": "Jolteon", "type1": "Electric", "type2": "", "hp": 65, "atk":  65, "def": 60, "spatk":  110, "spdef":  95, "spe": 130, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/135.png" },
			{ "nDex": 136, "name": "Flareon", "type1": "Fire", "type2": "", "hp": 65, "atk":  130, "def": 60, "spatk":  95, "spdef":  110, "spe": 65, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/136.png" },
			{ "nDex": 137, "name": "Porygon", "type1": "Normal", "type2": "", "hp": 65, "atk":  60, "def": 70, "spatk":  85, "spdef":  75, "spe": 40, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/137.png" },
			{ "nDex": 138, "name": "Omanyte", "type1": "Rock", "type2": "Water", "hp": 35, "atk":  40, "def": 100, "spatk":  90, "spdef":  55, "spe": 35, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/138.png" },
			{ "nDex": 139, "name": "Omastar", "type1": "Rock", "type2": "Water", "hp": 70, "atk":  60, "def": 125, "spatk":  115, "spdef":  70, "spe": 55, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/139.png" },
			{ "nDex": 140, "name": "Kabuto", "type1": "Rock", "type2": "Water", "hp": 30, "atk":  80, "def": 90, "spatk":  55, "spdef":  45, "spe": 55, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/140.png" },
			{ "nDex": 141, "name": "Kabutops", "type1": "Rock", "type2": "Water", "hp": 60, "atk":  115, "def": 105, "spatk":  65, "spdef":  70, "spe": 80, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/141.png" },
			{ "nDex": 142, "name": "Aerodactyl", "type1": "Rock", "type2": "Flying", "hp": 80, "atk":  105, "def": 65, "spatk":  60, "spdef":  75, "spe": 130, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/142.png" },
			{ "nDex": 143, "name": "Snorlax", "type1": "Normal", "type2": "Normal", "hp": 160, "atk":  110, "def": 65, "spatk":  65, "spdef":  110, "spe": 30, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/143.png" },
			{ "nDex": 144, "name": "Articuno", "type1": "Ice", "type2": "Flying", "hp": 90, "atk":  85, "def": 100, "spatk":  95, "spdef":  125, "spe": 85, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/144.png" },
			{ "nDex": 145, "name": "Zapdos", "type1": "Electric", "type2": "Flying", "hp": 90, "atk":  90, "def": 85, "spatk":  125, "spdef":  90, "spe": 100, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/145.png" },
			{ "nDex": 146, "name": "Moltres", "type1": "Fire", "type2": "Flying", "hp": 90, "atk":  100, "def": 90, "spatk":  125, "spdef":  85, "spe": 90, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/146.png" },
			{ "nDex": 147, "name": "Dratini", "type1": "Dragon", "type2": "", "hp": 41, "atk":  64, "def": 45, "spatk":  50, "spdef":  50, "spe": 50, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/147.png" },
			{ "nDex": 148, "name": "Dragonair", "type1": "Dragon", "type2": "", "hp": 61, "atk":  84, "def": 65, "spatk":  70, "spdef":  70, "spe": 70, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/148.png" },
			{ "nDex": 149, "name": "Dragonite", "type1": "Dragon", "type2": "Flying", "hp": 91, "atk":  134, "def": 95, "spatk":  100, "spdef":  100, "spe": 80, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/149.png" },
			{ "nDex": 150, "name": "Mewtwo", "type1": "Psychic", "type2": "", "hp": 106, "atk":  110, "def": 90, "spatk":  154, "spdef":  90, "spe": 130, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png" },
			{ "nDex": 151, "name": "Mew", "type1": "Psychic", "type2": "", "hp": 100, "atk":  100, "def": 100, "spatk":  100, "spdef":  100, "spe": 100, "image": "https://assets.pokemon.com/assets/cms2/img/pokedex/full/151.png" }
		]
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
		"addData": function(something, level) {
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
				var base2 = pokeTable.methods.calcStat(something, this.desiredlevel, this.iv, this.ev);
				var base = pokeTable.methods.calcStat(something, this.desiredlevel, [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]);

				myRadarChart.data.datasets[0].data = base;

				if (base[0] != base2[0] | base[1] != base2[1] | base[2] != base2[2] | base[3] != base2[3] | base[4] != base2[4] | base[5] != base2[5]) {
					if (myRadarChart.data.datasets.length < 2) {
						myRadarChart.data.datasets.push(stat2);
					}
					myRadarChart.data.datasets[1].data = [base2[0], base2[1], base2[2], base2[5], base2[4], base2[3]];

					myRadarChart.data.datasets[1].hidden = false;
					myRadarChart.data.datasets[1].fill = '-1';
					myRadarChart.data.labels = ["Hitpoint " + base['0'].toString() + " | " + base2['0'].toString(), "Attack " + base['1'].toString() + " | " + base2['1'].toString(), "Defense " + base['2'].toString() + " | " + base2['2'].toString(), "Speed " + base['5'].toString() + " | " + base2['5'].toString(), "Special Defense " + base['4'].toString() + " | " + base2['4'].toString(), "Special Attack " + base['3'].toString() + " | " + base2['3'].toString()];
				}
				myRadarChart.update();

			}
		}

	}
})