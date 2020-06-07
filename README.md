# York Inquirer Back-End

![Heroku](https://github.com/J-R-Oliver/the-york-inquirer/workflows/Heroku/badge.svg)

<table>
<tr>
<td>
The York Inquirer is a news website, that allows an aggregation of articles, article and comment ratings, and user-discussion. Users submit articles and comments to the site which are then voted up or down by the community.
</td>
</tr>
</table>

<img src="https://i.imgur.com/FxExxVa.png" alt="York Inquirer article list view" width="450" height="644"> <img src="https://i.imgur.com/xmFILQX.png" alt="York Inquirer article view" width="450" height="644">

## Demo

**Back-End**

The hosted version of the back-end project: https://the-york-inquirer.herokuapp.com/api

**Front-End**

The hosted version of the front-end project: https://yorkinquirer.jamesoliver.dev \
The repository for the front-end project: https://github.com/J-R-Oliver/york-inquirer-front-end

## Getting Started

If you wish to contribute to the project please follow the following instructions to setup a development environment on your local machine.

### Prerequisites

To install this project you will need to have:

- [Node.js](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org)

Tested on `Node.js v12/v13/v14` and `PostgreSQL v12`.

### Installation

To start, please `fork` and `clone` the repository to your local machine. First you will need to install the dependencies.

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

This project reads the following environment variables:

- DB_URL (In production this is a connection string)
- DB_USER
- DB_PASSWORD
- NODE_ENV

Please provide the necessary connection details for your Postgres instance.

## Contributing

Any and all contributions are welcome! To fix a bug or add a feature please:

- Fork the repository
- Create a new branch: `git checkout -b name-of-feature`
- Save any changes you have made
- Add your changes: `git add *`
- Commit your changes: `git commit -m 'clear and concise commit message'`
- Push your changes back to your fork: `git push origin name-of-feature`
- Create pull request

All changes must be tested! Prior to any `commit` or `push` a full test run will be started. This has been automated using [Husky](https://github.com/typicode/husky).

## Bug Requests

If you find a bug, unexpected behaviour or failed query, please report by creating an issue [here](https://github.com/J-R-Oliver/york-inquirer-back-end/issues). Please include as much information as possible including request details and response details.

## Testing

All tests have been written using [Jest](https://jestjs.io). A pre-written script has been made to initiate a test run.

```
npm test
```

A pretest script has been written and configured to run `eslint` automatically prior to starting Jest. This will highlight any linting errors.

## Linting

This project is being linted with `eslint` configured with the following rule sets:

- [Airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
- [Prettier](https://github.com/prettier/eslint-config-prettier)
- [Jest](https://github.com/jest-community/eslint-plugin-jest)
- [Jest Formatting](https://github.com/dangreenisrael/eslint-plugin-jest-formatting)
- [Node](https://github.com/mysticatea/eslint-plugin-node)
- [Node Security](https://github.com/nodesecurity/eslint-plugin-security)

## Built With

- [Express](http://expressjs.com) - a fast, unopinionated, minimalist web framework for Node.js.
- [Knex.js](http://knexjs.org) - a SQL query builder for various database engines including Postgres.
- [Node-Postgres](https://node-postgres.com) - a collection of node.js modules for interfacing with PostgreSQL databases.

## Developers

| [<img src="https://avatars0.githubusercontent.com/u/57285673?s=460&u=f84015efaae37809b255feece51e0516fe750767&v=4 =250x250" alt="James Oliver" width="175" height="175">](https://github.com/J-R-Oliver) |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [James Oliver](https://github.com/J-R-Oliver)                                                                                                                                                            |
