let bcrypt = require("bcryptjs")

let register = async (request,response) => {
    let {username, password } = request.body
    const db = request.app.get("db")
    let existingUser = await db.get_user([username]).catch(error => console.log(error))
    if(existingUser[0]) {
        response.status(409).json("username already taken")
    } else {
        let hash = await bcrypt.hash(password, 10)
        let newUser = await db.create_user([username,hash])
        console.log(newUser)
        request.session.user = {
            username,
            id: newUser[0].user_id
        }

        response.json(request.session.user)
    }
}

let login = async (request, response) => {
    let {username, password} = request.body
    const db = request.app.get("db")

    let user = await db.get_user(username)

    if (!user[0]) {
        response.status(403).json("username or password is incorrect")
    } else {
        const isAuthorized = await bcrypt.compare(password, user[0].password)
        if(!isAuthorized) {
            response.status(403).json("username or password is incorrect")
        } else {
            request.session.user = {
                username,
                id: user[0].user_id
            }
            response.json(request.session.user)
        }

    }

}

module.exports = {
    register,
    login
}