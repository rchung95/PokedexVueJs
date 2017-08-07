//Registering the component
Vue.component('pokedex', {
	props: ['todo'],
	template: '<li>{{ todo.name }}</li>'
})

var app1 = new Vue({
	el: '#app1',
	data: {
		pokemonList: [
			{ id: 1, name: 'Bulbasaur'},
			{ id: 2, name: 'Ivysaur' },
      		{ id: 3, name: 'Venusaur' },
      		{ id: 4, name: 'Charmander' },
      		{ id: 5, name: 'Charmeleon'},
      		{ id: 6, name: 'Charizard'},
      		{ id: 7, name: 'Squirtle'},
      		{ id: 8, name: 'Wartortle'},
      		{ id: 9, name: 'Blastoise'}
		]
	}
})