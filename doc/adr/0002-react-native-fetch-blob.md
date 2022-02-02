# 2. React Native Fetch Blob

Date: 2018-11-20

## Status

Accepted

## Context

The dependency react-native-star-prnt's Android implementation only supports loading image URI's located on the devices filesystem, in order to fetch an image
from the web we can utilise rn-fetch-blob to download the ticket logo and footer images to the filesystem of the device.

## Decision

Introduce rn-fetch-blob as a dependency.

## Consequences

We're dependent on rn-fetch-blob which is a native module.
