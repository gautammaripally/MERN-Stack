import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  setUnreadCount,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { buildConversations } from "../utils/messages";
import { DEFAULT_LISTING_IMAGE } from "../utils/listing";

const tabConfig = [
  ["account", "Account"],
  ["listings", "Listings"],
  ["inbox", "Inbox"],
];

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error, unreadCount } = useSelector(
    (state) => state.user
  );
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingError, setListingError] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [selectedConversationKey, setSelectedConversationKey] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (!currentUser?._id) {
      return;
    }

    const fetchProfileData = async () => {
      await Promise.all([fetchListings(), fetchMessages()]);
    };

    fetchProfileData();
  }, [currentUser?._id]);

  const conversations = useMemo(
    () => buildConversations(messages, currentUser?._id || ""),
    [messages, currentUser?._id]
  );

  const selectedConversation =
    conversations.find((conversation) => conversation.key === selectedConversationKey) ||
    conversations[0] ||
    null;

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversationKey(conversations[0].key);
    }
  }, [conversations, selectedConversation]);

  useEffect(() => {
    const syncReadState = async () => {
      if (!selectedConversation || activeTab !== "inbox") {
        return;
      }

      if (selectedConversation.unreadCount === 0) {
        return;
      }

      try {
        await fetch("/api/message/mark-read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listingId: selectedConversation.listing._id,
            participantId: selectedConversation.participant._id,
          }),
        });

        setMessages((prev) =>
          prev.map((message) =>
            message.listingRef?._id === selectedConversation.listing._id &&
            message.senderRef?._id === selectedConversation.participant._id &&
            message.receiverRef?._id === currentUser._id
              ? { ...message, isRead: true }
              : message
          )
        );
        dispatch(
          setUnreadCount(
            Math.max(unreadCount - selectedConversation.unreadCount, 0)
          )
        );
      } catch (markReadError) {
        console.log(markReadError.message);
      }
    };

    syncReadState();
  }, [selectedConversationKey, activeTab]);

  const fetchListings = async () => {
    try {
      setListingError("");
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setListingError(data.message);
        return;
      }
      setUserListings(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setListingError(fetchError.message);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      setMessageError("");
      const res = await fetch("/api/message/my");
      const data = await res.json();
      if (data.success === false) {
        setMessageError(data.message);
        setMessagesLoading(false);
        return;
      }
      setMessages(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setMessageError(fetchError.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setUpdateSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (submitError) {
      dispatch(updateUserFailure(submitError.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (deleteError) {
      dispatch(deleteUserFailure(deleteError.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (signOutError) {
      dispatch(signOutUserFailure(signOutError.message));
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setListingError(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (deleteError) {
      setListingError(deleteError.message);
    }
  };

  const handleSendReply = async () => {
    if (!selectedConversation || !replyMessage.trim()) {
      return;
    }

    try {
      setSendingReply(true);
      const res = await fetch("/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: selectedConversation.listing._id,
          receiverRef: selectedConversation.participant._id,
          body: replyMessage,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setMessageError(data.message);
        setSendingReply(false);
        return;
      }

      setMessages((prev) => [data, ...prev]);
      setReplyMessage("");
      setMessageError("");
    } catch (replyError) {
      setMessageError(replyError.message);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <section className="page-shell py-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="hero-card h-fit p-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt="Profile"
              className="h-20 w-20 rounded-[28px] object-cover ring-2 ring-white"
            />
            <div>
              <p className="eyebrow">Profile workspace</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-950">
                {currentUser.username}
              </h1>
              <p className="text-sm text-slate-500">{currentUser.email}</p>
            </div>
          </div>

          {/* <div className="mt-4 rounded-[22px] bg-white/75 px-4 py-3 text-sm text-slate-600">
            Profile image editing has been removed. This project no longer depends on Firebase.
          </div> */}

          <div className="mt-8 space-y-3">
            {tabConfig.map(([tabKey, label]) => (
              <button
                key={tabKey}
                type="button"
                onClick={() => setActiveTab(tabKey)}
                className={`flex w-full items-center justify-between rounded-[22px] px-4 py-3 text-left text-sm font-semibold transition duration-300 ${
                  activeTab === tabKey
                    ? "bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,0.2)]"
                    : "bg-white/75 text-slate-700"
                }`}
              >
                <span>{label}</span>
                {tabKey === "inbox" && unreadCount > 0 && (
                  <span className="rounded-full bg-[#c96d42] px-2.5 py-1 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link to="/create-listing" className="btn-primary justify-center">
              Create listing
            </Link>
            <button onClick={handleSignOut} className="btn-secondary justify-center">
              Sign out
            </button>
            <button
              onClick={handleDeleteUser}
              className="rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-600 transition duration-300 hover:bg-rose-50"
            >
              Delete account
            </button>
          </div>
        </aside>

        <div className="space-y-6">
          {activeTab === "account" && (
            <div className="hero-card p-8">
              <p className="eyebrow">Account details</p>
              <h2 className="mt-3 font-display text-4xl text-slate-950">
                Keep your profile polished
              </h2>
              <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                    id="username"
                    className="mt-2 w-full rounded-[20px] border border-white/60 bg-white/78 px-4 py-3 outline-none transition duration-300 focus:border-[#c96d42]"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    defaultValue={currentUser.email}
                    className="mt-2 w-full rounded-[20px] border border-white/60 bg-white/78 px-4 py-3 outline-none transition duration-300 focus:border-[#c96d42]"
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="field-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="New password"
                    onChange={handleChange}
                    id="password"
                    className="mt-2 w-full rounded-[20px] border border-white/60 bg-white/78 px-4 py-3 outline-none transition duration-300 focus:border-[#c96d42]"
                  />
                </div>
                <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                  <button
                    disabled={loading}
                    className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Update profile"}
                  </button>
                  {updateSuccess && (
                    <p className="text-sm font-medium text-emerald-600">
                      Profile updated successfully.
                    </p>
                  )}
                  {error && (
                    <p className="text-sm font-medium text-rose-600">{error}</p>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === "listings" && (
            <div className="hero-card p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">Your inventory</p>
                  <h2 className="mt-3 font-display text-4xl text-slate-950">
                    Manage listings
                  </h2>
                </div>
                <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">
                  {userListings.length} listings
                </div>
              </div>

              {listingError && (
                <p className="mt-5 text-sm font-medium text-rose-600">{listingError}</p>
              )}

              <div className="mt-8 grid gap-4">
                {userListings.length === 0 && (
                  <div className="rounded-[26px] bg-white/75 p-8 text-center text-slate-600">
                    No listings yet. Create your first one from the left panel.
                  </div>
                )}

                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="grid gap-4 rounded-[28px] border border-white/60 bg-white/80 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:grid-cols-[140px_1fr_auto]"
                  >
                    <Link to={`/listing/${listing._id}`}>
                      <img
                        src={listing.imageUrls?.[0] || DEFAULT_LISTING_IMAGE}
                        alt="Listing cover"
                        className="h-32 w-full rounded-[22px] object-cover"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        className="text-2xl font-semibold text-slate-900 transition duration-300 hover:text-[#9f4c24]"
                        to={`/listing/${listing._id}`}
                      >
                        {listing.name}
                      </Link>
                      <p className="mt-2 line-clamp-2 text-sm leading-7 text-slate-600">
                        {listing.description}
                      </p>
                      <p className="mt-3 text-sm font-medium text-slate-500">
                        {listing.address}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link
                        to={`/update-listing/${listing._id}`}
                        className="btn-primary justify-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleListingDelete(listing._id)}
                        className="rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-600 transition duration-300 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "inbox" && (
            <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
              <div className="hero-card p-6">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="eyebrow">Inbox</p>
                    <h2 className="mt-3 font-display text-4xl text-slate-950">
                      Conversations
                    </h2>
                  </div>
                  <button onClick={fetchMessages} className="btn-secondary px-4 py-2 text-sm">
                    Refresh
                  </button>
                </div>

                {messagesLoading ? (
                  <p className="mt-6 text-sm text-slate-500">Loading messages...</p>
                ) : (
                  <div className="mt-6 space-y-3">
                    {conversations.length === 0 && (
                      <div className="rounded-[24px] bg-white/78 p-5 text-sm text-slate-600">
                        No conversations yet.
                      </div>
                    )}
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.key}
                        type="button"
                        onClick={() => setSelectedConversationKey(conversation.key)}
                        className={`w-full rounded-[24px] p-4 text-left transition duration-300 ${
                          selectedConversation?.key === conversation.key
                            ? "bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,0.2)]"
                            : "bg-white/78 text-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-lg font-semibold">
                              {conversation.participant.username}
                            </p>
                            <p className="truncate text-sm opacity-75">
                              {conversation.listing.name}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="rounded-full bg-[#c96d42] px-2.5 py-1 text-xs font-semibold text-white">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="hero-card p-6">
                {selectedConversation ? (
                  <>
                    <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            selectedConversation.participant.avatar ||
                            currentUser.avatar
                          }
                          alt={selectedConversation.participant.username}
                          className="h-14 w-14 rounded-[20px] object-cover"
                        />
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                            Chatting with
                          </p>
                          <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                            {selectedConversation.participant.username}
                          </h3>
                          <p className="text-sm text-slate-500">
                            About {selectedConversation.listing.name}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/listing/${selectedConversation.listing._id}`}
                        className="btn-secondary"
                      >
                        View listing
                      </Link>
                    </div>

                    <div className="mt-6 space-y-4">
                      {selectedConversation.messages.map((message) => {
                        const mine = message.senderRef?._id === currentUser._id;
                        return (
                          <div
                            key={message._id}
                            className={`flex ${mine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-[24px] px-4 py-3 text-sm leading-7 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ${
                                mine
                                  ? "bg-slate-950 text-white"
                                  : "bg-white/82 text-slate-700"
                              }`}
                            >
                              <p>{message.body}</p>
                              <p
                                className={`mt-2 text-xs ${
                                  mine ? "text-white/60" : "text-slate-400"
                                }`}
                              >
                                {new Date(message.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 rounded-[28px] bg-white/80 p-4">
                      <textarea
                        rows="4"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply here..."
                        className="w-full resize-none rounded-[22px] border border-slate-200 bg-slate-50/90 p-4 outline-none transition duration-300 focus:border-[#c96d42]"
                      />
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleSendReply}
                          disabled={sendingReply}
                          className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {sendingReply ? "Sending..." : "Send reply"}
                        </button>
                        {messageError && (
                          <p className="text-sm font-medium text-rose-600">
                            {messageError}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-[28px] bg-white/78 p-10 text-center text-slate-600">
                    Select a conversation to read and reply.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
