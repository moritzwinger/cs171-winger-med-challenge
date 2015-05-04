# Process Book

### Project Description

Medical Store GeoChallenge: see http://databits.io/challenges/medical-store-geospatial-challenge

The main questions posed by the challenge are:

1. Over time, is there a tendency for customers from a particular referral source to come from a specific Toronto metro
area? This can help achieve geographic targeting of marketing efforts.

2. Over time, what are the referral trends per customer source and in comparison with other sources?
This can help understand what referral source is more effective than others.

3. Over time, is there a tendency for customers from particular referral sources to get bundles of products, or return
to the store for more products or services? This can help understand which referral source helps build a more loyal
customer base.

### Data

Data sets have been provided: A data set on referrers with their geographical data and the number of clients
referred to the medical store and time-resolved data on client visits with number of purchased articles and client
geo-data.

The provided datasets are enough to answer the three questions with appropraite representation.

### Design Iteration 1

![alt tag](https://github.com/moritzwinger/cs171-winger-med-challenge/master/Design_sketches.jpg)

The first design proposition was a visualization that shows all clients and referrers on a map and allows
interaction on hovering the mouse over a client or referrer. By this type of interaction, the viewer can
extract toatal and time-averaged quantities such as total visits, visits per client, total purchased items, etc.

To address the question on time-resolved properties, the visualization would also have a time-slider, where
properties are shown as a function of time.

A simple implementation of this feature, however showed that the data was to sparse to efficiently populate
the graph (map) and properly visualize the desired quantities. ALso it would have been hard to compare quantities
at different points in time.

### Design Iteration 2