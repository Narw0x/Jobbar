import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    reportedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reportedEntityType: {  // This can help to decide which model to populate
      type: String,
      required: true,
    },
    reportedByType: {  // Same for 'reportedBy'
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
