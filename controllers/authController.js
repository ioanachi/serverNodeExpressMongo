const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fsPromises = require("fs").promises


const handleLogin = async (req, res) => {
    console.log({ lll: "pppp" })

    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ "message": "Usernme+p required" })
    const foundUser = usersDB.users.find(el => el.username === user)
    if (!foundUser) return res.sendStatus(401)
    const match = await bcrypt.compare(pwd, foundUser.password)
    console.log({ match })
    if (match) {
        const roles = Object.values(foundUser.roles)
        console.log({ roles })
        const accessToken = jwt.sign(
            {
                "UserInfo": {

                    "username": foundUser.username,
                    "roles": roles
                }

            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        const otherUsers = usersDB.users.filter((person) => person.username !== foundUser.username)

        const currentUser = { ...foundUser, refreshToken }

        usersDB.setUsers([...otherUsers, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ accessToken })
    } else {
        req.sendStatus(401)
    }
}
module.exports = { handleLogin }