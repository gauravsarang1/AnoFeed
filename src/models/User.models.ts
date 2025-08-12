import mongoose, {Schema, Model, Document} from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date
}

export const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyExpiry: Date,
    isVerified: boolean,
    isAcceptMessages: boolean,
    Messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'user name is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'email is required ']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    verifyCode: {
        type: String,
    },
    verifyExpiry: {
        type: Date,
        required: [true, 'Verification code is expired']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptMessages: {
        type: Boolean,
        default: true
    },
    Messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User', UserSchema))
export default UserModel