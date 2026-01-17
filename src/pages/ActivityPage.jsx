import React, { useState, useEffect, useContext } from "react";
import { NavbarContext } from "../context/AllContext";
import "../styles/profile.css";
import { Modal, Button, message, Spin, Tabs, List, Tag } from "antd";
import axios from "axios";
import { API_URL } from "../Constants";

export default function ActivityPage() {
    const { currentUser: contextUser } = useContext(NavbarContext);

    const getStoredUser = () => {
        try {
            const stored = localStorage.getItem("currentUser");
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    };

    const storedUser = getStoredUser();
    const currentUser = contextUser || storedUser;

    const [donations, setDonations] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!currentUser || !currentUser.uid) {
                setLoading(false);
                return;
            }

            try {
                // Fetch donations
                const donationsRes = await axios.post(`${API_URL}/getUserDonations`, {
                    uid: currentUser.uid,
                });
                setDonations(donationsRes.data.donations || []);

                // Fetch events/volunteers
                const eventsRes = await axios.post(`${API_URL}/getUserVolunteers`, {
                    user_id: currentUser.uid,
                });
                setEvents(eventsRes.data.volunteers || []);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [currentUser]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <Spin size="large" tip="Loading activity history..." />
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <h2>Please log in to view your activity history.</h2>
            </div>
        );
    }

    return (
        <div className="profileContainer">
            <div style={{ padding: 32 }}>
                <div style={{ marginBottom: 40, marginTop: 10 }}>
                    <h2 className="pageTitle">Activity History</h2>
                    <p style={{ marginTop: -20 }}>
                        View your donation and event registration history.
                    </p>
                </div>

                {/* History Section */}
                <div className="history-section">
                    <Tabs defaultActiveKey="1" className="history-tabs">
                        <Tabs.TabPane tab="Donations" key="1">
                            <List
                                className="history-list"
                                dataSource={donations}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={`PHP ${Number(item.amount).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                            })}`}
                                            description={
                                                <>
                                                    <Tag color={item.status === "confirmed" ? "success" : "warning"}>
                                                        {item.status?.toUpperCase()}
                                                    </Tag>
                                                    <span> via {item.paymentMethod}</span>
                                                    <br />
                                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                                locale={{ emptyText: <div className="history-empty">No donations found.</div> }}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Events" key="2">
                            <div
                                style={{
                                    maxHeight: "530px",
                                    overflowY: "auto",
                                    paddingRight: "10px",
                                }}
                            >
                                <List
                                    className="history-list"
                                    dataSource={events}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={item.eventTitle || item.title}
                                                description={
                                                    <>
                                                        <Tag color="blue">{item.registration_type || "Participant"}</Tag>
                                                        <br />
                                                        <span>{item.location}</span>
                                                        <br />
                                                        <span>{new Date(item.date || item.createdAt).toLocaleDateString()}</span>
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                    locale={{ emptyText: <div className="history-empty">No event registrations found.</div> }}
                                />
                            </div>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}