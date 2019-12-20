const net = require ('net')
const ocafe = require ('@sovpro/ocafe')

module.exports = promiseConnect

function promiseConnect (...args) {
  let max_arg_idx = args.length - 1
  let userOnceConnected = () => {}
  let connect_timeout = 0
  let first_arg = args[0]

  if (typeof args[max_arg_idx] === 'function') {
    ; [userOnceConnected] = args.splice (max_arg_idx, 1)
  }

  if (typeof first_arg === 'object' &&
      first_arg !== null &&
      first_arg.hasOwnProperty ('connectTimeout')) {
    connect_timeout = Math.max (0, +(first_arg.connectTimeout)) || 0
  }

  const connect = (resolve, reject) => {
    let socket ;
    let cancel ;
    let timer = connect_timeout && setTimeout (
      () => {
        try {
          socket.destroy ()
          cancel ()
        }
        catch { ; }
          reject (new Error ('Connect timeout'))
        }
      , connect_timeout
    )

    try {
      socket = net.createConnection.apply (net, args)
      cancel = ocafe ( socket
        , 'connect' , () => {
            clearTimeout (timer)
            resolve (socket)
            setImmediate (userOnceConnected)
          }
        , 'error'   , err => {
            clearTimeout (timer)
            reject (err)
          }
      )
    }
    catch (err) {
      try { cancel () }
      catch { ; }
      reject (err)
    }

  }

  return new Promise (connect)
}
