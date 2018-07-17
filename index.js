import './globals'
import { Linking } from 'react-native'

import Connect from 'uport-connect/dist/uport-connect'
import { Credentials } from 'uport/dist/uport'
import { transport, message, crypto } from 'uport-core/dist/uport-core'
import { decodeJWT, verifyJWT } from 'did-jwt'


const uuidv1 = require('uuid/v1')
const qs = require('qs')

const configureUportConnect = (config) => {

  const callbackUrl = `${config.appAddress}://uport/req`
  
  const credentials = new Credentials({
    address: config.appAddress,
    privateKey: config.privateKey
  })
  
  const onloadResponse = () => {
    // Todo return live url
    return callbackUrl
  }

  const uportConnect = new Connect(config.appName, {
    network: 'rinkeby',
    isMobile: true,
    onloadResponse,
  })
  
  uportConnect.credentials = credentials

  uportConnect.genCallback = () => {
    return callbackUrl
  }
  
  const uriHandler = (url) => {
    Linking.openURL(url)
  }
  uportConnect.mobileTransport = transport.url.send({uriHandler})


  uportConnect.requestDisclosure = (options) => {
    const reqObj = { ...options,
                     notifications: false,
                     callbackUrl: callbackUrl }
    return uportConnect.credentials.requestDisclosure(reqObj)
  }

  uportConnect.requestMobile = (JWT, id) => {
    return uportConnect.request(JWT, id, {type: 'redirect', redirectUrl: callbackUrl})
  }

  const linkingHandler = (uri) => {
    uportConnect.pubResponse(transport.url.parseResponse(uri.url))
  }

  Linking.addEventListener('url', linkingHandler)


  return uportConnect
}

export default configureUportConnect
