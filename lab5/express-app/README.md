# express-app

This project was generated with [Hyperledger Composer Express Generator](https://github.com/idpattison/generator-idp-composer-express) version 0.0.1.

## Running the application

Run `npm install` and `npm start` to start the application.  Unless you specify otherwise, the application server will listen on port 8000.  Navigate to `http://localhost:8000/`.

## What is generated?

- an _app.js_ file
- a route file for each Asset and Participant, plus one for the main page
- a model file for each Asset and Participant
- a sample model file for complex queries, which must be modified to suit your actual queries
- view files: for listing, adding new, updating existing and deleting Assets and Participants
- route, model and view files for viewing system transactions
- route, model and view files for executing user transactions
- a _package.json_ file for building the app
- _manifest.yml_ and _.cfignore_ files for deploying the app to Cloud Foundry


## Building models for complex queries

You can add complex queries to your business network model by updating the _queries.qry_ file. An example is shown here
```sql
query Q1 {
  description: "select Person by last name"
  statement:
    SELECT net.biz.digitalPropertyNetwork.Person
      WHERE (lastName == _$nameParam)
}
```

To access this query, add the following to the _QueryModel.js_ file.
```js
'use strict';

const unirest = require('unirest');

exports.Q1 = function (nameParam, apiPath, callback) {
  unirest.get(apiPath + '/api/queries/Q1?nameParam=' + nameParam).end(function (response) {
    let ResultList = response.body;
    // do any enrichment here
    callback(ResultList);
  });
}
```

You can then call this from one of the route files with
```js
const QueryModel = require('../models/QueryModel');

// ...

QueryModel.Q1(nameParam, req.app.get('api path'), function (PersonList) {
  // ... rendering function here ...
});
```

> **NB:** The _QueryModel.js_ file beginning with an underscore will be re-created each time you run the generator tool, so rename it first to save your query models.


## Handling relationships

You can build models with relationships, for example in this model a _Property_ is owned by a _Person_:
```js
asset Property identified by titleId {
  o String   titleId
  --> Person   owner
}

participant Person identified by personId {
  o String personId
  o String firstName
  o String lastName
}
```

The _Property_ object holds the fully-qualified object name and the key (i.e. the _personId_) of the Person which owns it.  When you list the Property objects the owner is therefore not shown in a user-friendly way, it will be something like _net.biz.digitalPropertyNetwork.Person#ID:1234_.

You can enrich the data coming from the model to look up a more useful indicator of the owner (e.g. their name) in the model file.

This code matches the example above, and would be inserted in the generated _getAll_ and _getById_ functions. In this case we would be in the _PropertyModel.js_ file.

```js
// models/PropertyModel.js

// link to the model file for the object we have a relationship with
const personModel = require('../models/PersonModel');

exports.getAll = function (apiPath, callback) {
  unirest.get(apiPath + '/api/Property').end(function (response) {
    let propertyList = response.body;

    // get the list of persons by calling the function in the 'person' model
    // add the owner names to the property list
    // in this case we have used first and last names
    let personList;
    personModel.getAll(apiPath, function (personList) {

      for (let x = 0; x < propertyList.length; x++) {
        let owner = personList.find(function (person) {
          return ('resource:' + person.$class + '#' + person.personId == propertyList[x].owner)
        });
        propertyList[x].ownerName = owner.firstName + ' ' + owner.lastName;
      }

      callback(propertyList);
    });

  });
}

exports.getbyId = function (id, apiPath, callback) {
  unirest.get(apiPath + '/api/Property').end(function (response) {
    let property = response.body;

    // as there is only one Property object returned
    // we don't need the for() loop
    let personList;
    personModel.getAll(apiPath, function (personList) {

      let owner = personList.find(function (person) {
        return ('resource:' + person.$class + '#' + person.personId == property.owner)
      });
      property.ownerName = owner.firstName + ' ' + owner.lastName;

      callback(property);
    });

  });
}
```

We now have a new attribute _ownerName_ on each _Property_ object, which can be rendered in the view.

## Provide drop-down menus for relationship choices

Similarly, when we want to create a new _Property_, it would be better to list all of the owners in a drop down, rather than have to remember the exact resource identifier for each.

To do that, you need to pass a list of owners to the view in the route file:
```js
// routes/Property.js

const PersonModel = require('../models/PersonModel');

router.get('/new', function(req, res, next) {
  // get the list of people to populate the drop-down
  let personList;
  personModel.getAll(req.app.get('api path'), function (personList) {
    res.render('Property-new',
               { title: 'New Property',
                 owners: personList});
    });
});
```

Then in the view file, the form group for the owner is like this:
```
# views/Property-new.jade

.form-group
  label(for="owner" class="col-sm-2 control-label") owner
  .col-sm-6
    select(class="form-control" name="owner" onchange="document.getElementById('ownerId').selectedIndex=this.selectedIndex")
      each owner in owners
        option #{owner.firstName + " " + owner.lastName}
    select(id="ownerId" name="ownerId" style="visibility:hidden")
      each owner in owners
        option #{owner.personId}
```

What's happening here is that there are two drop-down lists (or _select_ elements in HTML terms), the first is populated with the Owners' names, the second is filled with the Owners' IDs - but this second one is kept hidden. When a user clicks on the first list the second is kept in sync (that's the _onchange_ function).

