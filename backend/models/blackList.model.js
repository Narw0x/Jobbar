import mongoose from "mongoose";

const BlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: '1d' } },
});

const Blacklist = mongoose.model('Blacklist', BlacklistSchema);

export default Blacklist;
