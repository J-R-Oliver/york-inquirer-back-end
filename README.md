# The York Inquirer

The York Inquirer is a news website, that allows an aggregation of articles, article and comment ratings, and user-discussion. Users submit articles and comments to the site which are then voted up or down by the community.

![Heroku](https://github.com/J-R-Oliver/the-york-inquirer/workflows/Heroku/badge.svg)

## Getting Started

If you wish to contribute to the project please follow the following instructions to setup a development environment on your local machine.

### Perquisites 

To install this project you will need to have: 

* [Node.js](https://nodejs.org)
* [PostgreSQL](https://www.postgresql.org)

### Installation

To start, please `fork` and `clone` the repository to your local machine.  First you will need to install the dependencies. 

```
npm install
```

You can then create, and seed the databases. This will create two databases, `york_inquirer` and `york_inquirer_test`, for testing and development purposes. The `seed-db` script will update the databases with all the schema changes defined in the migration files.

```
npm run create-db
npm run seed-db
```

The following command will start the server listening on the port defined in your .ENV file, details [below](###-Configuration).

```
npm start
```

### Configuration 

:construction:

## Contributing

Any and all contributions are welcome! To fix a bug or add a feature please: 

* Fork the repository
* Create a new branch: `git checkout -b name-of-feature`
* Save any changes you have made
* Add your changes: `git add *`
* Commit your changes: `git commit -m 'clear and concise commit message'`
* Push your changes back to your fork: `git push origin name-of-feature`
* Create pull request

All changes must be tested! Prior to any `commit` or `push` a full test run will be started. This has been automated using [Husky](https://github.com/typicode/husky).

## Bug Requests

If you find a bug, unexpected behaviour or failed query, please report by creating an issue [here](https://github.com/J-R-Oliver/the-york-inquirer/issues). Please include as much information as possible including request details and response details.

## Testing 

All test have been written using [Jest](https://jestjs.io). To start testing run:

```
npm test
```

A pretest script has been written and configured to run `eslint` automatically prior to starting Jest. This will highlight any lint errors.

## Built With

* [Express](http://expressjs.com) - a fast, unopinionated, minimalist web framework for Node.js.
* [Knex.js](http://knexjs.org) - a SQL query builder for various database engines including Postgres.
* [Node-Postgres](https://node-postgres.com) - a collection of node.js modules for interfacing with PostgreSQL databases. 

## To-do

[] Add linting guidelines to testing section\
[] Add link to hosted app and explain production scripts\
[] Add badges to README.ms\
[] Test created_at and updated_at implementation using Moment.js

## Developers 

[<img src="https://avatars0.githubusercontent.com/u/57285673?s=460&u=f84015efaae37809b255feece51e0516fe750767&v=4 =250x250" alt="James Oliver" width="250" height="250">](https://github.com/J-R-Oliver)|
---|
[James Oliver](https://github.com/J-R-Oliver)|
