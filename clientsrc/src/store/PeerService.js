/**
 * WebRTC Management Singleton Service
 */
​
import Peer from 'peerjs'
import { reactive } from '@vue/composition-api'
​
​
/**
 * @type {Peer}
 */
let _self = null
let _listeners = {
  data: [],
  media: []
}
​
class WebRTCService {
  constructor() {
    /**
     * @type {MediaStream}
     */
    this.localStream = null
    this.dataChannels = {}
    this.mediaChannels = {}
    this.peers = {}
    this.metadata = { id: '', name: '', img: '' }
  }
​
  get totalPeers() {
    return Object.keys(this.peers).length
  }
​
  get connected() {
    return _self !== null
  }
​
  open(selfId, metadata = { id: selfId, name: '', img: '' }, options = {
    host: "peer-connector.herokuapp.com",
    port: 443,
    path: "/connect",
    secure: true
  }) {
    this.id = selfId
    this.metadata = metadata
    _self = new Peer(selfId, options)
    this._onSignalRecieved()
  }
​
  close() {
    isConnected()
    _self.destroy()
    this.localStream = null
    Object.keys(this.dataChannels).forEach(k => {
      delete this.dataChannels[k]
    })
    Object.keys(this.mediaChannels).forEach(k => {
      delete this.mediaChannels[k]
    })
    Object.keys(this.peers).forEach(k => {
      delete this.peers[k]
    })
    Object.keys(this.metadata).forEach(k => {
      delete this.metadata[k]
    })
    _self = null
  }
​
  addPeer(peerId) {
    this.openDataChannel(peerId)
    if (this.localStream) {
      this.callPeer(peerId)
    }
  }
​
  removePeer(peerId) {
    let con = this.peers[peerId]
    if (con) { con.close() }
    delete this.peers[peerId]
    delete this.mediaChannels[peerId]
    delete this.dataChannels[peerId]
  }
​
​
  /**
   * @param {string} peerId
   * @param {Peer.PeerConnectOption} options
   */
  openDataChannel(peerId, options = { reliable: true, metadata: this.metadata }) {
    isConnected()
    if (this.peers[peerId]) { return }
    let con = _self.connect(peerId, options)
    this.peers[peerId] = con
    this.dataChannels[peerId] = con
    con.on("data", (data) => {
      this._triggerListeners("data", data)
    })
    con.on("close", () => {
      this.dataChannels[peerId] = null
    })
  }
​
  //#region PEER AUDIO & VIDEO CALLING
  callPeers(stream) {
    if (!stream) { return }
    this.localStream = stream
    Object.values(this.peers).forEach(peer => {
      this.callPeer(peer.peer)
    })
  }
​
  callPeer(peerId) {
    if (!this.localStream) { return }
    const call = _self.call(peerId, this.localStream, { metadata: this.metadata })
    if (!call) {
      return //retry(this.callPeer, 5)
    }
​
    call.on('stream', (remoteStream) => {
      this.mediaChannels[peerId] = remoteStream
      this._triggerListeners('media', { peerId, remoteStream })
    })
    call.on('close', () => {
      this.mediaChannels[peerId] = null
    })
​
    return call
  }
​
  //#endregion
​
  sendData(data) {
    Object.values(this.dataChannels).forEach(con => con ? con.send(data) : null)
  }
​
  //#region Event Listeners
  /**
   * Register callback to trigger when data is recieved
   * @param {function} fn
   */
  onData(fn) {
    registerListener('data', fn)
  }
  /**
   * Removes Data Listener
   * @param {function} fn
   */
  offData(fn) {
    removeListener('data', fn)
  }
  /**
   * Register callback to trigger when video track is recieved
   * @param {function} fn
   */
  onMedia(fn) {
    registerListener('media', fn)
  }
  /**
   * Removes Media Listener
   * @param {function} fn
   */
  offMedia(fn) {
    removeListener('bedia', fn)
  }
  /**
   * @param {string} type
   * @param {any} payload
   */
  _triggerListeners(type, payload) {
    if (!_listeners[type]) { return }
    _listeners[type].forEach((fn, i) => {
      try {
        fn(payload)
      } catch (e) {
        console.log(`[LISTENER ERROR] ${type}`, e, payload)
      }
    })
  }
​
  _onSignalRecieved() {
    _self.on('call', async (call) => {
      console.log('incoming call', call)
      const peerId = call.metadata.id
      call.on('stream', (remoteStream) => {
        if (!peerId) { return }
        if (!this.peers[peerId]) {
          this.openDataChannel(peerId)
        }
        this.mediaChannels[peerId] = remoteStream
        this._triggerListeners('media', { peerId, remoteStream })
      });
​
      call.answer(this.localStream)
​
      call.on('close', () => {
        this.dataChannels[peerId] = null
        this.mediaChannels[peerId] = null
        this._triggerListeners('media', { peerId, remoteStream: null })
      })
​
    });
    _self.on('data', (data) => {
      this._triggerListeners('data', data)
    })
    _self.on('connection', (con) => {
      let peerId = con.metadata.id
      if (!this.peers[peerId]) {
        this.openDataChannel(peerId)
      }
      con.on('open', () => {
        con.send({ message: 'Hello from ', sender: this.metadata })
      })
      console.log('connection from con', con)
    })
  }
​
  //#endregion
}
​
​
​
​
//#region UTILITIES
function isConnected() { if (!_self) { throw new Error('WebRTC is not open') } }
function isFn(fn) { if (typeof fn !== 'function') { throw new Error('Expected type function but recieved type ' + typeof fn) } }
function registerListener(type, fn) {
  isFn(fn)
  _listeners[type].push(fn)
}
function removeListener(type, fn) {
  isFn(fn)
  _listeners[type] = _listeners[type].filter(f => f === fn)
}
​
const attemptsTracker = new WeakMap()
/**
 * @param {function} cb
 * @param {number} maxAttempts
 * @param {number} delay
 */
async function retry(cb, maxAttempts = 3, delay = 1000) {
  let attemps = attemptsTracker.get(cb) || 0
  if (attemps >= maxAttempts) { return console.error('Retry Max Attempts reached for function ' + cb.name) }
  setTimeout(async () => {
    let res = await cb()
    if (res) {
      return attemptsTracker.delete(cb)
    }
    attemptsTracker.set(cb, ++attemps);
    retry(cb)
  }, delay)
}
​
//#endregion
​
export const webRTCService = new WebRTCService()