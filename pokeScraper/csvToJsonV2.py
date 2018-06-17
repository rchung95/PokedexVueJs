import csv
import json
from collections import OrderedDict

csvfile = open('./pokedexV2.csv', 'r')
jsonfile = open('./pokedexV2.json', 'w')

jsonNames = ("orderID", "nDex", "name", "types", "abilities", "stats", "note", "tier", "image")
reader = csv.DictReader(csvfile, jsonNames)

jsonordered = [OrderedDict(sorted(item.iteritems(), key=lambda (x, y): jsonNames.index(x))) for item in reader]

for row in jsonordered:
	# Change the value from String to an Int
	row['orderID'] = int(row['orderID'])
	row['nDex'] = int(row['nDex'])
	json.dump(row, jsonfile)
	jsonfile.write(',\n')
