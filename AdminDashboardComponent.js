import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,  
  Title       
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,  
  Title        
);


const AdminDashboardComponent = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUsers, setShowUsers] = useState(() => localStorage.getItem('activePanel') === 'users');
  const [showServices, setShowServices] = useState(() => localStorage.getItem('activePanel') === 'services');
  const [topFeatures, setTopFeatures] = useState([]);
  const [dailyLoginsPerUser, setDailyLoginsPerUser] = useState({});
  const [dailyFeatureUsageData, setDailyFeatureUsageData] = useState({});
  const [viewMode, setViewMode] = useState("user");
  const [dateRange, setDateRange] = useState("daily");

  useEffect(() => {
  fetch('http://10.10.96.100:8080/user-stats')
    .then(res => res.json())
    .then(data => {
      setUsers(data.users);
      // Filter out loginCount from top features
      setTopFeatures(
  (data.topFeatures || [])
    .filter(f => f.feature.toLowerCase() !== "logincount")
    .slice(0, 3)
);

      setDailyLoginsPerUser(data.dailyLoginsPerUser || {});
      setDailyFeatureUsageData(data.dailyFeatureUsageData || {});
      if (data.users.length > 0 && showUsers) {
        setSelectedUser(data.users[0]);
      }
    });
}, []);

  const togglePanel = () => {
    setShowUsers(prev => {
      const newState = !prev;
      localStorage.setItem('activePanel', newState ? 'users' : '');
      setShowServices(false);
      if (newState && users.length > 0) {
        setSelectedUser(users[0]);
      } else {
        setSelectedUser(null);
      }
      return newState;
    });
  };

  const toggleServices = () => {
    setShowServices(prev => {
      const newState = !prev;
      localStorage.setItem('activePanel', newState ? 'services' : '');
      setShowUsers(false);
      setSelectedUser(null);
      return newState;
    });
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const getDoughnutChartData = () => {
    const userStats = { ...selectedUser };
    delete userStats.username;
    delete userStats.password;
    delete userStats.loginCount;
    delete userStats.activityLog;

    const labels = Object.keys(userStats);
    const data = labels.map(key => Number(userStats[key]) || 0);
    const colors = [
      '#4CAF50', '#F44336', '#2196F3', '#FFC107', '#9C27B0',
      '#00BCD4', '#FF9800', '#795548', '#607D8B', '#E91E63'
    ];

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 1
      }]
    };
  };

  const getBarChartData = () => ({
    labels: topFeatures.map(f => f.feature),
    datasets: [{
      label: 'Usage Count',
      data: topFeatures.map(f => f.count),
      backgroundColor: ['#4CAF50', '#FFC107', '#2196F3']
    }]
  });

  const getTotalEvents = () => {
    if (!selectedUser) return 0;
    return Object.entries(selectedUser).reduce((sum, [key, val]) => {
      if (!['username', 'password', 'loginCount', 'activityLog'].includes(key)) {
        return sum + (Number(val) || 0);
      }
      return sum;
    }, 0);
  };

  const filterDates = (dates) => {
    const today = new Date();
    return dates.filter(date => {
      const d = new Date(date);
      if (dateRange === "daily") return d.toDateString() === today.toDateString();
      if (dateRange === "weekly") return (today - d) / (1000 * 60 * 60 * 24) <= 7;
      if (dateRange === "monthly") return (today - d) / (1000 * 60 * 60 * 24) <= 30;
      return true;
    });
  };

  const getLoginChartData = () => {
    const dates = new Set();
    Object.values(dailyLoginsPerUser).forEach(userLogins =>
      Object.keys(userLogins).forEach(date => dates.add(date))
    );

    let sortedDates = [...dates].sort();
    sortedDates = filterDates(sortedDates);

    if (viewMode === "user") {
      const datasets = Object.entries(dailyLoginsPerUser).map(([username, logins]) => ({
        label: username,
        data: sortedDates.map(date => logins[date] || 0),
        borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        backgroundColor: dateRange === "daily" ? '#' + Math.floor(Math.random() * 16777215).toString(16) : 'transparent',
        tension: 0.3
      }));

      return { labels: sortedDates, datasets };
    } else {
      const dailyTotals = {};
      Object.values(dailyLoginsPerUser).forEach(logins => {
        sortedDates.forEach(date => {
          dailyTotals[date] = (dailyTotals[date] || 0) + (logins[date] || 0);
        });
      });

      return {
        labels: sortedDates,
        datasets: [{
          label: "Total Logins",
          data: sortedDates.map(date => dailyTotals[date] || 0),
          borderColor: "#2196F3",
          backgroundColor: dateRange === "daily" ? "#2196F3" : "transparent",
          tension: 0.3
        }]
      };
    }
  };

  const getFeatureUsageChartData = () => {
    let sortedDates = Object.keys(dailyFeatureUsageData).sort();
    sortedDates = filterDates(sortedDates);

    const allFeatures = new Set();
    sortedDates.forEach(date =>
      Object.keys(dailyFeatureUsageData[date] || {}).forEach(f => allFeatures.add(f))
    );

    const datasets = [...allFeatures].map(feature => ({
      label: feature,
      data: sortedDates.map(date => dailyFeatureUsageData[date]?.[feature] || 0),
      borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      backgroundColor: dateRange === "daily" ? '#' + Math.floor(Math.random() * 16777215).toString(16) : "transparent",
      tension: 0.3
    }));

    return { labels: sortedDates, datasets };
  };

  const renderLoginChart = () => {
    const chartData = getLoginChartData();
    const isDaily = dateRange === "daily";
    const ChartComponent = isDaily ? Bar : Line;

    return (
      <div className="chart-container">
        <div style={{ flex: 1, height: "400px",marginRight:"200px",marginTop:"100px" }}>
          <ChartComponent
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: isDaily ? { y: { beginAtZero: true, ticks: { precision: 0 } } } : {}
            }}
          />
        </div>
        {/* <div className="chart-legend">
          {chartData.datasets.map((ds, i) => (
            <div key={i}>
              <span style={{
                backgroundColor: ds.borderColor,
                width: "12px", height: "12px", display: "inline-block", marginRight: "6px"
              }}></span>
              {ds.label}
            </div>
          ))}
        </div> */}
      </div>
    );
  };

  const renderFeatureUsageChart = () => {
    const chartData = getFeatureUsageChartData();
    const isDaily = dateRange === "daily";
    const ChartComponent = isDaily ? Bar : Line;

    return (
      <div className="chart-container">
        <div style={{ flex: 1, height: "400px" }}>
          <ChartComponent
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: isDaily ? { y: { beginAtZero: true, ticks: { precision: 0 } } } : {}
            }}
          />
        </div>
        <div className="chart-legend">
          {chartData.datasets.map((ds, i) => (
            <div key={i}>
              <span style={{
                backgroundColor: ds.borderColor,
                width: "12px", height: "12px", display: "inline-block", marginRight: "6px"
              }}></span>
              {ds.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
  <h3 onClick={togglePanel} style={{ cursor: 'pointer' }}>
    {showUsers ? '▼ Users' : '▶ Users'}
  </h3>

  {showUsers && (
    <>
      <div className="user-list">
        <ul>
          {users.map((user, idx) => (
            <li key={idx} onClick={() => handleUserClick(user)}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && (
        <div className="summary-container">
          <h4>Stats</h4>
          {Object.entries(selectedUser).map(([key, val]) =>
            !['username', 'password', 'loginCount', 'activityLog'].includes(key) ? (
              <div key={key}><strong>{key}:</strong> {val}</div>
            ) : null
          )}
          <div style={{ marginTop: '10px' }}>
            Total Events: <strong>{getTotalEvents()}</strong>
          </div>
        </div>
      )}
    </>
  )}

  <h3 onClick={toggleServices} style={{ cursor: 'pointer', marginTop: '10px' }}>
    {showServices ? '▼ Services' : '▶ Services'}
  </h3>

  {showServices && (
    <div className="summary-container">
      <h4>Top Services</h4>
      <ul>
        {topFeatures.map((f, i) => (
          <li key={i}><strong>{f.feature}</strong>: {f.count}</li>
        ))}
      </ul>
    </div>
  )}

  {/* Version at bottom */}
  <div className="version-label">v1.0.1</div>
</aside>


      <main className="main-panel">
        {showUsers && selectedUser && (
          <>
            <h2 style={{ textAlign: 'center' }}>Stats for {selectedUser.username}</h2>
            <div className="chart-wrapper" style={{ marginTop: '40px' }}>
              <Doughnut
                data={getDoughnutChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: { position: 'right', labels: { font: { size: 10 } } }
                  }
                }}
              />
            </div>
          </>
        )}

        {showServices && topFeatures.length > 0 && (
          <div className="bar-chart-wrapper">
            <h2>Top 3 Used Features</h2>
            <Bar
              data={getBarChartData()}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
        )}

        {!showUsers && !showServices && (
          <>
            <div className="default-stats">
              <h2>Daily Login Counts</h2>

              <div className="btn-group">
                <button className={dateRange === "daily" ? "active" : ""} onClick={() => setDateRange("daily")}>Daily</button>
                <button className={dateRange === "weekly" ? "active" : ""} onClick={() => setDateRange("weekly")}>Weekly</button>
                <button className={dateRange === "monthly" ? "active" : ""} onClick={() => setDateRange("monthly")}>Monthly</button>
              </div>

              <div className="btn-group" style={{ marginTop: '10px' }}>
                <button className={viewMode === "user" ? "active" : ""} onClick={() => setViewMode("user")}>User-Based</button>
                <button className={viewMode === "date" ? "active" : ""} onClick={() => setViewMode("date")}>Date-Based</button>
              </div>

              {renderLoginChart()}

              <h2 style={{ marginTop: "40px" }}>Daily Feature Usage</h2>
              {renderFeatureUsageChart()}
            </div>
            
          </>
        )}
        
      </main>
    </div>
    
  );
};

export default AdminDashboardComponent;