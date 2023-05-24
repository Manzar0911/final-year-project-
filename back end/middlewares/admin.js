import { User } from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';

const admin = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (user.role === 'customer') {
            next();
        } else {
            return next(CustomErrorHandler.unAuthorized());
        }
        // next();
    } catch (err) {
        return next(CustomErrorHandler.serverError(err.message));
    }
};

export default admin;