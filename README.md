# Twitch Plays Snake

Using the Twitch.tv platform to host a crowdsourced game of Snake.

## Project Setup

Note: This project was generated with [Yeoman](http://yeoman.io/) using the [webapp generator](https://github.com/yeoman/generator-webapp).

#### Install NodeJS

If you do not have NodeJS installed, get it [here](https://nodejs.org/).

#### Install Dependencies

Install server-side dependencies with [npm](https://www.npmjs.org/):

```bash
$ npm install
```

Install client-side dependencies with [bower](http://bower.io/):

```bash
$ bower install
```

## Web Application

After installing dependencies, you build the web application with [grunt](http://gruntjs.com/): 

```bash
$ grunt
```

You can then run the application on a local server (includes [Livereload](http://livereload.com/)): 

```bash
$ grunt serve
```

## Development

#### Dependency Management

Managing packages using Bower can be done using the following commands:

```bash
# Search for a dependency in the Bower registry.
$ bower search <dep>

# Install one or more dependencies.
$ bower install <dep>..<depN>

# Inject your dependencies into the index.html file.
$ grunt wiredep

# List out the dependencies you have installed for a project.
$ bower list

# Update a dependency to the latest version available.
$ bower update <dep>
```

## Tests

This project uses the [Mocha](https://github.com/mochajs/mocha) testing framework.

#### Running Tests

To run unit and integration tests, first install dependencies and build the webapp, then run:

```bash
$ npm test
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

_(Nothing yet)_
