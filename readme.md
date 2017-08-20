Zuul is a project I started with the intend of creating a UI framework
that is compatible with the API's and behavior of XUL.

This will effectively mean two things

 1. It will be relatively simple to port UI written in XUL to Zuul
 2. You will be able to build desktop UI using HTML, whilst still using desktop UI methodology.
 
## Building

Note that while this project uses NodeJS and Electron the actual source code for Zuul is pure JavaScript and does not depend on NodeJS. NodeJS is only used to build the distributable, and Electron to test it.

```
# Prepare
yarn install
yarn global add gulp mocha

# Build
gulp

# Test with kitchensink
gulp electron  # OR
gulp webserver # Navigate to http://localhost:8000/dist/kitchensink.html

# Run tests
npm test       # OR
mocha tests
```