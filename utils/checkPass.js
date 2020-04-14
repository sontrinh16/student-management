module.exports = (passwordChangeAt, jwtIat) => {
    if (passwordChangeAt !== null){
        const changeTimestamp = parseInt(passwordChangeAt.getTime() / 1000, 10);

        return jwtIat < changeTimestamp;
    }
    return false;
}