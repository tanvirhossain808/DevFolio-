const isValidSignUpFields = (requiredArr, inputArr) => {
    return inputArr.every((requiredField) =>
        requiredArr.includes(requiredField)
    )
}
module.exports = isValidSignUpFields
