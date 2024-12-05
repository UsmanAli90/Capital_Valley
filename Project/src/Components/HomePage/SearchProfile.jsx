import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams(); 
  const [searchParams] = useSearchParams(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const role = searchParams.get("role"); 

      try {
        const { data } = await axios.get(`http://localhost:3000/profile/${id}?role=${role}`);
        setUser(data);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, searchParams]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{user.username}'s Profile</h1>
      <p><strong>Role:</strong> {searchParams.get("role")}</p>
      {user.role === "startup" && (
        <p><strong>Startup Name:</strong> {user.startupName}</p>
      )}
      {user.role === "investor" && (
        <p><strong>Investment Interests:</strong> {user.interests.join(", ")}</p>
      )}
    </div>
  );
};

export default Profile;
