const {jwtVerify , SignJWT } = require("jose")
const express = require("express")
const secret = new TextEncoder().encode('secret')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/login-jwt', async (req, res) => {
    if(req.body.user === 'user' && req.body.pass == 'password'){
        const jwt = await new SignJWT(req.body)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('2h')
            .sign(secret)
        res.json({ jwt })
    }else{
        res.json({ error: "missing or wrong credentials"})
    }
})

app.get('/profile', async (req, res) => {
    const jwt = req.header("jwt")
    const { payload } = await jwtVerify(jwt, secret)
    if(payload?.user)
        res.json(payload)
    else
        res.json({error: "wrong or outdated JWT"})
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})