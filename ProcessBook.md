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

The provided data sets are enough to answer the three questions with appropriate representation.

### Design Iteration 1

![alt tag](https://github.com/moritzwinger/cs171-winger-med-challenge/master/Design_sketches_1.jpg)

The first design proposition was a visualization that shows all clients and referrers on a map and allows
interaction on hovering the mouse over a client or referrer. By this type of interaction, the viewer can
extract total and time-averaged quantities such as total visits, visits per client, total purchased items, etc.

To address the question on time-resolved properties, the visualization would also have a time-slider, where
properties are shown as a function of time.

A simple implementation of this feature, however showed that the data was to sparse to efficiently populate
the graph (map) and properly visualize the desired quantities. ALso it would have been hard to compare quantities
at different points in time.

### Design Iteration 2

![alt tag](https://github.com/moritzwinger/cs171-winger-med-challenge/master/Design_sketches_2.jpg)

In this iteration, a clearer design concept has been developed with a simple theme and color coding to distinguish
clients and referrers. The general concept of having a map to visualize the client / referrer distribution has been
kept but reduced to a simple graph representation that suited well the developed design concept.
Because of problems with the time-slider as discussed above, the idea has been discarded and an additional visual
element has been created, namely the time resolved visualization of purchase events per referral source.
In addition, to quantify where clients on the map have been referred from, a simple barchart has been constructed to
easily distinguish popular referral sources from the others.
The idea of size-encoded circles has been implemented.

### Design Iteration 3

![alt tag](https://github.com/moritzwinger/cs171-winger-med-challenge/master/Design_sketches_3.jpg)

Detailed description
