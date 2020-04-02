
# deckflex

## description

**THIS PROJECT IS A WORK-IN-PROGRESS** and does not currently work, although hopefully it eventually will.

deckflex aims to create a generic, reusable library for creating plugins for the Elgato Stream Deck using their JavaScript SDK. the original source code is derived from Elgato sample plugins.

## goals

the project should be modular and allow developers to import only the needed parts of the library. as much of the library should be split into separate packages as possible. project sub-packages should be designed to be used independently as possible while retaining inter-compatibility with other sub-packages.

the project should be written 100% in TypeScript, and packages will provide typings.

each package should be tested as much as possible and aim for 100% code coverage.

the package should make use of modern JavaScript language features as as much as possible with the goal of keeping the bundle size to a minimum.

utility functions will be kept out of the core package and, if necessary, provided in separate packages.

rather than "reinventing the wheel", utility functions will be pulled in from well-maintained npm packages (ex. lodash) wherever possible. where this is done, tree-shaking should be used to ensure only the required code is pulled in to the bundle.

packages will be distributed on npm and users will be encouraged to use bundlers such as webpack.
