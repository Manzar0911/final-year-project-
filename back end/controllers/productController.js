import { Product } from "../models";
import multer from "multer";
import path from "path";
import fs from "fs";
import CustomErrorHandler from "../services/CustomErrorHandler";
import productSchema from "../validators/productValidator";
import cloudinary from "../helper/imageUpload"

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // 3746674586-836534453.png
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image"); // 5mb

const productController = {
  async store(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      try {
        if (err) {
          return next(CustomErrorHandler.serverError(err.message));
        }

        const filePath = req.file.path;

        // const productSchema = Joi.object({
        //     name: Joi.string().required(),
        //     price: Joi.number().required(),
        //     size: Joi.string().required(),
        // });
        const result = await cloudinary.uploader.upload(filePath,{
          public_id: `${req.user._id}_product`,
          width: 700,
          height: 600,
          crop: 'fill'
        });
        const { error } = productSchema.validate(req.body);

        if (error) {
          // fs.unlink(`${appRoot}/${filePath}`, (err) => {
          //     if (err) {
          //         return next(
          //             CustomErrorHandler.serverError(err.message)
          //         );
          //     }
          // });
          return next(error);
        }

        const { title, desc, age, price, phone } = req.body;
        const productDetail = new Product({
          title: title,
          desc: desc,
          userId: req.user._id,
          age: age,
          price: price,
          phone: phone,
          image: result.url,
        });
        const newProduct = await productDetail.save();
        res.status(201).send({
          productDetails: newProduct,
        });
      } catch (err) {
        return next(err);
      }
    });
  },
  update(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      let filePath;
      if (req.file) {
        filePath = req.file.path;
      }

      // validation
      const { error } = productSchema.validate(req.body);
      if (error) {
        // Delete the uploaded file
        if (req.file) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError(err.message));
            }
          });
        }

        return next(error);
        // rootfolder/uploads/filename.png
      }

      const { title, desc, age, price, phone } = req.body;
      let document;
      try {
        document = await Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            title,
            desc,
            age,
            price,
            phone,
            ...(req.file && { image: filePath }),
          },
          { new: true }
        );
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
  async destroy(req, res, next) {
    const document = await Product.findOneAndRemove({ _id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    // image delete
    const imagePath = document._doc.image;
    // http://localhost:5000/uploads/1616444052539-425006577.png
    // approot/http://localhost:5000/uploads/1616444052539-425006577.png
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }
      return res.json(document);
    });
  },
  async index(req, res, next) {
    let documents;
    // pagination mongoose-pagination
    try {
      documents = await Product.find()
        .select("-updatedAt -__v")
        .sort({ _id: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async show(req, res, next) {
    let document;
    try {
      document = await Product.findOne({ _id: req.params.id }).select(
        "-updatedAt -__v"
      );
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(document);
  },
  // async getProducts(req, res, next) {
  //     let documents;
  //     try {
  //         documents = await Product.find({
  //             _id: { $in: req.body.ids },
  //         }).select('-updatedAt -__v');
  //     } catch (err) {
  //         return next(CustomErrorHandler.serverError());
  //     }
  //     return res.json(documents);
  // },
};

export default productController;
