import {
  Users,
  Activity,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Overview of LangApp activity</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-top">
            <h3>Total Users</h3>
            <Users className="stat-icon" />
          </div>

          <div className="stat-value">5</div>
          <div className="stat-sub">+10.2% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <h3>Active Users</h3>
            <Activity className="stat-icon" />
          </div>

          <div className="stat-value">3</div>
          <div className="stat-sub">+5 since last hour</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <h3>New Feedback</h3>
            <MessageSquare className="stat-icon" />
          </div>

          <div className="stat-value">+1</div>
          <div className="stat-sub">from the last 7 days</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <h3>Engagement Rate</h3>
            <TrendingUp className="stat-icon" />
          </div>

          <div className="stat-value">78.5%</div>
          <div className="stat-sub">+2.5% from last month</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>User Activity</h2>
          <p>Monthly new users in the last 6 months.</p>
        </div>

        <div className="chart-placeholder">
          {/* Тут позже подключим Recharts */}
          <div className="fake-bar" />
          <div className="fake-bar" />
          <div className="fake-bar" />
          <div className="fake-bar" />
          <div className="fake-bar" />
          <div className="fake-bar" />
        </div>
      </div>
    </div>
  );
}
