const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const path = require('path')
const fsPromises = require("fs").promises


const handleLogout = async (req, res) => {






    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    const foundUser = usersDB.users.find(el => el.refreshToken === refreshToken)
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true })

        return res.sendStatus(204)
    }
    //Delete the refresh token in the db

    const otherUsers = usersDB.users.filter(e => e.refreshToken !== foundUser.refreshToken)


    const newUsers = [...otherUsers, {
        username: foundUser.username,
        password: foundUser.password,
        refreshToken: ''
    }]
    usersDB.setUsers(newUsers)
    await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(usersDB.users))
    res.clearCookie('jwt', { "httpOnly": true })
    res.sendStatus(204)
}

module.exports = { handleLogout }