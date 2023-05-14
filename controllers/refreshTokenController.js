const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const path = require('path')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.sendStatus(401)
    console.log("aaaaaaaaaaa")
    const refreshToken = cookies.jwt

    const foundUser = usersDB.users.find(el => el.refreshToken === refreshToken)
    if (!foundUser) return res.sendStatus(403) //forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                return res.sendStatus(403)
            }
            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }

            )
            res.status(200).json({ accessToken })
        }
    )

}

module.exports = { handleRefreshToken }