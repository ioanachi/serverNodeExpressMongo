
const jwt = require('jsonwebtoken')


const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("oioioioioioioioi", req.roles)

        if (!req?.roles) return res.sendStatus(401)
        const rolesArray = [...allowedRoles]
        console.log(rolesArray, "rolesArray")
        console.log(req.roles, "roles")
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true)
        if (!result) res.sendStatus(401)
        next()
    }
}
module.exports = { verifyRoles }