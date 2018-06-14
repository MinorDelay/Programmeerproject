import csv
import json

# open csv file
with open ("threatenedFish.csv") as csv_file:

    # format each line into a seperate dict and make a list of all dicts
    # field_names = ("Country")
    reader = list(csv_file[1:3])
    print (reader)
    # for i in csv_file:
    #     list(row[i] for i in included_cols)
