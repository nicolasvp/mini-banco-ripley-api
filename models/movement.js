const { Schema, model } = require('mongoose');

const MovementSchema = Schema({
    rut: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    from: {
        type: String,
        required: true
    },
    destiny: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['LOAD', 'TRANSFER', 'WITHDRAWALS']
    },
});

module.exports = model('Movement', MovementSchema);