const D = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split("T")[0];
};

export const initialEmployees = [
  { id: 1, firstName: "Rumaisah", lastName: "Farhan", email: "rumaisahfarhan@kuickpay.com", phone: "0300-1112223", role: "Employee", departmentId: 1, designation: "Frontend Engineer", salary: 180000, status: "Active", joinDate: D(400), avatarColor: "#1E5EFF" },
  { id: 2, firstName: "Moiz", lastName: "Pasha", email: "moizpasha@kuickpay.com", phone: "0301-2223334", role: "Manager", departmentId: 1, designation: "Tech Lead", salary: 960000, status: "Active", joinDate: D(900), avatarColor: "#22B2FF" },
  { id: 3, firstName: "Bilal", lastName: "Ahmed", email: "bilal.ahmed@kuickpay.com", phone: "0302-3334445", role: "Employee", departmentId: 1, designation: "Backend Engineer", salary: 190000, status: "Active", joinDate: D(300), avatarColor: "#0B2A9C" },
  { id: 4, firstName: "Sana", lastName: "Riaz", email: "sana.riaz@kuickpay.com", phone: "0303-4445556", role: "HR", departmentId: 2, designation: "HR Manager", salary: 250000, status: "Active", joinDate: D(1200), avatarColor: "#1E5EFF" },
  { id: 5, firstName: "Omar", lastName: "Farooq", email: "omar.farooq@kuickpay.com", phone: "0304-5556667", role: "Manager", departmentId: 3, designation: "Finance Manager", salary: 300000, status: "Active", joinDate: D(1000), avatarColor: "#22B2FF" },
  { id: 6, firstName: "Hina", lastName: "Sheikh", email: "hina.sheikh@kuickpay.com", phone: "0305-6667778", role: "Manager", departmentId: 4, designation: "Sales Manager", salary: 280000, status: "Active", joinDate: D(800), avatarColor: "#0B2A9C" },
  { id: 7, firstName: "Zeeshan", lastName: "Tariq", email: "zeeshan.tariq@kuickpay.com", phone: "0306-7778889", role: "Employee", departmentId: 4, designation: "Growth Associate", salary: 140000, status: "Active", joinDate: D(200), avatarColor: "#1E5EFF" },
  { id: 8, firstName: "Mahnoor", lastName: "Iqbal", email: "mahnoor.iqbal@kuickpay.com", phone: "0307-8889990", role: "Employee", departmentId: 5, designation: "Product Designer", salary: 170000, status: "Active", joinDate: D(150), avatarColor: "#22B2FF" },
  { id: 9, firstName: "Usman", lastName: "Ghani", email: "usman.ghani@kuickpay.com", phone: "0308-9990001", role: "Employee", departmentId: 6, designation: "Support Specialist", salary: 110000, status: "Active", joinDate: D(120), avatarColor: "#0B2A9C" },
  { id: 10, firstName: "Faiza", lastName: "Noor", email: "faiza.noor@kuickpay.com", phone: "0309-0001112", role: "Employee", departmentId: 3, designation: "Accountant", salary: 130000, status: "On Leave", joinDate: D(600), avatarColor: "#1E5EFF" },
  { id: 11, firstName: "Danish", lastName: "Aslam", email: "danish.aslam@kuickpay.com", phone: "0310-1121314", role: "Employee", departmentId: 1, designation: "QA Engineer", salary: 150000, status: "Active", joinDate: D(90), avatarColor: "#22B2FF" },
  { id: 12, firstName: "Syed Saqib", lastName: "Ali", email: "syedsaqib@kuickpay.com", phone: "0311-2131415", role: "Super Admin", departmentId: 2, designation: "Chief Executive Officer", salary: 500000, status: "Active", joinDate: D(1500), avatarColor: "#0B2A9C" },
  { id: 13, firstName: "Farah", lastName: "Siddiqui", email: "farah.siddiqui@kuickpay.com", phone: "0312-3141516", role: "Payroll Manager", departmentId: 3, designation: "Payroll & Compensation Manager", salary: 270000, status: "Active", joinDate: D(700), avatarColor: "#22B2FF" },
  { id: 14, firstName: "Wareesha", lastName: "Faheem", email: "wareesha.faheem9@kuickpay.com", phone: "0300-1112223", role: "Employee", departmentId: 1, designation: "Frontend Engineer", salary: 180000, status: "Active", joinDate: D(400), avatarColor: "#1E5EFF" },
  { id: 15, firstName: "Usman", lastName: "Bhai", email: "usmanbhai@kuickpay.com", phone: "0301-2223334", role: "Employee", departmentId: 1, designation: " Sr.Frontend Engineer", salary: 320000, status: "Active", joinDate: D(900), avatarColor: "#22B2FF" },
];
