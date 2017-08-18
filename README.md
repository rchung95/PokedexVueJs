# PokedexVueJs

## Goal
To learn a new JS language alongside another frontend framework similar to Bootstrap.

## TODO
- Search functionality
  - ~~search a name~~
  - ~~multiple categories~~
  - search questions
- ~~Change type to type 1 and type 2 as some pokemon like Bulbasaur has multiple types~~
- Add in the rest of the pokemon
- Stylize it
  - Bulma (potentially remove it in favour of custom classes)
  - Custom clases
- Use node.js to make it fully a web application and connect it to potentially a database
  - Lots of npm modules for Vue.js
- IV/EV values
- ~~Analytical graph?~~ Potentially D3.js to showcase its 6 stats and/or IV/EV
- Rewrite js part so it aligns with vue.js code

Will add more if I can think of anything.

## Languages/Framework used
- Vue.js
- Bulma

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