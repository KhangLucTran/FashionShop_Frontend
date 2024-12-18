import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./InvoiceManagement.css";
import { getAdminToken, getToken } from "../../services/localStorageService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InvoiceManagement = ({ invoices, updateInvoiceStatus }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [activeTab, setActiveTab] = useState("pending");

  // Bộ lọc hóa đơn
  // Lọc hóa đơn có trạng thái "Pending"
  const pendingInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.status === "Pending"),
    [invoices]
  );
  // Lọc hóa đơn có trạng thái "Completed"
  const completedInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.status === "Completed"),
    [invoices]
  );

  // Tính tổng số tiền thu nhập
  useEffect(() => {
    const income = completedInvoices.reduce(
      (sum, invoice) => sum + invoice.totalAmount,
      0
    );
    setTotalIncome(income);
  }, [completedInvoices]);

  // Nhóm dữ liệu hóa đơn theo ngày và tính tổng số tiền
  const groupedData = useMemo(() => {
    const grouped = invoices.reduce((acc, invoice) => {
      const date = new Date(invoice.issuedAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { total: 0, count: 0, details: [] };
      }
      acc[date].total += invoice.totalAmount;
      acc[date].count += 1;
      acc[date].details.push(invoice);
      return acc;
    }, {});

    const labels = Object.keys(grouped);
    const data = labels.map((date) => grouped[date].total);
    const details = labels.map((date) => grouped[date]);

    return { labels, data, details };
  }, [invoices]);

  // Dữ liệu biểu đồ
  const chartData = {
    labels: groupedData.labels,
    datasets: [
      {
        label: "Tổng số tiền (VND)",
        data: groupedData.data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu khi hover vô cột trong biểu đồ
  // Gồm có số tiền mỗi sản phẩm, mã sản phẩm, tổng tiền trong ngày, tổng số sản phẩm
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tổng số tiền hóa đơn theo ngày",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const details = groupedData.details[index];
            return [
              `Tổng tiền: ${details.total.toLocaleString()} VND`,
              `Số hóa đơn: ${details.count}`,
              ...details.details.map(
                (invoice) =>
                  `- Mã hóa đơn: ${
                    invoice._id
                  } | ${invoice.totalAmount.toLocaleString()} VND`
              ),
            ];
          },
        },
      },
    },
  };

  // Xác nhận hóa đơn
  const confirmInvoice = async (id) => {
    try {
      const tokenUse = getAdminToken();
      const response = await fetch(
        `http://localhost:5000/api/invoice/confirm/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenUse}`,
          },
        }
      );

      if (response.ok) {
        alert("Đơn hàng đã được xác nhận thành công!");

        const updatedInvoices = invoices.map((invoice) =>
          invoice._id === id ? { ...invoice, status: "Completed" } : invoice
        );

        const income = updatedInvoices.reduce(
          (sum, invoice) =>
            invoice.status === "Completed" ? sum + invoice.totalAmount : sum,
          0
        );
        setTotalIncome(income);

        updateInvoiceStatus(
          updatedInvoices.find((invoice) => invoice._id === id)
        );

        setSelectedInvoice(null);
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || "Không thể xác nhận hóa đơn!"}`);
      }
    } catch (error) {
      console.error("Xác nhận đơn hàng thất bại:", error);
      alert("Có lỗi xảy ra khi xác nhận đơn hàng!");
    }
  };

  return (
    <section className="admin-home__invoice-management">
      <h2 className="admin-home__section-title">Quản lý Hóa đơn</h2>
      <p className="admin-home__total-income">
        Tổng thu nhập: <span>{totalIncome.toLocaleString()} VND</span>
      </p>

      {/* Biểu đồ */}
      <Bar data={chartData} options={chartOptions} />

      {/* Tabs hóa đơn */}
      <div className="admin-home__invoice-tabs">
        <button
          className={`admin-home__tab-button ${
            activeTab === "pending" ? "active" : ""
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Đơn hàng chưa xác nhận ({pendingInvoices.length})
        </button>
        <button
          className={`admin-home__tab-button ${
            activeTab === "completed" ? "active" : ""
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Đơn hàng đã xác nhận ({completedInvoices.length})
        </button>
      </div>

      {/* Danh sách hóa đơn */}
      {/* Danh sách hóa đơn chưa hoàn thành */}
      <div className="admin-home__invoice-category">
        {activeTab === "pending" && (
          <ul className="admin-home__invoice-list">
            {pendingInvoices.map((invoice) => (
              <li
                key={invoice._id}
                className="admin-home__invoice-item pending"
              >
                <span>Mã hóa đơn: {invoice._id}</span> |{" "}
                <span className={`status ${invoice.status}`}>
                  Trạng thái: {invoice.status}
                </span>
                <button onClick={() => setSelectedInvoice(invoice)}>
                  Xem chi tiết
                </button>
              </li>
            ))}
          </ul>
        )}
        {/* Danh sách hóa đơn đã hoàn thành */}
        {activeTab === "completed" && (
          <ul className="admin-home__invoice-list">
            {completedInvoices.map((invoice) => (
              <li
                key={invoice._id}
                className="admin-home__invoice-item completed"
              >
                <span>Mã hóa đơn: {invoice._id}</span> |{" "}
                <span className={`status ${invoice.status}`}>
                  Trạng thái: {invoice.status}
                </span>
                <button onClick={() => setSelectedInvoice(invoice)}>
                  Xem chi tiết
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chi tiết hóa đơn */}
      {selectedInvoice && (
        <div>
          <h3>Chi tiết hóa đơn</h3>
          <p>Mã hóa đơn: {selectedInvoice._id}</p>
          <p>Trạng thái: {selectedInvoice.status}</p>
          <p>Số tiền: {selectedInvoice.totalAmount.toLocaleString()} VND</p>
          <p>
            Ngày phát hành:{" "}
            {new Date(selectedInvoice.issuedAt).toLocaleString()}
          </p>
          {selectedInvoice.status === "Pending" && (
            <button
              className="confirm-button"
              onClick={() => confirmInvoice(selectedInvoice._id)}
            >
              Xác nhận đơn hàng
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default InvoiceManagement;
