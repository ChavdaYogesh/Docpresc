import mongoose from 'mongoose'

const searchHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symptoms: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    medicalHistory: {
        type: String,
        default: ''
    },
    recommendations: [{
        name: String,
        genericName: String,
        category: String,
        dosage: String,
        sideEffects: String,
        precautions: String,
        confidence: Number
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Index for faster queries
searchHistorySchema.index({ userId: 1, timestamp: -1 })

const searchHistoryModel = mongoose.model('SearchHistory', searchHistorySchema)

export default searchHistoryModel
