const Submission = require("../models/Submission")
const Assignment = require("../models/Assignment")

exports.submitAssignment = async (req, res, next)=>{
    try{
        const {assignmentId, githubUrl, liveDemoUrl, notes}=req.body;
        const studentId = req.user._id;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment){
            return res.status(404).json({
                success: false, message: "Assignment not found"
            })
        }
       const existingSubmission = await Submission.findOne({assignmentId, studentId});
       if (existingSubmission){
        return res.status(404).json({
            success: false, message: "You have already submited this assignment."
        })
       }
       const newSubmission = await Submission.create({
        assignmentId,
        studentId,
        githubUrl,
        liveDemoUrl,
        notes,
        status: "submitted"
       })
       return res.status(201).json({
        success: true, message: "Assignment submitted successfully", data: newSubmission
       })
    }catch(err){
        console.error("Error in submitAssignment:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }

}

exports.gradeSubmission = async (req, res, next)=>{
    try{
        const {score, feedback, status} = req.body;
        const gradedBy = req.user._id;

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            {
                score,
                feedback,
                status: status || "graded",
                gradedBy,
                gradedAt: Date.now()
            },
            {returnDocument: "after", runValidators: true}
        ).populate("studentId", "fullName email")
        .populate("assignmentId", "title maxScore");
        if (!submission){
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Submission graded successfully",
            data: submission
        })
    }catch(err){
        console.error("Error in gradeSubmission:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

exports.getSubmissionsByAssignment = async (req, res, next)=>{
    try{
        const submissions = await Submission.find({assignmentId: req.params.assignmentId})
        .populate("studentId", "fullName email phone");
        return res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions
        });
    } catch(err){
      console.error("Error in getSubmissionsByAssignment:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error"  
    });
    }
};