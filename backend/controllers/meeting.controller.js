const Meeting = require("../models/Meeting.model");
const { v4: uuidv4 } = require("uuid");

exports.hostMeeting = async (req, res) => {
  try {
    const meetingCode = uuidv4().slice(0, 6); // 6-char meeting code
    const meeting = new Meeting({
      host: req.user.id,
      meetingCode,
      participants: [req.user.id]
    });
    await meeting.save();

    res.json({ msg: "Meeting created", meetingCode });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.joinMeeting = async (req, res) => {
  try {
    const { meetingCode } = req.body;
    const meeting = await Meeting.findOne({ meetingCode });
    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    if (!meeting.participants.includes(req.user.id)) {
      meeting.participants.push(req.user.id);
      await meeting.save();
    }

    res.json({ msg: "Joined meeting", meetingCode });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
