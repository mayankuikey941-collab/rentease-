let properties = JSON.parse(localStorage.getItem("properties")) || [
  {
    id: 1,
    name: "Sharma Residency",
    location: "Damoh, Madhya Pradesh",
    rooms: 12,
    occupied: 8
  },
  {
    id: 2,
    name: "Verma Apartments",
    location: "Damoh, Madhya Pradesh",
    rooms: 8,
    occupied: 6
  }
];

let tenants = JSON.parse(localStorage.getItem("tenants")) || [
  {
    id: 1,
    name: "Rahul Sharma",
    room: "A-101",
    rent: 6000,
    status: "Paid"
  },
  {
    id: 2,
    name: "Amit Verma",
    room: "A-102",
    rent: 7500,
    status: "Paid"
  },
  {
    id: 3,
    name: "Rohit Kumar",
    room: "B-201",
    rent: 6500,
    status: "Pending"
  },
  {
    id: 4,
    name: "Suresh Patel",
    room: "B-202",
    rent: 5500,
    status: "Overdue"
  }
];


/* SAVE DATA */

function saveData() {
  localStorage.setItem("properties", JSON.stringify(properties));
  localStorage.setItem("tenants", JSON.stringify(tenants));
}


/* MONEY FORMAT */

function formatMoney(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}


/* RENDER DASHBOARD */

function renderDashboard() {

  let paidIncome = tenants
    .filter(t => t.status === "Paid")
    .reduce((sum, t) => sum + Number(t.rent), 0);

  let pendingIncome = tenants
    .filter(t => t.status !== "Paid")
    .reduce((sum, t) => sum + Number(t.rent), 0);

  document.getElementById("income").textContent =
    formatMoney(paidIncome);

  document.getElementById("pending").textContent =
    formatMoney(pendingIncome);

  document.getElementById("propertyCount").textContent =
    properties.length;

  document.getElementById("tenantCount").textContent =
    tenants.length;

  document.getElementById("reportIncome").textContent =
    formatMoney(paidIncome);

  let totalRooms = properties.reduce(
    (sum, p) => sum + Number(p.rooms), 0
  );

  let occupiedRooms = properties.reduce(
    (sum, p) => sum + Number(p.occupied), 0
  );

  let occupancy = totalRooms
    ? Math.round((occupiedRooms / totalRooms) * 100)
    : 0;

  document.getElementById("occupancy").textContent =
    occupancy + "%";

  renderProperties();
  renderTenants();
  renderPaymentSummary();
}


/* RENDER PROPERTIES */

function renderProperties() {

  let dashboard = document.getElementById(
    "dashboardProperties"
  );

  let list = document.getElementById(
    "propertiesList"
  );

  let html = "";

  properties.forEach(property => {

    let percentage = property.rooms
      ? Math.round(
          (property.occupied / property.rooms) * 100
        )
      : 0;

    html += `
      <div class="property-card">

        <div style="display:flex; justify-content:space-between; align-items:center;">

          <div style="font-size:30px">
            🏢
          </div>

          <button
            class="action-btn delete-btn"
            onclick="deleteProperty(${property.id})"
          >
            🗑 Delete
          </button>

        </div>

        <h3>${property.name}</h3>

        <p>📍 ${property.location}</p>

        <div class="property-info">

          <div>
            <small>Rooms</small>
            <h4>${property.rooms}</h4>
          </div>

          <div>
            <small>Occupied</small>
            <h4>${property.occupied}</h4>
          </div>

          <div>
            <small>Occupancy</small>
            <h4>${percentage}%</h4>
          </div>

        </div>

      </div>
    `;
  });

  dashboard.innerHTML = html;
  list.innerHTML = html;
}


/* DELETE PROPERTY */

function deleteProperty(id) {

  let confirmDelete =
    confirm("Are you sure you want to delete this property?");

  if (!confirmDelete) return;

  properties = properties.filter(
    property => property.id !== id
  );

  saveData();

  renderDashboard();
}


/* STATUS COLOR */

function getStatusClass(status) {

  if (status === "Paid") {
    return "paid";
  }

  if (status === "Pending") {
    return "pending";
  }

  return "overdue";
}


/* RENDER TENANTS */

