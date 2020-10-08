# AppsCo Front

AppsCo front represents AppsCo frontend application.
It is created from a collection of AppsCo, vaadin and polymer web components.

## Setup

1. Install bower
`npm install -g bower`

2. Install polymer

`npm install -g polymer-cli`

`sudo npm install --unsafe-perm -g polymer-cli`

3. Install dependencies
`bower install`

4. Setup environment
In index.html setup domain and authorization token
`<appsco-app domain="https://my-dev.appsco.com" authorization-token="token"></appsco-app>`

5. Run
`polymer serve`

## Build version

`polymer build --entrypoint index.html`
