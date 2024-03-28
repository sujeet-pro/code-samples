import { PromisePolyfill } from './index'

const a = PromisePolyfill.resolve(1)

a.then(v => {
    console.log(`v is ${v} === 1`)
})

const b = PromisePolyfill.resolve('val')
b.then((v) => {
    console.log(`This should not be logged: ${v}`)
    throw new Error('err thrown')
}).catch((err) => {
    console.log(`ERror logged`, err.message)
})

setTimeout(() => {
    console.log('Wait for 1000ms')
}, 1000)