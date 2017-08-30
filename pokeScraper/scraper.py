import csv
import requests
from BeautifulSoup import BeautifulSoup

url = 'https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_base_stats_(Generation_VII-present)' #This gets all of the pokemon and its stats
# url = 'https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number' #This gets the abilities and types
response = requests.get(url)
html = response.content

soup = BeautifulSoup(html)

#Used to get the stats
table = soup.find('table', attrs={'class': 'sortable roundy'})

#Used to get the abilities and types
# table = soup.find('table', attrs={'style': 'border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; -khtml-border-radius: 10px; -icab-border-radius: 10px; -o-border-radius: 10px;; border: 2px solid #FF1111; background: #FF1111;'})
# table = soup.find('table', attrs={'style': 'border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; -khtml-border-radius: 10px; -icab-border-radius: 10px; -o-border-radius: 10px;; border: 2px solid #DAA520; background: #DAA520;'})
# table = soup.find('table', attrs={'style': 'border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; -khtml-border-radius: 10px; -icab-border-radius: 10px; -o-border-radius: 10px;; border: 2px solid #A00000; background: #A00000;'})
# table = soup.find('table', attrs={'style': 'border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; -khtml-border-radius: 10px; -icab-border-radius: 10px; -o-border-radius: 10px;; border: 2px solid #AAAAFF; background: #AAAAFF;'})
# table = soup.find('table', attrs={'style': 'border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; -khtml-border-radius: 10px; -icab-border-radius: 10px; -o-border-radius: 10px;; border: 2px solid #444444; background: #444444;'})
# table = soup.find('table', attrs={'style': 'border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; -khtml-border-radius: 10px; -icab-border-radius: 10px; -o-border-radius: 10px;; border: 2px solid #025DA6; background: #025DA6;'})
# table = soup.find('table', attrs={'style': 'border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px; -khtml-border-radius: 10px; -icab-border-radius: 10px; -o-border-radius: 10px;; border: 2px solid #F1912B; background: #F1912B;'})

listofRows = []
for row in table.findAll('tr'):
	cellList = []
	count = 0
	for cell in row.findAll('td'):
		cellList.append(cell.text.encode('utf-8'))

		#Used to get the abilities; as generation has a separate table I had to run this 7 times...
		# if count == 3:
		# 	url2 = 'https://bulbapedia.bulbagarden.net/wiki/' + str(cell.text.encode('utf-8')) + '_(Pok%C3%A9mon)'
			
		# 	response = requests.get(url2)
		# 	html2 = response.content
		# 	soup2 = BeautifulSoup(html2)
		# 	span = soup2.findAll('span', attrs={'style': 'color:#000;'})
		# 	counter = 0
		# 	listOfSpan = []
		# 	for stu in span:
		# 		if counter >= 8 and counter <= 15:
		# 			cellList.append(stu.text)
		# 		counter += 1
		# 	# cellList.append(listOfSpan)
		# 	print cellList

		#Used to get the stats
		# if count > 9: #As there is 10 categories
		# 	url2 = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + cellList[0] + '.png'
		# 	cellList.append(url2)
		# else:
			# count += 1
	listofRows.append(cellList)

outfile = open("./pokedex.csv", "a") #wb to write, a to append
writer = csv.writer(outfile)
writer.writerows(listofRows)