# About

This package is an attempt at a port of the brilliant [pyracing](https://github.com/Esterni/pyracing), for those who need similar functionality from a node.js server. 
My initial use case was to enable me to use stats in a site that will be built with Sanity and Eleventy, and adding in Python and a database would have negated a lot of the reasons for going that route.

# Usage

Once you've cloned this repo into your project, you can initialise a client like so:
```js 
import Client from "./client.js";
const c = new Client("your@username.co.uk", "yourpassword");
```

Then explore the various methods at your disposal to get some data, like this one to get the data needed for an iRating graph:
```js
const irating = await c.irating(customerId,category);
```

Or to get recent race data for a given customer ID:
```js 
const lastRaces = await c.lastRacesStats(customerId);
```

# Contribution

I welcome any attempts to add all the missing functionality of pyracing – I started this project only needing the iRating and Last Race stats, so that's all I've implemented. I will get to more as I need them, but any help is appreciated.
