import csv, json

# create a dictionary to hold all of the state data
states_dict = {}
id_list = []


# read in the topojson atlas file 
with open('us-atlas.json') as atlasfile: 
	atlas_reader = json.load(atlasfile)
	for state in atlas_reader['objects']['states']['geometries']: 
		id_list.append(state['id'])

print(len(id_list))

# read the file of state names/abbreviations
with open('states.csv') as statesfile:
	state_reader = csv.DictReader(statesfile)
	for line in state_reader: 
		# create a new key/value pair for each state abbreviation
		# do this so that you can use the abbrv from the CDC data sets 
		states_dict[line['Abbreviation']] = line	

# read in 2015 data
with open('2015-death-data.csv', 'rb') as datafile: 
	reader = csv.DictReader(datafile)
	for line in reader:
		# find the state in the state_dict by abbrv code, i.e. AL
		state = states_dict[line['State']]
		# create a new property on state with num deaths 
		state['deaths2015'] = line['Number'].replace(',', '')


# repeat same deal here as above
with open('2013-2014-death-data.csv', 'rb') as datafile:
	reader = csv.DictReader(datafile)
	for line in reader: 
		state = states_dict[line['State']]
		state['deaths2013'] = line['2013Number'].replace(',', '')
		state['deaths2014'] = line['2014Number'].replace(',', '')	

# add in population data
with open('population-data.csv', 'rb') as pop_data:
	reader = csv.DictReader(pop_data)
	for line in reader:
		for key, value in states_dict.iteritems():
			if(value['State'] == line['GEO.display-label']):
				value['population2015'] = line['respop72015']
				value['population2014'] = line['respop72014']
				value['population2013'] = line['respop72013'] 
	print states_dict						

with open('combined-data.json', 'w') as outfile: 
	with open('us-atlas.json') as atlasfile: 
		atlas_reader = json.load(atlasfile)
		for state in atlas_reader['objects']['states']['geometries']:
			for key, value in states_dict.iteritems():
				if(value['AtlasId'] == state['id']):
					state['properties'] = value
	json.dump(atlas_reader, outfile)
		


