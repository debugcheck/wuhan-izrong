## Naming collision of flux/node_modules/fbjs
> find . -name 'fbjs' -print
> manually remove all fbjs inside any node_module except one at top level
<!--> npm install fbjs@0.6.1-->

## TransformError: .babelrc.stage
> find ./node_modules -name react-packager -prune -o -name '.babelrc' -print | xargs rm -f


## How to startup

### Configuration
All the configurations are configured in file 'config.js'. Make sure the items would be suitable for your environment.

### Run-time environment
NODE_ENV should be set to 'develop' or 'product' with different runtime environment.

Varied platform
1) Windows platform
    a) Please set the NODE_ENV variable.
        > set NODE_ENV=develop
2) Linux platform
    a) Please set the NODE_ENV variable.
        # export NODE_ENV=develop
