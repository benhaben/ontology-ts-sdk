import { makeInvokeTransaction } from '../src/transaction/makeTransactions'
import Transaction from '../src/transaction/transaction'
import Program from '../src/transaction/Program'
import { Identity } from '../src/identity'
import * as core from '../src/core'
import AbiInfo from '../src/Abi/AbiInfo'
import AbiFunction from '../src/Abi/AbiFunction'
import Parameter from '../src/Abi/parameter'
import json from '../src/smartcontract/data/NeoContract1.abi'
import json2 from '../src/smartcontract/data/NeoContract2.abi'
import { ab2hexstring, str2hexstr } from '../src/utils'
import { DEFAULT_ALGORITHM } from '../src/consts';
import { DDO } from '../src/transaction/DDO'

const tx_url = 'http://192.168.3.128:20335/api/v1/transaction'
const socket_url = 'ws://192.168.3.128:20335'
const Default_params = {
    "Action": "sendrawtransaction",
    "Version": "1.0.0",
    "Type": "",
    "Op": "test"
}
const WebSocket = require('ws');

var privateKey: string
var publicKey: string
var pk2: string
var ontid: string
var oldrecovery : string
var newrecovery : string

var abiInfo: AbiInfo
var identity: Identity

abiInfo = AbiInfo.parseJson(JSON.stringify(json2))
// privateKey = core.generatePrivateKeyStr()
// publicKey = ab2hexstring(core.getPublicKey(privateKey, true))
// console.log('privatekey: ' + privateKey)
// console.log('publick key: ' + publicKey)

privateKey = 'b02304dcb35bc9a055147f07b2a3291db4ac52f664ec38b436470c98db4200d9'
publicKey = '039392ba7df4a7badc4cc498be257202f9bbb89c887502e9bcb96a6636ee050ba8'
ontid = '6469643a6f6e743a5452616a31684377615135336264525450635a78596950415a364d61376a6351564b'
pk2 = '035096277bd28ee25aad489a83ca91cfda1f59f2668f95869e3f7de0af0f07fc5c'

// recovery = ab2hexstring(core.generateRandomArray(20))

newrecovery = '8143c0070b7bea4895dbe9078abdf655047b5949'
oldrecovery = '8143c0070b7bea4895dbe9078abdf655047b5950'

// identity = new Identity()
// identity.create(privateKey, '123456', 'mickey')
// ontid = str2hexstr(identity.ontid)
// console.log('ontid: ' + ontid)

const sendTx = (param, callback = null) => {
    const socket = new WebSocket(socket_url)
    socket.onopen = () => {
        console.log('connected')
        socket.send(param)
    }
    socket.onmessage = (event) => {
        console.log('response for send tx: ' + JSON.stringify(event.data))
        if (callback) {
            callback(event.data)
            socket.close()
        }
        // socket.close()
    }
    socket.onerror = (event) => {
        //no server or server is stopped
        console.log(event)
        socket.close()
    }
}

const getDDOTx = () => {
    let f = abiInfo.getFunction('GetDDO')

    let p1 = new Parameter('id', 'ByteArray', ontid)
    f.setParamsValue(p1)

    let tx = makeInvokeTransaction(abiInfo.hash, f, privateKey)

    let serialized = tx.serialize()
    console.log('DDO : ' + serialized)
    let param = JSON.stringify(Object.assign({}, Default_params, { Data: serialized, Op: "PreExec" }))
    return param
}

const parseDDO = (res) => {
    let result = JSON.parse(res)
    let ddo = DDO.deserialize(result.Result[0])
    console.log("parse DDO : " + JSON.stringify(ddo))
}

const testRegisterOntid = () => {
    let f = abiInfo.getFunction('RegIdByPublicKey')

    let p1 = new Parameter('id', 'ByteArray', ontid)
    let p2 = new Parameter('pk', 'ByteArray', publicKey)

    f.setParamsValue(p1, p2)
    let tx = makeInvokeTransaction(abiInfo.hash, f, privateKey)

    let serialized = tx.serialize()
    // console.log('register tx: ' + serialized)
    
    let param = JSON.stringify(Object.assign({}, Default_params, { Data: serialized }))
    sendTx(param)
}

