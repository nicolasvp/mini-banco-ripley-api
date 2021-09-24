const messages = {
    SERVER_UP: 'Server running on port:',
    AUTH_USER_ERROR: 'User or Password are incorrect - email validation.',
    AUTH_USER_STATUS_ERROR: 'User or Password are incorrect - user status validation.',
    AUTH_USER_PASSWORD_ERROR: 'User or Password are incorrect - password validation.',
    ADMIN_ERROR: 'Something fails please contact your admin.',
    DATABASE_INIT_ERROR: 'There is an error initializing the database!',
    DATABASE_INIT_SUCCESS: 'Database online!',
    GENERATE_TOKEN_ERROR: 'The token could not be generated.',
    TOKEN_NOT_PRESENT_ERROR: 'Token is not present in request headers.',
    INVALID_TOKEN_USER_ERROR: 'Invalid token - user validation.',
    INVALID_TOKEN_STATUS_ERROR: 'Invalid token - user status validation.',
    INVALID_TOKEN_ERROR: 'Invalid token.',
    ID_VALIDATION: 'ID is not valid',
    NAME_PRESENT_VALIDATION: 'Field name is mandatory',
    PASSWORD_LENGTH_VALIDATION: 'Field password must be 6 letters or more',
    EMAIL_FORMAT_VALIDATION: 'Field email is not valid',
    EMAIL_IS_PRESENT_VALIDATION: 'Email field is mandatory',
    PASSWORD_IS_PRESENT_VALIDATION: 'Password field is mandatory',
    USER_NOT_PRESENT: 'User not present in request.',
    INVALID_ROLE: 'Invalid role, your role must be included in valid roles list. ',
    FORBIDDEN_ROLE: 'Forbidden, your role is not admin.',
    CATEGORY_EXISTS: 'Category already exists. ',
    PRODUCT_EXISTS: 'Product already exists. ',
    ALLOWED_COLLECTIONS: 'Allowed collections are: ',
    INVALID_SEARCH: 'Invalid search',
    INVALID_MONGO_ID: 'Invalid mongo id',
    WITHDRAWALS_ERROR: 'The amount to withdrawals exceeds the available amount.',
    INVALID_AMOUNT_ERROR: 'The amount entered is invalid.'
};

module.exports = messages;