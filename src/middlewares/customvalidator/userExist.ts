import { User } from "../../models/User";

export const emailExistCustom = async (email: String) => {
    const user = await User.findOne({ email: email });
    if (user) throw new Error('Email already exist!');
}