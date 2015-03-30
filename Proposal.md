# Project Proposal

### Background and Motivation

In this particular project a fairly small data set is presented,
and it will be of interest to visualize data without provoking over-interpretation of the data,
a common fallacy in many data visualizations available.
The motivation behind choosing this project is to find out how well visualization
is suitable on a geographically relatively small scale using a sparse data set.

### Project Objective

The challenge presented on http://databits.io/challenges/medical-store-geospatial-challenge
poses a number of questions to be answered by visualizing a certain data set. The goal of the
visualization is to find quantitative connections between referral source locations and a Medical Supply
Store. To improve marketing strategies, the store representatives want to find out from where and which
referral source customers come.

Specifically, the following questions are asked to be answered the visualization:

1. Find a connection between a specific referral source and the store over time.
2. Analyse trends per referral source compared to other referral sources, such as returning customers, and number
   of items purchased.
3. Convey the uncertainty of the data.

### Data
The data sets are available on http://databits.io/challenges/medical-store-geospatial-challenge and
are separated in location data, data on referrers, and clients.

The data on Referrers presents unique ID's of client referrers, count of visits of clients referred
by the referrer, and location data of the referrers.

The data set on Clients associates a client unique ID to each client, the referrer that referred
the client to the store, and a client's living area, such as postal code, city and geo-coordinates.

### Data Processing

The data presented is relatively clean, the locations of the store and each referrer will be extracted
and the flow of customers wo the store will be analyzed. In a second step, geographical
data of the customers will be extracted and associated to referrer and store to get a picture of the
interconnection between referrers, customer location and the store.
Data is presented in .csv which can be readily handled with d3 / JavaScript.

### Visualization

The data will be visualized using a map of Toronto, or a simple graph, with the store and the referrers
displayed as a function of their latitude / longitude. Then in order to analyse connections between locations
will be visualized, where values of either number of purchases, visits, referrals is non-zero.
Depending on the number of interactions between the shop and the client / referrer, the connection will
be coded differently (line thickness, spatial proximity (when using a graph representation), color,
...).

### Must have features

The user must understand the geographical relationship between the store and the referrers, as
well as have an idea why a certain clientele chooses to go to that specific shop.

### Optional Features

The visualization could exhibit the feature of time resolution. Also, the uncertainty of the data set
needs to be expressed.


