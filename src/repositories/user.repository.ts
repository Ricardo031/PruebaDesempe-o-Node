import { User } from "../models/index.js";
import type { UserCreationAttributes } from "../models/user.model.js";

export const userRepository = {
    findAll: async () => {
        return User.findAll();
    },

    findById: async (id: number) => {
        return User.findByPk(id);
    },

    findByEmail: async (email: string) => {
        return User.findOne({ where: { email } });
    },

    // the create method will create a new user in the database
    create: async (data: UserCreationAttributes) => {
        return User.create(data);
    },

    // the update method will update a user in the database
    update: async (id: number, data: Partial<UserCreationAttributes>) => {
        const user = await User.findByPk(id);
        if (!user) return null;
        return user.update(data);
    },

    // the delete method will delete a user from the database
    delete: async (id: number) => {
        const user = await User.findByPk(id);
        if (!user) return null;
        await user.destroy();
        return true;
    },
};