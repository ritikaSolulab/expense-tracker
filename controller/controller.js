const model = require('../models/model');

//  post: http://localhost:8080/api/categories
exports.create_Categories = async (req, res, next) => {
    try {
      const {type, color} = req.body
      if(!req.body){
        return res.status(400).json({
          success: false,
          message: "Provide valid details"
        })
      }
      const newCategories = await model.Categories.create({type, color});
      return res.status(200).json(newCategories);
    } catch (err) {
      next(err);
    }
};

//  get: http://localhost:8080/api/categories
exports.get_Categories = async (req, res, next) => {
    try {
      const data = await model.Categories.find({});
      const filter = await data.map(v => Object.assign({}, { type: v.type, color: v.color}));
      return res.status(200).json(filter);
    } catch (err) {
      next(err);
    }
};
  

//  post: http://localhost:8080/api/transaction
exports.create_Transaction = async (req, res, next) => {
    try {
      const {name, type, amount} = req.body
      if(!req.body){
        return res.status(400).json({
          success: false,
          message: "Provide valid details"
        })
      }
      const transaction = await model.Transaction.create({name, type, amount, date: new Date()});
      return res.status(200).json(transaction);
    } catch (err) {
      next(err);
    }
};

//  get: http://localhost:8080/api/transaction
exports.get_Transaction = async (req, res, next) => {
    try {
      const data = await model.Transaction.find({});
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
};

//  delete: http://localhost:8080/api/transaction
exports.delete_Transaction = async (req, res, next) => {
    try {
      await model.Transaction.findByIdAndUpdate(req.params.id, {$set:{isDeleted:true}});
      return res.status(200).json({
        success: true,
        message: "Transaction has been deleted."
      });
    } catch (err) {
      next(err);
    }
};

//  get: http://localhost:8080/api/labels
exports.get_Labels = async(req, res, next) => {

    model.Transaction.aggregate([
        {
            $lookup : {
                from: "categories",
                localField: 'type',
                foreignField: "type",
                as: "categories_info"
            }
        },
        {
            $unwind: "$categories_info"
        }
    ]).then(result => {
        const data = result.map(v => Object.assign({}, { _id: v._id, name: v.name, type: v.type, amount: v.amount, color: v.categories_info['color']}));
        res.json(data);
    }).catch(error => {
        res.status(400).json("Looup Collection Error");
    })

}