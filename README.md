# vorteX is currently in development ...

**This is going to be a Dapp using React/Redux/Docker/Smart Contrat/Ethereum.**

It uses a React boilerplate used by ConsenSys to start new projects. 

It includes 

- a stack of *.js* library that we use on a daily basis
- an easy starting set-up using ``docker``
- contributing guidelines for new developers

## Stack

This application make active usage of

- [create-react-app](https://github.com/facebookincubator/create-react-app) that packs many utilities
- [redux](https://redux.js.org) for state management
- [react-router v4](https://reacttraining.com/react-router/) for routing
- [connected-react-router](https://github.com/supasate/connected-react-router) to connect router to redux state
- [material-ui v1](https://material-ui.com/) as main visual component library

## Start application

### Requirements

- docker>=17.0.0
- docker-compose>=1.17.0
- node>=9.0.0
- yarn>=1.6.0

### Install application

If not yet done, clone project locally and install node dependencies

```bash
git clone <project-url> && cd <project-folder>
yarn install # install node dependencies locally
```

### Start application

```bash
docker-compose up # start application in dev mode
```

## Contributing guidelines

Refer to [contributing guidelines](CONTRIBUTING.md)
