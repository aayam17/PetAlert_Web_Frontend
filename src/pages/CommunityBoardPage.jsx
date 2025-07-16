import React, { useEffect, useState } from "react";
import "../css/CommunityBoardPage.css";
import { getLostAndFound } from "../api/LostAndFoundApi.js";
import { getMemorials } from "../api/memorialApi";

const CommunityBoardPage = () => {
  const [lostFoundPosts, setLostFoundPosts] = useState([]);
  const [memorials, setMemorials] = useState([]);

  useEffect(() => {
    fetchLostAndFound();
    fetchMemorials();
  }, []);

  const fetchLostAndFound = async () => {
    try {
      const { data } = await getLostAndFound();
      setLostFoundPosts(data);
    } catch (error) {
      console.error("Error fetching lost and found:", error);
    }
  };

  const fetchMemorials = async () => {
    try {
      const { data } = await getMemorials();
      setMemorials(data);
    } catch (error) {
      console.error("Error fetching memorial tributes:", error);
    }
  };

  return (
    <div className="community-board-page">
      <h2 className="page-title">Community Board</h2>

      <p className="page-description">
        Welcome to the PetAlert Community Board! Here, users can connect,
        post updates, and help reunite lost pets with their owners.
      </p>

      {/* Lost & Found Board */}
      <section className="board-section">
        <h3 className="section-title">🐾 Lost & Found Board</h3>
        {lostFoundPosts.length > 0 ? (
          <div className="card-list">
            {lostFoundPosts.map((post) => (
              <div className="board-card" key={post._id}>
                <h4>
                     {post.petName
                         ? post.petName
                         : `New ${post.type?.toUpperCase()} notification`}
                </h4>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.petName || "Pet"}
                    className="board-image"
                  />
                )}
                <p><strong>Status:</strong> {post.type}</p>
                <p><strong>Location:</strong> {post.location}</p>
                <p><strong>Date:</strong> {post.date}</p>
                <p><strong>Time:</strong> {post.time}</p>
                <p><strong>Contact:</strong> {post.contactInfo}</p>
                <p><strong>Description:</strong> {post.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </section>

      {/* Memorial Tribute Board */}
      <section className="board-section">
        <h3 className="section-title">🕊️ Memorial Tribute Board</h3>
        {memorials.length > 0 ? (
          <div className="card-list">
            {memorials.map((entry) => (
              <div className="board-card" key={entry._id}>
                <h4>{entry.petName}</h4>
                {entry.imageUrl && (
                  <img
                    src={entry.imageUrl}
                    alt={entry.petName}
                    className="board-image"
                  />
                )}
                <p><strong>Date of Passing:</strong> {entry.dateOfPassing}</p>
                <p><strong>Tribute:</strong> {entry.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No memorial tributes yet.</p>
        )}
      </section>
    </div>
  );
};

export default CommunityBoardPage;
