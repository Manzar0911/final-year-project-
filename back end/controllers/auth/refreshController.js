import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";

const refreshController = {
  async refresh(req, res, next) {
    // console.log(req);
    // validation
    try {
      const refreshSchema = Joi.object({
        refresh_token: Joi.string().required(),
      });
      // console.log(req);
      const { error } = refreshSchema.validate(req.body);

      if (error) {
        return next(error);
      }

      // database
      let refreshtoken;
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refreshtoken) {
        return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
      }

      let userId;
      const { _id } = await JwtService.verify(
        refreshtoken.token,
        REFRESH_SECRET
      );
      userId = _id;

      const user = await User.findOne({ _id: userId });
      if (!user) {
        return next(CustomErrorHandler.unAuthorized("No user found!"));
      }

      // tokens
      // Toekn
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
      res.send({
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } catch (err) {
      console.log(error);
      return next(new Error("Something went wrong " + err.message));
    }
  },
};

export default refreshController;
