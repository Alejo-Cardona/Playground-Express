import userSchema from "../models/user.schema.js";

class userDAO {

    static async getUserByEmail(email) {
        return await userSchema.findOne({email})
    }

    static async getUserById(id) {
        return await userSchema.findOne({_id:id}, {first_name:1, last_name:1, email:1, age:1, admin:1}).lean()
    }

    static async setPasswordUser(email, newPassword) {
        return await userSchema.findOneAndUpdate(
                { email: email },
                { $set: { password: newPassword } },
                { new : true  }
            )
    }

    static async insert(first_name, last_name, age, email, password) {
        return await new userSchema({first_name, last_name, age, email, password}).save();
    }
}

export default userDAO