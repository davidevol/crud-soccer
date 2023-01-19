const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
  
    if (!document) {
      return next(new AppError("Document not found with that ID", 404));
    }
  
    res.status(204).end();
  });