function renderTenants() {

  let dashboard = document.getElementById(
    "dashboardTenants"
  );

  let list = document.getElementById(
    "tenantsList"
  );

  let dashboardHtml = "";
  let tenantHtml = "";

  tenants.forEach((tenant, index) => {

    let statusClass =
      getStatusClass(tenant.status);

    if (index < 5) {

      dashboardHtml += `
        <tr>

          <td>${tenant.name}</td>

          <td>${tenant.room}</td>

          <td>
            ${formatMoney(tenant.rent)}
          </td>

          <td>
            <span class="status ${statusClass}">
              ${tenant.status}
            </span>
          </td>

        </tr>
      `;
    }


    tenantHtml += `
      <tr>

        <td>${tenant.name}</td>

        <td>${tenant.room}</td>

        <td>
          ${formatMoney(tenant.rent)}
        </td>

        <td>
          <span class="status ${statusClass}">
            ${tenant.status}
          </span>
        </td>

        <td>

          ${
            tenant.status !== "Paid"
              ? `
                <button
                  class="action-btn pay-btn"
                  onclick="markPaid(${tenant.id})"
                >
                  ✓ Paid
                </button>
              `
              : ""
          }

          <button
            class="action-btn delete-btn"
            onclick="deleteTenant(${tenant.id})"
          >
            🗑 Delete
          </button>

        </td>

      </tr>
    `;
  });

  dashboard.innerHTML = dashboardHtml;

  list.innerHTML = tenantHtml;
}


/* MARK TENANT PAID */

function markPaid(id) {

  tenants = tenants.map(tenant => {

    if (tenant.id === id) {

      return {
        ...tenant,
        status: "Paid"
      };
    }

    return tenant;
  });

  saveData();

  renderDashboard();
}


/* DELETE TENANT */

function deleteTenant(id) {

  let confirmDelete =
    confirm("Are you sure you want to delete this tenant?");

  if (!confirmDelete) return;

  tenants = tenants.filter(
    tenant => tenant.id !== id
  );

  saveData();

  renderDashboard();
}


/* PAYMENT SUMMARY */

function renderPaymentSummary() {

  let paid = tenants.filter(
    t => t.status === "Paid"
  ).length;

  let pending = tenants.filter(
    t => t.status === "Pending"
  ).length;

  let overdue = tenants.filter(
    t => t.status === "Overdue"
  ).length;

  document.getElementById("paidCount").textContent =
    paid;

  document.getElementById("pendingCount").textContent =
    pending;

  document.getElementById("overdueCount").textContent =
    overdue;
}


/* ADD PROPERTY */

document
  .getElementById("propertyForm")
  .addEventListener("submit", function(e) {

    e.preventDefault();

    let name =
      document.getElementById("propertyName").value;

    let location =
      document.getElementById("propertyLocation").value;

    let rooms =
      document.getElementById("propertyRooms").value;

    properties.push({
      id: Date.now(),
      name: name,
      location: location,
      rooms: Number(rooms),
      occupied: 0
    });

    saveData();

    renderDashboard();

    this.reset();

    closePropertyModal();
  });


/* ADD TENANT */

document
  .getElementById("tenantForm")
  .addEventListener("submit", function(e) {

    e.preventDefault();

    let name =
      document.getElementById("tenantName").value;

    let room =
      document.getElementById("tenantRoom").value;

    let rent =
      document.getElementById("tenantRent").value;

    tenants.push({
      id: Date.now(),
      name: name,
      room: room,
      rent: Number(rent),
      status: "Pending"
    });

    saveData();

    renderDashboard();

    this.reset();

    closeTenantModal();
  });


/* PROPERTY MODAL */

function openPropertyModal() {

  document
    .getElementById("propertyModal")
    .classList.add("show");
}


function closePropertyModal() {

  document
    .getElementById("propertyModal")
    .classList.remove("show");
}


/* TENANT MODAL */

function openTenantModal() {

  document
    .getElementById("tenantModal")
    .classList.add("show");
}


function closeTenantModal() {

  document
    .getElementById("tenantModal")
    .classList.remove("show");
}


/* BUTTON EVENTS */

document
  .getElementById("addPropertyBtn")
  .addEventListener(
    "click",
    openPropertyModal
  );


document
  .getElementById("addTenantBtn")
  .addEventListener(
    "click",
    openTenantModal
  );


/* PAGE NAVIGATION */

function openPage(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove(
        "active-page"
      );

    });


  document
    .getElementById(pageId)
    .classList.add(
      "active-page"
    );


  document
    .getElementById("pageTitle")
    .textContent =
    pageId.charAt(0).toUpperCase()
    + pageId.slice(1);


  document
    .querySelectorAll(".nav-item")
    .forEach(item => {

      item.classList.remove(
        "active"
      );

      if (
        item.dataset.page === pageId
      ) {

        item.classList.add(
          "active"
        );

      }

    });


  document
    .querySelector(".sidebar")
    .classList.remove(
      "show"
    );
}


/* SIDEBAR BUTTONS */

document
  .querySelectorAll(".nav-item")
  .forEach(item => {

    item.addEventListener(
      "click",
      () => {

        openPage(
          item.dataset.page
        );

      }
    );

  });


/* MOBILE MENU */

document
  .getElementById("menuBtn")
  .addEventListener(
    "click",
    () => {

      document
        .querySelector(".sidebar")
        .classList.toggle(
          "show"
        );

    }
  );


/* START APP */

renderDashboard();