When the form is submitted, the value of the second, hidden list contains the ID of the Owner selected in the first list.  We then use this ID to create the Property object. That's done back in the route file:

```js
// routes/Property.js

router.get('/create', function(req, res, next) {
  // create the Property object - $class & id will be added in the model
  let Property = {
    "owner": "resource:net.biz.digitalPropertyNetwork.Person#" + req.query.ownerId,
    "information": req.query.information,
    "forSale": req.query.forSale
  };
  // call the 'create' method in the model, then show the list view
  PropertyModel.create(Property, req.app.get('api path'), function () {
    res.redirect('/Property');
  });
});
```
In here we prefix the ID coming from the hidden drop-down with the namespace and class information required by the business network. This is then passed back to the model to add to the business network.

Again, remember that this will all be overwritten if you run the generator tool again, so consider changing file names to protect your customisation work.

## Linking from one view to another

Where you have a relationship you can provide a link to go directly to a related asset.  For example, in a list of Property assets, the owner field could link to the details page for that Person.

Create a new variable in the Property object and fill that with the ID of the owner (by default, you get the fully qualified name, you need to split off just the _ID:xxxx_ part).  
```js
// models/PropertyModel.js

// do this is the enrichment section of the getAll function
for (let x = 0; x < PropertyList.length; x++) {
  PropertyList[x].ownerId = PropertyList[x].owner.split("#").pop();
}
```

Then create a link in the view.
```
# views/Property-list.jade

  td
    a(href="/Person/#{PropertyList[index].ownerId}") #{PropertyList[index].owner)
```

## Support for enumerations and booleans

Some fields are restricted to a few specific values, for example a Task may have 3 possible statuses: not started, in progress and complete. To enforce this in your user interface you can replace the standard text field with a drop-down which is pre-configured with the allowable values for a field.

In the view file:
```
# views/Task-new.jade

  .form-group
    label(for="status" class="col-sm-2 control-label") status
    .col-sm-6
      select(class="form-control" name="status")
        option Not started
        option In progress
        option Completed
```

You could also use radio buttons:
```
.form-group
  label(for="status" class="col-sm-2 control-label") Not started
  .col-sm-6
    input(type="radio" name="status" value="Not started")
.form-group
  label(for="status" class="col-sm-2 control-label") In progress
  .col-sm-6
    input(type="radio" name="status" value="In progress")
.form-group
  label(for="status" class="col-sm-2 control-label") Completed
  .col-sm-6
    input(type="radio" name="status" value="Completed")
```

For boolean fields, you could use a checkbox:
```
.form-group
  label(for="forSale" class="col-sm-2 control-label") for sale
  .col-sm-6
    input(type="checkbox" name="forSale")
```

## User transactions

A form is generated for submitting user transactions.  IDs can be entered either in short form (e.g. ID:1234) or fully qualified with the namespace and asset name.

You can choose to modify the transaction forms with drop-down menus as above.

You can also choose to submit the transactions from elsewhere, for example a transaction to register a property for sale could be called from the property's detail page.  In this case you can pre-populate the transaction with much of the information.
