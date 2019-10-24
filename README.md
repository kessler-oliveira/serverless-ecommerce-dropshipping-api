# Serverless E-Commerce Dropshipping API

This repo is for the API of the serverless e-commerce dropshipping project.

#### Usage

To use this repo you need to have the [Serverless framework](https://serverless.com) installed and AWS configured.

``` bash
$ npm install serverless -g
$ aws configure
```

Clone this repo.

``` bash
$ git clone https://github.com/kessler-oliveira/serverless-ecommerce-dropshipping-api.git
```

Finally, go to director and deploy the **services** in order:

| Phase 1         | Phase 2 | Phase 3  |
| :---            | :---    | :---     |
| infraestructure | auth    | register |

``` bash
$ npm install
$ serverless deploy
```

A alternative is configure the deploy in [SEED](https://seed.run/)
