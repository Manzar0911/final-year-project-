import { User, Product } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const userController = {
  async me(req, res, next) {
    // console.log(req);
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -updatedAt -__v"
      );
      const products = await Product.find({})({ userId: user._id });

      // console.log(user);
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
      res.status(200).send({
        accoutDetails: user,
        userProducts: products,
      });
    } catch (err) {
      return next(err);
    }
  },
};

export default userController;
