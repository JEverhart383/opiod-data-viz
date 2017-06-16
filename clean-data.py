import csv, json

# create a dictionary to hold all of the state data
states_dict = {}

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
		state['deaths2015'] = line['Number']


# repeat same deal here as above
with open('2013-2014-death-data.csv', 'rb') as datafile:
	reader = csv.DictReader(datafile)
	for line in reader: 
		state = states_dict[line['State']]
		state['deaths2013'] = line['2013Number']
		state['deaths2014'] = line['2014Number']		

with open('combined-data.json', 'w') as outfile: 
	json.dump(states_dict, outfile)
		


