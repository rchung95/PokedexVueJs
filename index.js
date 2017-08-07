// In the pokedex variable, what I did was created the data I will be using for the table.
// In the future, I will be adding all 151 Pokemon from the first generation and soon Pokemon
// of every generation! I can see myself using a JSON potentially found on the web otherwise
// I will create my own.

// Within methods, I made a function called sortTable which takes in a parameter called column.
// This function sorts the table to see if we want it in an ascending or descending order.
// The variable ascending would only be true of the variable sortcolumn strictly equals to variable column
// Within most programming lanuages I used these days, Depending on the order of the column and the boolean
// ascending, the table will either be in ascending order or descending.

// In computed, there is a function called pokeColumn, which would return the keys of what we have in our
// data (pokemonList). As I am planning to change these in the future, I would not need to create more tables
// headers in the HTML file. This function will do it for me.

var pokedex = new Vue({
	el: '#pokedex',
	data: {
		ascending: false,
		sortcolumn: '',
		pokemonList: [
			{ nDex: 1, name: 'Bulbasaur', type: 'Grass/Poison' },
			{ nDex: 2, name: 'Ivysaur', type: 'Grass/Poison' },
      		{ nDex: 3, name: 'Venusaur', type: 'Grass/Poison' },
      		{ nDex: 4, name: 'Charmander', type: 'Fire' },
      		{ nDex: 5, name: 'Charmeleon', type: 'Fire' },
      		{ nDex: 6, name: 'Charizard', type: 'Fire/Flying' },
      		{ nDex: 7, name: 'Squirtle', type: 'Water' },
      		{ nDex: 8, name: 'Wartortle', type: 'Water' },
      		{ nDex: 9, name: 'Blastoise', type: 'Water' }
		]
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
		}
	},

	computed: {
		"pokeColumn": function pokeColumn() {
			if (this.pokemonList.length == 0) {
				return [];
			}
		return Object.keys(this.pokemonList[0])
		}
	}
})