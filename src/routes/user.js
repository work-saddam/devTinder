const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get the all pending requests for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age"])     //both are same

    res.json({ message: "Data fetched successsfully", connectionRequests });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// Get all connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({ message: "Data fetch successfully", data });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// Feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const loggedInUser = req.user;

    // Find all connection requests (sent + received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.toUserId.toString());
      hideUsersFromFeed.add(req.fromUserId.toString());
    });

    // Always get fresh users from the beginning (no skip)
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .limit(limit);

    // Get total count
    const totalUsers = await User.countDocuments({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    });

    const hasMore = totalUsers > limit;

    // Debug logging
    // console.log(`Feed Request:`, {
    //   totalUsers,
    //   returnedUsers: users.length,
    //   hasMore,
    //   hideUsersCount: hideUsersFromFeed.size,
    // });

    res.status(200).json({
      users,
      pagination: {
        currentPage: 1, // Always page 1 since we don't skip
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasMore,
        usersPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Feed error:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;
