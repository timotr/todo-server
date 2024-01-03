import { sessions } from "./database.js"

export function authorize(req, res, next) {
    let token = req.headers.authorization.substring(7)

    if (!token) {
        res.status(401).send("Unauthorized - missing Bearer token")
        return
    }

    let userId = sessions[token]

    if (!userId) {
        res.status(401).send("Unauthorized")
        return
    }

    req.currentUserId = userId

    next();
}