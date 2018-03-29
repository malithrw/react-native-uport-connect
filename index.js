import './globals'
import { Linking } from 'react-native'

var uportConnect = require('uport-connect/dist/uport-connect')
const { Connect, SimpleSigner } = uportConnect

const uuidv1 = require('uuid/v1')
const qs = require('qs')

const configureUportConnect = (config) => {

  const uriHandler = (url) => {
    Linking.openURL(url)
  }

  const uport = new Connect(config.appName, {
    clientId: config.appAddress,
    signer: SimpleSigner(config.privateKey),
    mobileUrlHandler: uriHandler,
    uriHandler: uriHandler,
  })

  uport.topicFactory = (name) => {
    const id = uuidv1()
    const url = `${config.appAddress}:${id}`
    let handler
    let cancel
    const topic = new Promise((resolve, reject) => {
      handler = (uri) => {
        if (uri && uri.url.startsWith(url)) {
          const decoded = uri.url.replace('%23', '#')
          const params = qs.parse(decoded.slice(decoded.search(/\#/)+1))
          if (params && params[name]) {
            Linking.removeEventListener('url', handler)
            resolve(params[name])
          } else {
            reject()
          }          
        }
      }
      Linking.addEventListener('url', handler)

      cancel = () => {
        Linking.removeEventListener('url', handler)
        resolve()
      }
    })
    topic.url = url
    topic.cancel = cancel
    return topic
  }

  return {
    ...uportConnect,
    uport,
  }
}

export default configureUportConnect
