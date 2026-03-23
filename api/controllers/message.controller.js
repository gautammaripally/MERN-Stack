import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import Message from "../models/message.model.js";
import { errorHandler } from "../utils/error.js";
import { isSampleListing } from "../utils/listing.js";

const populateMessageQuery = (query) =>
  query
    .populate("senderRef", "username email avatar")
    .populate("receiverRef", "username email avatar")
    .populate("listingRef", "name imageUrls userRef");

export const sendMessage = async (req, res, next) => {
  try {
    const { listingId, receiverRef, body } = req.body;

    if (!listingId || !body?.trim()) {
      return next(errorHandler(400, "Listing and message are required!"));
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return next(errorHandler(400, "Invalid listing!"));
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (isSampleListing(listing)) {
      return next(
        errorHandler(
          400,
          "This is sample data. Messaging is disabled for demo listings."
        )
      );
    }

    const resolvedReceiverRef = receiverRef || listing.userRef;

    if (!mongoose.Types.ObjectId.isValid(resolvedReceiverRef)) {
      return next(errorHandler(400, "Invalid receiver!"));
    }

    if (req.user.id === resolvedReceiverRef) {
      return next(errorHandler(400, "You cannot message yourself!"));
    }

    const message = await Message.create({
      listingRef: listingId,
      senderRef: req.user.id,
      receiverRef: resolvedReceiverRef,
      body: body.trim(),
    });

    const populatedMessage = await populateMessageQuery(
      Message.findById(message._id)
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMyMessages = async (req, res, next) => {
  try {
    const messages = await populateMessageQuery(
      Message.find({
        $or: [{ senderRef: req.user.id }, { receiverRef: req.user.id }],
      }).sort({ createdAt: -1 })
    );

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const getUnreadMessageCount = async (req, res, next) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiverRef: req.user.id,
      isRead: false,
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markConversationRead = async (req, res, next) => {
  try {
    const { listingId, participantId } = req.body;

    if (!listingId || !participantId) {
      return next(
        errorHandler(400, "Listing and participant are required to mark read!")
      );
    }

    await Message.updateMany(
      {
        listingRef: listingId,
        senderRef: participantId,
        receiverRef: req.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
