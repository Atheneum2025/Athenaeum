const ProfessorDetails = require("../models/professorDetails.model.js")
const {asyncWrapper} = require("../middlewares/async.js");
const professorDetailsModel = require("../models/professorDetails.model.js");

const enterProfessorDetails = asyncWrapper( async (req, res) => {
    // take the data from req.body
    const professor = ProfessorDetails.create(req.body);
    if(!professor){
        res.status(400).json({message: "Couldn't enter professor Details"});
    }
    res.status(200).json({message: "Entered details the db"})
})

const removeProfessorDetails = asyncWrapper( async (req, res) => {
    // delete the details
    const { professorName } = req.params;
    const professor = await ProfessorDetails.findOneAndDelete({ professorId: professorName })
    if (!professorDetailsModel) {
        return res.status(404).json({ mag: `no User with id : ${professorName}` })
    }
    res.status(200).json({ professor });
})

const updateProfessorDetails = asyncWrapper( async (req, res) => {
    const { professorName } = req.params;

    const professor = await ProfessorDetails.findOneAndUpdate({ professorName: professorName }, req.body, {
        new: true,
        runValidators: true
    })

    if (!professor) {
        return res.status(404).json({ mag: `no User with id : ${professorName}` })
    }
    res.status(200).json({ professor })
})

const getProfessorDetails = asyncWrapper( async (req, res) => {
    // only display to the admin and the professor itself
    // use aggregate fumctions for getting all docs
    
    const { professorName } = req.params;
    const professor = await ProfessorDetails.findOne({ professorName: professorName })

    if (!professor) {
        return res.status(404).json({ mag: `no User with id : ${professorName}` })
    }
    res.status(200).json({ professor })
})

const displayProfessorAccount = asyncWrapper( async (req, res) => {
    // display to all , student and all other professors
    // use aggregate fumctions for getting only college name and experience
    const { professorName } = req.params;
    const professor = await ProfessorDetails.findOne({ professorName: professorName })

    if (!professor) {
        return res.status(404).json({ mag: `no User with id : ${professorName}` })
    }
    res.status(200).json({ professor })
})

module.exports ={
    enterProfessorDetails,
    removeProfessorDetails,
    updateProfessorDetails,
    getProfessorDetails,
    displayProfessorAccount
}