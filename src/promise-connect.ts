import { createConnection } from 'net'
import ocafe from '../../ocafe'

export = promiseConnect

function promiseConnect (...args) {
  const max_arg_idx = args.length - 1
  let userOnceConnected = () => {}
  let connect_timeout = 0
  const first_arg = args[0]

  if (typeof args[max_arg_idx] === 'function') {
    userOnceConnected = args.splice (max_arg_idx, 1)[0]
  }

  if (typeof first_arg === 'object' &&
      first_arg !== null &&
      first_arg.hasOwnProperty ('connectTimeout')) {
    connect_timeout = Math.max (0, +(first_arg.connectTimeout)) || 0
  }

  function connect (resolve, reject) {
    var socket ;
    var cancel ;
    var timer = connect_timeout && setTimeout (
      () => {
        try {
          socket.destroy ()
          cancel ()
        }
        finally  {
          reject (new Error ('Connect timeout'))
        }
      }
      , connect_timeout
    )

    try {
      socket = createConnection.apply (null, args)
      cancel = ocafe ( socket
        , 'connect' , () => {
            clearTimeout (timer)
            resolve (socket)
            setImmediate (userOnceConnected)
          }
        , 'error'   , (err) => {
            clearTimeout (timer)
            reject (err)
          }
      )
    }
    catch (err) {
      try { cancel () }
      finally { reject (err) }
    }

  }

  return new Promise (connect)
}
