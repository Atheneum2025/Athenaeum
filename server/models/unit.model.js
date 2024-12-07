const mongoose = require('mongoose');
const Material = require('./material.model');
const UnitSchema = new mongoose.Schema({
    unitname:{
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        required: true

    },
    course: { 
        type: String,
        ref: 'Course' 
    },
    subject: {
        type: String,
        ref: 'Subject'
    },
    materials: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Material' 
        }
    ]
},
{
    timestamps: true,
}
)

UnitSchema.pre('findOneAndUpdate', async function (next) {
    const unitId = this.getQuery().unitname;
    const updateData = this.getUpdate();

    const newUnitName = updateData.unitname;
    console.log(unitId);
    await Material.updateMany({unit: unitId},{ $set: {unit: newUnitName}})
})

module.exports = mongoose.model('Unit', UnitSchema);
