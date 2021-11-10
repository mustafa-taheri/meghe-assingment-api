module.exports = (req, res, next) => {
    res.header({
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*"
    })
    if (req.method == "OPTIONS") {
        res.status(200);
        res.json({});
    } else {
        next();
    }
}