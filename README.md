# PokedexVueJs

## Goal
To learn a new JS language alongside another frontend framework similar to Bootstrap.

## TODO
- Search functionality
  - ~~search a name~~
  - ~~multiple categories~~
  - search questions
- ~~Change type to type 1 and type 2 as some pokemon like Bulbasaur has multiple types~~
- ~~Add in the rest of the pokemon~~
- Stylize it
  - ~~Bulma (potentially remove it in favour of custom classes)~~
  - ~~Custom clases~~
- ~~Use node.js to make it fully a web application~~
- ~~Connect it to potentially a database~~
- ~~Levels, IV/EV values~~
- ~~Analytical graph? Potentially D3.js to showcase its 6 stats and/or IV/EV~~
- ~~Rewrite js part so it aligns with vue.js code~~
- ~~Build a web scraper~~
- ~~Rewrite Chart js part, so it is more reuseable?~~
- ~~Add in pokemon image~~
- ~~Scrape more for stats like legendary, has mega, tier list, generation etc.~~
- ~~Add in the web scraping code~~
- ~~Add in the CSVtoJSON code~~
- ~~Move jsons to another file~~
- Refactor code more
- Upload to a server liek digital ocean or heroku

Will add more if I can think of anything.

## Languages/Framework/Database used
- Vue.js
- Bulma
- Python
- MongoDB

## Challenges I faced
1. Searching multiple categories

One of the issues I faced within my search function is how to search through the data based on a number like 2. I been stuck on this problem for about a day. As I am still unfamilar with Vue.js, I thought that there was a way to filter out the data strictly using an int. I first attempted it using: 
```vue.js
return this.pokemonList.filter(pokemon => { 
				return (pokemon.nDex.indexOf(this.search >= 0);
```

but it ended being an error. My next attempt was google it. I came upon an answer on stack overflow which has them using ```.includes()```. I tried that and did not work. It also turns out that ```.includes()``` was removed in version 2 of Vuejs. My third attempt which was successful was to just think of integer as a string instead. So when I type in a number into the search bar, it will automatically be converted to a string. To do that, I used ```.toString()```. If you are wondering how the code looks like, it would look like this:
```vue.js
return this.pokemonList.filter(pokemon => { 
				return (pokemon.nDex.toString().indexOf(this.search.toString() >= 0);
```

Now my search functionality works perfectly and I can search through multiple categories like nDex, name and even type! What I learned from this challenge I faced is if you cannot find an answer via google, think of how you would write this in another language.

2. Using x-template

As I decided to learn how to use templates instead, I had to slightly change my code in the HTML side for the modal to pop up. Unfornately I keep getting errors such as ```Property or method is not defined on the instance but referenced during render```. My initial thought is that the method call is out of scope as it was in ```pokedex``` and not ```poke-table```. After some searching, it turns out that x-template was the problem itself. Apparently you are supposed to put it in a new variable and call that variable when you want to use it as a Vue template. So it would look like this:
```vue.js
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
			sortKey: '',
			sortOrders: sortOrders
		}
	},

	computed: {...}
	...
};

Vue.component('poke-table', pokeTable);
```

3. Easily forgotten mistake

Within the input field, I can enter a number and it would be used to calculate the pokemon's stats. However one problem I faced is when I wanted to change the level of the pokemon... let's say from 1 to 100, my HP stat would skyrocket to the 10000s. After about 10 minutes of checking out my JS code, I realized that I made a very forgetful and common mistake. I thought that the number I input would be of type ```Int```, however it is actually of type ```String```. I fixed this by surround the value with ```parseInt()``` to make it of type ```Int```.

4. Finding websites to scrape

One of the hugest issues I have when I am trying to scape for data is trying to find a perfect site with all of the stats I needed. I found three which are worthy, which are Bulbapedia, Serebii and Smogon. Bulbapedia was the easiest to scrape. If I was not using Bulbapedia I would had use Serebii. Smogon had all of the tier information which I needed, BUT it was a pain in the ass to scrape. I kind of wish there was already an API or another site that included tiers (AG, Uber, OU etc.) as part of their data.

For the future, I plan on building a better scraper so I do not need to manually go through all of the data to ensure that I did not skip one.

## Bugs that needs to be fix
- ~~When opening up the modal. The initial value is set to the previous stats of another Pokemon when hovering closely~~
  - Fixed using variableOfChart.destroy();
- ~~Stats would constantly change every time you click "update" to the past duplicate pokemon~~
  - This is due the json not having an unique id. All you need to do is create one and it will fix this problem

## How to run
To install of the NPM modules, enter code below on terminal:
```
npm install
```
*Note: For nodemon, you may need to run it as* ```npm install -g nodemon```

To run locally, set up the mongoDB instance first by entering:
```
mongod
```
then
```
nodemon app.js
```

## Resources I used to learn
- [Stat Formulas](https://bulbapedia.bulbagarden.net/wiki/Statistic#In-battle_modification)
- [Grid Component](https://vuejs.org/v2/examples/grid-component.html)
- [x-template issue](https://github.com/vuejs/vue/issues/4276)
- [Web Scraper tutorial](https://first-web-scraper.readthedocs.io/en/latest/#act-3-web-scraping)
