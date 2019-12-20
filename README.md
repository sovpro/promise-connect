# Promise Connect

Promise a connected socket.

## Overview

Promise Connect accepts the same parameters as [`net.createConnection`](https://nodejs.org/api/net.html#net_net_createconnection) and [`net.connect`](https://nodejs.org/api/net.html#net_net_connect)

## Usage

```js
try {
  const socket = await promiseConnect (port, host)
}
catch (error) {
  // handle error
}
```

### Connect Timeout

A non-standard (opt-in) option, `connectTimeout`, representing the milliseconds to wait for a connection is available. If not specified the default value for connectTimeout is 0, disabling the connect timeout. 

If `connectTimeout` is specified, and a connection is not made before the time specified in `connectTimeout` has passed, an error with message set to 'Connect timeout' is thrown.

```js
try {
  const socket = await promiseConnect ({
      port
    , host
    , connectTimeout: 5000 
  })
}
catch (error) {
  // error.message might be 'Connect timeout'
}
```

### Connect Listener

If a connect listener is specified, it is called after promise fulfillment.

```js
try {
  const socket = await promiseConnect (
      port
    , host
    , onConnect
  )
  function onConnect () {
    const ip_addr = socket.address().address
    console.log ('Connected to ' + address)
  }
}
catch (error) {
  // handle error
}
```

