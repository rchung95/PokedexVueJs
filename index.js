// In the pokedex variable, what I did was created the data I will be using for the table.
// In the future, I will be adding all 151 Pokemon from the first generation and soon Pokemon
// of every generation! I can see myself using a JSON potentially found on the web otherwise
// I will create my own.

// In filters, I want to capitlize the first letter of each key from data. This function would take the first
// charcter and make it uppercase. After you append it with the first of the string and return it.

// Within methods, I made a function called sortTable which takes in a parameter called column.
// This function sorts the table to see if we want it in an ascending or descending order.
// The variable ascending would only be true of the variable sortcolumn strictly equals to variable column
// Within most programming lanuages I used these days, Depending on the order of the column and the boolean
// ascending, the table will either be in ascending order or descending.

// In computed, there is a function called pokeColumn, which would return the keys of what we have in our
// data (pokemonList). As I am planning to change these in the future, I would not need to create more tables
// headers in the HTML file. This function will do it for me.
// 
// In filteredPokemon, it is used as part of the search functionality to find the matching data based on its
// name. I plan to expand this by having multiple filter which will definitely be a challenge.

function isActive() {
	document.getElementById("asdfg").classList.add("is-active");
}

function notActive() {
	document.getElementById("asdfg").classList.remove("is-active");
}

var pokedex = new Vue({
	el: '#pokedex',
	data: {
		ascending: false,
		sortcolumn: '',
		search: '',
		current: 0,
		pokemonList: [
			{ nDex: 1, name: 'Bulbasaur', type1: 'Grass', type2: 'Poison', hp: 45, atk: 49, def: 49, spatk: 65, spdef: 65, spe: 45 },
			{ nDex: 2, name: 'Ivysaur', type1: 'Grass', type2: 'Poison' },
      		{ nDex: 3, name: 'Venusaur', type1: 'Grass', type2: 'Poison' },
      		{ nDex: 4, name: 'Charmander', type1: 'Fire', type2: '' },
      		{ nDex: 5, name: 'Charmeleon', type1: 'Fire', type2: '' },
      		{ nDex: 6, name: 'Charizard', type1: 'Fire', type2: 'Flying' },
      		{ nDex: 7, name: 'Squirtle', type1: 'Water', type2: '' },
      		{ nDex: 8, name: 'Wartortle', type1: 'Water', type2: '' },
      		{ nDex: 9, name: 'Blastoise', type1: 'Water', type2: '' }
		]
	},

	filters: {
		capitalize: function (str) {
			return str.charAt(0).toUpperCase() + str.slice(1)
		}
	},

	methods: {
		"sortTable": function sortTable(column) {
			this.ascending = (this.sortcolumn === column) ? !this.ascending : true
			this.sortcolumn = column;
			var ascending = this.ascending;

			this.pokemonList.sort(function(a, b) {
				if (a[column] > b[column]) {
					return ascending ? 1 : -1;
				} else if (a[column] < b[column]) {
					return ascending ? -1 : 1;
				}
			})
		},

		specificValue(uniqueStrValue) {
			return this.pokemonList.filter((item) => item.name === uniqueStrValue)[0].hp
		}
	},

	computed: {
		"pokeColumn": function pokeColumn() {
			if (this.pokemonList.length == 0) {
				return [];
			}
		return Object.keys(this.pokemonList[0])
		},
		// Still need to implement the search for nation pokedex number
		"filteredPokemon": function() {
			return this.pokemonList.filter(pokemon => { 
				return (pokemon.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0 || pokemon.type1.toLowerCase().indexOf(this.search.toLowerCase()) >= 0 || pokemon.type2.toLowerCase().indexOf(this.search.toLowerCase()) >= 0 || pokemon.nDex.toString().indexOf(this.search.toString()) >= 0); 
			});
		}
	}
})