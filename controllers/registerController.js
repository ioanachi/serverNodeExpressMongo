const User = require('../model/User')

const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' })

    const duplicate = await User.findOne({ username: user }).exec()
    if (duplicate) return res.status(409).json({ "message": "User alredy exists" })
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10)
        const newUser = {
            "username": user,
            "roles": { "User": 2001 },
            "password": hashedPwd,

        }
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )

        res.status(201).json({ 'success': `New user ${newUser.username}  ${newUser.password} created!` });
    } catch (err) {
        console.log(err, "ppppppppppp")
        res.status(500).json({ 'message': err.message });
    }
}


module.exports = { handleNewUser }