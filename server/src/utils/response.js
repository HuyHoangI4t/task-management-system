const sendSuccess = (res, data = null, message = "Success") => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

module.exports = { sendSuccess };