const testAddAttribute = () => {
    let f = abiInfo.getFunction('AddAttribute')
    let p1 = new Parameter('id', 'ByteArray', ontid)
    let p2 = new Parameter('path', 'ByteArray', str2hexstr('Cert'))
    let p3 = new Parameter('type', 'ByteArray', str2hexstr('String'))
    let p4 = new Parameter('value', 'ByteArray', str2hexstr('abcd'))
    let p5 = new Parameter('pk', 'ByteArray', publicKey)

    f.setParamsValue(p1, p2, p3, p4, p5)
    let tx = makeInvokeTransaction(abiInfo.hash, f, privateKey)

    let serialized = tx.serialize()
    // console.log('addAddribute tx: ' + serialized)
    
    let param = JSON.stringify(Object.assign({}, Default_params, { Data: serialized }))
    sendTx(param)
}


const testAddPK = () => {
    let f = abiInfo.getFunction('AddKey')

    let p1 = new Parameter('id', 'ByteArray', ontid)
    let p2 = new Parameter('newpubkey', 'ByteArray', pk2)
    let p3 = new Parameter('sender', 'ByteArray', publicKey)

    f.setParamsValue(p1, p2, p3)
    let tx = makeInvokeTransaction(abiInfo.hash, f, privateKey)

    let serialized = tx.serialize()
    // console.log('add pk tx: ' + serialized)
    
    let param = JSON.stringify(Object.assign({}, Default_params, { Data: serialized }))
    console.log('add pk param: ' + param)
    sendTx(param)
}

const testRemovePK = () => {
    let f = abiInfo.getFunction('RemoveKey')

    let p1 = new Parameter('id', 'ByteArray', ontid)
    let p2 = new Parameter('oldpubkey', 'ByteArray', pk2)
    let p3 = new Parameter('sender', 'ByteArray', publicKey)

    f.setParamsValue(p1, p2, p3)
    let tx = makeInvokeTransaction(abiInfo.hash, f, privateKey)

    let serialized = tx.serialize()

    // let hashed = core.getHash(serialized)
    // console.log('remove pk tx: ' + serialized)
    // console.log('hashed:' + hashed)
    
    let param = JSON.stringify(Object.assign({}, Default_params, { Data: serialized }))
    console.log('remove pk param: ' + param)
    sendTx(param)
}

const testAddRecovery = () => {
    let f = abiInfo.getFunction('AddRecovery')

    let p1 = new Parameter('id', 'ByteArray', ontid)
    let p2 = new Parameter('recovery', 'ByteArray', oldrecovery)
    let p3 = new Parameter('pk', 'ByteArray', publicKey)

    f.setParamsValue(p1, p2, p3)
    let tx = makeInvokeTransaction(abiInfo.hash, f, privateKey)

    let serialized = tx.serialize()

    // let hashed = core.getHash(serialized)
    // console.log('remove pk tx: ' + serialized)
    // console.log('hashed:' + hashed)

    let param = JSON.stringify(Object.assign({}, Default_params, { Data: serialized }))
    console.log('change recovery param: ' + param)
    sendTx(param)
}

const testChangeRecovery = () => {
    let f = abiInfo.getFunction('ChangeRecovery')

    let p1 = new Parameter('id', 'ByteArray', ontid)
    let p2 = new Parameter('newrecovery', 'ByteArray', newrecovery)
    let p3 = new Parameter('recovery', 'ByteArray', oldrecovery)

    f.setParamsValue(p1, p2, p3)
    let tx = makeInvokeTransaction(abiInfo.hash, f, privateKey)

    let serialized = tx.serialize()

    let param = JSON.stringify(Object.assign({}, Default_params, { Data: serialized }))
    console.log('change recovery param: ' + param)
    sendTx(param)
}

const testGetDDO = () => {
    let param = getDDOTx()
    sendTx(param, parseDDO)
}

//uncomment one line to test one tx each time.

testRegisterOntid()

// testAddAttribute()

// testGetDDO()

// testAddPK()

// testRemovePK()

// testAddRecovery()

// testChangeRecovery()