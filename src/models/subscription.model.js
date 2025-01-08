import mongoose, {Schema} from "mongoose";


const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    }   
}, {timestamps: true})


export const Subscription = mongoose.model("Subscription", subscriptionSchema)


// siubscriber count channel se aata hai na ki user count se
// ek document banta h jo store krta ek to channel name aur subscriber jo aay ehai
// jitne documents utne subscriber aapke
