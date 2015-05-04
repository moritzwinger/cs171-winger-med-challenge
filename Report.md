### Overview and Motivation:

The visualization created is a submission to the challenge: Medical Store Geospatial Challenge
(http://databits.io/challenges/medical-store-geospatial-challenge).
The intention of the created visualization is to analyze and find patterns in customer referral data.


### Questions:

Three specific questions have been asked to be analyzed by the visualization.

1. Over time, is there a tendency for customers from a particular referral source to come from a specific Toronto metro
area? This can help achieve geographic targeting of marketing efforts.

2. Over time, what are the referral trends per customer source and in comparison with other sources?
This can help understand what referral source is more effective than others.

3. Over time, is there a tendency for customers from particular referral sources to get bundles of products, or return
to the store for more products or services? This can help understand which referral source helps build a more loyal
customer base.

### Exploratory Data Analysis:

The data set was sufficiently small to be viewed in Microsoft Excel, study of the structure and interconnectivity of
the available data sets has shaped the design as it is in its final format.

### Design Evolution:

A geographical representation of the referral sources and client locations seemed logical. Since, the data provided
latitude and longitude of client- and referrers' positions, it was a straight forward choice to implement a scatter plot
that resolves the data as located on the world map. To blend in with the overall design and keep simplicity,
an actual map as a visualization choice has been discarded.
This part of the visualization is intended to give the viewer an idea of where the most clients come from and what the
most prolific referral sources are.
To be able to analyze data quantitatively, the rest of the visualization has been implemented. It was clear that
when selecting a referral source or client, that the viewer will want to know about the selected object in more detail,
which is why the bar chart on referrer sources vs referred clients, the time resolved visit history and details
on clients and referrers have been created.
The idea was to keep the visualization as simple and clean as possible and let interaction be the driving force of
understanding the data. Selecting data points anywhere in the visualization should intuitively show trends and connections
in referrer and client data.

### Implementation:

The visualization has been used using the d3 library (http://d3js.org/). Code is organized in one html file and multiple
JavaScript files that implement the individual parts of the visualization.
The different parts interact via event handlers that trigger the actions required upon user interactions.

### Evaluation:

The data implies that referral sources close to the medical store of interest are the most prolific, if not considering
other referral sources, such as Walk-In etc. Most customers come from the vicinity of the store and buy a small amount
 of items (0-3) each visit. Clients tend to come from the vicinity of the store, seemingly independent of their
 referral source.
 The visualization has the potential to answer all the questions posed above by extensive  study of the visualization.
 Interaction with the visualization feels natural, and consequences of actions are intuitive and logical.
 The product is well rounded, simple and does not require extensive documentation.

### Possible Improvements and Extensions:

Adding total items purchased per referral source in the detail text visualization, and highlight lines on mouse-over of
client dots, when a client has visited more than once.