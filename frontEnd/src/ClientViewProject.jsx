import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  IndianRupee,
  Clock,
  CheckCircle2,
  MessageCircle,
  XCircle,
} from "lucide-react";
import Clientheader from "./Clientheader";
import API from "./API";

function ClientViewProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, proposalsRes] = await Promise.all([
          API.get(`/postjobs/${projectId}`),
          API.get(`/proposals/project/${projectId}`),
        ]);

        if (projectRes.data.success) setProject(projectRes.data.project);
        if (proposalsRes.data.success)
          setProposals(proposalsRes.data.proposals);
      } catch (error) {
        console.log("Fetch Client Project Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleAccept = async (proposalId) => {
    setActionError("");
    setAcceptingId(proposalId);

    try {
      const res = await API.patch(`/proposals/${proposalId}/accept`);

      if (res.data.success) {
        setProposals((prev) =>
          prev.map((p) =>
            p._id === proposalId
              ? { ...p, status: "accepted" }
              : { ...p, status: "rejected" },
          ),
        );

        setProject((prev) => ({ ...prev, status: "in-progress" }));
      }
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Failed to accept proposal.",
      );
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (proposalId) => {
    setActionError("");
    setRejectingId(proposalId);

    try {
      const res = await API.patch(`/proposals/${proposalId}/reject`);

      if (res.data.success) {
        setProposals((prev) =>
          prev.map((p) =>
            p._id === proposalId ? { ...p, status: "rejected" } : p,
          ),
        );
      }
    } catch (error) {
      setActionError(
        error.response?.data?.message || "Failed to reject proposal.",
      );
    } finally {
      setRejectingId(null);
    }
  };

  const handleChat = (freelancerId) => {
    navigate(`/clientmessages/${freelancerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10002b] text-white">
        <Clientheader />
        <p className="text-center py-20 text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#10002b] text-white">
        <Clientheader />
        <p className="text-center py-20 text-gray-300">Project not found</p>
      </div>
    );
  }

  const projectHasAcceptedProposal = proposals.some(
    (p) => p.status === "accepted",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] text-white">
      <Clientheader />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft size={18} /> Back to My Projects
        </button>

        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-purple-200 mb-8">{project.description}</p>

        <h2 className="text-xl font-bold mb-4">
          Proposals ({proposals.length})
        </h2>

        {actionError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">
            {actionError}
          </div>
        )}

        {proposals.length === 0 && (
          <p className="text-gray-400">No proposals received yet.</p>
        )}

        <div className="space-y-4">
          {proposals.map((p) => (
            <div
              key={p._id}
              className={`bg-white/10 border rounded-xl p-5 ${
                p.status === "accepted"
                  ? "border-green-400/50"
                  : "border-white/10"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">
                  {p.freelancerId?.fullName || "Freelancer"}
                </h3>
                <div className="flex items-center gap-1 text-purple-300 font-bold">
                  <IndianRupee size={16} />
                  {p.bidAmount}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-3">{p.coverLetter}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Clock size={14} />
                  {p.deliveryTime} days delivery
                </div>

                <div className="flex items-center gap-3">
                  {p.status === "accepted" && (
                    <>
                      <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                        <CheckCircle2 size={16} />
                        Accepted
                      </span>

                      <button
                        type="button"
                        onClick={() => handleChat(p.freelancerId?._id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium transition"
                      >
                        <MessageCircle size={16} />
                        Chat
                      </button>
                    </>
                  )}

                  {p.status === "rejected" && (
                    <span className="text-gray-500 text-sm">Rejected</span>
                  )}

                  {p.status !== "accepted" &&
                    p.status !== "rejected" &&
                    !projectHasAcceptedProposal && (
                      <>
                        <button
                          type="button"
                          disabled={rejectingId === p._id}
                          onClick={() => handleReject(p._id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50 border border-white/10 rounded-lg text-sm font-medium transition"
                        >
                          <XCircle size={16} />
                          {rejectingId === p._id ? "Rejecting..." : "Reject"}
                        </button>

                        <button
                          type="button"
                          disabled={acceptingId === p._id}
                          onClick={() => handleAccept(p._id)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition"
                        >
                          {acceptingId === p._id ? "Accepting..." : "Accept"}
                        </button>
                      </>
                    )}

                  {p.status !== "accepted" &&
                    p.status !== "rejected" &&
                    projectHasAcceptedProposal && (
                      <span className="text-gray-500 text-sm">
                        Position filled
                      </span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientViewProject;
