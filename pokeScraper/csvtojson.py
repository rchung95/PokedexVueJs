import csv
import json
from collections import OrderedDict

csvfile = open('./pokedex.csv', 'r')
jsonfile = open('./pokedex.json', 'w')

jsonNames = ("orderID", "nDex", "name", "type1", "type2", "ability1", "ability2", "hiddenability", "hp", "atk", "def", "spatk", "spdef", "spe", "note", "tier", "image")
reader = csv.DictReader(csvfile, jsonNames)

jsonordered = [OrderedDict(sorted(item.iteritems(), key=lambda (x, y): jsonNames.index(x))) for item in reader]

for row in jsonordered:
	# Change the value from String to an Int
	row['orderID'] = int(row['orderID'])
	row['nDex'] = int(row['nDex'])
	row['hp'] = int(row['hp'])
	row['atk'] = int(row['atk'])
	row['def'] = int(row['def'])
	row['spatk'] = int(row['spatk'])
	row['spdef'] = int(row['spdef'])
	row['spe'] = int(row['spe'])
	json.dump(row, jsonfile)
	jsonfile.write(',\n')